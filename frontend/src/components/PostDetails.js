
/*
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
//date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const PostDetails = ({ post }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }
    const response = await fetch("/api/posts/" + post._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_POST", paydescription: json });
    }
  };

  return (
    <div className="post-details">
      <h4>{post.location}</h4>
      <p>
        <strong>description: </strong>
        {post.description}
      </p>

      <p>
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </p>
      <span className="material-symbols-outlined " onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default PostDetails;*/

/*06.23
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const PostDetails = ({ post }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
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

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%", // ensures cards are same height
        overflow: "hidden",
      }}
    >
      
      <Box
        sx={{
          height: 200,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <img
          src={`/uploads/${post.photo}`}
          alt={post.location}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <IconButton size="small">
          <FavoriteIcon sx={{ color: "#FFD700" }} />
        </IconButton>
        {user && (
          <IconButton onClick={handleClick} size="small">
            <DeleteIcon sx={{ color: "#333" }} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ px: 2, pb: 2, flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            textTransform: "capitalize",
            mb: 1,
            lineHeight: 1.2,
          }}
        >
          {post.location}
        </Typography>

        <Stack direction="row" spacing={1} mb={1}>
          <Chip
            icon={<PlaceIcon fontSize="small" />}
            label={post.country || "Unknown"}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeIcon fontSize="small" />}
            label={formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Typography
          variant="body2"
          sx={{
            fontSize: "0.95rem",
            color: "#555",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
          }}
        >
          {post.description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PostDetails;*/

/*06.24
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Stack,
  Tooltip,
  Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useState } from "react";

const PostDetails = ({ post }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [openModal, setOpenModal] = useState(false);

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
      dispatch({ type: "UPDATE_POST", payload: json }); // ✅ IMPORTANT
    }
  };

  return (
    <>
      
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
        }}
      >
        
        <Box
          onClick={() => setOpenModal(true)}
          sx={{
            width: { xs: "100%", sm: "300px" },
            height: { xs: 200, sm: "100%" },
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <img
            src={`/uploads/${post.photo}`}
            alt={post.location}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>

        
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, textTransform: "capitalize", mb: 1 }}
            >
              {post.location}
            </Typography>

            <Stack direction="row" spacing={1} mb={1}>
              <Chip
                icon={<PlaceIcon fontSize="small" />}
                label={post.country || "Unknown"}
                size="small"
              />
              <Chip
                icon={<AccessTimeIcon fontSize="small" />}
                label={formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
                size="small"
              />
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 2,
              }}
            >
              {post.description}
            </Typography>
          </Box>

         
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip
              title={post.status === "public" ? "make private" : "make public"}
            >
              <IconButton size="small" onClick={handleToggleStatus}>
                <FavoriteIcon
                  color={post.status === "public" ? "error" : "inherit"}
                />
              </IconButton>
            </Tooltip>
            {user && (
              <Tooltip title="Delete">
                <IconButton size="small" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
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
            maxWidth: "95vw",
            maxHeight: "95vh",
            outline: "none",
          }}
        >
          <img
            src={`/uploads/${post.photo}`}
            alt="Full View"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              border: "none",
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default PostDetails;*/


/*08.02

import {
  Box,
  Typography,
  IconButton,
  Paper,
  Chip,
  Stack,
  Tooltip,
  Modal,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useState } from "react";

const PostDetails = ({ post, hideStatusToggle = false }) => {
  const { dispatch } = usePostsContext();
  const { user } = useAuthContext();
  const [openModal, setOpenModal] = useState(false);



  //comments
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [loadingComment, setLoadingComment] = useState(false);

  const User = user.email;

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
        // Update local comments state with new comment from server
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

  return (
    <>

      

      

      <Paper
        elevation={2}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
        }}
      >

        

     

        <Box
          onClick={() => setOpenModal(true)}
          sx={{
            width: { xs: "100%", sm: "300px" },
            height: { xs: 200, sm: "100%" },
            flexShrink: 0,
            cursor: "pointer",
          }}
        >
          <img
            src={`/uploads/${post.photo}`}
            alt={post.location}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>


        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, textTransform: "capitalize", mb: 1 }}
            >
              {post.location}
            </Typography>

            <Stack direction="row" spacing={1} mb={1}>
              <Chip
                icon={<PlaceIcon fontSize="small" />}
                label={post.country || "Unknown"}
                size="small"
              />
              <Chip
                icon={<AccessTimeIcon fontSize="small" />}
                label={formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
                size="small"
              />
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 2,
              }}
            >
              {post.description}
            </Typography>
          </Box>


          
          {post.status === "public" && (
            <Box mt={2}>
              <Chip
                label={
                  showComments
                    ? "Hide Comments"
                    : `Show Comments (${comments.length})`
                }
                onClick={handleToggleComments}
                clickable
                color="primary"
              />
            </Box>
          )}

        
          {showComments && (
            <Box mt={2} sx={{ maxHeight: 300, overflowY: "auto" }}>
              
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" mb={1}>
                  No comments yet.
                </Typography>
              ) : (
                comments.map((c, i) => (
                  <Paper key={i} sx={{ p: 1, mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {c.user}
                    </Typography>
                    <Typography variant="body2">{c.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString()
                        : "Unknown date"}
                    </Typography>
                  </Paper>
                ))
              )}

              
              {user ? (
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    style={{ flexGrow: 1, resize: "vertical", padding: 8 }}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={loadingComment || !commentText.trim()}
                    style={{ padding: "8px 16px", cursor: "pointer" }}
                  >
                    {loadingComment ? "Posting..." : "Post"}
                  </button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Please log in to comment.
                </Typography>
              )}
            </Box>
          )}

          

          <Box sx={{ display: "flex", gap: 1 }}>
            {!hideStatusToggle && (
              <Tooltip
                title={
                  post.status === "public" ? "make private" : "make public"
                }
              >
                <IconButton size="small" onClick={handleToggleStatus}>
                  <FavoriteIcon
                    color={post.status === "public" ? "error" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
            )}
            {!hideStatusToggle && user && (
              <Tooltip title="Delete">
                <IconButton size="small" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
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
            maxWidth: "95vw",
            maxHeight: "95vh",
            outline: "none",
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
        {/* Main content (image + details) */}
        <Box
          sx={{
            flex: showComments ? "0 0 60%" : "1",
            transition: "all 0.3s ease",
          }}
        >
          {/* Header with user info */}
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

          {/* Image */}
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

          {/* Content section */}
          <Box sx={{ p: 2 }}>
            {/* Location */}
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

            {/* Description */}
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

            {/* Tags */}
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

            {/* Action buttons */}
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

            {/* Admin controls */}
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

        {/* Comments section - appears on the right when toggled */}
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

            {/* Add comment */}
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

      {/* Image modal */}
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


export default PostDetails;
