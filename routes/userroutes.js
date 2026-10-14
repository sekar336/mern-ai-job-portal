const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadmiddleware");

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserSkills,
  uploadResume,
} = require("../controllers/usercontroller");

const protect = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get profile
router.get("/profile", protect, getUserProfile);

// Update skills
router.put("/skills", protect, updateUserSkills);

router.put(
  "/resume",
  protect,
  upload.single("resume"),
  uploadResume
);

module.exports = router;