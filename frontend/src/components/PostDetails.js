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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
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
  Edit as EditIcon,
  Report as ReportIcon,
  Lock as LockIcon,
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
  const [comments, setComments] = useState(post?.comments || []);
  const [loadingComment, setLoadingComment] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(post?.likes || []);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const descriptionRef = useRef(null);
  const username = user?.email || "Anonymous";
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentMenuAnchor, setCommentMenuAnchor] = useState(null);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyMenuAnchor, setReplyMenuAnchor] = useState(null);
  const [currentReplyId, setCurrentReplyId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyText, setEditedReplyText] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [commenterPhotos, setCommenterPhotos] = useState({}); // Store commenter profile photos
  const [currentUserPhoto, setCurrentUserPhoto] = useState(null); // Current user's profile photo

  useEffect(() => {
    const fetchProfile = async () => {
      if (!post?.user_id?._id) return;

      try {
        const res = await fetch(`/api/profile/user/${post.user_id._id}`);
        const data = await res.json();
        if (res.ok && data.photo) {
          setProfilePhoto(data.photo);
        }
      } catch (err) {
        console.log("Error fetching profile photo:", err);
      }
    };

    fetchProfile();
  }, [post?.user_id]);

  // Fetch current user's profile photo
  useEffect(() => {
    const fetchCurrentUserPhoto = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.photo) {
          setCurrentUserPhoto(data.photo);
        }
      } catch (err) {
        console.log("Error fetching current user profile photo:", err);
      }
    };

    fetchCurrentUserPhoto();
  }, [user]);

  // Fetch profile photos for all commenters using user IDs
  useEffect(() => {
    const fetchCommenterPhotos = async () => {
      if (!comments.length) return;

      const photos = {};

      // Get all unique user IDs from comments and replies
      const uniqueUserIds = new Set();

      comments.forEach((comment) => {
        if (comment.userId) uniqueUserIds.add(comment.userId);
        comment.replies?.forEach((reply) => {
          if (reply.userId) uniqueUserIds.add(reply.userId);
        });
      });

      for (const userId of uniqueUserIds) {
        try {
          // Fetch profile by user ID
          const res = await fetch(`/api/profile/user/${userId}`);
          const data = await res.json();
          if (res.ok && data.photo) {
            photos[userId] = data.photo;
          }
        } catch (err) {
          console.log("Error fetching profile photo for user:", userId, err);
        }
      }

      setCommenterPhotos(photos);
    };

    if (showComments) {
      fetchCommenterPhotos();
    }
  }, [comments, showComments]);

  useEffect(() => {
    if (descriptionRef.current) {
      const needsReadMore =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setShowReadMore(needsReadMore);
    }
  }, [post?.description]);

  useEffect(() => {
    // Check if current user has liked this post with comprehensive null checks
    if (!user || !user.email || !likes || !Array.isArray(likes)) {
      setIsLiked(false);
      return;
    }

    // Filter out any null/undefined likes and check if user has liked
    const userLiked = likes
      .filter((like) => like && like.user) // Filter out invalid like objects
      .some((like) => like.user === user.email);

    setIsLiked(userLiked);
  }, [likes, user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCommentMenuOpen = (event, commentId) => {
    setCommentMenuAnchor(event.currentTarget);
    setCurrentCommentId(commentId);
  };

  const handleCommentMenuClose = () => {
    setCommentMenuAnchor(null);
    setCurrentCommentId(null);
  };

  const handleReplyMenuOpen = (event, replyId) => {
    setReplyMenuAnchor(event.currentTarget);
    setCurrentReplyId(replyId);
  };

  const handleReplyMenuClose = () => {
    setReplyMenuAnchor(null);
    setCurrentReplyId(null);
  };

  const handleLike = async () => {
    if (!user) return alert("Please log in to like posts");
    if (loadingLike) return;

    setLoadingLike(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ user: user.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes || []);
        setLikeCount(data.likes?.length || 0);

        // Check if user liked the post with null safety
        const userLiked =
          data.likes?.some((like) => like && like.user === user.email) || false;

        setIsLiked(userLiked);

        // Update the post in context
        dispatch({
          type: "UPDATE_POST",
          payload: { ...post, likes: data.likes || [] },
        });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error liking post");
    } finally {
      setLoadingLike(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    if (!user) return alert("Please log in to comment");
    if (post.status !== "public")
      return alert("Cannot comment on private posts");

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

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;
    if (!user) return alert("Please log in to reply");
    if (post.status !== "public")
      return alert("Cannot reply to comments on private posts");

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ user: username, text: replyText }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setReplyText("");
        setReplyingTo(null);
      } else alert(data.error);
    } catch {
      alert("Error posting reply");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editedCommentText.trim()) return;
    if (post.status !== "public")
      return alert("Cannot edit comments on private posts");

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

  const handleEditReply = async (commentId, replyId) => {
    if (!editedReplyText.trim()) return;
    if (post.status !== "public")
      return alert("Cannot edit replies on private posts");

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${commentId}/replies/${replyId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ text: editedReplyText }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setEditingReplyId(null);
        setEditedReplyText("");
      } else alert(data.error);
    } catch {
      alert("Error editing reply");
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
        handleCommentMenuClose();
      } else alert(data.error);
    } catch {
      alert("Error deleting comment");
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this reply?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${commentId}/replies/${replyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        handleReplyMenuClose();
      } else alert(data.error);
    } catch {
      alert("Error deleting reply");
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (!user) return;
    const res = await fetch(`/api/posts/${post._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    if (res.ok) dispatch({ type: "DELETE_POST", payload: data });
  };

  const handleToggleStatus = async () => {
    handleMenuClose();
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

  // Add a null check for the post object
  if (!post) {
    return <div>Loading post...</div>;
  }

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
        {/* Post image section */}
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

        {/* Post content section */}
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
            {/* User info */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ width: 40, height: 40, mr: 2 }}
                src={profilePhoto ? `/uploads/${profilePhoto}` : undefined}
              >
                {!profilePhoto && post.user_id?.email?.[0]?.toUpperCase()}
              </Avatar>
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
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>

            {/* Post description */}
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
                maxHeight: isExpanded ? "none" : "144px",
              }}
            >
              <Typography>{post.description}</Typography>
            </Box>

            {/* Read more toggle */}
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

          {/* Post actions */}
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
                {/* Like Button */}
                <Tooltip title={isLiked ? "Unlike" : "Like"}>
                  <IconButton
                    onClick={handleLike}
                    disabled={loadingLike}
                    color={isLiked ? "error" : "default"}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      <Typography variant="body2" color="text.secondary">
                        {likeCount}
                      </Typography>
                    </Stack>
                  </IconButton>
                </Tooltip>

                {/* Comments Button */}
                <Tooltip title="Comments">
                  <IconButton onClick={() => setShowComments(!showComments)}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <CommentIcon />
                      <Typography variant="body2" color="text.secondary">
                        {comments.length}
                      </Typography>
                    </Stack>
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            {/* Post status toggle */}
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
                  onClick={handleToggleStatus}
                  sx={{ borderRadius: 20 }}
                >
                  {post.status === "public" ? "Public" : "Private"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Comments section */}
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
            post.status === "public" ? (
              <Typography color="text.secondary" textAlign="center" py={2}>
                No comments yet. Be the first to share your thoughts!
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 2,
                  color: "text.secondary",
                }}
              >
                <LockIcon sx={{ mb: 1 }} />
                <Typography textAlign="center">
                  This post is private. Only existing comments are visible.
                </Typography>
              </Box>
            )
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
                  {/* Comment header */}
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar
                      sx={{ width: 32, height: 32, mr: 1.5 }}
                      src={
                        comment.userId && commenterPhotos[comment.userId]
                          ? `/uploads/${commenterPhotos[comment.userId]}`
                          : undefined
                      }
                    >
                      {(!comment.userId || !commenterPhotos[comment.userId]) &&
                        comment.user?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
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
                    <IconButton
                      size="small"
                      onClick={(e) => handleCommentMenuOpen(e, comment._id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Comment content */}
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
                      <Typography variant="body2">{comment.text}</Typography>
                    )}
                  </Box>

                  {/* Replies section */}
                  {comment.replies?.length > 0 && (
                    <Box
                      sx={{
                        pl: 4,
                        mt: 1,
                        borderLeft: "2px solid",
                        borderColor: "divider",
                      }}
                    >
                      {comment.replies.map((reply, replyIndex) => (
                        <Box key={replyIndex} mb={2}>
                          {/* Reply header */}
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar
                              sx={{ width: 28, height: 28, mr: 1 }}
                              src={
                                reply.userId && commenterPhotos[reply.userId]
                                  ? `/uploads/${commenterPhotos[reply.userId]}`
                                  : undefined
                              }
                            >
                              {(!reply.userId ||
                                !commenterPhotos[reply.userId]) &&
                                reply.user?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box flex={1}>
                              <Typography fontWeight={600} fontSize="0.8rem">
                                {reply.user}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDistanceToNow(
                                  new Date(reply.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => handleReplyMenuOpen(e, reply._id)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Reply content */}
                          <Box sx={{ pl: 3.5 }}>
                            {editingReplyId === reply._id ? (
                              <>
                                <TextField
                                  fullWidth
                                  size="small"
                                  multiline
                                  value={editedReplyText}
                                  onChange={(e) =>
                                    setEditedReplyText(e.target.value)
                                  }
                                />
                                <Box mt={1} display="flex" gap={1}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                      handleEditReply(comment._id, reply._id)
                                    }
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => {
                                      setEditingReplyId(null);
                                      setEditedReplyText("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              </>
                            ) : (
                              <Typography variant="body2">
                                {reply.text}
                              </Typography>
                            )}
                          </Box>
                          {replyIndex < comment.replies.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Reply input - only show for public posts */}
                  {post.status === "public" && (
                    <Box sx={{ pl: 4.5, mt: 1 }}>
                      {replyingTo === comment._id ? (
                        <>
                          <TextField
                            fullWidth
                            size="small"
                            multiline
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            sx={{ mb: 1 }}
                          />
                          <Box display="flex" gap={1}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAddReply(comment._id)}
                            >
                              Post Reply
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <Button
                          size="small"
                          startIcon={<CommentIcon fontSize="small" />}
                          onClick={() => setReplyingTo(comment._id)}
                          sx={{ textTransform: "none", fontSize: "0.75rem" }}
                        >
                          Reply
                        </Button>
                      )}
                    </Box>
                  )}

                  {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Box>
          )}

          {/* Add comment section - only show for public posts */}
          {post.status === "public" && (
            <Box sx={{ mt: 3 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar
                  sx={{ width: 40, height: 40 }}
                  src={
                    currentUserPhoto
                      ? `/uploads/${currentUserPhoto}`
                      : undefined
                  }
                >
                  {!currentUserPhoto && user?.email?.[0]?.toUpperCase()}
                </Avatar>
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
          )}
        </Paper>
      </Collapse>

      {/* Post options menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {post.status === "public" ? (
              <BookmarkBorderIcon fontSize="small" />
            ) : (
              <BookmarkIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {post.status === "public" ? "Make Private" : "Make Public"}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "error" }}>
            Delete Post
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
      </Menu>

      {/* Comment options menu */}
      <Menu
        anchorEl={commentMenuAnchor}
        open={Boolean(commentMenuAnchor)}
        onClose={handleCommentMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user?.email ===
          comments.find((c) => c._id === currentCommentId)?.user && (
          <>
            {post.status === "public" && (
              <MenuItem
                onClick={() => {
                  const comment = comments.find(
                    (c) => c._id === currentCommentId
                  );
                  setEditingCommentId(currentCommentId);
                  setEditedCommentText(comment.text);
                  handleCommentMenuClose();
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                handleDeleteComment(currentCommentId);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ color: "error" }}>
                Delete
              </ListItemText>
            </MenuItem>
          </>
        )}
        {post.status === "public" && (
          <MenuItem
            onClick={() => {
              setReplyingTo(currentCommentId);
              handleCommentMenuClose();
            }}
          >
            <ListItemIcon>
              <CommentIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reply</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleCommentMenuClose}>
          <ListItemIcon>
            <ReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
      </Menu>

      {/* Reply options menu */}
      <Menu
        anchorEl={replyMenuAnchor}
        open={Boolean(replyMenuAnchor)}
        onClose={handleReplyMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user?.email ===
          comments
            .flatMap((c) => c.replies)
            .find((r) => r._id === currentReplyId)?.user && (
          <>
            {post.status === "public" && (
              <MenuItem
                onClick={() => {
                  const reply = comments
                    .flatMap((c) => c.replies)
                    .find((r) => r._id === currentReplyId);
                  setEditingReplyId(currentReplyId);
                  setEditedReplyText(reply.text);
                  handleReplyMenuClose();
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                const comment = comments.find((c) =>
                  c.replies.some((r) => r._id === currentReplyId)
                );
                handleDeleteReply(comment._id, currentReplyId);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ color: "error" }}>
                Delete
              </ListItemText>
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleReplyMenuClose}>
          <ListItemIcon>
            <ReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
      </Menu>

      {/* Image modal */}
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
        </Box>
      </Modal>
    </Box>
  );
};

export default PostDetails;

/*
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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
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
  Edit as EditIcon,
  Report as ReportIcon,
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
  const [comments, setComments] = useState(post?.comments || []);
  const [loadingComment, setLoadingComment] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(post?.likes || []);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);
  const descriptionRef = useRef(null);
  const username = user?.email || "Anonymous";
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentMenuAnchor, setCommentMenuAnchor] = useState(null);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyMenuAnchor, setReplyMenuAnchor] = useState(null);
  const [currentReplyId, setCurrentReplyId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyText, setEditedReplyText] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [commenterPhotos, setCommenterPhotos] = useState({}); // Store commenter profile photos
  const [currentUserPhoto, setCurrentUserPhoto] = useState(null); // Current user's profile photo

  useEffect(() => {
    const fetchProfile = async () => {
      if (!post?.user_id?._id) return;

      try {
        const res = await fetch(`/api/profile/user/${post.user_id._id}`);
        const data = await res.json();
        if (res.ok && data.photo) {
          setProfilePhoto(data.photo);
        }
      } catch (err) {
        console.log("Error fetching profile photo:", err);
      }
    };

    fetchProfile();
  }, [post?.user_id]);

  // Fetch current user's profile photo
  useEffect(() => {
    const fetchCurrentUserPhoto = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.photo) {
          setCurrentUserPhoto(data.photo);
        }
      } catch (err) {
        console.log("Error fetching current user profile photo:", err);
      }
    };

    fetchCurrentUserPhoto();
  }, [user]);

  // Fetch profile photos for all commenters using user IDs
  useEffect(() => {
    const fetchCommenterPhotos = async () => {
      if (!comments.length) return;

      const photos = {};

      // Get all unique user IDs from comments and replies
      const uniqueUserIds = new Set();

      comments.forEach((comment) => {
        if (comment.userId) uniqueUserIds.add(comment.userId);
        comment.replies?.forEach((reply) => {
          if (reply.userId) uniqueUserIds.add(reply.userId);
        });
      });

      for (const userId of uniqueUserIds) {
        try {
          // Fetch profile by user ID
          const res = await fetch(`/api/profile/user/${userId}`);
          const data = await res.json();
          if (res.ok && data.photo) {
            photos[userId] = data.photo;
          }
        } catch (err) {
          console.log("Error fetching profile photo for user:", userId, err);
        }
      }

      setCommenterPhotos(photos);
    };

    if (showComments) {
      fetchCommenterPhotos();
    }
  }, [comments, showComments]);

  useEffect(() => {
    if (descriptionRef.current) {
      const needsReadMore =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setShowReadMore(needsReadMore);
    }
  }, [post?.description]);

  useEffect(() => {
    // Check if current user has liked this post with comprehensive null checks
    if (!user || !user.email || !likes || !Array.isArray(likes)) {
      setIsLiked(false);
      return;
    }

    // Filter out any null/undefined likes and check if user has liked
    const userLiked = likes
      .filter((like) => like && like.user) // Filter out invalid like objects
      .some((like) => like.user === user.email);

    setIsLiked(userLiked);
  }, [likes, user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCommentMenuOpen = (event, commentId) => {
    setCommentMenuAnchor(event.currentTarget);
    setCurrentCommentId(commentId);
  };

  const handleCommentMenuClose = () => {
    setCommentMenuAnchor(null);
    setCurrentCommentId(null);
  };

  const handleReplyMenuOpen = (event, replyId) => {
    setReplyMenuAnchor(event.currentTarget);
    setCurrentReplyId(replyId);
  };

  const handleReplyMenuClose = () => {
    setReplyMenuAnchor(null);
    setCurrentReplyId(null);
  };

  const handleLike = async () => {
    if (!user) return alert("Please log in to like posts");
    if (loadingLike) return;

    setLoadingLike(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ user: user.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes || []);
        setLikeCount(data.likes?.length || 0);

        // Check if user liked the post with null safety
        const userLiked =
          data.likes?.some((like) => like && like.user === user.email) || false;

        setIsLiked(userLiked);

        // Update the post in context
        dispatch({
          type: "UPDATE_POST",
          payload: { ...post, likes: data.likes || [] },
        });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error liking post");
    } finally {
      setLoadingLike(false);
    }
  };

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

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;
    if (!user) return alert("Please log in to reply");

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ user: username, text: replyText }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setReplyText("");
        setReplyingTo(null);
      } else alert(data.error);
    } catch {
      alert("Error posting reply");
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

  const handleEditReply = async (commentId, replyId) => {
    if (!editedReplyText.trim()) return;

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${commentId}/replies/${replyId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ text: editedReplyText }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setEditingReplyId(null);
        setEditedReplyText("");
      } else alert(data.error);
    } catch {
      alert("Error editing reply");
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
        handleCommentMenuClose();
      } else alert(data.error);
    } catch {
      alert("Error deleting comment");
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this reply?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `/api/posts/${post._id}/comments/${commentId}/replies/${replyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        handleReplyMenuClose();
      } else alert(data.error);
    } catch {
      alert("Error deleting reply");
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (!user) return;
    const res = await fetch(`/api/posts/${post._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const data = await res.json();
    if (res.ok) dispatch({ type: "DELETE_POST", payload: data });
  };

  const handleToggleStatus = async () => {
    handleMenuClose();
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

  // Add a null check for the post object
  if (!post) {
    return <div>Loading post...</div>;
  }

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
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ width: 40, height: 40, mr: 2 }}
                src={profilePhoto ? `/uploads/${profilePhoto}` : undefined}
              >
                {!profilePhoto && post.user_id?.email?.[0]?.toUpperCase()}
              </Avatar>
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
                <IconButton size="small" onClick={handleMenuOpen}>
                  <MoreVertIcon />
                </IconButton>
              )}
            </Box>

            
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
                maxHeight: isExpanded ? "none" : "144px",
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
               
                <Tooltip title={isLiked ? "Unlike" : "Like"}>
                  <IconButton
                    onClick={handleLike}
                    disabled={loadingLike}
                    color={isLiked ? "error" : "default"}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      <Typography variant="body2" color="text.secondary">
                        {likeCount}
                      </Typography>
                    </Stack>
                  </IconButton>
                </Tooltip>

                
                <Tooltip title="Comments">
                  <IconButton onClick={() => setShowComments(!showComments)}>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <CommentIcon />
                      <Typography variant="body2" color="text.secondary">
                        {comments.length}
                      </Typography>
                    </Stack>
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

           
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
                  onClick={handleToggleStatus}
                  sx={{ borderRadius: 20 }}
                >
                  {post.status === "public" ? "Public" : "Private"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      
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
                    <Avatar
                      sx={{ width: 32, height: 32, mr: 1.5 }}
                      src={
                        comment.userId && commenterPhotos[comment.userId]
                          ? `/uploads/${commenterPhotos[comment.userId]}`
                          : undefined
                      }
                    >
                      {(!comment.userId || !commenterPhotos[comment.userId]) &&
                        comment.user?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box flex={1}>
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
                    <IconButton
                      size="small"
                      onClick={(e) => handleCommentMenuOpen(e, comment._id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  
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
                      </>
                    )}
                  </Box>

                
                  {comment.replies?.length > 0 && (
                    <Box
                      sx={{
                        pl: 4,
                        mt: 1,
                        borderLeft: "2px solid",
                        borderColor: "divider",
                      }}
                    >
                      {comment.replies.map((reply, replyIndex) => (
                        <Box key={replyIndex} mb={2}>
                         
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar
                              sx={{ width: 28, height: 28, mr: 1 }}
                              src={
                                reply.userId && commenterPhotos[reply.userId]
                                  ? `/uploads/${commenterPhotos[reply.userId]}`
                                  : undefined
                              }
                            >
                              {(!reply.userId ||
                                !commenterPhotos[reply.userId]) &&
                                reply.user?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box flex={1}>
                              <Typography fontWeight={600} fontSize="0.8rem">
                                {reply.user}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDistanceToNow(
                                  new Date(reply.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => handleReplyMenuOpen(e, reply._id)}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          
                          <Box sx={{ pl: 3.5 }}>
                            {editingReplyId === reply._id ? (
                              <>
                                <TextField
                                  fullWidth
                                  size="small"
                                  multiline
                                  value={editedReplyText}
                                  onChange={(e) =>
                                    setEditedReplyText(e.target.value)
                                  }
                                />
                                <Box mt={1} display="flex" gap={1}>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                      handleEditReply(comment._id, reply._id)
                                    }
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() => {
                                      setEditingReplyId(null);
                                      setEditedReplyText("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              </>
                            ) : (
                              <Typography variant="body2">
                                {reply.text}
                              </Typography>
                            )}
                          </Box>
                          {replyIndex < comment.replies.length - 1 && (
                            <Divider sx={{ my: 1 }} />
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}

                  
                  <Box sx={{ pl: 4.5, mt: 1 }}>
                    {replyingTo === comment._id ? (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          sx={{ mb: 1 }}
                        />
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAddReply(comment._id)}
                          >
                            Post Reply
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Button
                        size="small"
                        startIcon={<CommentIcon fontSize="small" />}
                        onClick={() => setReplyingTo(comment._id)}
                        sx={{ textTransform: "none", fontSize: "0.75rem" }}
                      >
                        Reply
                      </Button>
                    )}
                  </Box>

                  {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Box>
          )}

          
          <Box sx={{ mt: 3 }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                sx={{ width: 40, height: 40 }}
                src={
                  currentUserPhoto ? `/uploads/${currentUserPhoto}` : undefined
                }
              >
                {!currentUserPhoto && user?.email?.[0]?.toUpperCase()}
              </Avatar>
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

    
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {post.status === "public" ? (
              <BookmarkBorderIcon fontSize="small" />
            ) : (
              <BookmarkIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {post.status === "public" ? "Make Private" : "Make Public"}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: "error" }}>
            Delete Post
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
      </Menu>

      
      <Menu
        anchorEl={commentMenuAnchor}
        open={Boolean(commentMenuAnchor)}
        onClose={handleCommentMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user?.email ===
          comments.find((c) => c._id === currentCommentId)?.user && (
          <>
            <MenuItem
              onClick={() => {
                const comment = comments.find(
                  (c) => c._id === currentCommentId
                );
                setEditingCommentId(currentCommentId);
                setEditedCommentText(comment.text);
                handleCommentMenuClose();
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDeleteComment(currentCommentId);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ color: "error" }}>
                Delete
              </ListItemText>
            </MenuItem>
          </>
        )}
        <MenuItem
          onClick={() => {
            setReplyingTo(currentCommentId);
            handleCommentMenuClose();
          }}
        >
          <ListItemIcon>
            <CommentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reply</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCommentMenuClose}>
          <ListItemIcon>
            <ReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
      </Menu>

     
      <Menu
        anchorEl={replyMenuAnchor}
        open={Boolean(replyMenuAnchor)}
        onClose={handleReplyMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user?.email ===
          comments
            .flatMap((c) => c.replies)
            .find((r) => r._id === currentReplyId)?.user && (
          <>
            <MenuItem
              onClick={() => {
                const reply = comments
                  .flatMap((c) => c.replies)
                  .find((r) => r._id === currentReplyId);
                setEditingReplyId(currentReplyId);
                setEditedReplyText(reply.text);
                handleReplyMenuClose();
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                const comment = comments.find((c) =>
                  c.replies.some((r) => r._id === currentReplyId)
                );
                handleDeleteReply(comment._id, currentReplyId);
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ color: "error" }}>
                Delete
              </ListItemText>
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleReplyMenuClose}>
          <ListItemIcon>
            <ReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Report</ListItemText>
        </MenuItem>
      </Menu>

  
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
        </Box>
      </Modal>
    </Box>
  );
};

export default PostDetails;*/
