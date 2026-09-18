import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/users/register", form);

      console.log(res.data);

      alert("User Registered Successfully");

      navigate("/login");
    } catch (err) {
      console.log(err.response);

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">

      {/* =====================================================
          LEFT PANEL
      ====================================================== */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden bg-[#07111f] text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,#2563eb,transparent_32%),radial-gradient(circle_at_85%_75%,#7c3aed,transparent_30%)] opacity-40" />

        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">

          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 w-fit"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-black text-lg">
                AI
              </span>
            </div>

            <div className="text-left">
              <p className="font-black text-lg tracking-tight">
                CareerAI
              </p>

              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Intelligent Hiring
              </p>
            </div>
          </button>

          {/* Main */}
          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-400/20 bg-indigo-400/10 text-indigo-300 text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              Start Your Journey
            </div>

            <h1 className="mt-7 text-5xl xl:text-6xl font-black tracking-tight leading-[1.05]">
              Build your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                career advantage.
              </span>
            </h1>

            <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-lg">
              Join an intelligent hiring ecosystem where candidates
              discover better opportunities and recruiters find
              stronger talent.
            </p>

            {/* Journey steps */}
            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm font-black">
                  01
                </div>

                <div>
                  <p className="font-bold">
                    Create your profile
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Tell us about your professional journey
                  </p>
                </div>

              </div>

              <div className="w-px h-5 bg-white/10 ml-5" />

              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm font-black">
                  02
                </div>

                <div>
                  <p className="font-bold">
                    Connect with opportunities
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Discover roles that fit your potential
                  </p>
                </div>

              </div>

              <div className="w-px h-5 bg-white/10 ml-5" />

              <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sm font-black">
                  03
                </div>

                <div>
                  <p className="font-bold">
                    Grow with AI insights
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Understand your skills and career gaps
                  </p>
                </div>

              </div>

            </div>

          </div>

          <div className="text-xs text-slate-600">
            Intelligent matching platform · CareerAI
          </div>

        </div>
      </div>

      {/* =====================================================
          RIGHT REGISTER PANEL
      ====================================================== */}
      <div className="w-full lg:w-[52%] flex items-center justify-center px-5 sm:px-8 py-10">

        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-10">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black">
              AI
            </div>

            <div>
              <p className="font-black text-lg text-slate-900">
                CareerAI
              </p>

              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Intelligent Hiring
              </p>
            </div>

          </div>

          {/* Heading */}
          <div className="mb-7">

            <p className="text-sm font-bold text-indigo-600">
              Create your account
            </p>

            <h2 className="text-4xl font-black text-slate-900 tracking-tight mt-2">
              Start building your future.
            </h2>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Choose how you want to use CareerAI and unlock
              intelligent hiring tools.
            </p>

          </div>

          {/* Register card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">

            <form onSubmit={handleRegister}>

              {/* Name */}
              <div>

                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                  required
                />

              </div>

              {/* Email */}
              <div className="mt-5">

                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                  required
                />

              </div>

              {/* Password */}
              <div className="mt-5">

                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                  required
                />

              </div>

              {/* Role */}
              <div className="mt-6">

                <label className="block text-sm font-bold text-slate-700 mb-3">
                  I am joining as
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* Job Seeker */}
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        role: "jobseeker",
                      })
                    }
                    className={`text-left p-4 rounded-2xl border-2 transition ${
                      form.role === "jobseeker"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                        C
                      </div>

                      {form.role === "jobseeker" && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}

                    </div>

                    <p className="font-bold text-slate-900 mt-3">
                      Job Seeker
                    </p>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Find jobs and improve your career.
                    </p>

                  </button>

                  {/* Recruiter */}
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        role: "recruiter",
                      })
                    }
                    className={`text-left p-4 rounded-2xl border-2 transition ${
                      form.role === "recruiter"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-black">
                        R
                      </div>

                      {form.role === "recruiter" && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          ✓
                        </span>
                      )}

                    </div>

                    <p className="font-bold text-slate-900 mt-3">
                      Recruiter
                    </p>

                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Create roles and find great talent.
                    </p>

                  </button>

                </div>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-200 transition"
              >
                {loading
                  ? "Creating your account..."
                  : "Create Account"}
              </button>

            </form>

            {/* Login */}
            <div className="flex items-center gap-4 my-7">

              <div className="h-px bg-slate-100 flex-1" />

              <span className="text-xs text-slate-400">
                Already registered?
              </span>

              <div className="h-px bg-slate-100 flex-1" />

            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition"
            >
              Sign In Instead
            </button>

          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-slate-400">
            By creating an account, you join the CareerAI
            intelligent hiring platform.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;