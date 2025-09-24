import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // Import Lucide icons
import { changePassword } from "../../services/UserService";

const isValidPassword = (password) => {
  const lengthCheck = password.length >= 8;
  const uppercaseCheck = /[A-Z]/.test(password);
  const lowercaseCheck = /[a-z]/.test(password);
  const numberCheck = /\d/.test(password);
  const specialCharCheck = /[!@#$%^&*]/.test(password);

  return (
    lengthCheck &&
    uppercaseCheck &&
    lowercaseCheck &&
    numberCheck &&
    specialCharCheck
  );
};

const ChangePasswordComponent = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showconfirmNewPassword, setShowconfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setError(""); // Reset error state

    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    if (!isValidPassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
      );
      setLoading(false);
      return;
    }

    try {
      await changePassword(currentPassword, newPassword, confirmNewPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setconfirmNewPassword("");
    } catch (err) {
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">
        Change Password
      </h2>
      {error && <p className="text-red-500 text-sm mb-2 mt-1">{error}</p>}{" "}
      {/* Show error in red */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Current Password:</label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showCurrentPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">New Password:</label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showNewPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">
          Confirm New Password:
        </label>
        <div className="relative">
          <input
            type={showconfirmNewPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => {
              setconfirmNewPassword(e.target.value);
              setError("");
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
          <button
            type="button"
            onClick={() => setShowconfirmNewPassword(!showconfirmNewPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            {showconfirmNewPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      <button
        onClick={handleChangePassword}
        className={`bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </div>
  );
};

export default ChangePasswordComponent;
