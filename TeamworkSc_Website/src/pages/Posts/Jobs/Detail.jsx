import React, { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  ArrowRight,
  DollarSign,
  FileText,
  Building,
  Award,
  Folder,
  CheckSquare,
  ArrowLeft,
  Code,
  Star,
  Linkedin,
  Globe,
  GraduationCap,
  Gift,
  Loader2,
  Mail,
  Phone,
  CheckCircle,
  User,
} from "lucide-react";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { applyforJob, getJobById } from "../../../services/JobService";
import Footer from "../../../components/Footer/Footer";
import MyToast from "../../../components/Notification/MyToast";

const Loader = () => (
  <div className="min-h-screen flex justify-center items-center pt-24">
    <Loader2 className="h-12 w-12 text-[#EB6407] animate-spin" />
  </div>
);

const Detail = () => {
  const { isAuthenticated, user } = useSelector((state) => state.userData);

  const [step, setStep] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [applicantData, setApplicantData] = useState({
    fullName: "",
    email: "",
    phone:user.phoneNumber|| "",
    address: "",
    linkedIn: "",
    portfolio: "",
    experience: "",
    education: "",
    bio: "",
    resume: null,
    coverLetter: null,
  });
  const navigate = useNavigate();
  const { jobId } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await getJobById(jobId);
        setSelectedJob(response?.job);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleLoginDialog = () => {
    if (isAuthenticated) {
      setStep(2);
    } else {
      navigate("/login");
    }
  };
  const validateStep2 = () => {
    const newErrors = {};
    // if (!applicantData.phone) newErrors.phone = "Phone number is required.";
    // else if (!/^\d{10}$/.test(applicantData.phone)) {
    //   newErrors.phone = "Phone number must be 10 digits.";
    // }
    if (!applicantData.experience) newErrors.experience = "experience is required.";

    if (applicantData.linkedIn && !/^https?:\/\/(www\.)?linkedin\.com\/.+$/.test(applicantData.linkedIn)) {
      newErrors.linkedIn = "Invalid LinkedIn URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicantData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("jobId", selectedJob.id);
    formData.append("applicantFullName", user.name);
    formData.append("applicantEmail", user.email);
    formData.append("applicantPhone", user.phoneNumber||applicantData.phone);
    formData.append("applicantAddress", applicantData.address);
    formData.append("applicantLinkedIn", applicantData.linkedIn);
    formData.append("applicantPortfolio", applicantData.portfolio);
    formData.append("applicantExperience", applicantData.experience);
    formData.append("applicantEducation", applicantData.education);
    formData.append("bio", applicantData.bio);
    // if (applicantData.bio) formData.append("bio", applicantData.bio);
    if (applicantData.resume) formData.append("document", applicantData.resume);
    if (applicantData.coverLetter)
      formData.append("coverLetter", applicantData.coverLetter);
    setLoading(true);
    try {
      const response = await applyforJob(formData);
      if (response.data && response.success) {
        setStep(4);
        setLoading(false);
      } else {
        setLoading(false);
        MyToast(response.data.message || "Failed to apply !!", "error");
      }
    } catch (error) {
      setLoading(false);
      MyToast(error.response?.data?.message || "Failed to apply!", "error");
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setApplicantData((prev) => ({ ...prev, [name]: files[0] }));
  };

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
      bio: "",
      resume: null,
      coverLetter: null,
    });
    setErrors({});
  };
  return (
    <div className="font-sans antialiased text-[#3a4253] min-h-screen">
      <div className="w-full fixed top-0 z-50 bg-white shadow">
        <Navbar />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="rounded-lg p-4 sm:p-6 lg:p-8 mb-6 max-w-6xl mx-auto transition-transform transform ">
            {step === 1 && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {selectedJob?.title}
                  </h2>
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-600">
                      {selectedJob?.companyName}
                    </span>
                  </div>
                  <span className="text-gray-400 hidden sm:block">•</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-600">
                      {selectedJob?.location}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-700 p-3 rounded-lg transition-transform duration-300 hover:scale-105">
                    <Briefcase className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="font-semibold">Job Type:</span>
                    <span className="capitalize">{selectedJob?.jobType}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-gray-700 p-3 rounded-lg transition-transform duration-300 hover:scale-105">
                    <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="font-semibold">Salary:</span>
                    <span>{selectedJob?.salary} birr/month</span>
                  </div> */}
                  <div className="flex items-center gap-2 text-gray-700 p-3 rounded-lg transition-transform duration-300 hover:scale-105">
                    <Award className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="font-semibold">Experience:</span>
                    <span>{selectedJob?.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 p-3 rounded-lg transition-transform duration-300 hover:scale-105">
                    <Folder className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <span className="font-semibold">Category:</span>
                    <span className="capitalize">{selectedJob?.category}</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg transition-transform duration-300 hover:scale-105">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-teal-500" />
                      Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob?.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg transition-transform duration-300 hover:scale-105">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-red-500" />
                      Requirements
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob?.requirements}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg transition-transform duration-300 hover:scale-105">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-yellow-500" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob?.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 text-orange-700 rounded-full text-sm flex items-center gap-1 hover:bg-orange-100 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg transition-transform duration-300 hover:scale-105">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Gift className="w-5 h-5 text-pink-500" />
                      Benefits
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob?.benefits}
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={handleLoginDialog}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[0.98] hover:shadow-lg"
                  >
                    Apply Now <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
          {step === 2 && (
            <div className="space-y-6 max-w-4xl mx-auto max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide p-4 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
              <div className="relative mb-4">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  disabled
                  placeholder="Full Name"
                  className="w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-lg"
                  value={user.name ? user.name : applicantData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative mb-4">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  disabled
                  placeholder="Email Address"
                  className="w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-lg"
                  value={user.email ? user.email : applicantData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative mb-4">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className={`w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-lg ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                  value={user.phoneNumber? user.phoneNumber:applicantData.phone}
                  onChange={handleInputChange}
                    required
                    disabled
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}

              <div className="relative mb-4">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-lg"
                  value={applicantData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative mb-4">
                <Linkedin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="linkedIn"
                  placeholder="LinkedIn Profile URL"
                  className={`w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-lg ${
                    errors.linkedIn ? "border-red-500" : ""
                  }`}
                  value={applicantData.linkedIn}
                  onChange={handleInputChange}
                />
              </div>
              {errors.linkedIn && (
                <p className="text-red-500 text-sm">{errors.linkedIn}</p>
              )}

              <div className="relative mb-4">
                <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="portfolio"
                  placeholder="Portfolio URL"
                  className="w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-lg"
                  value={applicantData.portfolio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="relative mb-4">
                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  name="experience"
                  placeholder="Experience in year"
                  className="w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-lg "
                  value={applicantData.experience}
                  onChange={handleInputChange}
                  />
                   {errors.experience && (
                <p className="text-red-500 text-sm">{errors.experience}</p>
              )}
              </div>

              <div className="relative mb-4">
                <GraduationCap className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="education"
                  placeholder="Education"
                  className="w-full pl-10 px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-lg min-h-[100px]"
                  value={applicantData.education}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    // setSelectedJob(null);
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
            <div className="space-y-6 max-w-4xl mx-auto max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide p-4 bg-white rounded-lg shadow-lg">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  File Uploads
                </h2>
                <div className="flex flex-col mb-6">
                  <label className="text-sm font-semibold mb-2 text-gray-700">
                    Write Your bio here!{" "}
                  </label>
                  <div className="relative">
                    <textarea
                      name="bio"
                      placeholder="bio..."
                      rows={10}
                      className="focus:outline-none focus:border-orange-500  w-full pl-10 px-4 py-2 border rounded-lg mb-4 min-h-[100px]"
                      value={applicantData.bio}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <label className="text-sm font-semibold mb-2 text-gray-700">
                        Upload your resume (PDF only):
                      </label>
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf,"
                        className="border-2 border-gray-200 rounded-lg p-3 w-full focus:outline-none focus:border-orange-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        onChange={handleFileChange}
                        required
                      />
                    </div>

                    <div className="relative flex-1">
                      <label className="text-sm font-semibold mb-2 text-gray-700">
                        Upload your Cover Letter (PDF only):
                      </label>
                      <input
                        type="file"
                        name="coverLetter"
                        accept=".pdf,.docx"
                        className="border-2 border-gray-200 rounded-lg p-3 w-full focus:outline-none focus:border-orange-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
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
            </div>
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
                onClick={() => navigate("/posts/jobs")}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-[#EB6407] text-white font-semibold rounded-lg hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Detail;
