import { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  X,
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  Globe,
  Loader2,
} from "lucide-react"; // Ensure you have lucide-react installed
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { applyforJob, getAllOpenedJobs } from "../../../services/JobService";
import MyToast from "../../../components/Notification/MyToast";
import Detail from "./Detail";
import { useNavigate } from "react-router-dom";
import JobDetail from "../../../components/detailPages/JobDetail";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const Jobs = ({ jobId, setShowApplicants }) => {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedJob, setSelectedJob] = useState(jobId || null);
  // const [selectedJob, setSelectedJob] = useState(null);
  const [step, setStep] = useState(1);
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    search: "",
  });
  const [applicantData, setApplicantData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedIn: "",
    portfolio: "",
    experience: "",
    education: "",
    coverLetter: "",
    resume: null,
  });
  const [errors, setErrors] = useState({});
  const [isDetailView, setIsDetailView] = useState(false);
  const [jobDetail, setJobDetail] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const limit = 4;

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchQuery, filters]);

  useEffect(() => {
    setStep(2);
  }, [jobId]);

  const navigate = useNavigate();
  const fetchJobs = async () => {
    setLoading1(true);
    try {
      const response = await getAllOpenedJobs(currentPage, limit, {
        // search: searchQuery,
        filters,
      });
      setJobs(response?.job?.jobs || []);
      setTotalPages(Math.ceil(response?.job?.total / limit) || 1);
      setLoading1(false);
    } catch (error) {
      setLoading1(false);
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (!filters.type ||
        job.jobType.toLowerCase() === filters.type.toLowerCase()) &&
      (!filters.location ||
        job.location.toLowerCase().includes(filters.location.toLowerCase()))
    );
  });

  const resetModal = () => {
    setStep(1);
    setSelectedJob(null);
    setApplicantData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedIn: "",
      portfolio: "",
      experience: "",
      education: "",
      coverLetter: "",
      resume: null,
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicantData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };
  const handleLoginDialog = () => {
    if (isAuthenticated) {
      setStep(2);
    } else {
      navigate("/login");
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setApplicantData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!applicantData.phone) newErrors.phone = "Phone number is required.";
    if (
      applicantData.linkedIn &&
      !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/.test(
        applicantData.linkedIn
      )
    ) {
      newErrors.linkedIn = "LinkedIn URL is invalid.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("jobId", jobId ? jobId : selectedJob.id);
    formData.append("applicantFullName", user.name);
    formData.append("applicantEmail", user.email);
    formData.append("applicantPhone", applicantData.phone);
    formData.append("applicantAddress", applicantData.address);
    formData.append("applicantLinkedIn", applicantData.linkedIn);
    formData.append("applicantPortfolio", applicantData.portfolio);
    formData.append("applicantExperience", applicantData.experience);
    formData.append("applicantEducation", applicantData.education);
    formData.append("coverLetter", applicantData.coverLetter);
    // if (applicantData.coverLetter) formData.append("coverLetter", applicantData.coverLetter);
    if (applicantData.resume) formData.append("document", applicantData.resume);
    setLoading(true);
    try {
      const response = await applyforJob(formData);
      if (response.data && response.success) {
        setStep(4);
        setLoading(false);
      } else {
        setLoading(false);
        MyToast(response.data.message || "Failed to apply!", "error");
      }
    } catch (error) {
      setLoading(false);
      MyToast(error.response?.data?.message || "Failed to apply!", "error");
    }
  };

  return (
    <div className="font-sans antialiased  text-[#3a4253] overflow-x-hidden">
      <div className="w-full fixed top-0 z-50 bg-white shadow">
        {/* {user.role !== "agent" && <Navbar />} */}
        <Navbar />
      </div>
      {isDetailView ? (
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 pb-16">
          <JobDetail
            job={jobDetail}
            onClose={() => setIsDetailView(!isDetailView)}
          />
        </div>
      ) : (
        <section className="pt-44 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <Briefcase className="text-[#EB6407] w-8 h-8 animate-bounce" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Join Our Company
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              onChange={(e) =>
                setFilters((f) => ({ ...f, jobType: e.target.value }))
              }
            >
              <option value="">All Job Types</option>
              <option value="remote">Remote</option>
              <option value="contract">contract</option>
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="internship">internship</option>
            </select>
            <input
              type="text"
              placeholder="search here"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
            />
          </div>

          {loading1 ? (
            <Loader />
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:border-orange-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {job.title}{" "}
                    </h2>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {job.jobType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building2 className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{job.companyName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{job.location}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span>{job.salary} birr/month</span>
                  </div> */}
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span>
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Required Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-center mt-6 p-4 border rounded-lg shadow-sm bg-white">
                    <span className="text-sm text-gray-500 mb-2 md:mb-0">
                      Experience: {job.experience}
                    </span>
                    <button
                      onClick={() => {
                        navigate(`/posts/jobs/${job.id}`);
                      
                      }}
                      className="inline-flex items-center gap-2 bg-[#EB6407] hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-600">
              Showing page {currentPage} of {totalPages} • {filteredJobs.length}{" "}
              jobs
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
        </section>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-24 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 relative animate-slideIn">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors duration-300"
              onClick={resetModal}
            >
              <X className="w-6 h-6" />
            </button>

            {step === 1 && (
              <Detail
                selectedJob={selectedJob}
                handleLoginDialog={handleLoginDialog}
              />
            )}

            {step === 2 && (
              <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
                <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    disabled
                    placeholder="Full Name"
                    className={`w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500  rounded-lg mb-4 ${
                      errors.fullName ? "border-red-500" : ""
                    }`}
                    value={user.name ? user.name : applicantData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    disabled
                    placeholder="Email Address"
                    className={`w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500  rounded-lg mb-4 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    value={user.email ? user.email : applicantData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errors.email ||
                  (user.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  ))}

                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className={`w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500  rounded-lg mb-4 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    value={applicantData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="w-full pl-10 px-4 py-2  focus:outline-none focus:border-orange-500  border rounded-lg mb-4"
                    value={applicantData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="linkedIn"
                    placeholder="LinkedIn Profile URL"
                    className={`w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500  rounded-lg mb-4 ${
                      errors.linkedIn ? "border-red-500" : ""
                    }`}
                    value={applicantData.linkedIn}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.linkedIn && (
                  <p className="text-red-500 text-sm">{errors.linkedIn}</p>
                )}

                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="portfolio"
                    placeholder="Portfolio URL"
                    className="w-full pl-10 px-4 py-2 focus:outline-none focus:border-orange-500  border rounded-lg mb-4"
                    value={applicantData.portfolio}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="experience"
                    placeholder="Experience"
                    className="w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500  rounded-lg mb-4 min-h-[100px]"
                    value={applicantData.experience}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="education"
                    placeholder="Education"
                    className="focus:outline-none focus:border-orange-500  w-full pl-10 px-4 py-2 border rounded-lg mb-4 min-h-[100px]"
                    value={applicantData.education}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setSelectedJob(null);
                    }}
                    className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-700 flex items-center gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  File Uploads
                </h2>
                <div className="flex flex-col mb-6">
                  <label className="text-sm font-semibold mb-2 text-gray-700">
                    Upload coverLetter (PDF, DOCX):
                  </label>
                  <div className="relative">
                    {/* <input
                      type="file"
                      name="coverLetter"
                      accept=".pdf,.docx"
                      className="border-2 border-gray-200 rounded-lg p-3 w-full focus:outline-none focus:border-orange-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      onChange={handleFileChange}
                      required
                    /> */}
                    <textarea
                      name="coverLetter"
                      placeholder="Cover Letter"
                      className="focus:outline-none focus:border-orange-500  w-full pl-10 px-4 py-2 border rounded-lg mb-4 min-h-[100px]"
                      value={applicantData.coverLetter}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col mb-6">
                  <label className="text-sm font-semibold mb-2 text-gray-700">
                    Write Your cover letter here!{" "}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.docx"
                      className="border-2 border-gray-200 rounded-lg p-3 w-full focus:outline-none focus:border-orange-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 flex items-center gap-2 font-medium"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="text-center px-4 sm:px-6 md:px-8 max-w-lg mx-auto">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-3 sm:mb-4 animate-bounce" />
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Application Submitted!
                </h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                  Thank you for applying to {selectedJob.title}. We will review
                  your application and get back to you soon.
                </p>
                <button
                  onClick={resetModal}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-[#EB6407] text-white font-semibold rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {user.role !== "agent" && <Footer />}
    </div>
  );
};

export default Jobs;
