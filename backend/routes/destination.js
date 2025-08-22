const express = require("express");
const {
  createDestination,
  getDestinations,
  getDestination,
  updateDestination,
  deleteDestination,
  toggleLike,
  getUserDestinations,
  getCategories,
  getCountries,
  upload,
} = require("../controllers/destinationController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Public routes
router.get("/", getDestinations);
router.get("/categories", getCategories);
router.get("/countries", getCountries);
router.get("/:id", getDestination);
router.get("/user/:userId", getUserDestinations);

// Protected routes
router.use(requireAuth);
router.post("/", upload.array("photos", 5), createDestination);
router.patch("/:id", upload.array("photos", 5), updateDestination);
router.delete("/:id", deleteDestination);
router.post("/:id/like", toggleLike);

module.exports = router;
