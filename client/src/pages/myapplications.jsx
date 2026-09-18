import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/applications/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.applications || []);
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return {
          badge:
            "bg-amber-500/10 text-amber-400 border-amber-500/20",
          dot: "bg-amber-400",
        };

      case "Shortlisted":
        return {
          badge:
            "bg-blue-500/10 text-blue-400 border-blue-500/20",
          dot: "bg-blue-400",
        };

      case "Selected":
        return {
          badge:
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-400",
        };

      case "Rejected":
        return {
          badge:
            "bg-red-500/10 text-red-400 border-red-500/20",
          dot: "bg-red-400",
        };

      default:
        return {
          badge:
            "bg-slate-500/10 text-slate-400 border-slate-500/20",
          dot: "bg-slate-400",
        };
    }
  };

  const selectedCount = applications.filter(
    (app) => app.status === "Selected"
  ).length;

  const shortlistedCount = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const pendingCount = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>

          <p className="text-white font-semibold text-lg">
            Loading applications...
          </p>

          <p className="text-slate-500 text-sm mt-2">
            Preparing your application tracker
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <main className="relative max-w-7xl mx-auto px-5 sm:px-8 py-10">

        {/* Header */}
        <div className="mb-8">

          <button
            onClick={() => navigate("/jobs")}
            className="text-sm text-slate-400 hover:text-white transition mb-6"
          >
            ← Back to Jobs
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
                Candidate Dashboard
              </p>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                My
                <span className="text-blue-500">
                  {" "}Applications
                </span>
              </h1>

              <p className="text-slate-400 mt-3 max-w-xl">
                Track every opportunity, monitor application
                progress, and stay updated on your career journey.
              </p>
            </div>

            <button
              onClick={() => navigate("/jobs")}
              className="bg-white text-slate-950 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold transition"
            >
              Find More Jobs →
            </button>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-wider">
              Total Applications
            </p>

            <p className="text-3xl font-bold mt-2">
              {applications.length}
            </p>

            <p className="text-slate-600 text-xs mt-1">
              Opportunities pursued
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-wider">
              In Review
            </p>

            <p className="text-3xl font-bold mt-2 text-amber-400">
              {pendingCount}
            </p>

            <p className="text-slate-600 text-xs mt-1">
              Awaiting decision
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-wider">
              Shortlisted
            </p>

            <p className="text-3xl font-bold mt-2 text-blue-400">
              {shortlistedCount}
            </p>

            <p className="text-slate-600 text-xs mt-1">
              Moving forward
            </p>
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <p className="text-slate-500 text-xs uppercase tracking-wider">
              Selected
            </p>

            <p className="text-3xl font-bold mt-2 text-emerald-400">
              {selectedCount}
            </p>

            <p className="text-slate-600 text-xs mt-1">
              Successful outcomes
            </p>
          </div>

        </div>

        {/* Application Success Banner */}
        {selectedCount > 0 && (
          <div className="mb-8 border border-emerald-500/20 bg-emerald-500/[0.06] rounded-2xl p-5">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
                ✓
              </div>

              <div>
                <p className="font-bold text-emerald-400">
                  Congratulations!
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  You have been selected for{" "}
                  {selectedCount}{" "}
                  {selectedCount === 1
                    ? "opportunity"
                    : "opportunities"}.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.04] rounded-3xl p-10 sm:p-16 text-center">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <span className="text-3xl font-bold text-blue-400">
                +
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Your application journey starts here
            </h2>

            <p className="text-slate-500 max-w-md mx-auto mt-3">
              You haven't applied for any jobs yet.
              Explore available opportunities and find your
              next career move.
            </p>

            <button
              onClick={() => navigate("/jobs")}
              className="mt-7 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-xl font-bold transition"
            >
              Explore Jobs
            </button>

          </div>
        ) : (
          <>
            {/* Section Heading */}
            <div className="flex items-center justify-between mb-5">

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  Application History
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Your Applications
                </h2>
              </div>

              <span className="hidden sm:block text-sm text-slate-500">
                {applications.length}{" "}
                {applications.length === 1
                  ? "application"
                  : "applications"}
              </span>

            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-5">

              {applications.map((application) => {
                const job = application.job;
                const status = getStatusStyle(
                  application.status
                );

                return (
                  <div
                    key={application._id}
                    className="group bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/20 rounded-3xl p-6 transition duration-300"
                  >

                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg">
                          {job?.company
                            ?.charAt(0)
                            ?.toUpperCase() || "J"}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold group-hover:text-blue-400 transition">
                            {job?.title ||
                              "Job not available"}
                          </h3>

                          <p className="text-slate-400 text-sm mt-1">
                            {job?.company ||
                              "Company unavailable"}
                          </p>
                        </div>

                      </div>

                      {/* Status */}
                      <span
                        className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${status.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                        />

                        {application.status}
                      </span>

                    </div>

                    {/* Details */}
                    <div className="mt-6 grid grid-cols-2 gap-3">

                      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3">

                        <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                          Location
                        </p>

                        <p className="text-sm text-slate-300 mt-1 truncate">
                          {job?.location ||
                            "Not specified"}
                        </p>

                      </div>

                      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3">

                        <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                          Applied On
                        </p>

                        <p className="text-sm text-slate-300 mt-1">
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Unknown"}
                        </p>

                      </div>

                    </div>

                    {/* Timeline */}
                    <div className="mt-6">

                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                        Application Progress
                      </p>

                      <div className="flex items-center">

                        {[
                          "Applied",
                          "Shortlisted",
                          "Selected",
                        ].map((step, index) => {

                          const statusOrder = {
                            Applied: 1,
                            Shortlisted: 2,
                            Selected: 3,
                            Rejected: 0,
                          };

                          const current =
                            statusOrder[
                              application.status
                            ] || 1;

                          const stepNumber = index + 1;

                          const completed =
                            current >= stepNumber;

                          return (
                            <div
                              key={step}
                              className="flex items-center flex-1"
                            >

                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                                  completed
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : "bg-slate-900 border-white/10 text-slate-600"
                                }`}
                              >
                                {completed
                                  ? "✓"
                                  : stepNumber}
                              </div>

                              {index < 2 && (
                                <div
                                  className={`h-px flex-1 mx-2 ${
                                    current >
                                    stepNumber
                                      ? "bg-blue-500"
                                      : "bg-white/10"
                                  }`}
                                />
                              )}

                            </div>
                          );
                        })}

                      </div>

                      <div className="flex justify-between mt-2 text-[10px] text-slate-600">
                        <span>Applied</span>
                        <span>Shortlisted</span>
                        <span>Selected</span>
                      </div>

                    </div>

                    {/* Rejected State */}
                    {application.status ===
                      "Rejected" && (
                      <div className="mt-5 p-3 rounded-xl bg-red-500/[0.05] border border-red-500/10">
                        <p className="text-xs text-red-400">
                          This application was not selected
                          for the next stage.
                        </p>
                      </div>
                    )}

                    {/* Bottom */}
                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">

                      <p className="text-xs text-slate-600">
                        Application ID:{" "}
                        {application._id
                          ?.slice(-8)
                          ?.toUpperCase()}
                      </p>

                      {job?._id ? (
                        <button
                          onClick={() =>
                            navigate(
                              `/job/${job._id}`
                            )
                          }
                          className="text-sm font-bold text-blue-400 hover:text-blue-300 transition"
                        >
                          View Job →
                        </button>
                      ) : (
                        <span className="text-xs text-slate-600">
                          Job unavailable
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

            {/* Bottom CTA */}
            <div className="mt-8 border border-white/10 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent rounded-3xl p-7">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
                    Keep Exploring
                  </p>

                  <h3 className="text-xl font-bold">
                    One application can change your career.
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Discover more opportunities that match
                    your skills.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/jobs")}
                  className="shrink-0 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition"
                >
                  Browse Jobs
                </button>

              </div>

            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default MyApplications;