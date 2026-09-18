const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const OpenAI = require("openai");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const User = require("../models/User");
const Job = require("../models/Job");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ----------------------------------------------------
// Extract text from PDF
// ----------------------------------------------------
const extractPdfText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return result.text || "";
  } finally {
    await parser.destroy();
  }
};

// ----------------------------------------------------
// Extract text from DOCX
// ----------------------------------------------------
const extractDocxText = async (filePath) => {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return result.value || "";
};

// ----------------------------------------------------
// Extract resume text based on file extension
// ----------------------------------------------------
const extractResumeText = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    return await extractPdfText(filePath);
  }

  if (extension === ".docx") {
    return await extractDocxText(filePath);
  }

  throw new Error("Only PDF and DOCX resumes are supported");
};

// ----------------------------------------------------
// Resume → Job AI Matching
// ----------------------------------------------------
const matchResumeWithJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // Get logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Only jobseekers can use AI matching
    if (user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can use AI resume matching",
      });
    }

    // Check resume
    if (!user.resume) {
      return res.status(400).json({
        message: "Please upload your resume first",
      });
    }

    // ------------------------------------------------
    // Resolve resume file path
    // ------------------------------------------------
    let resumePath = user.resume;

    // If resume is stored as a URL/path beginning with /
    if (resumePath.startsWith("/")) {
      resumePath = resumePath.substring(1);
    }

    // Remove localhost URL if stored in DB
    if (resumePath.startsWith("http://localhost:5000/")) {
      resumePath = resumePath.replace(
        "http://localhost:5000/",
        ""
      );
    }

    if (resumePath.startsWith("http://localhost:5173/")) {
      resumePath = resumePath.replace(
        "http://localhost:5173/",
        ""
      );
    }

    resumePath = path.join(__dirname, "..", resumePath);

    // ------------------------------------------------
    // Check resume file exists
    // ------------------------------------------------
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({
        message: "Resume file not found",
      });
    }

    // ------------------------------------------------
    // Extract resume text
    // ------------------------------------------------
    const resumeText = await extractResumeText(resumePath);

    if (!resumeText.trim()) {
      return res.status(400).json({
        message: "Could not extract text from resume",
      });
    }

    // ------------------------------------------------
    // Get available jobs
    // ------------------------------------------------
    const jobs = await Job.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.json({
        message: "No jobs available",
        matches: [],
      });
    }

    // ------------------------------------------------
    // AI matching
    // ------------------------------------------------
    const matches = [];

    for (const job of jobs) {
      try {
        const jobSkills = Array.isArray(job.skills)
          ? job.skills
          : [];

        const jobInformation = `
Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Job Type: ${job.jobType || ""}
Experience: ${job.experience || ""}
Salary: ${job.salary || ""}

Job Description:
${job.description || ""}

Required Skills:
${jobSkills.join(", ")}
`;

        const prompt = `
You are an AI recruitment assistant.

Analyze the candidate's resume against the job requirements.

Candidate Resume:
${resumeText}

Job Information:
${jobInformation}

Return ONLY valid JSON in this exact format:

{
  "matchPercentage": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "explanation": ""
}

Rules:
- matchPercentage must be an integer from 0 to 100.
- matchedSkills must contain skills clearly present in the resume and relevant to the job.
- missingSkills must contain important job skills that are not clearly present in the resume.
- explanation must briefly explain why the candidate matches or does not match.
- Do not invent candidate experience.
- Consider both technical skills and relevant experience.
`;

        const response = await openai.responses.create({
          model: "gpt-5.6-luna",
          input: prompt,
        });

        let aiText = response.output_text || "";

        aiText = aiText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        let aiResult;

        try {
          aiResult = JSON.parse(aiText);
        } catch (parseError) {
          console.error(
            `AI JSON parsing failed for job ${job._id}:`,
            parseError.message
          );

          aiResult = {
            matchPercentage: 0,
            matchedSkills: [],
            missingSkills: [],
            explanation:
              "AI could not analyze this job correctly.",
          };
        }

        // Make sure match percentage is safe
        let matchPercentage = Number(
          aiResult.matchPercentage
        );

        if (Number.isNaN(matchPercentage)) {
          matchPercentage = 0;
        }

        matchPercentage = Math.max(
          0,
          Math.min(100, Math.round(matchPercentage))
        );

        // Make sure skills are arrays
        const matchedSkills = Array.isArray(
          aiResult.matchedSkills
        )
          ? aiResult.matchedSkills
          : [];

        const missingSkills = Array.isArray(
          aiResult.missingSkills
        )
          ? aiResult.missingSkills
          : [];

        matches.push({
          job: {
            _id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            salary: job.salary,
            jobType: job.jobType,
            experience: job.experience,
            skills: job.skills,
            createdBy: job.createdBy,
            createdAt: job.createdAt,
          },

          matchPercentage,

          matchedSkills,

          missingSkills,

          explanation:
            aiResult.explanation ||
            "AI analysis completed.",
        });
      } catch (jobError) {
        console.error(
          `AI matching failed for job ${job._id}:`,
          jobError.message
        );

        // Continue analyzing other jobs
        matches.push({
          job: {
            _id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            salary: job.salary,
            jobType: job.jobType,
            experience: job.experience,
            skills: job.skills,
            createdBy: job.createdBy,
            createdAt: job.createdAt,
          },

          matchPercentage: 0,

          matchedSkills: [],

          missingSkills: job.skills || [],

          explanation:
            "AI analysis was unavailable for this job.",
        });
      }
    }

    // ------------------------------------------------
    // Sort highest matching jobs first
    // ------------------------------------------------
    matches.sort(
      (a, b) =>
        b.matchPercentage - a.matchPercentage
    );

    return res.json({
      message: "AI resume matching completed successfully",
      matches,
    });
  } catch (error) {
    console.error(
      "AI Resume Match Error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to analyze resume",
    });
  }
};

module.exports = {
  matchResumeWithJobs,
};