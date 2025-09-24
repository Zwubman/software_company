import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Users,
  Clock,
  Filter,
  X,
  Loader2,
  BadgeDollarSign,
  SquareChevronRight,
} from "lucide-react";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../../services/JobService";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import JobDetail from "../detailPages/JobDetail";
import { useSelector } from "react-redux";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobId, setJobId] = useState("");
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    applications: 0,
    avgSalary: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    jobType: "",
    category: "",
    jobStatus: "",
    location: "",
    sortBy: "createdAt",
    sortOrder: "DESC", // Default sort order
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [jobDetail, setJobDetail] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    companyName: "Teamwork IT Solution",
    deadline: "",
    description: "",
    location: "Addis Ababa",
    salary: "",
    requirements: "",
    skills: "",
    jobType: "",
    category: "",
    benefits: "",
    jobStatus: "open",
    experience: "",
  });
  const { user } = useSelector((state) => state.userData);

  const limit = 10;

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchQuery, filters]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const currentFilters = { ...filters, search: searchQuery }; // Include searchQuery in filters

      const response = await getAllJobs(currentPage, limit, currentFilters);

      const jobsData = response.jobs.jobs || response.data;
      setJobs( response.jobs.jobs || response.data);

    
      setTotalPages(Math.ceil(response.jobs.total / limit));

      // Calculate stats
      const totalJobs = response.jobs.total || 0;
      const openJobs = jobsData.filter(
        (job) => job.jobStatus === "open"
      ).length;
      const applications = jobsData.reduce(
        (sum, job) => sum + (job.JobApplications?.length || 0),
        0
      );
      const avgSalary = jobsData.length
        ? (
            jobsData.reduce((sum, job) => sum + job.salary, 0) / jobsData.length
          ).toFixed(2)
        : 0;
      setStats({ totalJobs, openJobs, applications, avgSalary });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters({ ...filters, [name]: value });
  // };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "sortBy") {
      setFilters({ ...filters, sortBy: value });
    } else if (name === "sortOrder") {
      setFilters({ ...filters, sortOrder: value });
    } else {
      setFilters({ ...filters, [name]: value });
    }
    setCurrentPage(1); // Reset to the first page on filter change
    // fetchJobs(); // Fetch jobs when filters change
  };

  const resetFilters = () => {
    setFilters({
      jobType: "",
      category: "",
      jobStatus: "",
      location: "",
      sortBy: "createdAt",
      sortOrder:"DESC"
    });
    setSearchQuery("");
    setCurrentPage(1);
    fetchJobs();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleConfirm = async () => {
    try {
      await deleteJob(jobId);
      fetchJobs();
      setDeleteDialogOpen(false);
    } catch (error) {
      setDeleteDialogOpen(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const jobData = {
        ...formData,
        salary: Number(formData.salary),
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      };
      if (currentJob) {
        await updateJob(currentJob.id, jobData);
      } else {
        await createJob(jobData);
      }
      setIsModalOpen(false);
      setFormData({
        title: "",
        deadline: "",
        description: "",
        location: "Addis Ababa",
        salary: "",
        requirements: "",
        companyName: "Teamwork IT Solution",
        jobStatus: "open",
        skills: "",
        jobType: "",
        category: "",
        benefits: "",
        experience: "",
      });
      setCurrentJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (job) => {
    setCurrentJob(job);
    setFormData({
      title: job.title,
      companyName: job.companyName,
      deadline: job.deadline.split("T")[0],
      description: job.description,
      location: job.location,
      salary: job.salary.toString(),
      requirements: job.requirements,
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",
      jobType: job.jobType,
      category: job.category,
      benefits: job.benefits || "",
      jobStatus: job.jobStatus,
      experience: job.experience,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setJobId(id);
    setDeleteDialogOpen(true);
  };
  const resetForm = () => {
    setCurrentJob(null);
    setIsModalOpen(false);
    setFormData({
      title: "",
      deadline: "",
      description: "",
      location: "Addis Ababa",
      salary: "",
      requirements: "",
      companyName: "Teamwork IT Solution",
      jobStatus: "open",
      skills: "",
      jobType: "",
      category: "",
      benefits: "",
      experience: "",
    });
  };
  const handleDetail = (job) => {
    setJobDetail(job);
    setIsDetailView(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Get recent jobs (max 5)
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirm}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Job Management
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Briefcase, label: "Total Jobs", value: stats.totalJobs },
            { icon: Users, label: "Open Jobs", value: stats.openJobs },
            { icon: Clock, label: "Applications", value: stats.applications },
            {
              icon: BadgeDollarSign,
              label: "Avg Salary",
              value: `Birr ${stats.avgSalary}`,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-4"
            >
              <stat.icon className="h-8 w-8 text-[#EB6407]" />
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {isDetailView ? (
          <JobDetail
            job={jobDetail}
            onClose={() => setIsDetailView(!isDetailView)}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Search and Filter Bar */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <form
                  // onSubmit={handleSearchSubmit}
                  className="flex flex-col lg:flex-row gap-4"
                >
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search jobs..."
                      className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                    />
                  </div>
                  <select
                    name="sortBy"
                    onChange={handleFilterChange}
                    className={`flex items-center bg-white justify-center px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]`}
                  >
                    <option value="" selected>
                      Sort By
                    </option>
                    <option value="title">Title</option>
                    <option value="createdAt">Created Date</option>

                    <option value="applicationsCount">
                      Number of Applicants
                    </option>
                  </select>
                  <select
                    name="sortOrder"
                    onChange={handleFilterChange}
                    className={`flex items-center bg-white justify-center px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]`}
                  >
                    <option value="DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md transition-colors ${
                      showFilters
                        ? "bg-gray-100 border-gray-300"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Filter className="h-5 w-5 mr-2 text-gray-600" />
                    <span className="text-gray-700">Filters</span>
                  </button>{" "}
                  {user?.role == "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center justify-center px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      <span className="hidden 2xl:inline">Create </span>
                    </motion.button>
                  )}
                </form>

                {/* Filter Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Type
                        </label>
                        <select
                          name="jobType"
                          value={filters.jobType}
                          onChange={handleFilterChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        >
                          <option value="">All Types</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="remote">Remote</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          name="category"
                          value={filters.category}
                          onChange={handleFilterChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        >
                          <option value="">All Categories</option>
                          <option value="engineering">Engineering</option>
                          <option value="marketing">Marketing</option>
                          <option value="sales">Sales</option>
                          <option value="design">Design</option>
                          <option value="hr">HR</option>
                          <option value="it">IT</option>
                          <option value="software_development">
                            Software Development
                          </option>
                          <option value="data_science">Data Science</option>{" "}
                          <option value="sales">Sales</option>
                          <option value="finance">Finance</option>
                          <option value="operations">Operations</option>
                          <option value="customer_support">
                            Customer Support
                          </option>
                          <option value="content_writing">
                            Content Writing
                          </option>
                          <option value="legal">Legal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          name="jobStatus"
                          value={filters.jobStatus}
                          onChange={handleFilterChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        >
                          <option value="">All Statuses</option>
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={filters.location}
                          onChange={handleFilterChange}
                          placeholder="Filter by location"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reset All
                      </button>
                      {/* <button
                        type="button"
                        onClick={applyFilters}
                        className="px-4 py-1.5 bg-[#EB6407] text-white text-sm rounded-md hover:bg-[#C05600] transition-colors"
                      >
                        Apply Filters
                      </button> */}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Jobs Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3 text-left text-sm font-medium">
                              Title
                            </th>
                            {/* <th className="p-3 text-left text-sm font-medium hidden md:table-cell">
                              Company
                            </th> */}
                            {/* <th className="p-3 text-left text-sm font-medium hidden sm:table-cell">
                              Category
                            </th> */}
                            <th className="p-3 text-left text-sm font-medium hidden lg:table-cell">
                              Location
                            </th>
                            <th className="p-3 text-left text-sm font-medium">
                              Type
                            </th>
                            <th className="p-3 text-left text-sm font-medium hidden sm:table-cell">
                              Status
                            </th>
                            <th className="p-3 text-left text-sm font-medium hidden md:table-cell">
                              Apps
                            </th>
                            <th className="p-3 text-left text-sm font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <AnimatePresence>
                            {jobs.length > 0 ? (
                              jobs.map((job) => (
                                <motion.tr
                                  key={job.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="p-3 text-sm text-gray-800">
                                    {job.title}
                                  </td>
                                  {/* <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                                    {job.companyName}
                                  </td> */}
                                  {/* <td className="p-3 text-sm text-gray-600 hidden sm:table-cell">
                                    {job.category}
                                  </td> */}
                                  <td className="p-3 text-sm text-gray-600 hidden lg:table-cell">
                                    {job.location}
                                  </td>
                                  <td className="p-3 text-sm text-gray-600 capitalize">
                                    {job.jobType}
                                  </td>
                                  <td className="p-3 hidden sm:table-cell">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        job.jobStatus === "open"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {job.jobStatus}
                                    </span>
                                  </td>
                                  <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                                    {job.applicationsCount || 0}
                                  </td>
                                  <td className="p-3">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleDetail(job)}
                                        className="flex items-center border border-blue-500 text-blue-500 hover:bg-blue-100 transition-colors px-1 py-1 rounded-md text-xs"
                                        aria-label="View job details"
                                      >
                                        <SquareChevronRight className="h-4 w-4 mr-1" />
                                        <span className="hidden md:inline">
                                          Details
                                        </span>
                                      </button>
                                      {user?.role == "admin" && (
                                        <button
                                          onClick={() => handleEdit(job)}
                                          className="flex items-center border border-gray-500 text-gray-500 hover:bg-gray-100 transition-colors px-1 py-1 rounded-md text-xs"
                                          aria-label="Edit job"
                                        >
                                          <Edit className="h-4 w-4 mr-1" />
                                          <span className="hidden md:inline">
                                            Edit
                                          </span>
                                        </button>
                                      )}
                                      {user?.role == "admin" && (
                                        <button
                                          onClick={() => handleDelete(job.id)}
                                          className="flex items-center border border-red-500 text-red-500 hover:bg-red-100 transition-colors px-1 py-1 rounded-md text-xs"
                                          aria-label="Delete job"
                                        >
                                          <Trash2 className="h-4 w-4 mr-1" />
                                          <span className="hidden md:inline">
                                            Delete
                                          </span>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </motion.tr>
                              ))
                            ) : (
                              <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-32"
                              >
                                <td
                                  colSpan="8"
                                  className="text-center text-gray-500 p-4"
                                >
                                  No jobs found matching your criteria
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
                      <p className="text-sm text-gray-600">
                        Showing page {currentPage} of {totalPages} •{" "}
                        {jobs.length} jobs
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 border rounded-md flex items-center ${
                            currentPage === 1
                              ? "text-gray-400 border-gray-200"
                              : "text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          <span>Previous</span>
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 border rounded-md flex items-center ${
                            currentPage === totalPages
                              ? "text-gray-400 border-gray-200"
                              : "text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span>Next</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Jobs Sidebar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 h-fit sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Jobs
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden text-gray-500 hover:text-gray-700"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-gray-500">{job.companyName}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            job.jobStatus === "open"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {job.jobStatus}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent jobs
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Modal for Create/Edit Job */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {currentJob ? "Edit Job" : "Create New Job"}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title*
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name*
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          required
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deadline*
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location*
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Salary(optional)
                        </label>
                        <input
                          type="number"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          // required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Type*
                        </label>
                        <select
                          name="jobType"
                          value={formData.jobType}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          required
                        >
                          <option value="">Select Job Type</option>
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="remote">Remote</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category*
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="engineering">Engineering</option>
                          <option value="marketing">Marketing</option>
                          <option value="sales">Sales</option>
                          <option value="design">Design</option>
                          <option value="hr">HR</option>
                          <option value="it">IT</option>
                          <option value="software_development">
                            Software Development
                          </option>
                          <option value="data_science">Data Science</option>{" "}
                          <option value="sales">Sales</option>
                          <option value="finance">Finance</option>
                          <option value="operations">Operations</option>
                          <option value="customer_support">
                            Customer Support
                          </option>
                          <option value="content_writing">
                            Content Writing
                          </option>
                          <option value="legal">Legal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Status*
                        </label>
                        <select
                          name="jobStatus"
                          value={formData.jobStatus}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Experience*
                        </label>
                        <input
                          type="text"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills* (comma separated)
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        placeholder="e.g. JavaScript, React, Node.js"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description*
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        rows="4"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Requirements*
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        rows="3"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Benefits
                      </label>
                      <textarea
                        name="benefits"
                        value={formData.benefits}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407]"
                        rows="3"
                        placeholder="Optional benefits information"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isSubmitting && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        {currentJob ? "Update Job" : "Create Job"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminJobs;
