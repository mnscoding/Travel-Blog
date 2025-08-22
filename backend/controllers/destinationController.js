const Destination = require("../models/destinationModel");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ================= Multer Setup =================

// Define upload path (for destinations only)
const uploadPath = path.join(__dirname, "..", "uploads", "destinations");

// Ensure folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("✅ Created folder:", uploadPath);
}

// Multer storage setup for multiple photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // always safe now
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// ================= Controllers =================

// Get all destinations with filtering
const getDestinations = async (req, res) => {
  try {
    const { category, country, sortBy, search } = req.query;
    let filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (country && country !== "all") {
      filter.country = country;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = {};
    switch (sortBy) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "mostLiked":
        sortOptions = { "likes.length": -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const destinations = await Destination.find(filter)
      .populate("user_id", "email name")
      .sort(sortOptions);

    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single destination
const getDestination = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such destination" });
  }

  try {
    const destination = await Destination.findById(id).populate(
      "user_id",
      "email name"
    );

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new destination
const createDestination = async (req, res) => {
  try {
    const {
      title,
      description,
      country,
      location,
      category,
      bestTimeToVisit,
      estimatedCost,
      tags,
    } = req.body;

    // Validation
    let emptyFields = [];
    if (!title) emptyFields.push("title");
    if (!description) emptyFields.push("description");
    if (!country) emptyFields.push("country");
    if (!location) emptyFields.push("location");
    if (!category) emptyFields.push("category");

    if (emptyFields.length > 0) {
      return res.status(400).json({
        error: "Please fill in all required fields",
        emptyFields,
      });
    }

    const user_id = req.user._id;

    // Process uploaded photos
    const photos = req.files ? req.files.map((file) => file.filename) : [];

    const destination = await Destination.create({
      title,
      description,
      country,
      location,
      category,
      photos,
      user_id,
      bestTimeToVisit,
      estimatedCost,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    const populatedDestination = await Destination.findById(
      destination._id
    ).populate("user_id", "email name");

    res.status(201).json(populatedDestination);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update destination
const updateDestination = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such destination" });
  }

  try {
    const destination = await Destination.findOne({ _id: id });

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    // Check if user owns the destination
    if (destination.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedData = { ...req.body };

    // Process new photos if any
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.filename);
      updatedData.photos = [...destination.photos, ...newPhotos];
    }

    if (updatedData.tags) {
      updatedData.tags = updatedData.tags.split(",").map((tag) => tag.trim());
    }

    const updatedDestination = await Destination.findOneAndUpdate(
      { _id: id },
      updatedData,
      { new: true }
    ).populate("user_id", "email name");

    res.status(200).json(updatedDestination);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete destination
const deleteDestination = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such destination" });
  }

  try {
    const destination = await Destination.findOne({ _id: id });

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    // Check if user owns the destination
    if (destination.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Destination.findOneAndDelete({ _id: id });
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like/Unlike destination
const toggleLike = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid destination ID" });
  }

  if (!user) {
    return res.status(400).json({ error: "User information is required" });
  }

  try {
    const destination = await Destination.findById(id);

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    const existingLikeIndex = destination.likes.findIndex(
      (like) => like.user === user
    );

    if (existingLikeIndex > -1) {
      destination.likes.splice(existingLikeIndex, 1);
    } else {
      destination.likes.push({ user, createdAt: new Date() });
    }

    await destination.save();
    res.status(200).json({ likes: destination.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get destinations by user
const getUserDestinations = async (req, res) => {
  const { userId } = req.params;

  try {
    const destinations = await Destination.find({ user_id: userId })
      .populate("user_id", "email name")
      .sort({ createdAt: -1 });

    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    const categories = await Destination.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get countries
const getCountries = async (req, res) => {
  try {
    const countries = await Destination.distinct("country");
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upload,
  createDestination,
  getDestinations,
  getDestination,
  updateDestination,
  deleteDestination,
  toggleLike,
  getUserDestinations,
  getCategories,
  getCountries,
};
