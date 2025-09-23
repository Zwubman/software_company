import React, { useState } from "react";
import {
  FaStar,
  FaRegEnvelope,
  FaUser,
  FaComments,
  FaLightbulb,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa"; // Importing necessary icons
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { createFeedbackEntry } from "../services/FeedBackService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    feedbackType: "",
    message: "",
    rating: null,
    companyName: "",
    position: "",
    phone: "",
    address: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(""); // Reset error on input change
  };

  const handleStarClick = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.message ||
      formData.rating === null
    ) {
      setError("Please fill all required fields and provide a rating.");
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await createFeedbackEntry(formData);
      toast.success("Thank you! Feedback submitted successfully!");

      // navigate("/"); // Redirect to home page after successful submission

      // Reset form after submission
      setFormData({
        fullName: "",
        email: "",
        feedbackType: "",
        message: "",
        rating: null,
        companyName: "",
        position: "",
        phone: "",
        address: "",
        gender: "",
      });
    } catch (error) {
      toast.error(
        error.message || "Failed to submit feedback. Please try again."
      ); // Show error toast
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="font-sans text-[#3a4253] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6 mt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl transition-transform transform hover:scale-105"
        >
          <h2 className="text-3xl font-semibold mb-6 text-orange-600">
            Feedback
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 flex items-center">
              <FaUser className="text-orange-500 mr-2" size={20} /> Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 flex items-center">
              <FaRegEnvelope className="text-orange-500 mr-2" size={20} /> Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 col-span-1">
            <div className="mb-4">
              <div className="flex items-center">
                <label className="block text-sm font-medium">
                  Feedback Type
                </label>
              </div>

              <select
                name="feedbackType"
                id="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200 md:col-span-1"
                required
              >
                <option value=""></option>

                <option value="suggestion">Suggestion</option>
                <option value="complaint">Complaint</option>
                <option value="praise">Testimony</option>
                <option value="bug_report">Bug Report</option>
              </select>
            </div>
            <div className="mb-4">

            <div className="flex items-center">
              <label className="block text-sm font-medium">gender</label>
            </div>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200 md:col-span-1"
              required
            >
              <option value=""></option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              </select>
              </div>
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 flex items-center">
                <FaPhoneAlt className="text-orange-500 mr-2" size={20} /> Phone
                (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 flex items-center">
                <FaMapMarkerAlt className="text-orange-500 mr-2" size={20} />{" "}
                Address (Optional)
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Position (Optional)
              </label>
              <input
                type="text"
                name="position"
                id="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 flex items-center">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              minLength="10"
              maxLength="1000"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-transform duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  onClick={() => handleStarClick(num)}
                  className={`cursor-pointer text-3xl transition-transform duration-200 ${
                    formData.rating >= num
                      ? "text-orange-500"
                      : "text-gray-300 hover:text-orange-400"
                  }`}
                >
                  <FaStar />
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Feedback;
