const mongoose = require("mongoose");
const Application = require("../models/Application");
const Notification = require("../models/notification");
const Job = require("../models/Job");

// ==========================================
// APPLY FOR A JOB
// ==========================================
const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        success: false,
        message: "Only jobseekers can apply for jobs",
      });
    }

    const { jobId } = req.body;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      job: jobId,
      user: req.user.id,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      user: req.user.id,
    });

    // Notification failure should not cancel the application
    try {
      await Notification.create({
        user: job.createdBy,
        title: "New Job Application",
        message: `A candidate has applied for your ${job.title} position.`,
        type: "application",
        relatedJob: job._id,
        relatedApplication: application._id,
      });
    } catch (notificationError) {
      console.error(
        "Recruiter Notification Error:",
        notificationError
      );
    }

    res.status(201).json({
      success: true,
      message: "Job Applied Successfully",
      application,
    });
  } catch (err) {
    console.error("Apply For Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to apply for job",
    });
  }
};

// ==========================================
// GET MY APPLICATIONS
// ==========================================
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user.id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (err) {
    console.error("Get My Applications Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// ==========================================
// RECRUITER - GET APPLICANTS
// ==========================================
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Find the job first
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ==========================================
    // OWNERSHIP CHECK
    // ==========================================
    if (job.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view applicants for this job",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate(
        "user",
        "name email role resume"
      )
      .populate(
        "job",
        "title company location"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (err) {
    console.error("Get Job Applicants Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applicants",
    });
  }
};

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Rejected",
      "Selected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // ==========================================
    // FIND APPLICATION
    // ==========================================
    const existingApplication =
      await Application.findById(id)
        .populate(
          "user",
          "name email role resume"
        )
        .populate(
          "job",
          "title company location createdBy"
        );

    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (!existingApplication.job) {
      return res.status(404).json({
        success: false,
        message: "Associated job not found",
      });
    }

    // ==========================================
    // RECRUITER OWNERSHIP CHECK
    // ==========================================
    if (
      existingApplication.job.createdBy.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this application",
      });
    }

    const previousStatus =
      existingApplication.status;

    existingApplication.status = status;

    await existingApplication.save();

    // ==========================================
    // NOTIFY JOBSEEKER
    // ==========================================
    if (previousStatus !== status) {
      let notificationTitle =
        "Application Status Updated";

      let notificationMessage = `Your application for ${
        existingApplication.job.title
      } has been updated to ${status}.`;

      if (status === "Shortlisted") {
        notificationTitle =
          "Application Shortlisted";

        notificationMessage = `Great news! Your application for ${existingApplication.job.title} at ${existingApplication.job.company} has been shortlisted.`;
      }

      if (status === "Selected") {
        notificationTitle =
          "Application Selected";

        notificationMessage = `Congratulations! You have been selected for ${existingApplication.job.title} at ${existingApplication.job.company}.`;
      }

      if (status === "Rejected") {
        notificationTitle =
          "Application Update";

        notificationMessage = `Your application for ${existingApplication.job.title} at ${existingApplication.job.company} was not selected this time.`;
      }

      try {
        await Notification.create({
          user: existingApplication.user._id,
          title: notificationTitle,
          message: notificationMessage,
          type: "status",
          relatedJob: existingApplication.job._id,
          relatedApplication:
            existingApplication._id,
        });
      } catch (notificationError) {
        console.error(
          "Jobseeker Notification Error:",
          notificationError
        );
      }
    }

    res.json({
      success: true,
      message:
        "Application status updated successfully",
      application: existingApplication,
    });
  } catch (err) {
    console.error(
      "Update Application Status Error:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
};