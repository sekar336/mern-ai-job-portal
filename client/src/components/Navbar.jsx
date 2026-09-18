import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const readRole = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setRole(null);
      setUnreadCount(0);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role || null);
    } catch (error) {
      localStorage.removeItem("token");
      setRole(null);
      setUnreadCount(0);
    }
  };

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error(
        "Notification count error:",
        error
      );
    }
  };

  useEffect(() => {
    readRole();
  }, [location.pathname]);

  useEffect(() => {
    if (role) {
      fetchUnreadCount();
    }
  }, [role, location.pathname]);

  useEffect(() => {
    const handleStorage = () => {
      readRole();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () =>
      window.removeEventListener(
        "storage",
        handleStorage
      );
  }, []);

  // Refresh notification count every 30 seconds
  useEffect(() => {
    if (!role) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setRole(null);
    setUnreadCount(0);
    setMobileOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition ${
      isActive(path)
        ? "bg-slate-900 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8">

        {/* =====================================================
            DESKTOP / MAIN NAV
        ====================================================== */}
        <div className="h-[72px] flex items-center justify-between gap-6">

          {/* BRAND */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="font-black text-sm">
                AI
              </span>
            </div>

            <div className="hidden sm:block">
              <p className="text-[17px] font-black text-slate-900 tracking-tight leading-none">
                CareerAI
              </p>

              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-1">
                Intelligent Hiring
              </p>
            </div>
          </Link>

          {/* CENTER NAV */}
          <div className="hidden lg:flex items-center gap-1">

            <Link
              to="/"
              className={navClass("/")}
            >
              Home
            </Link>

            <Link
              to="/jobs"
              className={navClass("/jobs")}
            >
              Jobs
            </Link>

            {role === "jobseeker" && (
              <>
                <Link
                  to="/recommended-jobs"
                  className={navClass(
                    "/recommended-jobs"
                  )}
                >
                  AI Matches
                </Link>

                <Link
                  to="/skill-gap"
                  className={navClass(
                    "/skill-gap"
                  )}
                >
                  Skill Intelligence
                </Link>

                <Link
                  to="/my-applications"
                  className={navClass(
                    "/my-applications"
                  )}
                >
                  Applications
                </Link>

                <Link
                  to="/profile"
                  className={navClass("/profile")}
                >
                  Profile
                </Link>
              </>
            )}

            {role === "recruiter" && (
              <Link
                to="/recruiter-dashboard"
                className={navClass(
                  "/recruiter-dashboard"
                )}
              >
                Hiring Workspace
              </Link>
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">

            {!role ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {/* NOTIFICATION BUTTON */}
                <Link
                  to="/notifications"
                  className={`relative w-11 h-11 rounded-xl border flex items-center justify-center transition ${
                    isActive("/notifications")
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  aria-label="Notifications"
                >
                  {/* Bell */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.31 6.022c1.74.64 3.56 1.08 5.453 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                    />
                  </svg>

                  {/* Unread Badge */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </Link>

                {/* ROLE INDICATOR */}
                <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      role === "recruiter"
                        ? "bg-violet-500"
                        : "bg-blue-500"
                    }`}
                  />

                  <span className="text-xs font-bold text-slate-600">
                    {role === "recruiter"
                      ? "Recruiter"
                      : "Job Seeker"}
                  </span>
                </div>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <span className="text-xl font-light">
                ×
              </span>
            ) : (
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-slate-700" />
                <span className="block w-5 h-0.5 bg-slate-700" />
                <span className="block w-5 h-0.5 bg-slate-700" />
              </div>
            )}
          </button>
        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-5">

            <div className="space-y-1">

              <Link
                to="/"
                onClick={() =>
                  setMobileOpen(false)
                }
                className={navClass("/")}
              >
                <div className="block">
                  Home
                </div>
              </Link>

              <Link
                to="/jobs"
                onClick={() =>
                  setMobileOpen(false)
                }
                className={navClass("/jobs")}
              >
                <div className="block">
                  Jobs
                </div>
              </Link>

              {role === "jobseeker" && (
                <>
                  <Link
                    to="/recommended-jobs"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={navClass(
                      "/recommended-jobs"
                    )}
                  >
                    <div className="block">
                      AI Matches
                    </div>
                  </Link>

                  <Link
                    to="/skill-gap"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={navClass(
                      "/skill-gap"
                    )}
                  >
                    <div className="block">
                      Skill Intelligence
                    </div>
                  </Link>

                  <Link
                    to="/my-applications"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={navClass(
                      "/my-applications"
                    )}
                  >
                    <div className="block">
                      Applications
                    </div>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={navClass(
                      "/profile"
                    )}
                  >
                    <div className="block">
                      Profile
                    </div>
                  </Link>
                </>
              )}

              {role === "recruiter" && (
                <Link
                  to="/recruiter-dashboard"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={navClass(
                    "/recruiter-dashboard"
                  )}
                >
                  <div className="block">
                    Hiring Workspace
                  </div>
                </Link>
              )}

              {/* MOBILE NOTIFICATIONS */}
              {role && (
                <Link
                  to="/notifications"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className={navClass(
                    "/notifications"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      Notifications
                    </span>

                    {unreadCount > 0 && (
                      <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                        {unreadCount > 99
                          ? "99+"
                          : unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile actions */}
            <div className="border-t border-slate-100 mt-4 pt-4">

              {!role ? (
                <div className="grid grid-cols-2 gap-3">

                  <Link
                    to="/login"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="text-center py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="text-center py-3 rounded-xl bg-slate-900 text-white text-sm font-bold"
                  >
                    Get Started
                  </Link>

                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;