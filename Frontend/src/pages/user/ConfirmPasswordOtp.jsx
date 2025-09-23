import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleInputPassword,
  toggleVerifyPasswordOtp,
} from "../../features/dialogSlice";
import { useNavigate } from "react-router-dom";
import { verifyPasswordOtp } from "../../services/UserService";
import toast from "react-hot-toast";

const ConfirmPasswordOtp = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true); // State for dialog visibility
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  const dialog = useSelector((state) => state.dialogData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    otp: "",
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^[0-9]+$/, "OTP must be only digits")
      .length(6, "OTP must be exactly 6 digits")
      .required("OTP is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(""); // Clear previous errors
    setIsLoading(true); // Set loading state to true

    try {
      await verifyPasswordOtp(dialog.email, values.otp); // Use values.otp
      dispatch(toggleVerifyPasswordOtp(false));
      dispatch(toggleInputPassword(true));
      toast.success("OTP verified! please enter your new password!", {
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
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false); // Reset loading state
      setSubmitting(false); // Reset form submission state
    }
  };

  const handleOtpDialog = () => {
    dispatch(toggleVerifyPasswordOtp(false));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDialogOpen(false);
          dispatch(toggleVerifyPasswordOtp(false)); // Close the dialog
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer on unmount
  }, [dispatch]);

  if (!isDialogOpen) {
    return null; // Don't render anything if the dialog is closed
  }

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div
      className="flex flex-col px-8 sm:px-12 lg:px-16 bg-white w-full max-w-7xl rounded-lg"
      onClick={() => setError("")}
    >
      <button
        onClick={handleOtpDialog}
        className="absolute right-4 top-4 border-none bg-transparent cursor-pointer text-xl mr-4 mt-2 text-red-400 hover:text-red-600"
      >
        ✕
      </button>
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-xl lg:max-w-3xl mt-8 text-xl"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-center text-2xl lg:text-4xl font-bold text-orange-500 mb-8">
          Verify OTP
        </h2>
        <p className="text-center text-lg text-gray-600 mb-4">
          Time left: {formatTimeLeft(timeLeft)} minutes
        </p>
      </motion.div>
      <motion.div
        className="mb-12"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="py-12 px-6 mx-0 shadow-lg rounded-xl">
          <p className="text-center text-gray-600 mb-8">
            Please enter the 6-digit OTP sent to your email
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-8">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-base font-medium leading-6 text-gray-900"
                  >
                    Enter OTP
                  </label>
                  <div className="mt-3">
                    <Field
                      id="otp"
                      name="otp"
                      type="text"
                      maxLength="6"
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-orange-400 focus:border-orange-400 text-left tracking-widest"
                    />
                    {error && <div className="text-red-700">{error}</div>}
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting} // Disable button if loading or submitting
                    className={`flex w-full justify-center rounded-lg px-4 py-4 text-base font-semibold leading-6 text-white shadow-sm transition-colors duration-200 ${
                      isLoading || isSubmitting
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-400 hover:bg-orange-500 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                    }`}
                  >
                    {isLoading || isSubmitting ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-8">
            <span className="text-base text-gray-500">
              Didn't receive OTP?{" "}
              <button
                // onClick={handleResendOtp}
                className="font-semibold leading-6 text-orange-400 hover:text-orange-500 transition-colors duration-200 cursor-pointer"
              >
                {isLoading ? "Waiting..." : "Resend OTP"}
              </button>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmPasswordOtp;
