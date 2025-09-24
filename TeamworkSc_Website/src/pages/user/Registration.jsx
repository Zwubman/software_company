import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toogleOtpConfirmDialog } from "../../features/dialogSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import PhoneNumber from "../../components/UI/PhoneNumber";
import { Loader2 } from "lucide-react";

const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.userData);
  const [error, setError] = useState("");

  const initialValues = {
    email: "",
    phone: "", // Start as empty, will be set by PhoneNumber
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phone: Yup.string().required("Phone number is required"), // Add validation for phone
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true); // Start loading
    try {
      await dispatch({
        type: "user/register",
        formData: values,
        handleConfirmOtp,
        setIsLoading,
        setError,
      });
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false); // Stop loading
      setSubmitting(false);
    }
  };

  const handleConfirmOtp = () => {
    dispatch(toogleOtpConfirmDialog(true));
  };

  const handlePhoneChange = (phone, setFieldValue) => {
    // Update Formik's state directly
    setFieldValue("phone", phone);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8"
      onClick={() => setError("")}
    >
      <Navbar />
      <div className="w-full max-w-[90rem]">
        <motion.div
          className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500 mb-6">
            Create Your Account
          </h2>
        </motion.div>
        <motion.div
          className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-10">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm sm:text-base font-medium text-gray-900"
                      >
                        First Name
                      </label>
                      <div className="mt-1">
                        <Field
                          id="firstName"
                          name="firstName"
                          type="text"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm sm:text-base font-medium text-gray-900"
                      >
                        Last Name
                      </label>
                      <div className="mt-1">
                        <Field
                          id="lastName"
                          name="lastName"
                          type="text"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"

                          // className="block w-full rounded-lg border border-gray-300 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="block  justify-items-center  sm:flex justify-between">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm sm:text-base font-medium text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-lg border border-gray-300 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div className="">
                      <label
                        htmlFor="phone"
                        className="block text-sm sm:text-base font-medium text-gray-900"
                      >
                        Phone Number
                      </label>
                      <div className="mt-1 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent">
                        <PhoneNumber
                          onChange={(phone) =>
                            handlePhoneChange(phone, setFieldValue)
                          } // Pass setFieldValue here
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-red-500 text-xs sm:text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm sm:text-base font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-xs sm:text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm sm:text-base font-medium text-gray-900"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-1 relative">
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
                      />
                      {error && <div className="text-red-700">{error}</div>}
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="text-red-500 text-xs sm:text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={user.loading2}
                      className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                        user.loading2
                          ? "bg-orange-300 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      }`}
                    >
                      {user.loading2 ? (
                        <div className="flex items-center">
                          <Loader2 className="animate-spin h-5 w-5 mr-3" />
                          <span>Registering...</span>
                        </div>
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center">
              <span className="text-sm sm:text-base text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-semibold text-orange-400 hover:text-orange-500 transition-colors duration-200 focus:outline-none"
                >
                  Sign in
                </button>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Registration;
