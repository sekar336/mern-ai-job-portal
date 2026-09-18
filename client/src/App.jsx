import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";

import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import RecommendedJobs from "./pages/RecommendedJobs";

import SkillGap from "./pages/SkillGap";

import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/job/:id"
          element={<JobDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute allowedRole="jobseeker">
          <SkillGap />
        </ProtectedRoute>
           }
        />

        {/* Jobseeker Protected Routes */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommended-jobs"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <RecommendedJobs />
            </ProtectedRoute>
          }
        />


        {/* Recruiter Protected Routes */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-job"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <AddJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applicants/:jobId"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <Applicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
        <ProtectedRoute>
        <Notifications />
        </ProtectedRoute>
  }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;