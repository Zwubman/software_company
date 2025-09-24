import React, { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loading } from "../../features/userSlice";

const TopBar = ({ activeTab, sidebarOpen, navItems }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const username = "AdminUser"; // Replace with actual username from auth context or props
  const dispatch = useDispatch();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(loading(false));
    navigate("/");
  };

  const { user } = useSelector((state) => state.userData);

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <header className="bg-white shadow-sm z-5">
      <div className="flex items-center justify-between p-4">
        <div className="hidden md:block text-gray-600">
          {/* <p className="text-sm">Welcome, {username}!</p>
          <p className="text-xs">Your role: {user?.role}</p> */}
        </div>
        <div className="flex items-center">
          <h1 className="text-3xl font-extrabold text-orange-600 hidden md:block tracking-widest ">
            Welcome to Teamwork IT Solution
          </h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-[#3a4253] hover:text-[#EB6407] p-2 rounded-lg transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="h-8 w-8 rounded-full bg-[#EB6407] flex items-center justify-center text-white font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <span className="text-gray-700 text-base font-medium">
                {user?.role == "admin"
                  ? "Super Admin"
                  : user?.role == "regionAdmin"
                  ? "Regional Admin"
                  : user?.role == "zoneAdmin"
                  ? "Zone Admin"
                  : user.role == "woredaAdmin"
                  ? "Woreda Admin"
                  : "Agent"}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e8eaed] z-50"
              >
                <div className="py-1">
                  <motion.button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fee8d9] hover:text-[#EB6407] transition-colors duration-200"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {isLoggingOut ? (
                      <svg
                        className="animate-spin h-4 w-4 text-[#EB6407]"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
