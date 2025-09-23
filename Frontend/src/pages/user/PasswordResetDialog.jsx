import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  toggleResetPassword,
  toggleVerifyPasswordOtp,
  setEmail,
} from "../../features/dialogSlice";
import { resetPassword } from "../../services/UserService";
import toast from "react-hot-toast";

const PasswordResetDialog = () => {
  const [email, setEmail1] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      setLoading(true);
      await resetPassword(email);
      dispatch(toggleResetPassword(false));
      dispatch(setEmail(email));
      toast.success(`Reset OTP sent to ${email}. Check your email!`, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: "#28a745", // Bright green background
          color: "#ffffff", // White text
          borderRadius: "8px",
          padding: "16px",
          fontSize: "16px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow
        },
      });
      dispatch(toggleVerifyPasswordOtp(true));
    } catch (error) {
      if (error.message === "User with this email does not exist") {
        setError("User with this email does not exist.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(toggleResetPassword(false)); // Close the dialog
  };

  return (
    <div className="bg-white rounded-lg pb-8 pt-16 px-4 min-h-98">
      <h2 className="text-lg font-semibold">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail1(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
        <button
          type="submit"
          className={`mt-4 text-white px-4 py-2 rounded ${
            loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
          }`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      <button onClick={handleClose} className="mt-4 text-red-500">
        Close
      </button>
    </div>
  );
};

export default PasswordResetDialog;
