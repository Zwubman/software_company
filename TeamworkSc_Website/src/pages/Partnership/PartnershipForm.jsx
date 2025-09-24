import React, { useState, useEffect } from "react";
import {
  updateMyPartnership,
  updatePartnershipStatus,
} from "../../services/PartnershipService";
import MyToast from "../../components/Notification/MyToast";
import PhoneNumberInput from "../../components/UI/PhoneNumberInput";
import { AlertTriangle } from "react-feather";

const PartnershipForm = ({
  isOpen,
  onClose,
  onOrderAdded,
  partnershipId,
  partnershipData,
  user,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    sex: "male",
    phoneNumber: "",
    email: user.email,
    profession: "",
    abilityForPartnership: "",
    abilityDescription: "",
  });
  const [responseError, setResponseError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (partnershipData) {
      setFormData({
        fullName: partnershipData.fullName || "",
        sex: partnershipData.sex || "male",
        phoneNumber: partnershipData.phoneNumber || "",
        email: user.email,
        profession: partnershipData.profession || "",
        abilityForPartnership: partnershipData.abilityForPartnership || "",
        abilityDescription: partnershipData.abilityDescription || "",
      });
    }
  }, [partnershipData, user.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add logic to update the partnership data
      const response = await updateMyPartnership(partnershipData.id, formData); // Assuming onOrderAdded handles the update
      MyToast(response?.message || "updated", "success");
      onOrderAdded();
      onClose();
    } catch (error) {
      setResponseError(error.message || "Submission failed. Please try again.");

      // MyToast(error?.response?.data.message || "failed to update", "error");
    } finally {
      setLoading(false);
    }
  };
  const handlePhoneChange = (phoneNumber) => {
    setFormData((prev) => ({ ...prev, phoneNumber }));
  };

  const partnershipOptions = [
    { value: "idea", label: "Idea for productive philosophy" },
    { value: "tech_product", label: "New Tech Product" },
    { value: "budget_support", label: "Budget Support" },
    { value: "other", label: "other" },
  ];
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={() => {
        setResponseError("");
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-4 text-gray-400 text-2xl hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-[#EB6407] mb-4">
          Edit Partnership Application
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="md:col-span-2 flex flex-col items-center">
            <label className="block text-sm font-medium text-[#3a4253] mb-1">
              Profile Picture
            </label>
            <div className="relative w-32 h-32">
              <div
                className={`flex items-center justify-center w-full h-full rounded-full borde border-gray-300`}
              >
                {user?.profilePicture && (
                  <div className="relative w-full h-full">
                    <img
                      src={user?.profilePicture}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <input
            name="fullName"
            placeholder="Full Name"
            disabled
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 border border-orange-200 rounded-md"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="p-3 border border-orange-200 rounded-md"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {/* <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="p-3 border border-orange-200 rounded-md"
              required
            /> */}
            <PhoneNumberInput
              onChange={handlePhoneChange}
              value={formData.phoneNumber}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              disabled
              className="p-3 border border-orange-200 rounded-md"
              required
            />
            <input
              name="profession"
              placeholder="Profession"
              value={formData.profession}
              onChange={handleChange}
              className="p-3 border border-orange-200 rounded-md"
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
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnershipForm;
