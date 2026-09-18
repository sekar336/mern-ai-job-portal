import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SkillGap() {
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSkillGap();
  }, []);

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/ai/resume-match",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jobData = response.data.jobs || [];

      // Backend may provide extractedSkills.
      // Fallback: collect skills already matched across analyzed jobs.
      const extractedSkills = response.data.extractedSkills || [];

      const fallbackSkills = [
        ...new Set(
          jobData.flatMap((job) => job.matchedSkills || [])
        ),
      ];

      setSkills(
        extractedSkills.length > 0
          ? extractedSkills
          : fallbackSkills
      );

      setJobs(jobData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to analyze skill gap"
      );
    } finally {
      setLoading(false);
    }
  };

  const uniqueMissingSkills = useMemo(() => {
    const skillMap = new Map();

    jobs.forEach((job) => {
      (job.missingSkills || []).forEach((skill) => {
        const key = skill.trim().toLowerCase();

        if (key && !skillMap.has(key)) {
          skillMap.set(key, skill.trim());
        }
      });
    });

    return [...skillMap.values()];
  }, [jobs]);

  const averageMatch = useMemo(() => {
    if (!jobs.length) return 0;

    const total = jobs.reduce(
      (sum, job) => sum + (job.matchPercentage || 0),
      0
    );

    return Math.round(total / jobs.length);
  }, [jobs]);

  const strongMatches = useMemo(() => {
    return jobs.filter(
      (job) => (job.matchPercentage || 0) >= 80
    ).length;
  }, [jobs]);

  const topJob = jobs.length > 0 ? jobs[0] : null;

  const getMatchTheme = (percentage) => {
    if (percentage >= 80) {
      return {
        label: "Excellent Match",
        text: "text-emerald-600",
        bg: "bg-emerald-500",
        soft: "bg-emerald-50",
        border: "border-emerald-100",
      };
    }

    if (percentage >= 50) {
      return {
        label: "Good Match",
        text: "text-amber-600",
        bg: "bg-amber-500",
        soft: "bg-amber-50",
        border: "border-amber-100",
      };
    }

    return {
      label: "Needs Improvement",
      text: "text-red-600",
      bg: "bg-red-500",
      soft: "bg-red-50",
      border: "border-red-100",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_30%,#2563eb,transparent_35%)]" />

        <div className="relative text-center max-w-md">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-900/40">
            <div className="w-9 h-9 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>

          <p className="mt-7 text-xs uppercase tracking-[0.3em] text-blue-300 font-semibold">
            AI Career Intelligence
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Building your skill map
          </h1>

          <p className="mt-3 text-slate-400 leading-relaxed">
            AI is comparing your resume against current job
            requirements and identifying your strongest opportunities.
          </p>

          <div className="mt-7 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_10%_20%,#2563eb,transparent_28%),radial-gradient(circle_at_90%_10%,#7c3aed,transparent_25%)]" />

        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:42px_42px]" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                AI Career Intelligence
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                Know what you're good at.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                  Know what comes next.
                </span>
              </h1>

              <p className="mt-6 text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
                Your resume has been analyzed against available
                opportunities. Discover your strengths, identify skill
                gaps, and understand exactly where you can improve.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={fetchSkillGap}
                  className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition shadow-lg"
                >
                  Re-analyze Resume
                </button>

                <Link
                  to="/recommended-jobs"
                  className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 text-white font-semibold hover:bg-white/10 transition"
                >
                  View AI Matches
                </Link>
              </div>
            </div>

            {/* Hero score */}
            <div className="w-full lg:w-[310px] rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 shadow-2xl">

              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Career Readiness
              </p>

              <div className="flex items-center gap-5 mt-5">
                <div
                  className="w-28 h-28 rounded-full p-2 shrink-0"
                  style={{
                    background: `conic-gradient(#6366f1 ${averageMatch}%, rgba(255,255,255,0.08) 0)`,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#0b1728] flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">
                      {averageMatch}%
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">
                      average
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-white font-bold">
                    {averageMatch >= 80
                      ? "Strong Profile"
                      : averageMatch >= 50
                      ? "Growing Profile"
                      : "Needs Development"}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Based on AI job compatibility
                  </p>
                </div>
              </div>

              <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                  style={{ width: `${averageMatch}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-bold text-red-700">
              AI analysis unavailable
            </p>

            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>
          </div>
        )}

        {/* =====================================================
            METRICS
        ====================================================== */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Resume Skills
            </p>

            <div className="flex items-end justify-between mt-3">
              <p className="text-3xl font-black">
                {skills.length}
              </p>

              <span className="text-xs font-bold text-emerald-600">
                DETECTED
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Skill Gaps
            </p>

            <div className="flex items-end justify-between mt-3">
              <p className="text-3xl font-black">
                {uniqueMissingSkills.length}
              </p>

              <span className="text-xs font-bold text-red-500">
                TO IMPROVE
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Jobs Analyzed
            </p>

            <div className="flex items-end justify-between mt-3">
              <p className="text-3xl font-black">
                {jobs.length}
              </p>

              <span className="text-xs font-bold text-blue-600">
                AI SCANNED
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Strong Matches
            </p>

            <div className="flex items-end justify-between mt-3">
              <p className="text-3xl font-black">
                {strongMatches}
              </p>

              <span className="text-xs font-bold text-indigo-600">
                80%+
              </span>
            </div>
          </div>

        </section>

        {/* =====================================================
            TOP OPPORTUNITY
        ====================================================== */}
        {topJob && (
          <section className="mb-10">

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold">
                  AI Recommendation
                </p>

                <h2 className="text-2xl font-black mt-1">
                  Your strongest opportunity
                </h2>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 text-white p-7 sm:p-9 shadow-xl shadow-indigo-200">

              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/10 flex items-center justify-center text-xl font-black">
                    {topJob.company?.charAt(0)?.toUpperCase() || "J"}
                  </div>

                  <div>
                    <p className="text-blue-100 text-sm">
                      Best current match
                    </p>

                    <h3 className="text-2xl sm:text-3xl font-black mt-1">
                      {topJob.title}
                    </h3>

                    <p className="text-blue-100 mt-1">
                      {topJob.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-blue-100">
                      Match score
                    </p>

                    <p className="text-5xl font-black mt-1">
                      {topJob.matchPercentage || 0}%
                    </p>
                  </div>

                  <Link
                    to={`/job/${topJob._id}`}
                    className="px-5 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-slate-100 transition"
                  >
                    Explore Role
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            SKILL MAP
        ====================================================== */}
        <section className="grid lg:grid-cols-2 gap-6 mb-12">

          {/* Strengths */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-bold">
                  Strength Map
                </p>

                <h2 className="text-2xl font-black mt-1">
                  Your current skills
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Skills detected or matched from your resume.
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black">
                {skills.length}
              </div>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-7">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
                <p className="text-sm text-slate-500">
                  No resume skills were detected yet.
                </p>

                <Link
                  to="/profile"
                  className="inline-block mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Update your profile
                </Link>
              </div>
            )}
          </div>

          {/* Gaps */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-red-500 font-bold">
                  Growth Map
                </p>

                <h2 className="text-2xl font-black mt-1">
                  Skills to develop
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Skills frequently missing from your strongest opportunities.
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-black">
                {uniqueMissingSkills.length}
              </div>
            </div>

            {uniqueMissingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-7">
                {uniqueMissingSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                <p className="font-bold text-emerald-700">
                  Your skill profile is looking strong.
                </p>

                <p className="text-sm text-emerald-600 mt-1">
                  No major skill gaps were identified across the analyzed jobs.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            ROADMAP
        ====================================================== */}
        <section className="mb-12">

          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold">
              Career Roadmap
            </p>

            <h2 className="text-3xl font-black mt-1">
              Turn gaps into opportunities
            </h2>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Focus on the skills that repeatedly appear as missing
              across the roles you are targeting.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {uniqueMissingSkills.slice(0, 6).map((skill, index) => (
              <div
                key={`${skill}-roadmap`}
                className="group bg-white border border-slate-200 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300"
              >
                <div className="flex items-center justify-between">

                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Growth Area
                  </span>
                </div>

                <h3 className="font-bold text-lg mt-5">
                  {skill}
                </h3>

                <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Recommended for your target roles
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* =====================================================
            JOB ANALYSIS
        ====================================================== */}
        <section>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-bold">
                Opportunity Intelligence
              </p>

              <h2 className="text-3xl font-black mt-1">
                Job-wise skill analysis
              </h2>

              <p className="text-slate-500 mt-2">
                Understand exactly why each opportunity matches your profile.
              </p>
            </div>

            <span className="text-sm font-semibold text-slate-500">
              {jobs.length} opportunities analyzed
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
              <h3 className="text-xl font-bold">
                No jobs available for analysis
              </h3>

              <p className="text-slate-500 mt-2">
                Once jobs are available, AI will compare them with your resume.
              </p>

              <Link
                to="/jobs"
                className="inline-block mt-5 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">

              {jobs.map((job, index) => {
                const percentage = job.matchPercentage || 0;
                const theme = getMatchTheme(percentage);

                return (
                  <article
                    key={job._id}
                    className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/70 transition-all duration-300"
                  >

                    {/* Card top */}
                    <div className="p-6">

                      <div className="flex justify-between items-start gap-4">

                        <div className="flex gap-3 min-w-0">

                          <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
                            {job.company?.charAt(0)?.toUpperCase() || "J"}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">
                              #{String(index + 1).padStart(2, "0")}
                            </p>

                            <h3 className="font-black text-xl truncate mt-0.5">
                              {job.title}
                            </h3>

                            <p className="text-sm text-slate-500 truncate mt-0.5">
                              {job.company}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className={`text-3xl font-black ${theme.text}`}>
                            {percentage}%
                          </p>

                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            compatibility
                          </p>
                        </div>

                      </div>

                      {/* Score */}
                      <div className="mt-6">

                        <div className="flex justify-between text-xs mb-2">
                          <span className={`font-bold ${theme.text}`}>
                            {theme.label}
                          </span>

                          <span className="text-slate-400">
                            AI score
                          </span>
                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${theme.bg} rounded-full transition-all duration-700`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="border-t border-slate-100 px-6 py-5">

                      <div className="grid sm:grid-cols-2 gap-5">

                        <div>
                          <p className="text-xs uppercase tracking-wider font-bold text-emerald-600 mb-3">
                            Your strengths
                          </p>

                          {job.matchedSkills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {job.matchedSkills.map(
                                (skill, skillIndex) => (
                                  <span
                                    key={`${skill}-${skillIndex}`}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400">
                              No strong matches detected
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wider font-bold text-red-500 mb-3">
                            Growth areas
                          </p>

                          {job.missingSkills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {job.missingSkills
                                .slice(0, 5)
                                .map((skill, skillIndex) => (
                                  <span
                                    key={`${skill}-${skillIndex}`}
                                    className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold"
                                  >
                                    + {skill}
                                  </span>
                                ))}
                            </div>
                          ) : (
                            <p className="text-xs text-emerald-600 font-medium">
                              No major gaps
                            </p>
                          )}
                        </div>

                      </div>

                      {/* AI Explanation */}
                      {job.explanation && (
                        <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 p-4">

                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />

                            <p className="text-xs uppercase tracking-wider font-bold text-indigo-600">
                              AI Insight
                            </p>
                          </div>

                          <p className="text-sm text-slate-600 leading-relaxed mt-2">
                            {job.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6">

                      <Link
                        to={`/job/${job._id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition"
                      >
                        View Job Intelligence
                        <span className="group-hover:translate-x-1 transition">
                          →
                        </span>
                      </Link>

                    </div>
                  </article>
                );
              })}

            </div>
          )}
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="mt-14 rounded-3xl overflow-hidden bg-[#07111f] text-white relative">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,#4f46e5,transparent_35%)] opacity-30" />

          <div className="relative p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-7">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-300 font-bold">
                Next Step
              </p>

              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                Ready to close your skill gaps?
              </h2>

              <p className="text-slate-400 mt-2 max-w-xl">
                Explore AI-matched opportunities and use your skill
                roadmap to prepare for the roles you want.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/recommended-jobs"
                className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition"
              >
                AI Recommended Jobs
              </Link>

              <Link
                to="/profile"
                className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 font-semibold hover:bg-white/10 transition"
              >
                Update Profile
              </Link>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default SkillGap;