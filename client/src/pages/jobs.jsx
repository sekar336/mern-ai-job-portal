import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.log("Fetch Jobs Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("");
    setCompanyFilter("");
    setJobTypeFilter("");
    setExperienceFilter("");
    setCurrentPage(1);
  };

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.trim().toLowerCase();
    const locationText = locationFilter.trim().toLowerCase();
    const companyText = companyFilter.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText) ||
      job.skills?.some((skill) =>
        skill.toLowerCase().includes(searchText)
      );

    const matchesLocation =
      !locationText ||
      job.location?.toLowerCase().includes(locationText);

    const matchesCompany =
      !companyText ||
      job.company?.toLowerCase().includes(companyText);

    const matchesJobType =
      !jobTypeFilter ||
      job.jobType?.toLowerCase() ===
        jobTypeFilter.toLowerCase();

    const matchesExperience =
      !experienceFilter ||
      job.experience?.toLowerCase() ===
        experienceFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCompany &&
      matchesJobType &&
      matchesExperience
    );
  });

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = filteredJobs.slice(
    indexOfFirstJob,
    indexOfLastJob
  );

  const goToPage = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleLocationFilter = (value) => {
    setLocationFilter(value);
    setCurrentPage(1);
  };

  const handleCompanyFilter = (value) => {
    setCompanyFilter(value);
    setCurrentPage(1);
  };

  const handleJobTypeFilter = (value) => {
    setJobTypeFilter(value);
    setCurrentPage(1);
  };

  const handleExperienceFilter = (value) => {
    setExperienceFilter(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>

          <h2 className="text-white text-xl font-semibold mt-6">
            Finding opportunities
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Loading the latest jobs for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">

      {/* =========================
          HERO HEADER
      ========================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-3xl rounded-full"></div>

          <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:45px_45px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12">

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Career Opportunities
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-5 tracking-tight">
              Find work that
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                moves you forward.
              </span>
            </h1>

            <p className="text-slate-400 text-lg mt-5 max-w-2xl leading-relaxed">
              Explore relevant opportunities, discover new career paths
              and find roles that match your skills.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-10 max-w-5xl">
            <div className="bg-white rounded-2xl p-2 shadow-2xl shadow-black/20 flex flex-col md:flex-row gap-2">

              <div className="flex-1 flex items-center px-4">
                <span className="text-slate-400 text-lg mr-3">
                  Search
                </span>

                <input
                  type="text"
                  placeholder="Job title, company, location or skill"
                  value={search}
                  onChange={(e) =>
                    handleSearch(e.target.value)
                  }
                  className="w-full py-3 outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={() =>
                  document
                    .getElementById("filters")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
                className="px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold transition"
              >
                Filters
              </button>

            </div>
          </div>

          {/* QUICK STATS */}
          <div className="flex flex-wrap gap-8 mt-8 text-sm">
            <div>
              <span className="text-white font-bold">
                {jobs.length}
              </span>
              <span className="text-slate-500 ml-2">
                Total Jobs
              </span>
            </div>

            <div>
              <span className="text-white font-bold">
                {filteredJobs.length}
              </span>
              <span className="text-slate-500 ml-2">
                Matching Results
              </span>
            </div>

            <div>
              <span className="text-blue-400 font-bold">
                AI
              </span>
              <span className="text-slate-500 ml-2">
                Powered Recommendations
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <section className="bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* FILTER PANEL */}
          <div
            id="filters"
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Refine your search
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Narrow down opportunities using the filters below.
                </p>
              </div>

              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Clear all filters
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Location
                </label>

                <input
                  type="text"
                  placeholder="e.g. Chennai"
                  value={locationFilter}
                  onChange={(e) =>
                    handleLocationFilter(e.target.value)
                  }
                  className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Company
                </label>

                <input
                  type="text"
                  placeholder="Company name"
                  value={companyFilter}
                  onChange={(e) =>
                    handleCompanyFilter(e.target.value)
                  }
                  className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Job Type
                </label>

                <select
                  value={jobTypeFilter}
                  onChange={(e) =>
                    handleJobTypeFilter(e.target.value)
                  }
                  className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                >
                  <option value="">All Job Types</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Experience
                </label>

                <select
                  value={experienceFilter}
                  onChange={(e) =>
                    handleExperienceFilter(e.target.value)
                  }
                  className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                >
                  <option value="">All Experience Levels</option>
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

            </div>
          </div>

          {/* RESULTS HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

            <div>
              <p className="text-sm text-slate-500">
                Showing
                <span className="font-semibold text-slate-900 mx-1">
                  {filteredJobs.length}
                </span>
                opportunities
              </p>
            </div>

            {totalPages > 1 && (
              <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
            )}

          </div>

          {/* =========================
              EMPTY STATES
          ========================= */}
          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                <span className="text-slate-400 font-bold">
                  JOB
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mt-6">
                No jobs available
              </h2>

              <p className="text-slate-500 mt-2">
                Recruiters haven't posted any opportunities yet.
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">

              <h2 className="text-2xl font-bold text-slate-800">
                No matching jobs
              </h2>

              <p className="text-slate-500 mt-2">
                Try changing your search terms or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Reset Search
              </button>

            </div>
          ) : (
            <>
              {/* =========================
                  JOB GRID
              ========================= */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {currentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >

                    {/* TOP ACCENT */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                    <div className="p-6">

                      {/* COMPANY + TITLE */}
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex gap-4">

                          <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-slate-900 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {job.company
                                ?.charAt(0)
                                ?.toUpperCase() || "J"}
                            </span>
                          </div>

                          <div>
                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                              {job.title}
                            </h2>

                            <p className="text-slate-500 text-sm mt-1">
                              {job.company}
                            </p>
                          </div>

                        </div>

                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                          Open
                        </span>

                      </div>

                      {/* JOB META */}
                      <div className="flex flex-wrap gap-2 mt-6">

                        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                          {job.location}
                        </span>

                        {job.jobType && (
                          <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
                            {job.jobType}
                          </span>
                        )}

                        {job.experience && (
                          <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                            {job.experience}
                          </span>
                        )}

                      </div>

                      {/* DESCRIPTION */}
                      {job.description && (
                        <p className="text-sm text-slate-500 leading-relaxed mt-5 line-clamp-3">
                          {job.description}
                        </p>
                      )}

                      {/* SALARY */}
                      {job.salary && (
                        <div className="mt-5">
                          <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
                            Compensation
                          </p>

                          <p className="text-sm font-bold text-slate-800 mt-1">
                            {job.salary}
                          </p>
                        </div>
                      )}

                      {/* SKILLS */}
                      {job.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-5">
                          {job.skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs"
                            >
                              {skill}
                            </span>
                          ))}

                          {job.skills.length > 5 && (
                            <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-400 text-xs">
                              +{job.skills.length - 5}
                            </span>
                          )}
                        </div>
                      )}

                      {/* BUTTON */}
                      <div className="mt-6 pt-5 border-t border-slate-100">

                        <Link
                          to={`/job/${job._id}`}
                          className="flex items-center justify-center w-full py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold transition"
                        >
                          View Job Details
                          <span className="ml-2 group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </Link>

                      </div>

                    </div>
                  </div>
                ))}

              </div>

              {/* =========================
                  PAGINATION
              ========================= */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">

                  <button
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 transition"
                  >
                    ←
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() =>
                        goToPage(pageNumber)
                      }
                      className={`w-11 h-11 rounded-xl font-semibold transition ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-blue-300 transition"
                  >
                    →
                  </button>

                </div>
              )}

            </>
          )}

        </div>
      </section>
    </div>
  );
}

export default Jobs;