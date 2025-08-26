const express = require("express");
const {
  createProfile,
  getProfile,
  updateProfile,
  getProfilePhoto,
  getProfileByUserId,
  deleteProfile,
} = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/user/:userId", getProfileByUserId);
// Protect routes
router.use(requireAuth);

// POST /api/profiles
router.post("/", upload.single("photo"), createProfile);
router.get("/", getProfile);
router.put("/", upload.single("photo"), updateProfile);
router.get("/photo", getProfilePhoto);
router.delete("/", deleteProfile);
// GET /api/profile/user/:userId

module.exports = router;

/*const express = require("express");
const {
  createProfile,
  getProfiles,
  getProfile,
  deleteProfile,
  updateProfile,
  getProfileByEmail,
} = require("../controllers/profileController");

const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/upload"); // ✅ Your custom multer middleware

const router = express.Router();

// Require auth for all routes
router.use(requireAuth);

// Routes
router.get("/", getProfiles);
router.get("/:id", getProfile);
router.post("/", upload.single("photo"), createProfile); // ✅ with photo upload
router.delete("/:id", deleteProfile);
router.patch("/:id", upload.single("photo"), updateProfile); // ✅ with photo upload
router.get("/me", getProfileByEmail);

module.exports = router;*/
