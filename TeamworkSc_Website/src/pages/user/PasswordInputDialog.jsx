import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleInputPassword } from "../../features/dialogSlice";
import { chagneVerifiedPassword } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Ensure you import toast

const PasswordInputDialog = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const dialog = useSelector((state) => state.dialogData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async () => {
    setError(""); // Clear previous errors

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      // Send the email and passwords to the backend
      console.log(dialog.email, newPassword, confirmNewPassword);
      await chagneVerifiedPassword(
        dialog.email,
        newPassword,
        confirmNewPassword
      );

      toast.success("Password reset successfully completed!", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: "#28a745",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "16px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        },
      });
      dispatch(toggleInputPassword(false));
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while changing the password."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    dispatch(toggleInputPassword(false));
  };

  return (
    <div className="py-20 mx-auto rounded-lg max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <button
          onClick={closeDialog}
          className="text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
      </div>
      <div className="mb-4 min-w-72">
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmNewPassword}
            onChange={(e) => setconfirmNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
        {/* Error message */}
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full p-3 text-white rounded ${
          loading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
        } transition`}
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </div>
  );
};

export default PasswordInputDialog;
