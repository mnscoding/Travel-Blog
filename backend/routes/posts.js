const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
  togglePostStatus,
  getPublicPosts,
  addComment,
  editComment,
  deleteComment,
  addReply,
  editReply,
  deleteReply,
  toggleLike,
  upload,
} = require("../controllers/postController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/public", getPublicPosts);
router.use(requireAuth);

router.get("/", getPosts);
router.get("/:id", getPost);

// Use multer upload middleware for creating and updating
router.post("/", upload.single("photo"), createPost);
router.patch("/:id", upload.single("photo"), updatePost);
router.delete("/:id", deletePost);

router.patch("/toggle-status/:id", togglePostStatus);

router.post("/:id/comments", addComment);
router.patch("/:postId/comments/:commentId", editComment);
router.delete("/:postId/comments/:commentId", deleteComment);
// In routes/posts.js
// Add these new routes after your comment routes
router.post("/:postId/comments/:commentId/replies", addReply);
router.patch("/:postId/comments/:commentId/replies/:replyId", editReply);
router.delete("/:postId/comments/:commentId/replies/:replyId", deleteReply);
// Add this route to your posts routes
router.post("/:id/like", toggleLike);

module.exports = router;
