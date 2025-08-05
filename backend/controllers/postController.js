/*
const Post = require("../models/postModel");
const mongoose = require("mongoose");

//get all posts
const getPosts = async (req, res) => {
  const user_id = req.user._id;

  const posts = await Post.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(posts);
};

//get a single post
const getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

//create new post
const createPost = async (req, res) => {
  const { location, description } = req.body;

  let emptyFields = [];

  if (!location) {
    emptyFields.push("location");
  }
  if (!description) {
    emptyFields.push("description");
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  //add doc to db
  try {
    const user_id = req.user._id;
    const post = await Post.create({ location, description, user_id });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findOneAndDelete({ _id: id });
  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

//update a post
const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }
  res.status(200).json(post);
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
};*/

const Post = require("../models/postModel");
const mongoose = require("mongoose");

const multer = require("multer");
const path = require("path");

// ===== Multer Storage Setup =====

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 162747384.jpg
  },
});

const upload = multer({ storage });

// ===== Controller Functions =====

// Get all posts
/*const getPosts = async (req, res) => {
  const user_id = req.user._id;
  const posts = await Post.find({ user_id }).sort({ createdAt: -1 })
}*/
// Get all posts
const getPosts = async (req, res) => {
  const user_id = req.user._id;
  //const posts = await Post.find({ user_id }).sort({ createdAt: -1 });
  const posts = await Post.find()
    .populate("user_id", "email") // ✅ Load email and name of user
    .sort({ createdAt: -1 });

  res.status(200).json(posts);
};

// Get a single post
const getPost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  /*const post = await Post.findById(id);*/

  //const post = await Post.findById(id);
  const post = await Post.findById(id).populate("user_id", "email");

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

// Create new post (with optional photo)
const createPost = async (req, res) => {
  const { location, description } = req.body;

  let emptyFields = [];
  if (!location) emptyFields.push("location");
  if (!description) emptyFields.push("description");

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: "Please fill in all the fields",
      emptyFields,
    });
  }

  const photo = req.file ? req.file.filename : null;

  try {
    const user_id = req.user._id;
    const post = await Post.create({ location, description, photo, user_id });

    res.status(200).json(post);

    // Populate the user email before sending the response
    const populatedPost = await Post.findById(post._id).populate(
      "user_id",
      "email"
    );

    //res.status(200).json(post);
    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const post = await Post.findOneAndDelete({ _id: id });
  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

// Update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such post" });
  }

  const updatedData = { ...req.body };
  if (req.file) {
    updatedData.photo = req.file.filename;
  }

  const post = await Post.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
  });

  if (!post) {
    return res.status(404).json({ error: "No such post" });
  }

  res.status(200).json(post);
};

// Toggle post status between public/private
const togglePostStatus = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid post ID" });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  post.status = post.status === "public" ? "private" : "public";
  await post.save();

  res.status(200).json(post);
};

const getPublicPosts = async (req, res) => {
  /*const posts = await Post.find({ status: "public" }).sort({ createdAt: -1 });
  res.status(200).json(posts);
};*/

  const posts = await Post.find({ status: "public" })
    .populate("user_id", "email")
    .sort({ createdAt: -1 });
  res.status(200).json(posts);
};

// Add comment to a public post
const addComment = async (req, res) => {
  const { id } = req.params;
  const { user, text } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (!user) {
    return res.status(400).json({ error: "User information missing" });
  }

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Comment text is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    const post = await Post.findById(id);

    if (!post || post.status !== "public") {
      return res.status(404).json({ error: "Public post not found" });
    }

    post.comments.push({ user, text });
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error("Error in addComment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

module.exports = {
  upload, // export multer middleware
  createPost,
  getPosts,
  getPost,
  deletePost,
  updatePost,
  togglePostStatus,
  getPublicPosts,
  addComment,
};
