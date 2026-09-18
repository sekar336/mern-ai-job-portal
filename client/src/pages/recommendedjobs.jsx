import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  const fetchAIRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to use AI recommendations.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/ai/resume-match",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(response.data.jobs || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate AI recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  const getMatchLevel = (percentage) => {
    if (percentage >= 80) {
      return {
        label: "Excellent Match",
        text: "text-emerald-400",
        bg: "bg-emerald-500",
        soft: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      };
    }

    if (percentage >= 50) {
      return {
        label: "Good Match",
        text: "text-amber-400",
        bg: "bg-amber-500",
        soft: "bg-amber-500/10",
        border: "border-amber-500/20",
      };
    }

    return {
      label: "Low Match",
      text: "text-red-400",
      bg: "bg-red-500",
      soft: "bg-red-500/10",
      border: "border-red-500/20",
    };
  };

  const averageMatch =
    jobs.length > 0
      ? Math.round(
          jobs.reduce(
            (sum, job) =>
              sum + (job.matchPercentage || 0),
            0
          ) / jobs.length
        )
      : 0;

  const strongMatches = jobs.filter(
    (job) => (job.matchPercentage || 0) >= 80
  ).length;

  const totalMatchedSkills = [
    ...new Set(
      jobs.flatMap((job) => job.matchedSkills || [])
    ),
  ].length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">

        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full" />

        <div className="relative text-center px-6">

          <div className="relative w-28 h-28 mx-auto mb-8">

            <div className="absolute inset-0 rounded-full border border-blue-500/20" />

            <div className="absolute inset-3 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />

            <div className="absolute inset-7 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-400 font-bold">
                AI
              </span>
            </div>

          </div>

          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.25em]">
            Resume Intelligence
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold mt-3">
            Finding your best matches
          </h1>

          <p className="text-slate-500 max-w-md mx-auto mt-3">
            Our AI is comparing your resume, skills and
            experience against available opportunities.
          </p>

          <div className="mt-7 flex justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-blue-500/60 animate-pulse delay-150" />
            <span className="w-2 h-2 rounded-full bg-blue-500/30 animate-pulse delay-300" />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">

        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-3xl rounded-full" />

        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/10 blur-3xl rounded-full" />

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
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-5">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              AI Match Center
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Jobs that fit
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">
                your potential.
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg mt-5 max-w-2xl leading-relaxed">
              Our AI analyzes your resume against job requirements
              to identify opportunities where your experience and
              skills are most relevant.
            </p>

          </div>

          <div className="flex gap-3">

            <Link
              to="/profile"
              className="px-5 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] font-semibold transition"
            >
              Update Profile
            </Link>

            <button
              onClick={fetchAIRecommendations}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition"
            >
              Re-analyze
            </button>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 border border-red-500/20 bg-red-500/[0.06] rounded-2xl p-5">

            <div className="flex gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 font-bold">
                !
              </div>

              <div>
                <p className="font-bold text-red-400">
                  AI analysis unavailable
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  {error}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Analytics */}
        {!error && jobs.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Jobs Analyzed
              </p>

              <p className="text-3xl font-bold mt-2">
                {jobs.length}
              </p>

              <p className="text-xs text-slate-600 mt-1">
                AI evaluated opportunities
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Average Match
              </p>

              <p className="text-3xl font-bold text-blue-400 mt-2">
                {averageMatch}%
              </p>

              <p className="text-xs text-slate-600 mt-1">
                Across all opportunities
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Strong Matches
              </p>

              <p className="text-3xl font-bold text-emerald-400 mt-2">
                {strongMatches}
              </p>

              <p className="text-xs text-slate-600 mt-1">
                80%+ compatibility
              </p>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Matched Skills
              </p>

              <p className="text-3xl font-bold text-indigo-400 mt-2">
                {totalMatchedSkills}
              </p>

              <p className="text-xs text-slate-600 mt-1">
                Skills recognized by AI
              </p>
            </div>

          </div>
        )}

        {/* Empty */}
        {!error && jobs.length === 0 && (
          <div className="border border-white/10 bg-white/[0.04] rounded-3xl p-12 sm:p-16 text-center">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-blue-400">
                AI
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold">
              No opportunities found
            </h2>

            <p className="text-slate-500 max-w-md mx-auto mt-3">
              There are currently no jobs available for AI
              matching. Try again later.
            </p>

            <Link
              to="/jobs"
              className="inline-block mt-7 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition"
            >
              Browse All Jobs
            </Link>

          </div>
        )}

        {/* Results */}
        {!error && jobs.length > 0 && (
          <>

            <div className="flex items-end justify-between mb-5">

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  Ranked Opportunities
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  Best matches for you
                </h2>
              </div>

              <p className="text-sm text-slate-600 hidden sm:block">
                Highest compatibility first
              </p>

            </div>

            <div className="grid lg:grid-cols-2 gap-6">

              {jobs.map((job, index) => {

                const percentage =
                  job.matchPercentage || 0;

                const level =
                  getMatchLevel(percentage);

                return (
                  <div
                    key={job._id}
                    className="group relative bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/30 rounded-3xl overflow-hidden transition-all duration-300"
                  >

                    {/* Match accent */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${level.bg}`}
                    />

                    {/* Rank */}
                    <div className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500">
                      #{index + 1}
                    </div>

                    <div className="p-6 sm:p-7">

                      {/* Job Identity */}
                      <div className="flex items-start gap-4 pr-12">

                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-900/20">
                          {job.company
                            ?.charAt(0)
                            ?.toUpperCase() || "J"}
                        </div>

                        <div className="min-w-0">

                          <h3 className="text-xl sm:text-2xl font-bold truncate group-hover:text-blue-400 transition">
                            {job.title}
                          </h3>

                          <p className="text-slate-400 mt-1">
                            {job.company}
                          </p>

                        </div>

                      </div>

                      {/* Match Score */}
                      <div className="mt-7 p-5 rounded-2xl bg-slate-900/60 border border-white/5">

                        <div className="flex items-center justify-between gap-5">

                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                              AI Compatibility
                            </p>

                            <div className="flex items-end gap-2 mt-1">
                              <span
                                className={`text-4xl font-bold ${level.text}`}
                              >
                                {percentage}%
                              </span>

                              <span
                                className={`text-xs font-bold mb-1.5 ${level.text}`}
                              >
                                {level.label}
                              </span>
                            </div>
                          </div>

                          {/* Circular Score */}
                          <div
                            className="relative w-16 h-16 shrink-0 rounded-full flex items-center justify-center"
                            style={{
                              background: `conic-gradient(currentColor ${percentage}%, rgba(255,255,255,0.05) 0)`,
                              color:
                                percentage >= 80
                                  ? "#34d399"
                                  : percentage >= 50
                                  ? "#fbbf24"
                                  : "#f87171",
                            }}
                          >
                            <div className="absolute inset-1 rounded-full bg-slate-900 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                AI
                              </span>
                            </div>
                          </div>

                        </div>

                        <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">

                          <div
                            className={`h-full ${level.bg} rounded-full transition-all duration-1000`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* Job Meta */}
                      <div className="flex flex-wrap gap-2 mt-5">

                        <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-xs text-slate-400">
                          {job.location}
                        </span>

                        <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-xs text-slate-400">
                          {job.jobType}
                        </span>

                        {job.experience && (
                          <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-xs text-slate-400">
                            {job.experience}
                          </span>
                        )}

                      </div>

                      {/* Skills */}
                      <div className="mt-6">

                        <div className="flex items-center justify-between mb-3">

                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Skill Analysis
                          </h4>

                          <span className="text-xs text-slate-600">
                            AI detected
                          </span>

                        </div>

                        {job.matchedSkills?.length > 0 && (
                          <div>

                            <p className="text-xs text-emerald-400 font-semibold mb-2">
                              Matching strengths
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {job.matchedSkills.map(
                                (skill, skillIndex) => (
                                  <span
                                    key={`${skill}-${skillIndex}`}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-300 text-xs font-medium"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}

                            </div>

                          </div>
                        )}

                        {job.missingSkills?.length > 0 && (
                          <div className="mt-4">

                            <p className="text-xs text-amber-400 font-semibold mb-2">
                              Growth opportunities
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {job.missingSkills
                                .slice(0, 6)
                                .map(
                                  (
                                    skill,
                                    skillIndex
                                  ) => (
                                    <span
                                      key={`${skill}-${skillIndex}`}
                                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15 text-amber-300 text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}

                              {job.missingSkills.length >
                                6 && (
                                <span className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-slate-500 text-xs">
                                  +
                                  {job.missingSkills
                                    .length - 6}{" "}
                                  more
                                </span>
                              )}

                            </div>

                          </div>
                        )}

                      </div>

                      {/* AI Explanation */}
                      {job.explanation && (
                        <div className="mt-6 p-4 rounded-2xl bg-blue-500/[0.05] border border-blue-500/10">

                          <div className="flex items-center gap-2 mb-2">

                            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-blue-400">
                                AI
                              </span>
                            </div>

                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                              Why this matches
                            </p>

                          </div>

                          <p className="text-sm text-slate-400 leading-relaxed">
                            {job.explanation}
                          </p>

                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-4">

                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                            Recommended action
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {percentage >= 80
                              ? "Strong opportunity — consider applying."
                              : percentage >= 50
                              ? "Worth exploring based on your profile."
                              : "Review skill requirements first."}
                          </p>
                        </div>

                        <Link
                          to={`/job/${job._id}`}
                          className="shrink-0 px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-blue-50 font-bold text-sm transition"
                        >
                          View Job →
                        </Link>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* Skill Gap CTA */}
            <div className="mt-10 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-blue-600/[0.08] via-indigo-600/[0.08] to-transparent p-7 sm:p-9">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>

                  <p className="text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                    Career Intelligence
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Want to know what you're missing?
                  </h2>

                  <p className="text-slate-500 mt-2 max-w-xl">
                    Analyze the skills required by your target jobs
                    and identify the areas that can improve your
                    career opportunities.
                  </p>

                </div>

                <Link
                  to="/skill-gap"
                  className="shrink-0 bg-indigo-600 hover:bg-indigo-500 px-7 py-3.5 rounded-xl font-bold transition text-center"
                >
                  Analyze Skill Gap →
                </Link>

              </div>

            </div>

          </>
        )}

      </main>
    </div>
  );
}

export default RecommendedJobs;;