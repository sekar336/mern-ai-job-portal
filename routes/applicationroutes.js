const express = require("express");

const router = express.Router();

const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ===============================
// JOBSEEKER ROUTES
// ===============================

// Apply for a job
router.post(
  "/",
  protect,
  authorize("jobseeker"),
  applyForJob
);

// Get my applications
router.get(
  "/my",
  protect,
  authorize("jobseeker"),
  getMyApplications
);

// ===============================
// RECRUITER ROUTES
// ===============================

// Get applicants
router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter"),
  getJobApplicants
);

// Update status
router.put(
  "/:id/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus
);

module.exports = router;