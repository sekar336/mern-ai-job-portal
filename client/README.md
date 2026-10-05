# AI Job Portal

A full-stack MERN-based AI Job Portal designed to connect jobseekers and recruiters through a secure and intelligent job application platform.

The platform allows jobseekers to search and apply for jobs, manage their profiles and resumes, track applications, receive notifications, and use AI-powered resume analysis to discover suitable job opportunities.

Recruiters can create and manage job postings, view applicants, update application statuses, and notify candidates.

## Overview

The platform uses AI to analyze uploaded resumes against available job postings and identify:

- Overall job compatibility
- Matching skills
- Missing skills
- Skill gaps
- Recommended job opportunities
- AI-generated match explanations

The project also includes JWT authentication, role-based authorization, recruiter ownership protection, application management, notifications, and secure API access.

---

## Features

### Jobseeker

- User registration and login
- JWT-based authentication
- Protected routes
- Profile management
- Skills management
- Resume upload
- PDF and DOCX resume support
- Job search
- Job filtering
- Job details
- Job application
- Duplicate application prevention
- Application tracking
- Application status notifications
- Notification management
- AI-powered resume analysis
- AI-based job matching
- Matched skills identification
- Missing skills identification
- AI-generated match explanation
- Recommended jobs
- Skill gap analysis

### Recruiter

- Recruiter registration and login
- JWT-based authentication
- Role-based protected access
- Recruiter dashboard
- Create job postings
- Edit job postings
- Delete job postings
- View recruiter-owned jobs
- View job applicants
- Update application status
- Applicant notifications
- Recruiter job ownership protection

### AI Features

- Resume text extraction from PDF
- Resume text extraction from DOCX
- Resume skill extraction
- AI resume-to-job matching
- Match percentage calculation
- Matched skills detection
- Missing skills detection
- AI-generated match explanation
- AI-powered recommended jobs
- Skill gap analysis
- Deterministic skill matching fallback

### Security

- JWT authentication
- Role-based authorization
- Protected API routes
- Recruiter ownership validation
- Jobseeker application protection
- Recruiter applicant privacy
- Duplicate application prevention
- ObjectId validation
- Environment variable protection
- Uploaded resume protection
- Secure notification ownership checks

---

## Tech Stack

### Frontend

- React.js
- Vite
- Axios
- React Router
- CSS

### Backend

- Node.js
- Express.js
- JWT Authentication
- Multer
- PDF Parse
- Mammoth

### Database

- MongoDB
- Mongoose

### AI

- OpenAI API

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## User Roles

The application supports two main roles.

### Jobseeker

Jobseekers can:

1. Create an account
2. Build their profile
3. Add skills
4. Upload a resume
5. Search for jobs
6. Apply for jobs
7. Track applications
8. Receive application notifications
9. Analyze their resume using AI
10. Find recommended jobs
11. Identify missing skills

### Recruiter

Recruiters can:

1. Create an account
2. Create job postings
3. Manage their own jobs
4. View applicants
5. Update application status
6. Notify applicants about application progress

---

## AI Job Matching Flow

```text
Jobseeker
   |
   v
Upload Resume
   |
   v
Resume Text Extraction
   |
   v
Skill Detection
   |
   v
AI Resume Analysis
   |
   v
Compare Resume with Jobs
   |
   +----------------------+
   |                      |
   v                      v
Matched Skills       Missing Skills
   |                      |
   +----------+-----------+
              |
              v
       Match Percentage
              |
              v
       Job Recommendations
              |
              v
         Skill Gap