const express = require("express");

//controller function
const {
  signupUser,
  loginUser,
  deleteAccount,
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//login routes
router.post("/login", loginUser);

//signup routes
router.post("/signup", signupUser);

// delete account route
router.delete("/", requireAuth, deleteAccount);

module.exports = router;
