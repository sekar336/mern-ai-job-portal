import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/users/login", {
        email,
        password,
      });

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      window.location.href = "/";
    } catch (err) {
      console.log(err.response);

      alert(
        err.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">

      {/* =====================================================
          LEFT BRAND PANEL
      ====================================================== */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#07111f] text-white">

        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#2563eb,transparent_32%),radial-gradient(circle_at_85%_75%,#7c3aed,transparent_30%)] opacity-40" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">

          {/* Brand */}
          <div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-3"
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

          </div>

          {/* Main message */}
          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/20 bg-blue-400/10 text-blue-300 text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              AI Powered Career Platform
            </div>

            <h1 className="mt-7 text-5xl xl:text-6xl font-black tracking-tight leading-[1.05]">
              Your next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                opportunity starts here.
              </span>
            </h1>

            <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-lg">
              Discover relevant jobs, understand your skill gaps,
              and let AI connect your potential with the right
              opportunities.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4 mt-10 max-w-lg">

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">

                <p className="text-2xl font-black">
                  AI
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Resume intelligence
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">

                <p className="text-2xl font-black">
                  360°
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Career insights
                </p>

              </div>

            </div>

          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between text-xs text-slate-600">

            <span>
              Intelligent matching platform
            </span>

            <span>
              © CareerAI
            </span>

          </div>

        </div>
      </div>

      {/* =====================================================
          RIGHT LOGIN PANEL
      ====================================================== */}
      <div className="w-full lg:w-[48%] flex items-center justify-center px-5 sm:px-8 py-10">

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
          <div className="mb-8">

            <p className="text-sm font-bold text-indigo-600">
              Welcome back
            </p>

            <h2 className="text-4xl font-black text-slate-900 tracking-tight mt-2">
              Sign in to continue.
            </h2>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Access your jobs, applications, recommendations,
              and career intelligence.
            </p>

          </div>

          {/* Login Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">

            <form onSubmit={handleLogin}>

              {/* Email */}
              <div>

                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                  required
                />

              </div>

              {/* Password */}
              <div className="mt-5">

                <div className="flex justify-between items-center mb-2">

                  <label className="text-sm font-bold text-slate-700">
                    Password
                  </label>

                  <span className="text-xs text-slate-400">
                    Secure access
                  </span>

                </div>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400"
                  required
                />

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-200 transition"
              >
                {loading
                  ? "Signing you in..."
                  : "Sign In"}
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">

              <div className="h-px bg-slate-100 flex-1" />

              <span className="text-xs text-slate-400">
                New to CareerAI?
              </span>

              <div className="h-px bg-slate-100 flex-1" />

            </div>

            {/* Register */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition"
            >
              Create an Account
            </button>

          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

            Secure authentication

            <span className="text-slate-300">
              •
            </span>

            AI-powered platform

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;