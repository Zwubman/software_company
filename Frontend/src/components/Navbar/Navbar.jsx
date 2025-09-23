import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp } from "react-feather";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import {
  toogleLoginDialog,
  toogleRegisterDialog,
} from "../../features/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaBriefcase,
  FaUsers,
  FaPhoneAlt,
  FaListUl,
  FaChevronRight,
  FaHandshake,
} from "react-icons/fa";
import { addrouteToStore } from "../../features/routeSlice";
import TopBar from "../AdminComponents/TopBar";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangOptions, setShowLangOptions] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.userData
  );

  const myApplications = (id) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/my-applications/${id}`);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setShowLangOptions(false);
    setActiveSubmenu(null);
  };

  const handleLoginDialog = () => {
    navigate("/login");
    // dispatch(toogleLoginDialog(true));
  };

  const handleRegisterDialog = () => {
    navigate("/signup");
    // dispatch(toogleRegisterDialog(true));
  };
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const getLinkClassName = (path, isExact = false) => {
    const baseClasses =
      "relative flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium tracking-wide transition-all duration-300 group";
    const isActive = isExact
      ? location.pathname === path
      : location.pathname.startsWith(path);

    return isActive
      ? `${baseClasses} text-[#EB6407] [text-shadow:_0_0_8px_rgba(235,100,7,0.3)]`
      : `${baseClasses} text-[#3a4253] hover:text-[#EB6407]`;
  };

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setShowLangOptions(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({
      type: "user/authenticated",
      payload: { isAuthenticated: false },
    });
    dispatch(addrouteToStore(""));

    navigate("/");

    // window.location.reload();
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setShowLangOptions(false);
  };

  const languageNames = { en: "EN", am: "አማ" };

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm border-[#e8eaed] transition-shadow duration-300  "
      }`}
    >
      <style>
        {`
          @keyframes slide-down {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          @keyframes pulse-underline {
            0% { width: 0; opacity: 0.6; }
            50% { width: 100%; opacity: 1; }
            100% { width: 100%; opacity: 0.8; }
          }
          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
          .animate-bounce:hover {
            animation: bounce 0.4s ease-in-out;
          }
          .underline-animation::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right, #EB6407, #d45605);
            transition: width 0.3s ease, opacity 0.3s ease;
          }
          .underline-animation:hover::after {
            width: 100%;
            animation: pulse-underline 0.6s ease-in-out;
          }
          .mega-item:hover .preview-image {
            transform: scale(1.05);
            opacity: 1;
          }
          .progress-bar {
            height: 2px;
            background: linear-gradient(to right, #EB6407, #d45605);
            transition: width 0.3s ease;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-4 ">
        <div className="flex justify-between items-center h-12 md:h-20 ">
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={handleLinkClick}
          >
            <img
              src="/assets/logo1.png"
              alt="Teamwork Logo"
              className="w-10 h-10 rounded-full border-2 border-[#3a4253] group-hover:border-[#EB6407] group-hover:scale-110 "
            />
            <span className="text-[#3a4253] font-bold text-2xl tracking-wider group-hover:text-[#EB6407] hidden lg:block">
              Teamwork It Solution!
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 ">
            <Link
              to="/"
              className={`${getLinkClassName("/", true)} underline-animation`}
              onClick={handleLinkClick}
            >
              {t("Home")}
            </Link>

            <Link
              to="/about-us"
              className={`${getLinkClassName("/about-us")} underline-animation`}
              onClick={handleLinkClick}
            >
              {t("About us")}
            </Link>

            <Link
              to="/service"
              className={`${getLinkClassName("/service")} underline-animation`}
              onClick={handleLinkClick}
            >
              {t("Services")}
            </Link>

            {/* Enhanced Mega Menu */}
            <div className="relative">
              <button
                onClick={() => toggleSubmenu("posts")}
                className={`${getLinkClassName(
                  "/posts"
                )} flex items-center underline-animation`}
                aria-expanded={activeSubmenu === "posts"}
                aria-controls="mega-menu"
              >
                {t("Posts")}
                {activeSubmenu === "posts" ? (
                  <ChevronUp
                    size={18}
                    className="ml-1 transition-transform duration-300"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="ml-1 transition-transform duration-300"
                  />
                )}
              </button>

              {activeSubmenu === "posts" && (
                <div
                  id="mega-menu"
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[640px] bg-white rounded-2xl shadow-xl border border-[#e8eaed] p-6 grid grid-cols-2 gap-6 animate-fade-in z-50"
                >
                  <div className="col-span-1">
                    <h3 className="text-[#3a4253] font-semibold mb-3 border-l-4 border-[#EB6407] pl-2">
                      {t("Posts")}
                    </h3>
                    <Link
                      to="/posts/news"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#fff5ef] rounded-lg group mega-item transition-all duration-200"
                      onClick={handleLinkClick}
                    >
                      <div className="relative p-2 bg-[#fee8d9] rounded-lg group-hover:bg-[#EB6407] transition-colors duration-300">
                        <FaNewspaper
                          size={16}
                          className="text-[#EB6407] group-hover:text-white"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 preview-image transition-all duration-300"
                          style={{
                            background:
                              "url(/assets/news-preview.jpg) center/cover",
                          }}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium text-[#3a4253] group-hover:text-[#EB6407]">
                          {t("News")}
                        </p>
                        <p className="text-sm text-[#7b8494] group-hover:text-[#EB6407]/80">
                          {t("Latest updates & press releases")}
                        </p>
                      </div>
                      <FaChevronRight
                        size={12}
                        className="ml-auto mt-1 text-[#c4c8d0] group-hover:text-[#EB6407]"
                      />
                    </Link>
                    <Link
                      to="/posts/events"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#fff5ef] rounded-lg group mega-item transition-all duration-200"
                      onClick={handleLinkClick}
                    >
                      <div className="relative p-2 bg-[#fee8d9] rounded-lg group-hover:bg-[#EB6407] transition-colors duration-300">
                        <FaCalendarAlt
                          size={16}
                          className="text-[#EB6407] group-hover:text-white"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 preview-image transition-all duration-300"
                          style={{
                            background:
                              "url(/assets/events-preview.jpg) center/cover",
                          }}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium text-[#3a4253] group-hover:text-[#EB6407]">
                          {t("Events")}
                        </p>
                        <p className="text-sm text-[#7b8494] group-hover:text-[#EB6407]/80">
                          {t("Upcoming webinars and conferences")}
                        </p>
                      </div>
                      <FaChevronRight
                        size={12}
                        className="ml-auto mt-1 text-[#c4c8d0] group-hover:text-[#EB6407]"
                      />
                    </Link>
                    <Link
                      to="/posts/jobs"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#fff5ef] rounded-lg group mega-item transition-all duration-200"
                      onClick={handleLinkClick}
                    >
                      <div className="relative p-2 bg-[#fee8d9] rounded-lg group-hover:bg-[#EB6407] transition-colors duration-300">
                        <FaBriefcase
                          size={16}
                          className="text-[#EB6407] group-hover:text-white"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 preview-image transition-all duration-300"
                          style={{
                            background:
                              "url(/assets/jobs-preview.jpg) center/cover",
                          }}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium text-[#3a4253] group-hover:text-[#EB6407]">
                          {t("Jobs")}
                        </p>
                        <p className="text-sm text-[#7b8494] group-hover:text-[#EB6407]/80">
                          {t("Explore new opportunities")}
                        </p>
                      </div>
                      <FaChevronRight
                        size={12}
                        className="ml-auto mt-1 text-[#c4c8d0] group-hover:text-[#EB6407]"
                      />
                    </Link>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-[#3a4253] font-semibold mb-3 border-l-4 border-[#EB6407] pl-2">
                      More
                    </h3>
                    <Link
                      to="/posts/more/team"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#fff5ef] rounded-lg group mega-item transition-all duration-200"
                      onClick={handleLinkClick}
                    >
                      <div className="relative p-2 bg-[#fee8d9] rounded-lg group-hover:bg-[#EB6407] transition-colors duration-300">
                        <FaUsers
                          size={16}
                          className="text-[#EB6407] group-hover:text-white"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 preview-image transition-all duration-300"
                          style={{
                            background:
                              "url(/assets/team-preview.jpg) center/cover",
                          }}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium text-[#3a4253] group-hover:text-[#EB6407]">
                          {t("Our Team")}
                        </p>
                        <p className="text-sm text-[#7b8494] group-hover:text-[#EB6407]/80">
                          Meet our dedicated professionals
                        </p>
                      </div>
                      <FaChevronRight
                        size={12}
                        className="ml-auto mt-1 text-[#c4c8d0] group-hover:text-[#EB6407]"
                      />
                    </Link>
                    <Link
                      to="/posts/more/contact us"
                      className="flex items-start gap-3 px-4 py-3 hover:bg-[#fff5ef] rounded-lg group mega-item transition-all duration-200"
                      onClick={handleLinkClick}
                    >
                      <div className="relative p-2 bg-[#fee8d9] rounded-lg group-hover:bg-[#EB6407] transition-colors duration-300">
                        <FaHandshake
                          size={16}
                          className="text-[#EB6407] group-hover:text-white"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-10 preview-image transition-all duration-300"
                          style={{
                            background:
                              "url(/assets/collaborations-preview.jpg) center/cover",
                          }}
                        ></div>
                      </div>
                      <div>
                        <p className="font-medium text-[#3a4253] group-hover:text-[#EB6407]">
                          {t("Contact us")}
                        </p>
                        <p className="text-sm text-[#7b8494] group-hover:text-[#EB6407]/80">
                          Our trusted partners
                        </p>
                      </div>
                      <FaChevronRight
                        size={12}
                        className="ml-auto mt-1 text-[#c4c8d0] group-hover:text-[#EB6407]"
                      />
                    </Link>
                  </div>
                  <div className="col-span-3 border-t border-[#e8eaed] pt-3">
                    <button
                      // to="/posts"
                      className="text-sm font-medium text-[#EB6407] hover:text-[#d45605] flex items-center gap-1 px-4"
                      onClick={() => {
                        navigate("/posts/news");
                      }}
                    >
                      View our news
                      <FaChevronRight size={10} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/agents"
              className={`${getLinkClassName("/agents")} underline-animation`}
              onClick={handleLinkClick}
            >
              {t("Agents")}
            </Link>

            <Link
              to="/partnership"
              className={`${getLinkClassName(
                "/partnership"
              )} underline-animation`}
              onClick={handleLinkClick}
            >
              {t("Partnership")}
            </Link>

            <div className="hidden md:block flex-grow w-12 "></div>
            <div className="flex gap-4">
              {isAuthenticated && user.role !== "admin" ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#3a4253] hover:text-[#EB6407] bg-white border border-[#e8eaed] rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#EB6407] focus:ring-offset-2"
                  >
                    <img
                      src={user?.profilePicture || "/assets/teamwork.jpg"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover bg-red-600"
                    />
                    <span className="flex items-center">
                      {user.agentType ? user.agentType + " agent" : user?.role}
                      <svg
                        className="ml-1 w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e8eaed] py-2">
                      <div className="px-4 py-2 border-b border-[#e8eaed]">
                        <span className="block font-medium">{user.name}</span>
                        <p className="text-sm text-[#3a4253]">
                          {user.username}
                        </p>
                        <p className="text-xs text-[#7b8494]">
                          Role: {user.role}
                        </p>
                      </div>
                      <Link
                        to="/settings/1"
                        className="block px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fff5ef] hover:text-[#EB6407]"
                      >
                        Profile
                      </Link>
                      {/* <Link
                        to="/settings/1"
                        className="block px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fff5ef] hover:text-[#EB6407]"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => myApplications(user?.id)}
                        className="w-full text-left px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fff5ef] hover:text-[#EB6407]"
                      >
                        My Job Applications
                      </button>
                      <button
                        onClick={() => navigate("/my-agent-request")}
                        className="w-full text-left px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fff5ef] hover:text-[#EB6407]"
                      >
                        My Agent Request
                      </button>
                      <button
                        onClick={() => navigate("/my-orders")}
                        className="w-full text-left px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fff5ef] hover:text-[#EB6407]"
                      >
                        My Order Request
                      </button>
                      <button
                        onClick={() => navigate("/my-partnership")}
                        className="w-full text-left px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fff5ef] hover:text-[#EB6407]"
                      >
                        My Partnership Request
                      </button> */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fff5ef] hover:text-[#EB6407]"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLoginDialog}
                    className="px-4 py-2 text-sm font-medium text-[#EB6407] border-2 border-[#EB6407] hover:text-white hover:bg-[#EB6407] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#EB6407] focus:ring-offset-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleRegisterDialog}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#EB6407] hover:bg-[#d45605] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#EB6407] focus:ring-offset-2"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#3a4253] hover:text-[#EB6407] hover:bg-[#fff5ef] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div
        className="progress-bar"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-[#e8eaed] animate-slide-down"
        >
          <div className="flex flex-col px-2 py-3 space-y-1">
            <Link
              to="/"
              className={`${getLinkClassName(
                "/",
                true
              )} mx-2 underline-animation`}
              onClick={handleLinkClick}
            >
              {t("Home")}
            </Link>
            <Link
              to="/about-us"
              className={`${getLinkClassName(
                "/about-us"
              )} mx-2 underline-animation`}
              onClick={handleLinkClick}
            >
              {t("About us")}
            </Link>
            <Link
              to="/service"
              className={`${getLinkClassName(
                "/service"
              )} mx-2 underline-animation`}
              onClick={handleLinkClick}
            >
              {t("Services")}
            </Link>
            <div className="mx-2">
              <button
                onClick={() => toggleSubmenu("mobile-posts")}
                className={`${getLinkClassName(
                  "/posts"
                )} w-full flex justify-between items-center underline-animation`}
                aria-expanded={activeSubmenu === "mobile-posts"}
              >
                <span>{t("Posts")}</span>
                {activeSubmenu === "mobile-posts" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {activeSubmenu === "mobile-posts" && (
                <div className="ml-6 mt-1 space-y-1 bg-[#f8fafc] rounded-lg p-2 animate-fade-in">
                  <Link
                    to="/posts/news"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#3a4253] hover:text-[#EB6407] hover:bg-[#fff5ef] rounded-lg"
                    onClick={handleLinkClick}
                  >
                    <FaNewspaper size={14} className="text-[#EB6407]" />
                    {t("News")}
                  </Link>

                  <Link
                    to="/posts/events"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#3a4253] hover:text-[#EB6407] hover:bg-[#fff5ef] rounded-lg"
                    onClick={handleLinkClick}
                  >
                    <FaCalendarAlt size={14} className="text-[#EB6407]" />
                    {t("Events")}
                  </Link>

                  <Link
                    to="/posts/jobs"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#3a4253] hover:text-[#EB6407] hover:bg-[#fff5ef] rounded-lg"
                    onClick={handleLinkClick}
                  >
                    <FaBriefcase size={14} className="text-[#EB6407]" />
                    {t("Jobs")}
                  </Link>

                  <Link
                    to="/posts/more/team"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#3a4253] hover:text-[#EB6407] hover:bg-[#fff5ef] rounded-lg"
                    onClick={handleLinkClick}
                  >
                    <FaUsers size={14} className="text-[#EB6407]" />
                    {t("Team")}
                  </Link>

                  <Link
                    to="/posts/more/contact us"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#3a4253] hover:text-[#EB6407] hover:bg-[#fff5ef] rounded-lg"
                    onClick={handleLinkClick}
                  >
                    <FaPhoneAlt size={14} className="text-[#EB6407]" />
                    {t("Contact us")}
                  </Link>

                  <Link
                    to="/posts/news"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-[#3a4253] hover:text-[#EB6407] hover:bg-[#fff5ef] rounded-lg"
                    onClick={handleLinkClick}
                  >
                    <FaListUl size={14} className="text-[#EB6407]" />
                    {t("View all Posts")}
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/agents"
              className={`${getLinkClassName(
                "/agents"
              )} mx-2 underline-animation`}
              onClick={handleLinkClick}
            >
              {t("Agents")}
            </Link>
            <Link
              to="/partnership"
              className={`${getLinkClassName(
                "/partnership"
              )} mx-2 underline-animation`}
              onClick={handleLinkClick}
            >
              {t("Partnership")}
            </Link>
            {isAuthenticated && user.role !== "admin" ? (
              <div>
                <Link
                  to="/settings/1"
                  className={`${getLinkClassName(
                    "/settings/1"
                  )} mx-2 underline-animation`}
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="block mx-2 bg-orange-500 text-white w-full my-2  justify-start py-2 rounded hover:bg-orange-600 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleRegisterDialog}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#EB6407] hover:bg-[#d45605] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#EB6407] focus:ring-offset-2"
                >
                  Sign Up
                </button>{" "}
                <button
                  onClick={handleLoginDialog}
                  className="px-4 py-2 text-sm font-medium text-[#EB6407] border-2 border-[#EB6407] hover:text-white hover:bg-[#EB6407] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#EB6407] focus:ring-offset-2"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
