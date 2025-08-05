/*
const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
} = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//require auth for all post routes
router.use(requireAuth);

//GET all posts
router.get("/", getPosts);

//GET a single post
router.get("/:id", getPost);

//POST a new post
router.post("/", createPost);

//DELETE a post
router.delete("/:id", deletePost);

//UPDATE a post
router.patch("/:id", updatePost);

module.exports = router;*/

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

module.exports = router;
