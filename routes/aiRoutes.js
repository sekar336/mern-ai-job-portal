const express = require("express");
const router = express.Router();

const {
  matchResumeWithJobs,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get(
  "/resume-match",
  protect,
  authorize("jobseeker"),
  matchResumeWithJobs
);

module.exports = router;