import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPartnership } from "../../services/PartnershipService";
import PartnershipStory from "./PartnershipStory";
import PhoneNumberInput from "../../components/UI/PhoneNumberInput";
import { AlertTriangle } from "react-feather";

const partnershipOptions = [
  { value: "idea", label: "Idea for productive philosophy" },
  { value: "tech_product", label: "New Tech Product" },
  { value: "budget_support", label: "Budget Support" },
  { value: "other", label: "other" },
];

const Partnership = () => {
  const { isAuthenticated, user } = useSelector((state) => state.userData);

  const [formData, setFormData] = useState({
    fullName: "",
    sex: "male",
    profession: "",
    abilityForPartnership: "",
    abilityDescription: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [responseError, setResponseError] = useState("");
  const navigate = useNavigate();

  const checkUser = () => {
    if (isAuthenticated) {
      setShowModal(true);
    } else {
      navigate("/login");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Clear any existing data for the profile picture
    if (imageFile) {
      formDataToSend.append("profilePicture", imageFile, imageFile.name);
    } else {
      formDataToSend.append("profilePicture", user.profilePicture || "");
    }

    // Append user data with correct string keys, ensuring no duplicates
    formDataToSend.append("email", user.email || "");
    formDataToSend.append("fullName", user.name || "");
    formDataToSend.append("phoneNumber", user.phoneNumber || "");

    // Append other form data
    formDataToSend.append("sex", formData.sex || "male"); // Set default value if not set
    formDataToSend.append("profession", formData.profession || "");
    formDataToSend.append(
      "abilityForPartnership",
      formData.abilityForPartnership || "idea"
    );

    // Include abilityDescription based on the selected option
    if (formData.abilityForPartnership === "other") {
      formDataToSend.append(
        "abilityDescription",
        formData.abilityDescription || ""
      );
    } else {
      formDataToSend.append("abilityDescription", ""); // Ensure it's empty if not selected
    }

    try {
      setLoading(true);
      await createPartnership(formDataToSend);
      setShowModal(false);
      toast.success("🎉 Partnership request submitted!", {
        position: "top-center",
      });
    } catch (err) {
      // toast.error(err.message || "Submission failed. Please try again.", {
      //   position: "top-center",
      // });
      setResponseError(err.message || "Submission failed. Please try again.");
      // setTimeout(() => {
      //   setResponseError("");
      // }, 5000);
    } finally {
      setLoading(false);
    }
  };
  // Add this function to handle phone number changes
  const handlePhoneChange = (phoneNumber) => {
    setFormData((prev) => ({ ...prev, phoneNumber }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="font-sans bg-white text-[#3a4253] overflow-x-hidden">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-orange-100">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative pt-44 pb-36 white overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-white rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-white rounded-full opacity-30 blur-2xl animate-pulse" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="bg-white/40 backdrop-blur-2xl border border-orange-200 shadow-2xl rounded-[2rem] w-full max-w-sm h-full animate-float-slow ring-4 ring-orange-100 overflow-hidden flex items-center justify-center">
            <img
              src="/assets/partner2.png"
              alt="Partner Illustration"
              className="h-full w-auto object-cover"
            />
          </div>

          <div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-[#EB6407] drop-shadow-md">
              Partner With Us
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-xl mb-6">
              Join a movement of thinkers, builders, and doers. We’re inviting
              collaborators with the vision, tools, and drive to shape
              Ethiopia’s digital future.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li>✅ Co-develop impactful technology</li>
              <li>✅ Drive social innovation at scale</li>
            </ul>
            <button
              onClick={checkUser}
              className="bg-gradient-to-r from-[#EB6407] to-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transition text-lg"
            >
              Apply for Partnership
            </button>
          </div>
        </div>
      </section>
      {/* 🧾 Fixed Testimonials Timeline */}
      <section className="py-24 bg-gradient-to-br from-orange-50 via-white to-orange-100 text-center">
        <h2 className="text-3xl font-black text-orange-700 mb-16">
          Stories of Partnership
        </h2>
        <PartnershipStory />
      </section>

      {/* Partnership Opportunities */}
      <section className="py-24 bg-orange-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "💡 Bring Ideas",
              text: "Pitch your vision, model, or philosophy that drives transformation.",
            },
            {
              title: "🧪 Co-Build Products",
              text: "Collaborate on designing impactful platforms and services.",
            },
            {
              title: "💰 Scale with Resources",
              text: "Fund or co-execute high-impact digital programs.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white shadow-md border border-orange-100 rounded-2xl p-6 text-left hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-bold text-[#EB6407] mb-2">
                {card.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-24 bg-gradient-to-r from-orange-200 to-orange-100 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-3xl font-extrabold text-gray-800 mb-4">
            Let’s spark transformation together.
          </h3>
          <p className="text-lg text-gray-700 mb-8">
            Whether you're a tech innovator, social visionary, or investor, we
            welcome your ambition and alignment.
          </p>
          <button
            onClick={checkUser}
            className="bg-[#EB6407] hover:bg-orange-700 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg transition-all"
          >
            Become a Partner
          </button>
        </div>
      </section>

      {/* Modal Form */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => {
            setResponseError("");
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-semibold text-[#EB6407] mb-4">
              Partnership Application
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="md:col-span-2 flex flex-col items-center">
                <label className="block text-sm font-medium text-[#3a4253] mb-1">
                  Profile Picture
                </label>
                <div className="relative w-32 h-32">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    // required
                  />
                  <div
                    className={`flex items-center justify-center w-full h-full rounded-full border ${
                      formErrors.profilePicture
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {imagePreview || user?.profilePicture ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview || user?.profilePicture}
                          alt="Preview"
                          className="w-full h-full rounded-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 mb-2 mr-2">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-white bg-orange-600 rounded-full p-2 hover:bg-orange-700 transition duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            <input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange} // Your function to handle the image change
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
                {formErrors.profilePicture && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.profilePicture}
                  </p>
                )}
              </div>
              <input
                name="fullName"
                disabled
                placeholder="Full Name"
                value={user.name}
                onChange={handleChange}
                className="w-full p-3 border border-orange-200 rounded-md"
                required
              />
              <div className="grid grid-cols-2 gap-4 ">
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="p-3 border border-orange-200 rounded-md max-h-12"
                >
                  <option>male</option>
                  <option>female</option>
                </select>
                <PhoneNumberInput
                  onChange={handlePhoneChange}
                  value={user.phoneNumber}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  disabled
                  onChange={handleChange}
                  className="p-3 border border-orange-200 rounded-md"
                  required
                />
                <input
                  name="profession"
                  placeholder="Profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="p-3 border border-orange-200 rounded-md"
                  required
                />
              </div>
              <select
                name="abilityForPartnership"
                value={formData.abilityForPartnership}
                onChange={handleChange}
                className="w-full p-3 border border-orange-200 rounded-md"
                required
              >
                <option value="">-- Select Ability --</option>
                {partnershipOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {formData.abilityForPartnership === "other" && (
                <textarea
                  name="abilityDescription"
                  placeholder="Describe your proposed partnership opportunity..."
                  value={formData.abilityDescription}
                  onChange={handleChange}
                  className="w-full p-3 border border-orange-200 rounded-md"
                  rows={4}
                />
              )}
              {responseError && (
                <p className="text-red-500 text-sm px-4 flex items-center bg-red-200 rounded-md py-1">
                  <AlertTriangle className="mr-2" /> {responseError}
                </p>
              )}
              <button
                type="submit"
                className="w-full bg-[#EB6407] hover:bg-orange-700 text-white font-bold py-3 rounded-full shadow-md transition"
              >
                {loading ? "submitting..." : " Submit Partnership"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Partnership;
