import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    selected: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================================================
  // FETCH DASHBOARD
  // =========================================================
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const jobsRes = await API.get("/jobs/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const myJobs = jobsRes.data || [];

      setJobs(myJobs);

      let totalApplicants = 0;
      let selected = 0;
      let rejected = 0;

      for (const job of myJobs) {
        try {
          const applicantsRes = await API.get(
            `/applications/job/${job._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const applications =
            applicantsRes.data.applications || [];

          totalApplicants += applications.length;

          selected += applications.filter(
            (application) =>
              application.status === "Selected"
          ).length;

          rejected += applications.filter(
            (application) =>
              application.status === "Rejected"
          ).length;
        } catch (err) {
          console.log(
            "Failed to load applicants:",
            err
          );
        }
      }

      setStats({
        totalJobs: myJobs.length,
        totalApplicants,
        selected,
        rejected,
      });
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // REFRESH
  // =========================================================
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
  };

  // =========================================================
  // DELETE JOB
  // =========================================================
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await API.delete(`/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.message);

      setJobs((prevJobs) =>
        prevJobs.filter(
          (job) => job._id !== jobId
        )
      );

      fetchDashboard();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete job"
      );
    }
  };

  // =========================================================
  // CALCULATED METRICS
  // =========================================================
  const selectionRate = useMemo(() => {
    if (!stats.totalApplicants) return 0;

    return Math.round(
      (stats.selected / stats.totalApplicants) * 100
    );
  }, [stats]);

  const rejectionRate = useMemo(() => {
    if (!stats.totalApplicants) return 0;

    return Math.round(
      (stats.rejected / stats.totalApplicants) * 100
    );
  }, [stats]);

  const activeCandidates = Math.max(
    0,
    stats.totalApplicants -
      stats.selected -
      stats.rejected
  );

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-6">
        <div className="text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-900/40">
            <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-blue-300 font-semibold">
            Recruiter Intelligence
          </p>

          <h1 className="mt-3 text-2xl font-black">
            Preparing your hiring workspace
          </h1>

          <p className="text-slate-400 mt-2">
            Loading jobs and candidate activity...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">

      {/* =====================================================
          DARK HERO / COMMAND HEADER
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#07111f] text-white">

        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_20%,#2563eb,transparent_30%),radial-gradient(circle_at_85%_10%,#7c3aed,transparent_28%)]" />

        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-14">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black shadow-lg shadow-blue-900/30">
                RC
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-300 font-semibold">
                  Recruiter Workspace
                </p>

                <h1 className="text-2xl sm:text-3xl font-black mt-1">
                  Hiring Command Center
                </h1>
              </div>

            </div>

            <div className="flex gap-3">

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition disabled:opacity-50"
              >
                {refreshing
                  ? "Refreshing..."
                  : "Refresh Data"}
              </button>

              <Link
                to="/add-job"
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-bold hover:bg-slate-100 transition"
              >
                Create Job
              </Link>

            </div>

          </div>

          {/* Hero content */}
          <div className="mt-12 max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Hiring system operational
            </div>

            <h2 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Build your team with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                better hiring decisions.
              </span>
            </h2>

            <p className="mt-5 text-slate-400 max-w-2xl leading-relaxed">
              Manage your open positions, monitor candidate activity,
              and move promising applicants through your hiring pipeline
              from one intelligent workspace.
            </p>

          </div>

          {/* Mini dashboard */}
          <div className="mt-10 grid sm:grid-cols-3 gap-4">

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Active Positions
              </p>

              <p className="text-3xl font-black mt-2">
                {stats.totalJobs}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Published job openings
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Candidate Pipeline
              </p>

              <p className="text-3xl font-black mt-2">
                {activeCandidates}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Candidates under review
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Hiring Success
              </p>

              <p className="text-3xl font-black mt-2">
                {selectionRate}%
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Selection rate
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

        {/* ===================================================
            KPI CARDS
        ==================================================== */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

          {/* Jobs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Job Openings
                </p>

                <p className="text-4xl font-black mt-3">
                  {stats.totalJobs}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                JOB
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-4">
              Total positions created
            </p>

          </div>

          {/* Applicants */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Applicants
                </p>

                <p className="text-4xl font-black mt-3">
                  {stats.totalApplicants}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                CV
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-4">
              Total candidate applications
            </p>

          </div>

          {/* Selected */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Selected
                </p>

                <p className="text-4xl font-black text-emerald-600 mt-3">
                  {stats.selected}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                OK
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-4">
              Candidates selected
            </p>

          </div>

          {/* Rejected */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Rejected
                </p>

                <p className="text-4xl font-black text-red-500 mt-3">
                  {stats.rejected}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center font-black">
                NO
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-4">
              Candidates rejected
            </p>

          </div>

        </section>

        {/* ===================================================
            PIPELINE OVERVIEW
        ==================================================== */}
        <section className="grid lg:grid-cols-3 gap-5 mb-12">

          {/* Candidate Pipeline */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold">
                  Candidate Flow
                </p>

                <h2 className="text-2xl font-black mt-1">
                  Hiring pipeline
                </h2>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Live overview
              </span>

            </div>

            <div className="mt-8">

              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-600">
                  Application volume
                </span>

                <span className="font-bold">
                  {stats.totalApplicants} candidates
                </span>
              </div>

              <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex">

                {stats.totalApplicants > 0 && (
                  <>
                    <div
                      className="bg-indigo-500"
                      style={{
                        width: `${
                          (activeCandidates /
                            stats.totalApplicants) *
                          100
                        }%`,
                      }}
                    />

                    <div
                      className="bg-emerald-500"
                      style={{
                        width: `${
                          (stats.selected /
                            stats.totalApplicants) *
                          100
                        }%`,
                      }}
                    />

                    <div
                      className="bg-red-400"
                      style={{
                        width: `${
                          (stats.rejected /
                            stats.totalApplicants) *
                          100
                        }%`,
                      }}
                    />
                  </>
                )}

              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xs text-slate-500">
                      In Review
                    </span>
                  </div>

                  <p className="text-xl font-black mt-1">
                    {activeCandidates}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-500">
                      Selected
                    </span>
                  </div>

                  <p className="text-xl font-black mt-1">
                    {stats.selected}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="text-xs text-slate-500">
                      Rejected
                    </span>
                  </div>

                  <p className="text-xl font-black mt-1">
                    {stats.rejected}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Hiring Health */}
          <div className="bg-[#0b1728] text-white rounded-3xl p-6 sm:p-7 shadow-xl">

            <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-bold">
              Hiring Health
            </p>

            <h2 className="text-2xl font-black mt-1">
              Recruitment snapshot
            </h2>

            <div className="mt-8 space-y-6">

              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    Selection rate
                  </span>

                  <span className="font-bold">
                    {selectionRate}%
                  </span>
                </div>

                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{
                      width: `${selectionRate}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    Rejection rate
                  </span>

                  <span className="font-bold">
                    {rejectionRate}%
                  </span>
                </div>

                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full"
                    style={{
                      width: `${rejectionRate}%`,
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">

                <p className="text-xs text-slate-500">
                  Active candidate pool
                </p>

                <p className="text-3xl font-black mt-1">
                  {activeCandidates}
                </p>

              </div>

            </div>
          </div>

        </section>

        {/* ===================================================
            JOB MANAGEMENT HEADER
        ==================================================== */}
        <section className="mb-6">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-bold">
                Position Management
              </p>

              <h2 className="text-3xl font-black mt-1">
                Your job openings
              </h2>

              <p className="text-slate-500 mt-2">
                Manage positions and review candidate pipelines.
              </p>
            </div>

            <Link
              to="/add-job"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition"
            >
              + Create New Position
            </Link>

          </div>

        </section>

        {/* ===================================================
            JOBS
        ==================================================== */}
        {jobs.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              JOB
            </div>

            <h2 className="text-2xl font-black mt-5">
              No positions yet
            </h2>

            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Create your first job opening and start building
              your candidate pipeline.
            </p>

            <Link
              to="/add-job"
              className="inline-block mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition"
            >
              Create First Job
            </Link>

          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-5">

            {jobs.map((job, index) => (
              <article
                key={job._id}
                className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
              >

                {/* Job top */}
                <div className="p-6">

                  <div className="flex justify-between items-start gap-5">

                    <div className="flex gap-4 min-w-0">

                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                        {job.company
                          ?.charAt(0)
                          ?.toUpperCase() || "J"}
                      </div>

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Position {index + 1}
                          </span>

                          <span className="w-1 h-1 rounded-full bg-slate-300" />

                          <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">
                            Active
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black mt-1 truncate">
                          {job.title}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {job.company}
                        </p>

                      </div>

                    </div>

                    <div className="hidden sm:block px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-xs font-bold">
                      {job.jobType || "Full Time"}
                    </div>

                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 mt-6">

                    <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">
                      {job.location}
                    </span>

                    {job.experience && (
                      <span className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">
                        {job.experience}
                      </span>
                    )}

                    {job.salary && (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
                        {job.salary}
                      </span>
                    )}

                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">

                      {job.skills
                        .slice(0, 5)
                        .map((skill, skillIndex) => (
                          <span
                            key={`${skill}-${skillIndex}`}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}

                      {job.skills.length > 5 && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold">
                          +{job.skills.length - 5} more
                        </span>
                      )}

                    </div>
                  )}

                </div>

                {/* Job action bar */}
                <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/70">

                  <div className="flex flex-wrap gap-2">

                    <Link
                      to={`/applicants/${job._id}`}
                      className="flex-1 min-w-[130px] text-center px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition"
                    >
                      View Applicants
                    </Link>

                    <Link
                      to={`/edit-job/${job._id}`}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(job._id)
                      }
                      className="px-4 py-2.5 rounded-xl bg-white border border-red-100 text-red-500 text-sm font-bold hover:bg-red-50 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

        {/* ===================================================
            FINAL CTA
        ==================================================== */}
        <section className="mt-12 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 text-white relative">

          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100 font-bold">
                Hiring Studio
              </p>

              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Ready to find your next great hire?
              </h2>

              <p className="text-blue-100/80 mt-2 max-w-xl">
                Publish another position and keep your recruitment
                pipeline moving.
              </p>
            </div>

            <Link
              to="/add-job"
              className="shrink-0 px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-slate-100 transition"
            >
              Create Job Opening
            </Link>

          </div>

        </section>

      </main>
    </div>
  );
}

export default RecruiterDashboard;