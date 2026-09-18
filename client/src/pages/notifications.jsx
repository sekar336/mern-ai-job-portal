import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setNotifications((current) =>
          current.map((notification) =>
            notification._id === id
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification
          )
        );
      }
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setNotifications((current) =>
          current.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      }
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    } finally {
      setActionLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setNotifications((current) =>
          current.filter(
            (notification) =>
              notification._id !== id
          )
        );
      }
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter(
          (notification) =>
            !notification.isRead
        )
      : notifications;

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const getNotificationIcon = (type) => {
    if (type === "application") {
      return (
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h4m5 4H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7l5 5v9a2 2 0 0 1-2 2Z"
            />
          </svg>
        </div>
      );
    }

    if (type === "status") {
      return (
        <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      );
    }

    if (type === "job") {
      return (
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM8 7h8"
            />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
          />
        </svg>
      </div>
    );
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor(
      (Date.now() - new Date(date).getTime()) /
        1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.20),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.18),transparent_35%)]" />

        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-14">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-blue-300 text-xs font-bold uppercase tracking-[0.16em] mb-5">
                CareerAI
                <span className="w-1 h-1 rounded-full bg-blue-400" />
                Notification Center
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                Stay ahead of
                <span className="block text-blue-400">
                  every career update.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-slate-400 text-sm sm:text-base leading-7">
                Track application updates, recruiter
                activity and important hiring events
                from one intelligent workspace.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="px-5 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 font-bold">
                  Unread
                </p>

                <p className="text-2xl font-black mt-1">
                  {unreadCount}
                </p>
              </div>

              <div className="px-5 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 font-bold">
                  Total
                </p>

                <p className="text-2xl font-black mt-1">
                  {notifications.length}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 py-8">

        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">

            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                filter === "unread"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>

          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={fetchNotifications}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition disabled:opacity-50"
              >
                {actionLoading
                  ? "Updating..."
                  : "Mark all as read"}
              </button>
            )}

          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="space-y-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse"
              />
            ))}

          </div>
        ) : filteredNotifications.length === 0 ? (

          /* EMPTY STATE */
          <div className="bg-white border border-slate-200 rounded-3xl px-6 py-20 text-center shadow-sm">

            <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">

              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.31 6.022c1.74.64 3.56 1.08 5.453 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>

            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              {filter === "unread"
                ? "You're all caught up"
                : "No notifications yet"}
            </h2>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              {filter === "unread"
                ? "There are no unread updates waiting for you."
                : "Your application and career updates will appear here."}
            </p>

            <Link
              to="/jobs"
              className="inline-flex mt-6 px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition"
            >
              Explore Jobs
            </Link>

          </div>
        ) : (

          /* NOTIFICATION LIST */
          <div className="space-y-3">

            {filteredNotifications.map(
              (notification) => (
                <div
                  key={notification._id}
                  className={`group relative bg-white border rounded-2xl p-5 transition-all ${
                    notification.isRead
                      ? "border-slate-200 hover:border-slate-300"
                      : "border-blue-200 bg-blue-50/30 shadow-sm shadow-blue-100"
                  }`}
                >

                  {/* UNREAD INDICATOR */}
                  {!notification.isRead && (
                    <span className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-blue-600" />
                  )}

                  <div className="flex gap-4">

                    {getNotificationIcon(
                      notification.type
                    )}

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                        <div>

                          <div className="flex items-center gap-2">

                            <h3 className="font-black text-slate-900">
                              {notification.title}
                            </h3>

                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-600" />
                            )}

                          </div>

                          <p className="mt-1.5 text-sm text-slate-600 leading-6">
                            {notification.message}
                          </p>

                        </div>

                        <span className="text-xs font-semibold text-slate-400 shrink-0">
                          {getTimeAgo(
                            notification.createdAt
                          )}
                        </span>

                      </div>

                      {/* RELATED JOB */}
                      {notification.relatedJob && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">

                          <span className="text-xs font-bold text-slate-500">
                            {notification.relatedJob.title}
                          </span>

                          {notification.relatedJob.company && (
                            <>
                              <span className="text-slate-300">
                                /
                              </span>

                              <span className="text-xs font-semibold text-slate-400">
                                {
                                  notification
                                    .relatedJob
                                    .company
                                }
                              </span>
                            </>
                          )}

                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="flex flex-wrap items-center gap-2 mt-4">

                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }
                            className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                          >
                            Mark as read
                          </button>
                        )}

                        {notification.relatedJob && (
                          <Link
                            to={`/jobs/${notification.relatedJob._id}`}
                            onClick={() =>
                              !notification.isRead &&
                              markAsRead(
                                notification._id
                              )
                            }
                            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                          >
                            View job
                          </Link>
                        )}

                        <button
                          onClick={() =>
                            deleteNotification(
                              notification._id
                            )
                          }
                          className="px-3 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;