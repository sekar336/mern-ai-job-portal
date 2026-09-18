const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // Job Title
    title: {
      type: String,
      required: true,
    },

    // Company Name
    company: {
      type: String,
      required: true,
    },

    // Job Location
    location: {
      type: String,
      required: true,
    },

    // Job Description
    description: {
      type: String,
      default: "",
    },

    // Salary
    salary: {
      type: String,
      default: "",
    },

    // Job Type
    jobType: {
      type: String,
      default: "Full Time",
    },

    // Required Experience
    experience: {
      type: String,
      default: "",
    },

    // Required Skills
    skills: {
      type: [String],
      default: [],
    },

    // Recruiter who created this job
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);