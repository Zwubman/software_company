import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, X } from "lucide-react";
import { createAgent, updateAgent } from "../../services/AgentService";
import axios from "axios";
import { api } from "../../constants/api";
import MyToast from "../../components/Notification/MyToast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
      type === "error"
        ? "bg-red-100 text-red-800"
        : "bg-green-100 text-green-800"
    }`}
  >
    {type === "error" && <AlertCircle className="h-5 w-5" />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X className="h-4 w-4" />
    </button>
  </motion.div>
);

const AgentApplication = ({ onClose, user, myAgentData }) => {
  const [currentAgent, setCurrentAgent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    sex: "Male",
    profession: "",
    educationLevel: "",
    agentType: "",
    languages: [],
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    regionId: "",
    zoneId: "",
    woredaId: "",
    currentLanguageInput: "",
    // profilePicture: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    fetchRegions();
    if (myAgentData && Object.keys(myAgentData).length > 0) {
      setCurrentAgent(myAgentData);
      setFormData({
        fullName: myAgentData.fullName,
        sex: myAgentData.sex,
        profession: myAgentData.profession,
        educationLevel: myAgentData.educationLevel,
        agentType: myAgentData.agentType,
        languages: myAgentData.languages || [],
        phoneNumber: myAgentData.phoneNumber,
        email: myAgentData.email,
        regionId: myAgentData.regionId || "",
        zoneId: myAgentData.zoneId || "",
        woredaId: myAgentData.woredaId?.toString() || "",
        currentLanguageInput: "",
      });
      setSelectedRegion(myAgentData.regionId?.toString() || "");
      setSelectedZone(myAgentData.zoneId?.toString() || "");
      setFormErrors({});
    } else {
      // setToast({ message: "No agent request found", type: "info" });
    }
  }, [myAgentData]);
  const navigate = useNavigate();
  const fetchRegions = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${api}/regions/all-region`, config);
      setRegions(response?.data?.regions?.regions || []);
    } catch (error) {
      setToast({ message: "Failed to fetch regions", type: "error" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
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

  const handleLanguageInputChange = (e) => {
    setFormData({ ...formData, currentLanguageInput: e.target.value });
    setFormErrors({ ...formErrors, languages: "" });
  };

  const addLanguage = () => {
    const { currentLanguageInput, languages } = formData;
    if (
      currentLanguageInput.trim() &&
      !languages.includes(currentLanguageInput.trim())
    ) {
      setFormData({
        ...formData,
        languages: [...languages, currentLanguageInput.trim()],
        currentLanguageInput: "",
      });
    }
  };

  const removeLanguage = (languageToRemove) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((lang) => lang !== languageToRemove),
    });
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedZone("");
    setFormData({ ...formData, regionId, zoneId: "", woredaId: "" });
    setFormErrors({ ...formErrors, regionId: "", zoneId: "", woredaId: "" });
  };

  const handleZoneChange = (e) => {
    const zoneId = e.target.value;
    setSelectedZone(zoneId);
    setFormData({ ...formData, zoneId, woredaId: "" });
    setFormErrors({ ...formErrors, zoneId: "", woredaId: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.profession.trim())
      errors.profession = "Profession is required";
    if (!formData.educationLevel.trim())
      errors.educationLevel = "Education level is required";
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    }
    // else if (!/^(\251|0)[97]\d{8}$/.test(formData.phoneNumber.trim())) {
    //   errors.phoneNumber = "Please enter a valid Ethiopian phone number";
    // }
    if (!formData.email.trim()) errors.email = "Email is required";
    if (formData.languages.length === 0)
      errors.languages = "At least one language is required";
    if (!formData.regionId) errors.regionId = "Region is required";
    if (!formData.zoneId) errors.zoneId = "Zone is required";
    if (!formData.woredaId || isNaN(Number(formData.woredaId)))
      errors.woredaId = "Woreda is required";
    return errors;
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();

    try {
      if (imageFile) {
        formDataToSend.append("profilePicture", imageFile, imageFile.name);
      } else if (currentAgent || userData.user.profilePicture) {
        // Append existing profile picture if no new image is provided
        formDataToSend.append("profilePicture", userData?.user.profilePicture);
      }

      // Append other form data
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (currentAgent) {
        formDataToSend.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });

        await updateAgent(currentAgent.id, formDataToSend); // Send FormData
        navigate("/agents");
        MyToast("Agent updated successfully", "success");
      } else {
        await createAgent(formDataToSend); // Send FormData
        MyToast("Agent created successfully", "success");
        onClose();
      }
    } catch (error) {
      setFormErrors({ ...formErrors, general: error.message });
      // await setToast({ message: error.message, type: "error" });
      // onClose();
    } finally {
      // resetForm();
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      sex: "Male",
      profession: "",
      educationLevel: "",
      agentType: "",
      languages: [],
      phoneNumber: "",
      email: "",
      regionId: "",
      zoneId: "",
      woredaId: "",
      currentLanguageInput: "",
    });
    setSelectedRegion("");
    setSelectedZone("");
    setCurrentAgent(null);
    setFormErrors({});
  };

  const zones = selectedRegion
    ? regions.find((r) => r.id === Number(selectedRegion))?.Zones || []
    : [];

  const woredas = selectedZone
    ? zones.find((z) => z.id === Number(selectedZone))?.woredas || []
    : selectedRegion
    ? regions
        .find((r) => r.id === Number(selectedRegion))
        ?.Zones?.flatMap((z) => z.woredas) || []
    : regions?.flatMap((r) => r.Zones.flatMap((z) => z.woredas));

  return (
    <div
      className="min-h-screen bg-gray-50 p-4 md:p-6"
      onClick={() => {
        setFormErrors({ ...formErrors, general: "" });
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <AnimatePresence>
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
                  <h2 className="text-xl font-semibold text-[#3a4253] ">
                    {currentAgent ? "Edit " : " Become an Agent  "}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      onClose();
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-[#3a4253]"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                src={
                                  imagePreview || userData?.user?.profilePicture
                                }
                                alt="Preview"
                                className="w-full h-full rounded-full object-cover"
                              />
                              <div className="absolute bottom-0 right-0 mb-2 mr-2">
                                <label
                                  htmlFor="file-upload"
                                  className="cursor-pointer"
                                >
                                  {!currentAgent && (
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
                                  )}
                                  <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={currentAgent} // Disable if not editing an agent
                                    // Your function to handle the image change
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

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Full Name*
                      </label>
                      <input
                        disabled
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.fullName
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        required
                      />
                      {formErrors.fullName && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Gender*
                      </label>
                      <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Profession*
                      </label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.profession
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        required
                      />
                      {formErrors.profession && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.profession}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Education Level*
                      </label>
                      <input
                        type="text"
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.educationLevel
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        required
                      />
                      {formErrors.educationLevel && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.educationLevel}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Agent Type*
                      </label>
                      <select
                        name="agentType"
                        value={formData.agentType}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                        required
                      >
                        {" "}
                        <option value="" disabled>select agent type</option>
                        <option value="Region">Region</option>
                        <option value="Zone">Zone</option>
                        <option value="Woreda">Woreda</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        required
                        disabled
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Email*
                      </label>
                      <input
                        disabled
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Region*
                      </label>
                      <select
                        name="regionId"
                        value={selectedRegion}
                        onChange={handleRegionChange}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.regionId
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        required
                      >
                        <option value="">Select Region</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.regionId && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.regionId}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Zone*
                      </label>
                      <select
                        name="zoneId"
                        value={selectedZone}
                        onChange={handleZoneChange}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.zoneId
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        required
                        disabled={!selectedRegion}
                      >
                        <option value="">Select Zone</option>
                        {zones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.zoneId && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.zoneId}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Woreda*
                      </label>
                      <select
                        name="woredaId"
                        value={formData.woredaId}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.woredaId
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        required
                        disabled={!selectedZone}
                      >
                        <option value="">Select Woreda</option>
                        {woredas.map((woreda) => (
                          <option key={woreda?.id} value={woreda?.id}>
                            {woreda?.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.woredaId && (
                        <p className="text-xs text-red-500 mt-1">
                          {formErrors.woredaId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#3a4253] mb-1">
                      Languages*
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={formData.currentLanguageInput}
                        onChange={handleLanguageInputChange}
                        className={`flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 ${
                          formErrors.languages
                            ? "border-red-500"
                            : "border-gray-300 focus:ring-[#EB6407]"
                        }`}
                        placeholder="Add a language (e.g., Amharic)"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={addLanguage}
                        className="px-3 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600]"
                      >
                        Add
                      </motion.button>
                    </div>
                    {formErrors.languages && (
                      <p className="text-xs text-red-500 mb-2">
                        {formErrors.languages}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((language) => (
                        <div
                          key={language}
                          className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                        >
                          <span className="text-sm text-[#3a4253]">
                            {language}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            type="button"
                            onClick={() => removeLanguage(language)}
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {formErrors.general && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {formErrors.general}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        // setIsModalOpen(false);
                        onClose();

                        resetForm();
                      }}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 rounded-md text-[#3a4253] hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] disabled:opacity-50 flex items-center"
                    >
                      {isSubmitting && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      {currentAgent ? "Update " : "submit"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
          {/* )} */}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AgentApplication;
