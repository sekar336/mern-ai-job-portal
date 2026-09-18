import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative min-h-[680px] flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl"></div>

          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300 text-sm font-medium mb-7">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                AI-Powered Career Platform
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Find the job
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  that fits you.
                </span>
              </h1>

              <p className="text-lg text-slate-400 max-w-xl mt-7 leading-relaxed">
                Discover opportunities matched to your skills, experience
                and career goals with intelligent AI-powered job matching.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-9">
                <Link
                  to="/jobs"
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-center transition shadow-lg shadow-blue-600/20"
                >
                  Explore Jobs
                </Link>

                <Link
                  to="/register"
                  className="px-7 py-3.5 border border-slate-700 hover:border-slate-500 hover:bg-white/5 rounded-xl font-semibold text-center transition"
                >
                  Create Your Profile
                </Link>
              </div>

              {/* TRUST LINE */}
              <div className="flex flex-wrap gap-6 mt-10 text-sm text-slate-500">
                <span>Smart Matching</span>
                <span>•</span>
                <span>Skill Analysis</span>
                <span>•</span>
                <span>Career Insights</span>
              </div>
            </div>

            {/* RIGHT AI CARD */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-5 bg-blue-500/10 blur-3xl rounded-full"></div>

              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-7 shadow-2xl">

                <div className="flex items-center justify-between mb-7">
                  <div>
                    <p className="text-sm text-slate-500">
                      AI Compatibility
                    </p>
                    <h3 className="text-xl font-semibold mt-1">
                      Your Job Match
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold">
                      AI
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="relative w-28 h-28">
                    <div className="w-full h-full rounded-full border-[10px] border-slate-800"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <p className="text-3xl font-bold text-blue-400">
                          92%
                        </p>
                        <p className="text-[10px] text-slate-500 text-center">
                          MATCH
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-300 font-medium">
                      Excellent compatibility
                    </p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Your profile strongly matches this
                      opportunity.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">
                      Technical Skills
                    </span>
                    <span className="text-green-400">
                      Strong
                    </span>
                  </div>

                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-blue-500 rounded-full"></div>
                  </div>

                  <div className="flex justify-between text-xs pt-3">
                    <span className="text-slate-400">
                      Experience
                    </span>
                    <span className="text-green-400">
                      Excellent
                    </span>
                  </div>

                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[84%] bg-indigo-500 rounded-full"></div>
                  </div>
                </div>

                <div className="mt-7 pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500 mb-3">
                    Recommended role
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        Full Stack Developer
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Technology Company
                      </p>
                    </div>

                    <span className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                      Top Match
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div className="text-center md:text-left">
              <p className="text-3xl font-bold">
                {jobs.length}+
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Active Jobs
              </p>
            </div>

            <div className="text-center md:text-left">
              <p className="text-3xl font-bold">
                AI
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Resume Matching
              </p>
            </div>

            <div className="text-center md:text-left">
              <p className="text-3xl font-bold">
                24/7
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Career Discovery
              </p>
            </div>

            <div className="text-center md:text-left">
              <p className="text-3xl font-bold">
                Smart
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Skill Analysis
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="bg-slate-50 text-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
            <div>
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
                Opportunities
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold mt-2">
                Latest job openings
              </h2>

              <p className="text-slate-500 mt-3">
                Explore the newest opportunities from our platform.
              </p>
            </div>

            <Link
              to="/jobs"
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              View all jobs →
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <h3 className="text-lg font-semibold">
                No jobs available
              </h3>

              <p className="text-slate-500 mt-2">
                New opportunities will appear here soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {jobs.slice(0, 6).map((job) => (
                <div
                  key={job._id}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl transition duration-300"
                >

                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                        <span className="text-blue-600 font-bold">
                          {job.company?.charAt(0)?.toUpperCase() || "J"}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold group-hover:text-blue-600 transition">
                        {job.title}
                      </h3>

                      <p className="text-slate-500 mt-1">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs">
                      {job.location}
                    </span>

                    {job.jobType && (
                      <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs">
                        {job.jobType}
                      </span>
                    )}

                    {job.experience && (
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs">
                        {job.experience}
                      </span>
                    )}
                  </div>

                  {job.description && (
                    <p className="text-sm text-slate-500 mt-5 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  )}

                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <Link
                      to={`/job/${job._id}`}
                      className="block text-center w-full py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold transition"
                    >
                      View Job
                    </Link>
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>
      </section>

      {/* AI FEATURE SECTION */}
      <section className="bg-white py-20 text-slate-900">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider">
              Built for smarter careers
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              More than just a job board
            </h2>

            <p className="text-slate-500 mt-4">
              Our platform combines job discovery with AI-powered
              insights to help candidates make better career decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">

            <div className="p-7 rounded-2xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold">
                  AI
                </span>
              </div>

              <h3 className="text-xl font-bold mt-6">
                Intelligent Matching
              </h3>

              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Compare your resume with job requirements and
                discover opportunities that align with your profile.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <span className="text-indigo-600 font-bold">
                  SG
                </span>
              </div>

              <h3 className="text-xl font-bold mt-6">
                Skill Gap Analysis
              </h3>

              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Identify missing skills and understand what you
                can improve to become more job-ready.
              </p>
            </div>

            <div className="p-7 rounded-2xl border border-slate-200 hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                <span className="text-sky-600 font-bold">
                  JD
                </span>
              </div>

              <h3 className="text-xl font-bold mt-6">
                Better Job Discovery
              </h3>

              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Search, filter and explore opportunities through
                a clean and focused job discovery experience.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-slate-950 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-950/60 to-slate-900 p-10 sm:p-14 text-center">

            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>

            <div className="relative">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider">
                Your next opportunity starts here
              </p>

              <h2 className="text-3xl sm:text-5xl font-bold mt-4">
                Ready to find your perfect job?
              </h2>

              <p className="text-slate-400 max-w-xl mx-auto mt-5">
                Build your profile, upload your resume and let AI
                help you discover better opportunities.
              </p>

              <Link
                to="/register"
                className="inline-block mt-8 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition shadow-lg shadow-blue-600/20"
              >
                Get Started
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;