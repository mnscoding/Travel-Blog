const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllProfiles,
  getAllPosts,
} = require("../controllers/adminController");

const requireAuth = require("../middleware/requireAuth"); // auth middleware

router.use(requireAuth);
// ===== DASHBOARD =====
router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/profiles", getAllProfiles);
router.get("/posts", getAllPosts);

module.exports = router;
