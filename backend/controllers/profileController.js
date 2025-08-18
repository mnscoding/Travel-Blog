const Profile = require("../models/profileModel");
const path = require("path");

// @desc   Create new profile
// @route  POST /api/profile
// @access Private
const createProfile = async (req, res) => {
  const { name, dob, city, bio } = req.body;

  let emptyFields = [];
  if (!name) emptyFields.push("name");
  if (!dob) emptyFields.push("dob");
  if (!city) emptyFields.push("city");
  if (!bio) emptyFields.push("bio");

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: "Please fill in all required fields",
      emptyFields,
    });
  }

  try {
    const user_id = req.user._id;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user_id });
    if (existingProfile) {
      return res.status(400).json({ error: "Profile already exists" });
    }

    const photo = req.file ? req.file.filename : null;

    const profile = await Profile.create({
      user_id,
      name,
      dob,
      city,
      bio,
      photo,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Get user profile
// @route  GET /api/profile
// @access Private
const getProfile = async (req, res) => {
  try {
    const user_id = req.user._id;
    const profile = await Profile.findOne({ user_id });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc   Update profile
// @route  PUT /api/profile
// @access Private
const updateProfile = async (req, res) => {
  const { name, dob, city, bio } = req.body;

  try {
    const user_id = req.user._id;
    const photo = req.file ? req.file.filename : undefined;

    const profile = await Profile.findOneAndUpdate(
      { user_id },
      {
        name,
        dob,
        city,
        bio,
        ...(photo && { photo }),
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfilePhoto = async (req, res) => {
  try {
    const user_id = req.user._id;
    const profile = await Profile.findOne({ user_id }).select("photo");

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ photo: profile.photo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user_id: userId });
    res.status(200).json(profile || {}); // <-- always 200
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  getProfilePhoto,
  getProfileByUserId,
};

/*08.10
const Profile = require("../models/profileModel");
const path = require("path");

// @desc   Create new profile
// @route  POST /api/profiles
// @access Public (You can add auth if needed)
const createProfile = async (req, res) => {
  const { name, dob, city, bio } = req.body;

  let emptyFields = [];
  if (!name) emptyFields.push("name"); //hiii
  if (!dob) emptyFields.push("dob");
  if (!city) emptyFields.push("city");
  if (!bio) emptyFields.push("bio");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all required fields", emptyFields });
  }

  try {
    const user_id = req.user._id;
    const photo = req.file ? req.file.filename : null;

    const profile = await Profile.create({
      user_id,
      name,
      dob,
      city,
      bio,
      photo,
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProfile,
};

module.exports = { createProfile };*/

/*const Profile = require("../models/profileModel");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
});

// Initialize upload variable with Multer storage configuration
const upload = multer({ storage });

// Get all profiles
const getProfiles = async (req, res) => {
  const user_id = req.user._id;

  try {
    const profiles = await Profile.find({}).sort({ createdAt: -1 });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};

// Get single profile
const getProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such profile" });
  }

  const profile = await Profile.findById(id);

  if (!profile) {
    return res.status(404).json({ error: "No such profile" });
  }

  res.status(200).json(profile);
};

// Create profile
const createProfile = async (req, res) => {
  const { name, dob, city, bio, email, user_id } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : "";

  let emptyFields = [];

  if (!name) emptyFields.push("name");
  if (!dob) emptyFields.push("dob");
  if (!city) emptyFields.push("city");
  if (!bio) emptyFields.push("bio");

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  try {
    const profile = await Profile.create({
      name,
      dob,
      city,
      bio,
      email,
      photo,
      user_id,
    });

    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete profile
const deleteProfile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such profile" });
  }

  const profile = await Profile.findOneAndDelete({ _id: id });

  if (!profile) {
    return res.status(404).json({ error: "No such profile" });
  }

  res.status(200).json(profile);
};

// Update profile
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const updatedData = { ...req.body };

  if (req.file) {
    updatedData.photo = `/uploads/${req.file.filename}`;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such profile" });
  }

  const profile = await Profile.findOneAndUpdate({ _id: id }, updatedData, {
    new: true,
  });

  if (!profile) {
    return res.status(404).json({ error: "No such profile" });
  }

  res.status(200).json(profile);
};

// Get profile by user email
const getProfileByEmail = async (req, res) => {
  const userEmail = req.user.email; // email from the decoded token

  try {
    const profile = await Profile.findOne({ user_id });

    if (!profile) {
      return res.status(404).json({ error: "No profile found for this email" });
    }

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createProfile,
  getProfiles,
  getProfile,
  deleteProfile,
  updateProfile,
  getProfileByEmail,
};*/
