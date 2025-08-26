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

const deleteProfile = async (req, res) => {
  try {
    const user_id = req.user._id;
    const profile = await Profile.findOneAndDelete({ user_id });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ message: "Profile deleted successfully" });
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
  deleteProfile,
};
