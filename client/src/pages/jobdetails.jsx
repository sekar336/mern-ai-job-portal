import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [role, setRole] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const fetchJob = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.log("Job Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to load job details"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkAlreadyApplied = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      if (decoded.role !== "jobseeker") return;

      const res = await API.get("/applications/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const applications = res.data.applications || [];

      const applied = applications.some(
        (application) =>
          application.job?._id === id
      );

      setAlreadyApplied(applied);
    } catch (err) {
      console.log(
        "Application Check Error:",
        err
      );
    }
  };

  const handleApply = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to apply for this job");
      navigate("/login");
      return;
    }

    try {
      setApplying(true);

      const res = await API.post(
        "/applications",
        {
          jobId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlreadyApplied(true);

      alert(
        res.data.message ||
          "Job Applied Successfully"
      );
    } catch (err) {
      console.log("Apply Error:", err);

      if (
        err.response?.data?.message ===
        "You have already applied for this job"
      ) {
        setAlreadyApplied(true);
      }

      alert(
        err.response?.data?.message ||
          "Failed to apply for this job"
      );
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role || "");
      } catch (error) {
        console.log("Token Error:", error);
        localStorage.removeItem("token");
      }
    }

    fetchJob();
    checkAlreadyApplied();
  }, [id]);

  /* =========================
      LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>

          <h2 className="text-white text-xl font-semibold mt-6">
            Loading opportunity
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Preparing job details...
          </p>
        </div>
      </div>
    );
  }

  /* =========================
      JOB NOT FOUND
  ========================= */
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full">
          <div className="w-14 h-14 mx-auto rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <span className="text-red-400 font-bold">
              404
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mt-5">
            Job Not Found
          </h2>

          <p className="text-slate-500 mt-2">
            This opportunity may have been removed or is no longer available.
          </p>

          <button
            onClick={() => navigate("/jobs")}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">

      {/* =========================
          TOP HEADER
      ========================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-3xl rounded-full"></div>

          <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:45px_45px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-14">

          <button
            onClick={() => navigate("/jobs")}
            className="text-slate-400 hover:text-white text-sm font-medium transition mb-10"
          >
            ← Back to Jobs
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            <div className="flex items-start gap-5">

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  {job.company
                    ?.charAt(0)
                    ?.toUpperCase() || "J"}
                </span>
              </div>

              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold mb-3">
                  Open Position
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  {job.title}
                </h1>

                <p className="text-lg text-slate-400 mt-2">
                  {job.company}
                </p>
              </div>

            </div>

            {role === "jobseeker" && (
              <button
                onClick={handleApply}
                disabled={
                  applying || alreadyApplied
                }
                className={`px-8 py-4 rounded-xl font-semibold transition shadow-lg ${
                  alreadyApplied
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
                }`}
              >
                {alreadyApplied
                  ? "Application Submitted"
                  : applying
                  ? "Submitting Application..."
                  : "Apply for this Job"}
              </button>
            )}

          </div>
        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="grid lg:grid-cols-3 gap-8">

            {/* =========================
                LEFT CONTENT
            ========================= */}
            <div className="lg:col-span-2 space-y-6">

              {/* JOB OVERVIEW */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

                <h2 className="text-xl font-bold text-slate-900">
                  Job Overview
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Key information about this opportunity
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-7">

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-2">
                      {job.location}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                      Employment Type
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-2">
                      {job.jobType || "Not specified"}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                      Experience
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-2">
                      {job.experience || "Not specified"}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                      Salary
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-2">
                      {job.salary || "Not specified"}
                    </p>
                  </div>

                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

                <h2 className="text-xl font-bold text-slate-900">
                  About the Role
                </h2>

                <p className="text-slate-600 mt-5 leading-8 whitespace-pre-line">
                  {job.description ||
                    "No description has been provided for this position."}
                </p>

              </div>

              {/* SKILLS */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

                <h2 className="text-xl font-bold text-slate-900">
                  Required Skills
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Skills expected for this role
                </p>

                {job.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mt-6">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mt-5">
                    No specific skills listed.
                  </p>
                )}

              </div>

            </div>

            {/* =========================
                RIGHT SIDEBAR
            ========================= */}
            <div className="space-y-6">

              {/* APPLY CARD */}
              {role === "jobseeker" && (
                <div className="bg-slate-950 rounded-2xl p-6 text-white shadow-xl">

                  <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    Take the next step
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    Interested in this role?
                  </h3>

                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    Submit your application and let the recruiter
                    know you're interested in this opportunity.
                  </p>

                  <button
                    onClick={handleApply}
                    disabled={
                      applying || alreadyApplied
                    }
                    className={`w-full mt-6 py-3.5 rounded-xl font-semibold transition ${
                      alreadyApplied
                        ? "bg-slate-700 text-slate-400"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    {alreadyApplied
                      ? "Application Submitted"
                      : applying
                      ? "Submitting..."
                      : "Apply Now"}
                  </button>

                </div>
              )}

              {/* COMPANY CARD */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                  Hiring Company
                </p>

                <div className="flex items-center gap-4 mt-5">

                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {job.company
                        ?.charAt(0)
                        ?.toUpperCase() || "C"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {job.company}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Employer
                    </p>
                  </div>

                </div>

              </div>

              {/* QUICK DETAILS */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

                <h3 className="font-bold text-slate-900">
                  Quick Details
                </h3>

                <div className="space-y-4 mt-5">

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Location
                    </span>

                    <span className="text-sm font-semibold text-slate-800 text-right">
                      {job.location}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Job Type
                    </span>

                    <span className="text-sm font-semibold text-slate-800 text-right">
                      {job.jobType || "Not specified"}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Experience
                    </span>

                    <span className="text-sm font-semibold text-slate-800 text-right">
                      {job.experience || "Not specified"}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Salary
                    </span>

                    <span className="text-sm font-semibold text-slate-800 text-right">
                      {job.salary || "Not specified"}
                    </span>
                  </div>

                </div>

              </div>

              {/* BACK */}
              <button
                onClick={() => navigate("/jobs")}
                className="w-full py-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:text-blue-600 text-slate-700 font-semibold transition"
              >
                ← Browse More Jobs
              </button>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default JobDetails;