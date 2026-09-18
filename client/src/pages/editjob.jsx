import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);

      const job = res.data;

      setTitle(job.title || "");
      setCompany(job.company || "");
      setLocation(job.location || "");
      setDescription(job.description || "");
      setSalary(job.salary || "");
      setJobType(job.jobType || "Full Time");
      setExperience(job.experience || "");

      setSkills(
        Array.isArray(job.skills)
          ? job.skills.join(", ")
          : ""
      );
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to load job details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setUpdating(true);

      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const res = await API.put(
        `/jobs/${id}`,
        {
          title,
          company,
          location,
          description,
          salary,
          jobType,
          experience,
          skills: skillsArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        res.data.message || "Job Updated Successfully"
      );

      navigate("/recruiter-dashboard");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to update job"
      );
    } finally {
      setUpdating(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400";

  const labelClass =
    "block text-sm font-bold text-slate-700 mb-2";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] flex items-center justify-center px-5">
        <div className="text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl border border-indigo-400/20 bg-indigo-500/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          </div>

          <h2 className="text-xl font-bold text-white mt-5">
            Loading position
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Preparing your editing workspace...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#07111f] text-white">

        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_25%,#2563eb,transparent_30%),radial-gradient(circle_at_85%_20%,#7c3aed,transparent_28%)]" />

        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:42px_42px]" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-12 lg:py-16">

          <button
            type="button"
            onClick={() =>
              navigate("/recruiter-dashboard")
            }
            className="text-sm text-slate-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            <div className="max-w-3xl">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 text-xs font-semibold uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Position Optimization
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight">
                Refine your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                  hiring opportunity.
                </span>
              </h1>

              <p className="mt-5 text-slate-400 max-w-2xl leading-relaxed">
                Update your position details, improve the candidate
                requirements, and keep your job listing aligned with
                AI-powered candidate matching.
              </p>

            </div>

            {/* Current position indicator */}
            <div className="w-full lg:w-72 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-white text-slate-900 flex items-center justify-center font-black">
                  {company
                    ? company.charAt(0).toUpperCase()
                    : "J"}
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">
                    Editing
                  </p>

                  <p className="font-bold truncate mt-1">
                    {title || "Job Position"}
                  </p>
                </div>

              </div>

              <div className="mt-5 h-px bg-white/10" />

              <div className="flex justify-between mt-4">
                <span className="text-xs text-slate-500">
                  Status
                </span>

                <span className="text-xs font-bold text-emerald-400">
                  Active Position
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">

        <form onSubmit={handleSubmit}>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* =================================================
                FORM
            ================================================== */}
            <div className="lg:col-span-2 space-y-6">

              {/* Position Details */}
              <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

                <div className="px-6 sm:px-8 py-6 border-b border-slate-100">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                      01
                    </div>

                    <div>
                      <h2 className="text-xl font-black">
                        Position details
                      </h2>

                      <p className="text-sm text-slate-500 mt-0.5">
                        Update the core information of this opening.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-6 sm:p-8 space-y-6">

                  <div>
                    <label className={labelClass}>
                      Job Title
                    </label>

                    <input
                      type="text"
                      value={title}
                      onChange={(e) =>
                        setTitle(e.target.value)
                      }
                      placeholder="e.g. Senior React Developer"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">

                    <div>
                      <label className={labelClass}>
                        Company
                      </label>

                      <input
                        type="text"
                        value={company}
                        onChange={(e) =>
                          setCompany(e.target.value)
                        }
                        placeholder="Company name"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Location
                      </label>

                      <input
                        type="text"
                        value={location}
                        onChange={(e) =>
                          setLocation(e.target.value)
                        }
                        placeholder="e.g. Chennai"
                        className={inputClass}
                        required
                      />
                    </div>

                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">

                      <label className={labelClass + " mb-0"}>
                        Job Description
                      </label>

                      <span className="text-xs text-slate-400">
                        Candidate-facing content
                      </span>

                    </div>

                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      placeholder="Describe responsibilities, expectations, team environment and role objectives..."
                      className={`${inputClass} min-h-[200px] resize-y`}
                    />

                  </div>

                </div>
              </section>

              {/* Requirements */}
              <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

                <div className="px-6 sm:px-8 py-6 border-b border-slate-100">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                      02
                    </div>

                    <div>
                      <h2 className="text-xl font-black">
                        Candidate requirements
                      </h2>

                      <p className="text-sm text-slate-500 mt-0.5">
                        Fine-tune who you're looking for.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-6 sm:p-8 space-y-6">

                  <div className="grid sm:grid-cols-2 gap-5">

                    <div>
                      <label className={labelClass}>
                        Job Type
                      </label>

                      <select
                        value={jobType}
                        onChange={(e) =>
                          setJobType(e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="Full Time">
                          Full Time
                        </option>

                        <option value="Part Time">
                          Part Time
                        </option>

                        <option value="Internship">
                          Internship
                        </option>

                        <option value="Remote">
                          Remote
                        </option>

                        <option value="Contract">
                          Contract
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Required Experience
                      </label>

                      <input
                        type="text"
                        value={experience}
                        onChange={(e) =>
                          setExperience(e.target.value)
                        }
                        placeholder="e.g. 2 Years"
                        className={inputClass}
                      />
                    </div>

                  </div>

                  <div>
                    <label className={labelClass}>
                      Salary / Compensation
                    </label>

                    <input
                      type="text"
                      value={salary}
                      onChange={(e) =>
                        setSalary(e.target.value)
                      }
                      placeholder="e.g. ₹5 - ₹8 LPA"
                      className={inputClass}
                    />
                  </div>

                  <div>

                    <div className="flex justify-between items-center mb-2">

                      <label className={labelClass + " mb-0"}>
                        Required Skills
                      </label>

                      <span className="text-xs font-semibold text-indigo-500">
                        AI matching input
                      </span>

                    </div>

                    <textarea
                      value={skills}
                      onChange={(e) =>
                        setSkills(e.target.value)
                      }
                      placeholder="React, JavaScript, Node.js, MongoDB, REST API"
                      className={`${inputClass} min-h-[140px] resize-y`}
                    />

                    <p className="text-xs text-slate-400 mt-2">
                      Separate skills using commas.
                    </p>

                  </div>

                </div>
              </section>

            </div>

            {/* =================================================
                SIDEBAR
            ================================================== */}
            <aside className="space-y-5">

              {/* Live Preview */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

                <div className="flex justify-between items-center">

                  <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold">
                    Live Preview
                  </p>

                  <span className="text-[10px] px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 font-bold">
                    UPDATED
                  </span>

                </div>

                <div className="mt-5">

                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                    {company
                      ? company.charAt(0).toUpperCase()
                      : "J"}
                  </div>

                  <h3 className="text-xl font-black mt-4 break-words">
                    {title || "Your job title"}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {company || "Company name"}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">
                      {location || "Location"}
                    </span>

                    <span className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold">
                      {jobType}
                    </span>

                  </div>

                  {experience && (
                    <p className="text-xs text-slate-500 mt-4">
                      Experience:{" "}
                      <span className="font-semibold text-slate-700">
                        {experience}
                      </span>
                    </p>
                  )}

                  {salary && (
                    <p className="text-xs text-emerald-600 mt-2 font-bold">
                      {salary}
                    </p>
                  )}

                  {description && (
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed line-clamp-4">
                      {description}
                    </p>
                  )}

                </div>
              </div>

              {/* AI Optimization */}
              <div className="rounded-3xl bg-[#0b1728] text-white p-6 shadow-xl">

                <div className="flex items-center justify-between">

                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center font-black">
                    AI
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                    Connected
                  </span>

                </div>

                <h3 className="text-xl font-black mt-5">
                  Optimize for better matches
                </h3>

                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Your job description and skill requirements are
                  used by the AI matching engine when evaluating
                  candidate resumes.
                </p>

                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3">

                    <span className="w-2 h-2 rounded-full bg-emerald-400" />

                    <span className="text-xs text-slate-300">
                      Semantic skill comparison
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="w-2 h-2 rounded-full bg-blue-400" />

                    <span className="text-xs text-slate-300">
                      Resume compatibility
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="w-2 h-2 rounded-full bg-violet-400" />

                    <span className="text-xs text-slate-300">
                      Skill-gap analysis
                    </span>

                  </div>

                </div>

              </div>

              {/* Actions */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-200 transition"
                >
                  {updating
                    ? "Saving Changes..."
                    : "Save Position Changes"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/recruiter-dashboard")
                  }
                  className="w-full mt-2 py-3 rounded-xl text-slate-500 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

              </div>

            </aside>

          </div>

        </form>

      </main>
    </div>
  );
}

export default EditJob;