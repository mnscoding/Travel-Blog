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

module.exports = router;
