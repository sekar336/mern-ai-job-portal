import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.get(
        `/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(res.data.applications || []);
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    applicationId,
    status
  ) => {
    const token = localStorage.getItem("token");

    try {
      setUpdatingId(applicationId);

      const res = await API.put(
        `/applications/${applicationId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter(
        (a) => a.status === "Applied"
      ).length,
      shortlisted: applications.filter(
        (a) => a.status === "Shortlisted"
      ).length,
      selected: applications.filter(
        (a) => a.status === "Selected"
      ).length,
      rejected: applications.filter(
        (a) => a.status === "Rejected"
      ).length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const name =
        application.user?.name?.toLowerCase() || "";

      const email =
        application.user?.email?.toLowerCase() || "";

      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const getInitial = (name) => {
    if (!name) return "C";

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Shortlisted":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

        <div className="text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-pulse">
            <span className="text-white font-black">
              AI
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mt-5">
            Loading Candidate Intelligence
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            Preparing your applicant workspace...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-slate-950">

        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-32 -right-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 left-10 w-96 h-96 bg-indigo-600 rounded-full blur-[130px]" />
        </div>

        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-12">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            <div>

              <Link
                to="/recruiter-dashboard"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition mb-7"
              >
                <span>←</span>
                Back to Hiring Workspace
              </Link>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300 text-xs font-bold uppercase tracking-wider mb-5">
                Candidate Evaluation
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Applicant
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Intelligence Hub
                </span>
              </h1>

              <p className="text-slate-400 max-w-2xl mt-4 text-base leading-7">
                Review candidates, evaluate their profiles,
                manage hiring stages, and move the strongest
                applicants forward.
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 min-w-[220px]">

              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                Candidate Pool
              </p>

              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-black text-white">
                  {stats.total}
                </span>

                <span className="text-sm text-slate-400 mb-1">
                  applicants
                </span>
              </div>

              <p className="text-xs text-emerald-400 mt-2 font-semibold">
                {stats.shortlisted} currently shortlisted
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 -mt-7 relative z-10">

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

          {[
            {
              label: "Total",
              value: stats.total,
              text: "Candidates",
            },
            {
              label: "Applied",
              value: stats.applied,
              text: "New candidates",
            },
            {
              label: "Shortlisted",
              value: stats.shortlisted,
              text: "In review",
            },
            {
              label: "Selected",
              value: stats.selected,
              text: "Hired",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              text: "Closed",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                {item.label}
              </p>

              <div className="text-3xl font-black text-slate-900 mt-2">
                {item.value}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {item.text}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* TOOLBAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-7">

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative flex-1 max-w-xl">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                Search
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search candidate name or email..."
                className="w-full pl-20 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition text-sm"
              />

            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">

              {[
                "All",
                "Applied",
                "Shortlisted",
                "Selected",
                "Rejected",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                    statusFilter === status
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {status}
                </button>
              ))}

            </div>

          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">

            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredApplications.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {applications.length}
              </span>{" "}
              candidates
            </p>

            <button
              onClick={fetchApplicants}
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              Refresh
            </button>

          </div>

        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-14 text-center shadow-sm">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <span className="text-slate-500 font-black text-lg">
                0
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mt-6">
              No Applicants Yet
            </h2>

            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Nobody has applied for this position yet.
              New candidates will appear here automatically.
            </p>

            <Link
              to="/recruiter-dashboard"
              className="inline-flex mt-6 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition"
            >
              Return to Dashboard
            </Link>

          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">

            <h2 className="text-xl font-black">
              No Matching Candidates
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your search or status filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold"
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <div className="space-y-5">

            {filteredApplications.map(
              (application, index) => {
                const resumeUrl =
                  application.user?.resume
                    ? `http://localhost:5000${application.user.resume}`
                    : "";

                const name =
                  application.user?.name ||
                  "Unknown Candidate";

                const email =
                  application.user?.email ||
                  "No email available";

                const isUpdating =
                  updatingId === application._id;

                return (
                  <div
                    key={application._id}
                    className="group bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-300 transition duration-300 overflow-hidden"
                  >

                    {/* TOP ACCENT */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                    <div className="p-6 lg:p-7">

                      {/* Candidate Header */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                        <div className="flex gap-4">

                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-lg">
                            {getInitial(name)}
                          </div>

                          <div>

                            <div className="flex flex-wrap items-center gap-3">

                              <h2 className="text-xl font-black text-slate-900">
                                {name}
                              </h2>

                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-black border ${getStatusStyle(
                                  application.status
                                )}`}
                              >
                                {application.status}
                              </span>

                            </div>

                            <p className="text-sm text-slate-500 mt-1">
                              {email}
                            </p>

                            <p className="text-xs text-slate-400 mt-2">
                              Candidate #{String(
                                index + 1
                              ).padStart(2, "0")}
                            </p>

                          </div>

                        </div>

                        <div className="text-left lg:text-right">

                          <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                            Applied
                          </p>

                          <p className="text-sm font-bold text-slate-700 mt-1">
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString(
                              undefined,
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>

                        </div>

                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-100 my-6" />

                      {/* Candidate Intelligence */}
                      <div className="grid md:grid-cols-3 gap-4">

                        <div className="bg-slate-50 rounded-2xl p-4">

                          <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            Applied Position
                          </p>

                          <p className="font-bold text-slate-800 mt-2">
                            {application.job?.title ||
                              "Position"}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {application.job?.company ||
                              "Company"}
                          </p>

                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4">

                          <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            Candidate Email
                          </p>

                          <p className="font-semibold text-slate-800 mt-2 break-all">
                            {email}
                          </p>

                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4">

                          <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            Resume Status
                          </p>

                          <p
                            className={`font-bold mt-2 ${
                              application.user?.resume
                                ? "text-emerald-600"
                                : "text-slate-500"
                            }`}
                          >
                            {application.user?.resume
                              ? "Resume Available"
                              : "Not Uploaded"}
                          </p>

                        </div>

                      </div>

                      {/* Resume */}
                      <div className="mt-6">

                        <div className="flex items-center justify-between mb-3">

                          <h3 className="text-sm font-black text-slate-900">
                            Candidate Resume
                          </h3>

                          {application.user?.resume && (
                            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">
                              Document Ready
                            </span>
                          )}

                        </div>

                        {application.user?.resume ? (
                          <div className="flex flex-wrap gap-3">

                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition"
                            >
                              View Resume
                            </a>

                            <a
                              href={resumeUrl}
                              download
                              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition"
                            >
                              Download Resume
                            </a>

                          </div>
                        ) : (
                          <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500">
                            This candidate has not uploaded a
                            resume.
                          </div>
                        )}

                      </div>

                      {/* Hiring Timeline */}
                      <div className="mt-7">

                        <p className="text-sm font-black text-slate-900 mb-4">
                          Hiring Progress
                        </p>

                        <div className="flex items-center">

                          {[
                            "Applied",
                            "Shortlisted",
                            "Selected",
                          ].map((stage, stageIndex) => {

                            const currentIndex =
                              application.status ===
                              "Rejected"
                                ? -1
                                : [
                                    "Applied",
                                    "Shortlisted",
                                    "Selected",
                                  ].indexOf(
                                    application.status
                                  );

                            const completed =
                              currentIndex >=
                              stageIndex;

                            return (
                              <div
                                key={stage}
                                className="flex items-center flex-1 last:flex-none"
                              >

                                <div className="flex flex-col items-center">

                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                                      completed
                                        ? "bg-slate-900 border-slate-900 text-white"
                                        : "bg-white border-slate-200 text-slate-400"
                                    }`}
                                  >
                                    {stageIndex + 1}
                                  </div>

                                  <span
                                    className={`text-[10px] font-bold mt-2 ${
                                      completed
                                        ? "text-slate-800"
                                        : "text-slate-400"
                                    }`}
                                  >
                                    {stage}
                                  </span>

                                </div>

                                {stageIndex < 2 && (
                                  <div
                                    className={`h-0.5 flex-1 mx-2 mb-5 ${
                                      currentIndex >
                                      stageIndex
                                        ? "bg-slate-900"
                                        : "bg-slate-200"
                                    }`}
                                  />
                                )}

                              </div>
                            );
                          })}

                        </div>

                        {application.status ===
                          "Rejected" && (
                          <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-semibold">
                            Candidate application has been
                            rejected.
                          </div>
                        )}

                      </div>

                      {/* Actions */}
                      <div className="mt-7 pt-6 border-t border-slate-100">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                          <div>

                            <p className="text-xs uppercase tracking-widest text-slate-400 font-black">
                              Hiring Decision
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                              Move this candidate to the next
                              stage.
                            </p>

                          </div>

                          <div className="flex flex-wrap gap-2">

                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(
                                  application._id,
                                  "Shortlisted"
                                )
                              }
                              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              {isUpdating
                                ? "Updating..."
                                : "Shortlist"}
                            </button>

                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(
                                  application._id,
                                  "Selected"
                                )
                              }
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              Select Candidate
                            </button>

                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(
                                  application._id,
                                  "Rejected"
                                )
                              }
                              className="px-4 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-black hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                              Reject
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* =====================================================
            BOTTOM CTA
        ====================================================== */}
        <div className="mt-10 rounded-3xl bg-slate-950 p-8 lg:p-10 relative overflow-hidden">

          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/20 blur-[90px] rounded-full" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-blue-400 text-xs uppercase tracking-widest font-black">
                Hiring Command Center
              </p>

              <h2 className="text-2xl font-black text-white mt-2">
                Keep your hiring pipeline moving.
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Return to your dashboard to manage positions
                and monitor your complete hiring workflow.
              </p>

            </div>

            <Link
              to="/recruiter-dashboard"
              className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-slate-900 text-sm font-black hover:bg-slate-100 transition"
            >
              Hiring Dashboard →
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Applicants;