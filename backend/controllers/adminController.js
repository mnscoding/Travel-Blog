const User = require("../models/userModel");
const Post = require("../models/postModel");
const Profile = require("../models/profileModel");

// ===== DASHBOARD STATS =====
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const publicPosts = await Post.countDocuments({ status: "public" });
    const privatePosts = await Post.countDocuments({ status: "private" });
    const totalProfiles = await Profile.countDocuments();

    res.status(200).json({
      totalUsers,
      totalProfiles,
      totalPosts,
      publicPosts,
      privatePosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

// ===== LIST USERS =====
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "email role createdAt").sort({
      createdAt: -1,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ===== LIST PROFILES =====
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("user_id", "email role") // show user's email + role
      .sort({ createdAt: -1 });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};

// ===== LIST POSTS =====
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user_id", "email role") // show author's email + role
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllProfiles,
  getAllPosts,
};
