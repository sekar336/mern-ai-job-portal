# AI Job Portal

An AI-powered full-stack job portal built using the MERN stack and OpenAI. The platform connects jobseekers and recruiters through role-based authentication, job management, application tracking, notifications, resume analysis, and AI-powered job matching.

## Overview

The AI Job Portal is designed to simplify the recruitment process for both jobseekers and recruiters.

Jobseekers can create profiles, upload resumes, search for jobs, apply for jobs, track applications, and receive AI-powered job recommendations.

Recruiters can create and manage job postings, view applicants, update application statuses, and receive notifications when candidates apply.

The platform also uses AI to analyze resumes against available jobs and identify matching skills, missing skills, and overall job compatibility.

## Features

### Jobseeker

- User registration and login
- JWT-based authentication
- Profile management
- Skills management
- Resume upload
- Job search
- Job filtering
- Job details
- Job application
- Application tracking
- Application status notifications
- AI-powered resume analysis
- AI-based job matching
- Matched skills identification
- Missing skills identification
- Recommended jobs
- Skill gap analysis
- Notification management

### Recruiter

- Recruiter registration and login
- Recruiter dashboard
- Create job postings
- Edit job postings
- Delete job postings
- View recruiter jobs
- View job applicants
- Update application status
- Applicant notifications
- Role-based protected access

### AI Features

- Resume text extraction from PDF and DOCX
- AI resume-to-job matching
- Match percentage calculation
- Matched skills detection
- Missing skills detection
- AI-generated match explanation
- AI-powered recommended jobs
- Skill gap analysis

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

## Project Structure

```text
MERN-AI-JOB-PORTAL/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── aicontroller.js
│   ├── applicationcontroller.js
│   ├── jobcontroller.js
│   ├── notificationcontroller.js
│   └── usercontroller.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── uploadmiddleware.js
│
├── models/
│   ├── application.js
│   ├── job.js
│   ├── notification.js
│   └── user.js
│
├── routes/
│   ├── airoutes.js
│   ├── applicationroutes.js
│   ├── jobRoutes.js
│   ├── notificationroutes.js
│   └── userroutes.js
│
├── uploads/
├── index.js
├── package.json
└── .gitignore