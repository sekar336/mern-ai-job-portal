import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/protectedroute";

import Home from "./pages/Home";
import Jobs from "./pages/jobs";
import JobDetails from "./pages/jobdetails";
import Login from "./pages/login";
import Register from "./pages/register";

import RecruiterDashboard from "./pages/recruiterdashboard";
import AddJob from "./pages/addjob";
import EditJob from "./pages/editjob";
import Applicants from "./pages/applicants";

import MyApplications from "./pages/myapplications";
import Profile from "./pages/profile";
import RecommendedJobs from "./pages/recommendedjobs";

import SkillGap from "./pages/skillgap";
import Notifications from "./pages/notifications";

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