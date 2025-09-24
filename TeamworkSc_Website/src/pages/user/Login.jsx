import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import PasswordResetDialog from "./PasswordResetDialog";
import { toggleResetPassword } from "../../features/dialogSlice";

const Login = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userData);
  const route = useSelector((state) => state.routerData.route);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
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
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(11, "Password must be less than 11 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      await dispatch({
        type: "user/login",
        formData: values,
        callback,
        setIsLoading,
        setError,
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  const callback = () => {
    setIsLoading(false);
    user?.role == "admin" ? navigate("/admin") : navigate(route || "/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      onClick={() => setError("")}
    >
      <Navbar />
      <div className="max-w-xl w-full space-y-8 relative bg-white p-10 rounded-2xl shadow-2xl">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <h2 className="text-4xl font-extrabold text-orange-500 mb-6">
            Welcome Back
          </h2>
          <p className="text-base text-gray-500 mb-8">
            Sign in to your account
          </p>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-lg border border-gray-300 px-3 py-3 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"

                    // className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 text-base"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-base font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-3 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"

                      // className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 text-base"
                    />
                    {error && <div className=" text-red-700  ">{error}</div>}{" "}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={20} />
                      ) : (
                        <FaEye size={20} />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                    isLoading
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="flex items-center justify-between text-base">
                  <button
                    onClick={() => dispatch(toggleResetPassword(true))}
                    className="font-medium text-orange-500 hover:text-orange-600 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                  <div className="text-gray-500">
                    No account?
                    <a
                      onClick={() => navigate("/signup")}
                      className="ml-2 font-medium text-orange-500 hover:text-orange-600 transition-colors duration-200 cursor-pointer"
                    >
                      Sign up
                    </a>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
