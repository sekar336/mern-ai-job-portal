import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddJob() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const res = await API.post(
        "/jobs",
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
        res.data.message || "Job Created Successfully"
      );

      navigate("/recruiter-dashboard");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400";

  const labelClass =
    "block text-sm font-bold text-slate-700 mb-2";

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#07111f] text-white">

        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_15%_30%,#2563eb,transparent_30%),radial-gradient(circle_at_85%_20%,#7c3aed,transparent_28%)]" />

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
                Hiring Studio
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-black tracking-tight">
                Create a role
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                  great candidates will notice.
                </span>
              </h1>

              <p className="mt-5 text-slate-400 max-w-2xl leading-relaxed">
                Define the opportunity clearly. Your job description
                and required skills will also help the AI matching
                engine evaluate candidate compatibility.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="w-full lg:w-64 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">

              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  Job Setup
                </span>

                <span className="text-xs font-bold text-blue-300">
                  01 / 01
                </span>
              </div>

              <div className="h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              </div>

              <p className="text-xs text-slate-500 mt-3">
                Complete the details below to publish your position.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FORM AREA
      ====================================================== */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">

        <form onSubmit={handleSubmit}>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* =================================================
                MAIN FORM
            ================================================== */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basic Information */}
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
                        Tell candidates what this opportunity is about.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-6 sm:p-8 space-y-6">

                  {/* Job title */}
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

                  {/* Company + Location */}
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
                        placeholder="e.g. Infosys"
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

                  {/* Description */}
                  <div>
                    <div className="flex justify-between items-center mb-2">

                      <label className={labelClass + " mb-0"}>
                        Job Description
                      </label>

                      <span className="text-xs text-slate-400">
                        Responsibilities & expectations
                      </span>

                    </div>

                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      placeholder="Describe the role, responsibilities, team environment, expectations, and what success looks like..."
                      className={`${inputClass} min-h-[190px] resize-y`}
                    />
                  </div>

                </div>
              </section>

              {/* Role Requirements */}
              <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

                <div className="px-6 sm:px-8 py-6 border-b border-slate-100">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                      02
                    </div>

                    <div>
                      <h2 className="text-xl font-black">
                        Role requirements
                      </h2>

                      <p className="text-sm text-slate-500 mt-0.5">
                        Define the profile you're looking for.
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-6 sm:p-8 space-y-6">

                  {/* Job Type + Experience */}
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

                  {/* Salary */}
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

                  {/* Skills */}
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
                      className={`${inputClass} min-h-[130px] resize-y`}
                    />

                    <p className="text-xs text-slate-400 mt-2">
                      Separate each skill using commas.
                    </p>
                  </div>

                </div>
              </section>

            </div>

            {/* =================================================
                SIDEBAR
            ================================================== */}
            <aside className="space-y-5">

              {/* Preview */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

                <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold">
                  Live Preview
                </p>

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
                    <p className="text-xs text-emerald-600 mt-2 font-semibold">
                      {salary}
                    </p>
                  )}

                </div>
              </div>

              {/* AI info */}
              <div className="rounded-3xl bg-[#0b1728] text-white p-6 shadow-xl">

                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center font-black">
                  AI
                </div>

                <h3 className="text-xl font-black mt-5">
                  Built for AI matching
                </h3>

                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Clear descriptions and accurate required skills
                  help the portal's AI engine compare candidate
                  resumes against your position.
                </p>

                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-300">
                      Semantic skill matching
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs text-slate-300">
                      Resume compatibility analysis
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    <span className="text-xs text-slate-300">
                      Candidate skill-gap insights
                    </span>
                  </div>

                </div>

              </div>

              {/* Submit */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-200 transition"
                >
                  {loading
                    ? "Publishing Position..."
                    : "Publish Job Position"}
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

export default AddJob;