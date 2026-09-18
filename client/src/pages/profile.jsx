import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState("");
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);

      if (res.data.user.skills) {
        setSkills(res.data.user.skills.join(", "));
      }
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkills = async () => {
    const token = localStorage.getItem("token");

    try {
      setUpdating(true);

      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const res = await API.put(
        "/users/skills",
        {
          skills: skillsArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);

      alert("Skills updated successfully!");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to update skills"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadResume = async () => {
    if (!resume) {
      alert("Please select a resume file");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("resume", resume);

      const res = await API.put(
        "/users/resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.user);
      setResume(null);

      alert("Resume uploaded successfully!");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to upload resume"
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>

          <p className="text-white text-lg font-semibold">
            Loading your profile...
          </p>

          <p className="text-slate-500 text-sm mt-2">
            Preparing your AI career dashboard
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            User not found
          </h2>

          <button
            onClick={() => navigate("/login")}
            className="mt-5 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const skillList = user.skills || [];

  const profileScore = Math.min(
    100,
    40 +
      (skillList.length > 0 ? 25 : 0) +
      (user.resume ? 35 : 0)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full"></div>

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main */}
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
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3">
                Candidate Profile
              </p>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Your Career
                <span className="text-blue-500">
                  {" "}Profile
                </span>
              </h1>

              <p className="text-slate-400 mt-3 max-w-xl">
                Keep your skills and resume updated to improve
                AI-powered job matching.
              </p>
            </div>

            <button
              onClick={() => navigate("/recommended-jobs")}
              className="bg-white text-slate-950 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold transition shadow-lg"
            >
              View AI Matches →
            </button>
          </div>
        </div>

        {/* Profile Hero */}
        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl mb-6">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-900/30">

              <span className="text-4xl font-bold">
                {user.name?.charAt(0)?.toUpperCase()}
              </span>

            </div>

            {/* Identity */}
            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-bold">
                  {user.name}
                </h2>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 capitalize">
                  {user.role}
                </span>
              </div>

              <p className="text-slate-400 mt-2">
                {user.email}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">

                <div className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10">
                  <span className="text-slate-500 text-xs">
                    Skills
                  </span>

                  <p className="font-bold text-white">
                    {skillList.length}
                  </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10">
                  <span className="text-slate-500 text-xs">
                    Resume
                  </span>

                  <p className="font-bold text-white">
                    {user.resume ? "Uploaded" : "Missing"}
                  </p>
                </div>

              </div>
            </div>

            {/* Profile Score */}
            <div className="md:w-56">

              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">
                  Profile strength
                </span>

                <span className="text-sm font-bold text-blue-400">
                  {profileScore}%
                </span>
              </div>

              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                  style={{
                    width: `${profileScore}%`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                {profileScore === 100
                  ? "Your profile is ready for AI matching."
                  : "Complete your profile for better matching."}
              </p>

            </div>

          </div>
        </section>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Skills */}
            <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                    Candidate Intelligence
                  </p>

                  <h2 className="text-2xl font-bold">
                    Skills & Expertise
                  </h2>
                </div>

                <span className="text-xs text-slate-500">
                  Separate skills using commas
                </span>

              </div>

              {/* Current Skills */}
              {skillList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">

                  {skillList.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}

                </div>
              )}

              <textarea
                value={skills}
                onChange={(e) =>
                  setSkills(e.target.value)
                }
                placeholder="React, Node.js, MongoDB, JavaScript, Python..."
                className="w-full min-h-32 bg-slate-900/70 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition resize-none"
              />

              <button
                onClick={handleUpdateSkills}
                disabled={updating}
                className="mt-4 w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold transition"
              >
                {updating
                  ? "Updating..."
                  : "Save Skills"}
              </button>

            </section>

            {/* Resume */}
            <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">

              <div className="mb-6">
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
                  AI Matching Engine
                </p>

                <h2 className="text-2xl font-bold">
                  Resume Intelligence
                </h2>

                <p className="text-slate-400 text-sm mt-2">
                  Upload your latest resume so the AI engine
                  can compare your profile with available jobs.
                </p>
              </div>

              {/* Existing Resume */}
              {user.resume ? (
                <div className="border border-emerald-500/20 bg-emerald-500/[0.06] rounded-2xl p-5 mb-5">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>
                      <p className="text-emerald-400 font-semibold">
                        Resume available
                      </p>

                      <p className="text-slate-500 text-sm mt-1">
                        Your resume is ready for AI analysis.
                      </p>
                    </div>

                    <a
                      href={`http://localhost:5000${user.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-center px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm transition"
                    >
                      View Resume
                    </a>

                  </div>

                </div>
              ) : (
                <div className="border border-amber-500/20 bg-amber-500/[0.05] rounded-2xl p-5 mb-5">

                  <p className="text-amber-400 font-semibold">
                    Resume not uploaded
                  </p>

                  <p className="text-slate-500 text-sm mt-1">
                    Upload one to unlock AI resume matching.
                  </p>

                </div>
              )}

              {/* Upload Box */}
              <label className="block cursor-pointer">

                <div className="border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-2xl p-8 text-center bg-slate-900/30 transition">

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <span className="text-blue-400 text-2xl font-bold">
                      ↑
                    </span>
                  </div>

                  <p className="font-semibold">
                    {resume
                      ? resume.name
                      : "Choose your resume"}
                  </p>

                  <p className="text-slate-500 text-sm mt-2">
                    PDF, DOC or DOCX • Maximum 5MB
                  </p>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setResume(e.target.files[0])
                    }
                    className="hidden"
                  />

                </div>

              </label>

              <button
                onClick={handleUploadResume}
                disabled={uploading || !resume}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white py-3 rounded-xl font-bold transition"
              >
                {uploading
                  ? "Uploading Resume..."
                  : "Upload Resume"}
              </button>

            </section>

          </div>

          {/* RIGHT */}
          <aside className="space-y-6">

            {/* AI Readiness */}
            <section className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-3xl p-6">

              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                AI Readiness
              </p>

              <h3 className="text-xl font-bold mt-2">
                Your profile is
                <br />
                {profileScore >= 80
                  ? "ready to compete."
                  : "almost ready."}
              </h3>

              <div className="mt-6">

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">
                    Completion
                  </span>

                  <span className="font-bold">
                    {profileScore}%
                  </span>
                </div>

                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${profileScore}%`,
                    }}
                  />
                </div>

              </div>

              <button
                onClick={() =>
                  navigate("/skill-gap")
                }
                className="mt-6 w-full bg-white text-slate-950 hover:bg-blue-50 py-3 rounded-xl font-bold transition"
              >
                Analyze Skill Gap
              </button>

            </section>

            {/* Account */}
            <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">

              <h3 className="text-lg font-bold mb-5">
                Account Information
              </h3>

              <div className="space-y-4">

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Full Name
                  </p>

                  <p className="text-sm font-semibold mt-1">
                    {user.name}
                  </p>
                </div>

                <div className="h-px bg-white/10"></div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Email
                  </p>

                  <p className="text-sm font-semibold mt-1 break-all">
                    {user.email}
                  </p>
                </div>

                <div className="h-px bg-white/10"></div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Account Type
                  </p>

                  <p className="text-sm font-semibold capitalize mt-1">
                    {user.role}
                  </p>
                </div>

              </div>

            </section>

            {/* Quick Actions */}
            <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-6">

              <h3 className="text-lg font-bold mb-4">
                Quick Actions
              </h3>

              <div className="space-y-2">

                <button
                  onClick={() =>
                    navigate("/recommended-jobs")
                  }
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 transition"
                >
                  <span className="font-semibold text-sm">
                    AI Recommended Jobs
                  </span>

                  <span className="block text-xs text-slate-500 mt-1">
                    Find jobs matching your profile
                  </span>
                </button>

                <button
                  onClick={() =>
                    navigate("/my-applications")
                  }
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 transition"
                >
                  <span className="font-semibold text-sm">
                    My Applications
                  </span>

                  <span className="block text-xs text-slate-500 mt-1">
                    Track your job applications
                  </span>
                </button>

                <button
                  onClick={() => navigate("/jobs")}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 transition"
                >
                  <span className="font-semibold text-sm">
                    Browse Jobs
                  </span>

                  <span className="block text-xs text-slate-500 mt-1">
                    Explore latest opportunities
                  </span>
                </button>

              </div>

            </section>

          </aside>

        </div>

        {/* Bottom CTA */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent p-7 sm:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
                Next Step
              </p>

              <h2 className="text-2xl font-bold">
                Discover your best-fit opportunities.
              </h2>

              <p className="text-slate-500 text-sm mt-2">
                Let the AI matching engine analyze your resume
                against available jobs.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/recommended-jobs")
              }
              className="shrink-0 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition"
            >
              Explore AI Matches
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Profile;