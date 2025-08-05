import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Stack,
  Tooltip,
  Modal,
  Avatar,
  TextField,
  Button,
  Divider,
  Collapse,
  Badge,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Place as PlaceIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const PostDetails = ({ post, hideStatusToggle = false }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [openModal, setOpenModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [loadingComment, setLoadingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const username = user?.email || "Anonymous";
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  useEffect(() => {
    if (descriptionRef.current) {
      const needsReadMore =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setShowReadMore(needsReadMore);
    }
  }, [post.description]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!user) return alert("Please log in to comment");

    setLoadingComment(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ user: username, text: commentText }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setCommentText("");
      } else alert(data.error);
    } catch {
      alert("Error posting comment");
    } finally {
      setLoadingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editedCommentText.trim()) return;

    try {
      const res = await fetch(`/api/posts/${post._id}/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ text: editedCommentText }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setEditingCommentId(null);
        setEditedCommentText("");
      } else alert(data.error);
    } catch {
      alert("Error editing comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`/api/posts/${post._id}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
      } else alert(data.error);
    } catch {
      alert("Error deleting comment");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const res = await fetch(`/api/posts/${post._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    if (res.ok) dispatch({ type: "DELETE_POST", payload: data });
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    const res = await fetch(`/api/posts/toggle-status/${post._id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    if (res.ok) dispatch({ type: "UPDATE_POST", payload: data });
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box sx={{ mb: showComments ? 0 : 3 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* Image Section (Left) */}
        <Box
          onClick={() => setOpenModal(true)}
          sx={{
            width: { xs: "100%", sm: "40%" },
            minWidth: { sm: "40%" },
            height: { xs: 250, sm: 320 },
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            "&:hover img": {
              transform: "scale(1.03)",
            },
          }}
        >
          <img
            src={`/uploads/${post.photo}`}
            alt="post"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
              color: "white",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <PlaceIcon fontSize="small" />
              <Typography fontWeight={600}>{post.location}</Typography>
            </Stack>
          </Box>
        </Box>

        {/* Content Section (Right) */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {/* User Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ width: 40, height: 40, mr: 2 }} />
              <Box flex={1}>
                <Typography fontWeight={600}>
                  {post.user_id?.email || "Travel Enthusiast"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </Typography>
              </Box>
              {!hideStatusToggle && user && (
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>

            {/* Description with Read More */}
            <Box
              ref={descriptionRef}
              sx={{
                mb: 2,
                whiteSpace: "pre-line",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: isExpanded ? "none" : 6,
                WebkitBoxOrient: "vertical",
                maxHeight: isExpanded ? "none" : "144px", // 6 lines * 24px line height
              }}
            >
              <Typography>{post.description}</Typography>
            </Box>

            {showReadMore && (
              <Button
                size="small"
                onClick={toggleDescription}
                endIcon={
                  <ExpandMoreIcon
                    sx={{
                      transform: isExpanded ? "rotate(180deg)" : "none",
                      transition: "transform 0.3s ease",
                    }}
                  />
                }
                sx={{
                  textTransform: "none",
                  color: "text.secondary",
                  mb: 2,
                  p: 0,
                }}
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2 }}
                flexWrap="wrap"
                useFlexGap
              >
                {post.tags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: "primary.light",
                      color: "white",
                      fontSize: "0.7rem",
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {/* Action Buttons */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 1,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={0.5}>
                <Tooltip title={liked ? "Unlike" : "Like"}>
                  <IconButton
                    onClick={() => setLiked(!liked)}
                    sx={{ color: liked ? "error.main" : "inherit" }}
                  >
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Comments">
                  <IconButton onClick={() => setShowComments(!showComments)}>
                    {/*<Badge
                      badgeContent={comments.length}
                      color="primary"
                      max={99}
                    >
                      <CommentIcon />
                    </Badge>*/}
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <CommentIcon />
                      <Typography variant="body2" color="text.secondary">
                        {comments.length}
                      </Typography>
                    </Stack>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share">
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Tooltip title={bookmarked ? "Remove bookmark" : "Save"}>
                <IconButton onClick={() => setBookmarked(!bookmarked)}>
                  {bookmarked ? (
                    <BookmarkIcon color="primary" />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Admin Controls */}
            {!hideStatusToggle && user && (
              <Box
                sx={{
                  mt: 2,
                  pt: 1,
                  borderTop: "1px dashed",
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  /*startIcon={
                    post.status === "public" ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )
                  }*/
                  onClick={handleToggleStatus}
                  sx={{ borderRadius: 20 }}
                >
                  {post.status === "public" ? "Public" : "Private"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="black"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  sx={{ borderRadius: 20 }}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Paper
          elevation={0}
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderTop: "1px solid",
            borderColor: "divider",
            p: 3,
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={2}>
            Comments ({comments.length})
          </Typography>

          {comments.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={2}>
              No comments yet. Be the first to share your thoughts!
            </Typography>
          ) : (
            <Box
              sx={{
                maxHeight: 300,
                overflowY: "auto",
                pr: 1,
                "&::-webkit-scrollbar": {
                  width: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "grey.400",
                  borderRadius: 3,
                },
              }}
            >
              {comments.map((comment, index) => (
                <Box key={index} mb={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1.5 }} />
                    <Box>
                      <Typography fontWeight={600} fontSize="0.9rem">
                        {comment.user}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {comment.createdAt
                          ? formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })
                          : "Just now"}
                      </Typography>
                    </Box>
                  </Box>
                  {/*<Typography variant="body2" sx={{ pl: 4.5 }}>
                    {comment.text}
                  </Typography>*/}
                  <Box sx={{ pl: 4.5 }}>
                    {editingCommentId === comment._id ? (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          value={editedCommentText}
                          onChange={(e) => setEditedCommentText(e.target.value)}
                        />
                        <Box mt={1} display="flex" gap={1}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEditComment(comment._id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditedCommentText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2">{comment.text}</Typography>

                        {user?.email === comment.user && (
                          <Stack direction="row" spacing={1} mt={0.5}>
                            <Button
                              size="small"
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditedCommentText(comment.text);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              Delete
                            </Button>
                          </Stack>
                        )}
                      </>
                    )}
                  </Box>

                  {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Box>
          )}

          {/* Add Comment Form */}
          <Box sx={{ mt: 3 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar sx={{ width: 40, height: 40 }} />
              <TextField
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                fullWidth
                multiline
                rows={2}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                disabled={!commentText.trim() || loadingComment}
                onClick={handleAddComment}
                sx={{ borderRadius: 2 }}
              >
                {loadingComment ? "Posting..." : "Post Comment"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Collapse>

      {/* Full Image Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.8)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outline: "none",
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={`/uploads/${post.photo}`}
            alt="full"
            style={{
              maxHeight: "80vh",
              maxWidth: "100%",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
          {/*<Paper
            sx={{
              width: "100%",
              p: 2,
              mt: 1,
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {post.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.description}
            </Typography>
          </Paper>*/}
        </Box>
      </Modal>
    </Box>
  );
};

export default PostDetails;

/*08.05
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Stack,
  Tooltip,
  Modal,
  Avatar,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceIcon from "@mui/icons-material/Place";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useState } from "react";

const PostDetails = ({ post, hideStatusToggle = false }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [openModal, setOpenModal] = useState(false);

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [loadingComment, setLoadingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const User = user?.email || "Anonymous";

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    if (!user) {
      alert("Please log in to add comments.");
      return;
    }

    setLoadingComment(true);

    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ user: User, text: commentText }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments(data.comments);
        setCommentText("");
      } else {
        alert(data.error || "Failed to add comment");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const response = await fetch("/api/posts/" + post._id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_POST", payload: json });
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    const response = await fetch("/api/posts/toggle-status/" + post._id, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "UPDATE_POST", payload: json });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: { xs: "column", sm: showComments ? "row" : "column" },
          transition: "all 0.3s ease",
        }}
      >
        
        <Box
          sx={{
            flex: showComments ? "0 0 60%" : "1",
            transition: "all 0.3s ease",
          }}
        >
          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Avatar
              sx={{ width: 36, height: 36, mr: 1.5 }}
              src="/default-avatar.jpg"
            />
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                fontSize="0.9rem"
              >
                {post.user_id?.email || "Travel Enthusiast"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.7rem"
              >
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </Box>

         
          <Box
            onClick={() => setOpenModal(true)}
            sx={{
              width: "100%",
              height: { xs: 250, sm: showComments ? 350 : 400 },
              position: "relative",
              cursor: "pointer",
              transition: "height 0.3s ease",
            }}
          >
            <img
              src={`/uploads/${post.photo}`}
              alt={post.location}
              style={{
                width: "75%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                margin: "0 auto", // This centers the image horizontally
              }}
            />
          </Box>

          
          <Box sx={{ p: 2 }}>
           
            <Box sx={{ mb: 1.5 }}>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{ mt: 0.5 }}
              >
                <PlaceIcon fontSize="small" color="red" />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textTransform: "capitalize",
                    fontSize: "1.2rem",
                  }}
                >
                  {post.location || "Unknown"}
                </Typography>
              </Stack>
            </Box>

          
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                lineHeight: 1.6,
                mb: 2,
                whiteSpace: "pre-line",
                fontSize: "0.9rem",
              }}
            >
              {post.description}
            </Typography>

            
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        mb: 0.5,
                        bgcolor: "primary.light",
                        color: "white",
                        fontSize: "0.7rem",
                        height: "24px",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Stack direction="row" spacing={0.5}>
                {post.status === "public" && (
                  <Tooltip title={liked ? "Unlike" : "Like"}>
                    <IconButton size="small" onClick={handleLike}>
                      {liked ? (
                        <FavoriteIcon color="error" fontSize="small" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
                {post.status === "public" && (
                  <Tooltip
                    title={showComments ? "Hide comments" : "Show comments"}
                  >
                    <IconButton size="small" onClick={handleToggleComments}>
                      <CommentIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Share">
                  <IconButton size="small">
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Tooltip
                title={bookmarked ? "Remove bookmark" : "Save for later"}
              >
                <IconButton size="small" onClick={handleBookmark}>
                  <BookmarkIcon
                    color={bookmarked ? "primary" : "inherit"}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
            </Box>

            
            {!hideStatusToggle && user && (
              <Box
                sx={{
                  mt: 1.5,
                  pt: 1.5,
                  borderTop: "1px dashed",
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 0.5,
                }}
              >
                <Tooltip
                  title={
                    post.status === "public" ? "Make private" : "Make public"
                  }
                >
                  <IconButton size="small" onClick={handleToggleStatus}>
                    {post.status === "public" ? (
                      <FavoriteIcon color="error" fontSize="small" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={handleDelete}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>

        
        {showComments && (
          <Box
            sx={{
              flex: "0 0 40%",
              borderLeft: { sm: "1px solid" },
              borderColor: { sm: "divider" },
              display: "flex",
              flexDirection: "column",
              height: { sm: "500px" },
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Comments ({comments.length})
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              {comments.length === 0 ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 3 }}
                >
                  No comments yet. Be the first to share your thoughts!
                </Typography>
              ) : (
                comments.map((comment, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        sx={{ width: 32, height: 32, mr: 1 }}
                        src="/default-avatar.jpg"
                      />
                      <Typography
                        variant="subtitle2"
                        fontWeight="600"
                        fontSize="0.9rem"
                      >
                        {comment.user}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1, fontSize: "0.7rem" }}
                      >
                        {comment.createdAt
                          ? formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })
                          : "Just now"}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ pl: 4.5, fontSize: "0.9rem" }}
                    >
                      {comment.text}
                    </Typography>
                    {index < comments.length - 1 && (
                      <Divider sx={{ my: 1.5 }} />
                    )}
                  </Box>
                ))
              )}
            </Box>

           
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                <Avatar
                  sx={{ width: 36, height: 36, mr: 1.5 }}
                  src="/default-avatar.jpg"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  multiline
                  rows={2}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "background.default",
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleAddComment}
                  disabled={loadingComment || !commentText.trim()}
                  size="small"
                  sx={{ borderRadius: 2, px: 2, fontSize: "0.8rem" }}
                >
                  {loadingComment ? "Posting..." : "Post"}
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "transparent",
            p: 0,
            borderRadius: 0,
            maxWidth: "100vw",
            maxHeight: "100vh",
            outline: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={`/uploads/${post.photo}`}
            alt="Full View"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
      </Modal>
    </>
  );
};


export default PostDetails;*/
