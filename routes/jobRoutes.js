const express = require("express");
const router = express.Router();

const {
  getJobs,
  getMyJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  getRecommendedJobs,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// =====================================
// PUBLIC ROUTES
// =====================================

router.get("/", getJobs);

// =====================================
// PROTECTED SPECIAL ROUTES
// IMPORTANT: These MUST come before /:id
// =====================================

router.get(
  "/my",
  protect,
  authorize("recruiter"),
  getMyJobs
);

router.get(
  "/recommended",
  protect,
  authorize("jobseeker"),
  getRecommendedJobs
);

// =====================================
// SINGLE JOB
// Keep this AFTER /my and /recommended
// =====================================

router.get("/:id", getSingleJob);

// =====================================
// RECRUITER JOB MANAGEMENT
// =====================================

router.post(
  "/",
  protect,
  authorize("recruiter"),
  createJob
);

router.put(
  "/:id",
  protect,
  authorize("recruiter"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorize("recruiter"),
  deleteJob
);

module.exports = router;