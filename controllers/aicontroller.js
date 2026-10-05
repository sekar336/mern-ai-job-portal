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

// ======================================================
// COMMON SKILLS
// ======================================================

const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "HTML",
  "CSS",
  "SQL",
  "React",
  "React.js",
  "Node.js",
  "Express",
  "Express.js",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Oracle",
  "Redis",
  "Firebase",
  "Next.js",
  "Vue",
  "Vue.js",
  "Angular",
  "Angular.js",
  "Tailwind CSS",
  "Bootstrap",
  "Material UI",
  "Git",
  "GitHub",
  "GitLab",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "REST API",
  "GraphQL",
  "OpenAI API",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "Data Science",
  "Pandas",
  "NumPy",
  "TensorFlow",
  "PyTorch",
  "Django",
  "Flask",
  "Spring Boot",
  "PHP",
  "Laravel",
  "Figma",
  "UI/UX",
  "Communication",
  "Communication Skills",
  "Teamwork",
  "Leadership",
  "Problem Solving",
];

// ======================================================
// RESUME PATH
// ======================================================

const resolveResumePath = (resumeValue) => {
  if (!resumeValue) {
    return null;
  }

  let resumePath = String(resumeValue).trim();

  resumePath = resumePath.replace(
    /^https?:\/\/localhost:5000/i,
    ""
  );

  resumePath = resumePath.replace(
    /^https?:\/\/localhost:5173/i,
    ""
  );

  resumePath = resumePath.replace(/\\/g, "/");

  resumePath = resumePath.replace(/^\/+/, "");

  if (!resumePath.startsWith("uploads/")) {
    resumePath = path.join(
      "uploads",
      resumePath
    );
  }

  return path.resolve(
    __dirname,
    "..",
    resumePath
  );
};

// ======================================================
// PDF TEXT EXTRACTION
// ======================================================

const extractPdfText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return result?.text || "";
  } finally {
    await parser.destroy();
  }
};

// ======================================================
// DOCX TEXT EXTRACTION
// ======================================================

const extractDocxText = async (filePath) => {
  const result =
    await mammoth.extractRawText({
      path: filePath,
    });

  return result?.value || "";
};

// ======================================================
// RESUME TEXT
// ======================================================

const extractResumeText = async (
  filePath
) => {
  const extension =
    path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    return await extractPdfText(filePath);
  }

  if (extension === ".docx") {
    return await extractDocxText(filePath);
  }

  throw new Error(
    "Only PDF and DOCX resumes are supported"
  );
};

// ======================================================
// CLEAN SKILLS
// ======================================================

const cleanSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  const result = [];
  const seen = new Set();

  for (const skill of skills) {
    if (!skill) {
      continue;
    }

    const cleaned = String(skill)
      .trim()
      .replace(/\s+/g, " ");

    if (!cleaned) {
      continue;
    }

    const key = cleaned.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      result.push(cleaned);
    }
  }

  return result;
};

// ======================================================
// NORMALIZE SKILL
// ======================================================

const normalizeSkill = (skill) => {
  return String(skill || "")
    .toLowerCase()
    .replace(/\.js/g, "js")
    .replace(/nodejs/g, "node")
    .replace(/reactjs/g, "react")
    .replace(/vuejs/g, "vue")
    .replace(/angularjs/g, "angular")
    .replace(/expressjs/g, "express")
    .replace(/javascript/g, "js")
    .replace(/typescript/g, "ts")
    .replace(/mongodb/g, "mongo")
    .replace(/postgresql/g, "postgres")
    .replace(/c\+\+/g, "cpp")
    .replace(/c#/g, "csharp")
    .replace(/\.net/g, "dotnet")
    .replace(/[.\-_+#/]/g, "")
    .replace(/\s+/g, "")
    .trim();
};

// ======================================================
// SPLIT SKILL STRING
// ======================================================

const splitSkillString = (value) => {
  if (!value) {
    return [];
  }

  const text = String(value).trim();

  if (!text) {
    return [];
  }

  // Normal separators
  const separated = text
    .split(/[,;|\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (separated.length > 1) {
    return separated;
  }

  return [text];
};

// ======================================================
// EXPAND SKILLS
//
// Handles:
// ["React", "Node.js"]
//
// AND also:
// ["JavaScript React Node.js Express.js MongoDB"]
// ======================================================

const expandSkills = (skills) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  const rawSkills = [];

  for (const skill of skills) {
    rawSkills.push(
      ...splitSkillString(skill)
    );
  }

  const result = [];

  // First add normal separated skills
  for (const skill of rawSkills) {
    const cleaned = String(skill)
      .trim()
      .replace(/\s+/g, " ");

    if (cleaned) {
      result.push(cleaned);
    }
  }

  // Detect known skills inside large strings
  const combinedText = rawSkills
    .join(" ")
    .toLowerCase();

  for (const knownSkill of COMMON_SKILLS) {
    const normalizedKnown =
      normalizeSkill(knownSkill);

    const normalizedCombined =
      normalizeSkill(combinedText);

    if (
      normalizedKnown &&
      normalizedCombined.includes(
        normalizedKnown
      )
    ) {
      result.push(knownSkill);
    }
  }

  return cleanSkills(result);
};

// ======================================================
// DETECT SKILLS DIRECTLY FROM RESUME TEXT
//
// Backup if AI returns empty
// ======================================================

const detectSkillsFromText = (
  resumeText
) => {
  const text = String(
    resumeText || ""
  ).toLowerCase();

  const detected = [];

  for (const skill of COMMON_SKILLS) {
    const skillLower =
      skill.toLowerCase();

    if (
      text.includes(skillLower)
    ) {
      detected.push(skill);
    }
  }

  return cleanSkills(detected);
};

// ======================================================
// PARSE AI JSON
// ======================================================

const parseAIResponse = (text) => {
  if (!text) {
    throw new Error(
      "Empty AI response"
    );
  }

  let cleaned = String(text)
    .trim()
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace =
    cleaned.indexOf("{");

  const lastBrace =
    cleaned.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleaned = cleaned.substring(
      firstBrace,
      lastBrace + 1
    );
  }

  return JSON.parse(cleaned);
};

// ======================================================
// AI RESUME SKILL EXTRACTION
// ======================================================

const extractResumeSkillsWithAI = async (
  resumeText
) => {
  const limitedResumeText =
    resumeText.slice(0, 15000);

  const prompt = `
You are an expert resume skill extraction system.

Analyze the candidate resume.

Extract skills that are explicitly mentioned
or clearly demonstrated in the resume.

Include:

- Programming languages
- Frameworks
- Libraries
- Databases
- Web technologies
- Cloud technologies
- AI/ML technologies
- Developer tools
- APIs
- Relevant professional skills

Do NOT invent skills.

Return ONLY valid JSON.

Format:

{
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB"
  ]
}

Candidate Resume:

${limitedResumeText}
`;

  const response =
    await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

  const aiText =
    response.output_text || "";

  const result =
    parseAIResponse(aiText);

  return expandSkills(
    result.skills
  );
};

// ======================================================
// MERGE ALL CANDIDATE SKILLS
//
// Resume AI skills
// +
// Resume text detected skills
// +
// Profile skills
// ======================================================

const buildCandidateSkills = async (
  resumeText,
  profileSkills
) => {
  let aiSkills = [];

  try {
    aiSkills =
      await extractResumeSkillsWithAI(
        resumeText
      );
  } catch (error) {
    console.error(
      "AI skill extraction failed:",
      error.message
    );
  }

  const textSkills =
    detectSkillsFromText(
      resumeText
    );

  const savedProfileSkills =
    expandSkills(
      profileSkills
    );

  const allSkills = cleanSkills([
    ...aiSkills,
    ...textSkills,
    ...savedProfileSkills,
  ]);

  console.log(
    "AI Resume Skills:",
    aiSkills
  );

  console.log(
    "Resume Text Skills:",
    textSkills
  );

  console.log(
    "Profile Skills:",
    savedProfileSkills
  );

  console.log(
    "FINAL CANDIDATE SKILLS:",
    allSkills
  );

  return allSkills;
};

// ======================================================
// DETERMINISTIC SKILL MATCH
// ======================================================

const calculateSkillMatch = (
  resumeSkills,
  jobSkills
) => {
  const candidateSkills =
    expandSkills(resumeSkills);

  const requiredSkills =
    expandSkills(jobSkills);

  if (!requiredSkills.length) {
    return {
      percentage: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const candidateNormalized =
    candidateSkills.map(
      normalizeSkill
    );

  const matchedSkills = [];
  const missingSkills = [];

  for (const jobSkill of requiredSkills) {
    const normalizedJobSkill =
      normalizeSkill(jobSkill);

    const matched =
      candidateNormalized.some(
        (candidateSkill) => {
          if (
            !candidateSkill ||
            !normalizedJobSkill
          ) {
            return false;
          }

          return (
            candidateSkill ===
              normalizedJobSkill ||
            candidateSkill.includes(
              normalizedJobSkill
            ) ||
            normalizedJobSkill.includes(
              candidateSkill
            )
          );
        }
      );

    if (matched) {
      matchedSkills.push(
        jobSkill
      );
    } else {
      missingSkills.push(
        jobSkill
      );
    }
  }

  const percentage =
    Math.round(
      (matchedSkills.length /
        requiredSkills.length) *
        100
    );

  return {
    percentage,
    matchedSkills:
      cleanSkills(matchedSkills),
    missingSkills:
      cleanSkills(missingSkills),
  };
};

// ======================================================
// AI JOB MATCH
// ======================================================

const analyzeJobMatchWithAI = async (
  resumeText,
  candidateSkills,
  job
) => {
  const jobSkills =
    expandSkills(job.skills);

  const limitedResumeText =
    resumeText.slice(0, 15000);

  const prompt = `
You are an expert AI recruitment assistant.

Compare the candidate against the job.

CANDIDATE SKILLS:
${candidateSkills.join(", ")}

CANDIDATE RESUME:
${limitedResumeText}

JOB TITLE:
${job.title}

COMPANY:
${job.company}

JOB DESCRIPTION:
${job.description || ""}

JOB EXPERIENCE:
${job.experience || ""}

JOB REQUIRED SKILLS:
${jobSkills.join(", ")}

Return ONLY JSON:

{
  "matchPercentage": 85,
  "matchedSkills": [
    "React",
    "Node.js",
    "MongoDB"
  ],
  "missingSkills": [
    "Docker"
  ],
  "explanation": "The candidate has strong skills relevant to this role."
}

Rules:

- matchPercentage must be 0 to 100.
- matchedSkills must come from candidate skills.
- missingSkills must come from required job skills.
- Do not invent skills.
- Consider both skills and relevant experience.
- If most job skills match, score should be high.
- If half match, score should be around 40-60.
- If very few match, score should be low.
- Return ONLY JSON.
`;

  const response =
    await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

  return parseAIResponse(
    response.output_text || ""
  );
};

// ======================================================
// MAIN CONTROLLER
// ======================================================

const matchResumeWithJobs = async (
  req,
  res
) => {
  try {
    // --------------------------------------------------
    // USER
    // --------------------------------------------------

    const userId =
      req.user.id;

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid user ID",
      });
    }

    const user =
      await User.findById(
        userId
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    if (
      user.role !== "jobseeker"
    ) {
      return res.status(403).json({
        message:
          "Only jobseekers can use AI resume matching",
      });
    }

    // --------------------------------------------------
    // RESUME
    // --------------------------------------------------

    if (!user.resume) {
      return res.status(400).json({
        message:
          "Please upload your resume first",
      });
    }

    const resumePath =
      resolveResumePath(
        user.resume
      );

    console.log(
      "Stored resume:",
      user.resume
    );

    console.log(
      "Resolved resume:",
      resumePath
    );

    if (
      !resumePath ||
      !fs.existsSync(
        resumePath
      )
    ) {
      return res.status(404).json({
        message:
          "Resume file was not found. Please upload your resume again.",
      });
    }

    // --------------------------------------------------
    // EXTRACT RESUME TEXT
    // --------------------------------------------------

    let resumeText = "";

    try {
      resumeText =
        await extractResumeText(
          resumePath
        );
    } catch (error) {
      console.error(
        "Resume extraction error:",
        error
      );

      return res.status(400).json({
        message:
          "Unable to read resume. Please upload a valid PDF or DOCX.",
      });
    }

    resumeText =
      resumeText.trim();

    console.log(
      "Extracted characters:",
      resumeText.length
    );

    if (!resumeText) {
      return res.status(400).json({
        message:
          "Could not extract readable text from resume.",
      });
    }

    // --------------------------------------------------
    // BUILD CANDIDATE SKILLS
    //
    // Resume + Profile
    // --------------------------------------------------

    const candidateSkills =
      await buildCandidateSkills(
        resumeText,
        user.skills
      );

    // --------------------------------------------------
    // JOBS
    // --------------------------------------------------

    const jobs =
      await Job.find()
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    if (!jobs.length) {
      return res.json({
        message:
          "No jobs available",

        resume: {
          fileName:
            path.basename(
              resumePath
            ),

          extractedCharacters:
            resumeText.length,
        },

        extractedSkills:
          candidateSkills,

        matches: [],

        jobs: [],
      });
    }

    // --------------------------------------------------
    // MATCH EACH JOB
    // --------------------------------------------------

    const matches = [];

    for (const job of jobs) {
      const jobSkills =
        expandSkills(
          job.skills
        );

      console.log(
        "================================"
      );

      console.log(
        "JOB:",
        job.title
      );

      console.log(
        "ORIGINAL JOB SKILLS:",
        job.skills
      );

      console.log(
        "PARSED JOB SKILLS:",
        jobSkills
      );

      // ------------------------------------------------
      // Deterministic matching
      // ------------------------------------------------

      const fallback =
        calculateSkillMatch(
          candidateSkills,
          jobSkills
        );

      console.log(
        "SKILL MATCH:",
        fallback
      );

      let matchPercentage =
        fallback.percentage;

      let matchedSkills =
        fallback.matchedSkills;

      let missingSkills =
        fallback.missingSkills;

      let explanation =
        `Your resume and profile skills match ${fallback.percentage}% of the required skills for this job.`;

      // ------------------------------------------------
      // AI matching
      // ------------------------------------------------

      try {
        const aiResult =
          await analyzeJobMatchWithAI(
            resumeText,
            candidateSkills,
            job
          );

        console.log(
          "AI RESULT:",
          aiResult
        );

        let aiPercentage =
          Number(
            aiResult.matchPercentage
          );

        if (
          Number.isFinite(
            aiPercentage
          )
        ) {
          aiPercentage =
            Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  aiPercentage
                )
              )
            );

          // If AI says 0 but actual
          // skills match, use actual
          // skill score.
          if (
            aiPercentage === 0 &&
            fallback.percentage > 0
          ) {
            matchPercentage =
              fallback.percentage;

            matchedSkills =
              fallback.matchedSkills;

            missingSkills =
              fallback.missingSkills;
          } else {
            matchPercentage =
              aiPercentage;

            matchedSkills =
              expandSkills(
                aiResult.matchedSkills
              );

            missingSkills =
              expandSkills(
                aiResult.missingSkills
              );
          }
        }

        if (
          typeof aiResult.explanation ===
            "string" &&
          aiResult.explanation.trim()
        ) {
          explanation =
            aiResult.explanation;
        }
      } catch (error) {
        console.error(
          `AI job matching failed for ${job.title}:`,
          error.message
        );

        // Keep deterministic score
        // instead of returning 0.
        matchPercentage =
          fallback.percentage;

        matchedSkills =
          fallback.matchedSkills;

        missingSkills =
          fallback.missingSkills;

        explanation =
          `Skill-based matching found ${fallback.percentage}% compatibility with this job.`;
      }

      // ------------------------------------------------
      // Job object
      // ------------------------------------------------

      const jobData = {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        description:
          job.description,
        salary: job.salary,
        jobType:
          job.jobType,
        experience:
          job.experience,

        // Return parsed skills
        // so frontend gets clean skills
        skills:
          jobSkills,

        createdBy:
          job.createdBy,

        createdAt:
          job.createdAt,
      };

      matches.push({
        job: jobData,

        matchPercentage,

        matchedSkills:
          cleanSkills(
            matchedSkills
          ),

        missingSkills:
          cleanSkills(
            missingSkills
          ),

        explanation,
      });
    }

    // --------------------------------------------------
    // SORT
    // --------------------------------------------------

    matches.sort(
      (a, b) =>
        b.matchPercentage -
        a.matchPercentage
    );

    // --------------------------------------------------
    // FLATTEN FOR FRONTEND
    // --------------------------------------------------

    const flattenedJobs =
      matches.map(
        (match) => ({
          ...match.job,

          matchPercentage:
            match.matchPercentage,

          matchedSkills:
            match.matchedSkills,

          missingSkills:
            match.missingSkills,

          explanation:
            match.explanation,
        })
      );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.json({
      message:
        "AI resume matching completed successfully",

      resume: {
        fileName:
          path.basename(
            resumePath
          ),

        extractedCharacters:
          resumeText.length,
      },

      // IMPORTANT:
      // Resume + Profile skills
      extractedSkills:
        candidateSkills,

      matches,

      // Used by existing frontend
      jobs:
        flattenedJobs,
    });
  } catch (error) {
    console.error(
      "AI Resume Match Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to analyze resume. Please try again.",
    });
  }
};

module.exports = {
  matchResumeWithJobs,
};