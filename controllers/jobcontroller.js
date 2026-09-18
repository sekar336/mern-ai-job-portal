const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");

// ===============================
// GET ALL JOBS
// ===============================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Get Jobs Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// ===============================
// GET LOGGED-IN RECRUITER'S JOBS
// ===============================
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Get My Jobs Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs",
    });
  }
};

// ===============================
// GET SINGLE JOB
// ===============================
const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json(job);
  } catch (err) {
    console.error("Get Single Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

// ===============================
// CREATE JOB
// ===============================
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      salary,
      jobType,
      experience,
      skills,
    } = req.body;

    // Required fields
    if (!title || !company || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, company and location are required",
      });
    }

    const cleanSkills = Array.isArray(skills)
      ? skills
          .filter((skill) => typeof skill === "string")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

    const newJob = new Job({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description || "",
      salary: salary || "",
      jobType: jobType || "Full Time",
      experience: experience || "",
      skills: cleanSkills,
      createdBy: req.user.id,
    });

    const savedJob = await newJob.save();

    res.status(201).json({
      success: true,
      message: "Job Created Successfully",
      job: savedJob,
    });
  } catch (err) {
    console.error("Create Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

// ===============================
// UPDATE JOB
// ===============================
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ===============================
    // OWNERSHIP CHECK
    // ===============================
    if (job.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this job",
      });
    }

    // ===============================
    // UPDATE BASIC FIELDS
    // ===============================
    if (req.body.title !== undefined) {
      if (!req.body.title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Job title cannot be empty",
        });
      }

      job.title = req.body.title.trim();
    }

    if (req.body.company !== undefined) {
      if (!req.body.company.trim()) {
        return res.status(400).json({
          success: false,
          message: "Company name cannot be empty",
        });
      }

      job.company = req.body.company.trim();
    }

    if (req.body.location !== undefined) {
      if (!req.body.location.trim()) {
        return res.status(400).json({
          success: false,
          message: "Location cannot be empty",
        });
      }

      job.location = req.body.location.trim();
    }

    if (req.body.description !== undefined) {
      job.description = req.body.description;
    }

    if (req.body.salary !== undefined) {
      job.salary = req.body.salary;
    }

    if (req.body.jobType !== undefined) {
      job.jobType = req.body.jobType;
    }

    if (req.body.experience !== undefined) {
      job.experience = req.body.experience;
    }

    // ===============================
    // UPDATE SKILLS
    // ===============================
    if (Array.isArray(req.body.skills)) {
      job.skills = req.body.skills
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    const updatedJob = await job.save();

    res.status(200).json({
      success: true,
      message: "Job Updated Successfully",
      job: updatedJob,
    });
  } catch (err) {
    console.error("Update Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};

// ===============================
// DELETE JOB
// ===============================
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ===============================
    // OWNERSHIP CHECK
    // ===============================
    if (job.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Job Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
};

// ===============================
// GET RECOMMENDED JOBS
// ===============================
const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.skills || user.skills.length === 0) {
      return res.json({
        success: true,
        jobs: [],
        message: "Please add your skills first",
      });
    }

    const skillRegex = user.skills
      .filter((skill) => typeof skill === "string" && skill.trim())
      .map((skill) => new RegExp(skill.trim(), "i"));

    const jobs = await Job.find({
      skills: {
        $in: skillRegex,
      },
    }).sort({ createdAt: -1 });

    const recommendedJobs = jobs
      .map((job) => {
        const matchingSkills = job.skills.filter((jobSkill) =>
          user.skills.some(
            (userSkill) =>
              userSkill.toLowerCase().trim() ===
              jobSkill.toLowerCase().trim()
          )
        );

        const matchPercentage =
          job.skills.length > 0
            ? Math.round(
                (matchingSkills.length / job.skills.length) * 100
              )
            : 0;

        return {
          ...job.toObject(),
          matchingSkills,
          matchPercentage,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      jobs: recommendedJobs,
    });
  } catch (err) {
    console.error("Recommended Jobs Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recommended jobs",
    });
  }
};

// ===============================
// EXPORT CONTROLLERS
// ===============================
module.exports = {
  getJobs,
  getMyJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  getRecommendedJobs,
};
