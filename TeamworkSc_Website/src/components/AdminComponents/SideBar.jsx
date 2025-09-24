import React, { useState, useRef, useEffect } from "react";

import {
  Users,
  Briefcase,
  Newspaper,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  Menu,
  ChevronDown,
  LocateIcon,
  ListOrdered,
  ArrowLeft,
  FileText,
  PersonStandingIcon,
  MessageCircle,
  User,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Avatar12 from "../profile/Avatar";
import { useSelector } from "react-redux";

const SideBar = ({
  sidebarOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
  navItems,
}) => {
  const [openSubMenu, setOpenSubMenu] = useState("dashboard");
  const { user } = useSelector((state) => state.userData);

  const toggleSubMenu = (name) => {
    setOpenSubMenu(openSubMenu === name ? null : name);
  };

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      toggleSubMenu(item.name);
    } else {
      setActiveTab(item.name);
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    }
  };

  const handleSubMenuClick = (subItem) => {
    setActiveTab(subItem.name);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  const menuItems = [
    user.role === "admin" && {
      name: "dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      subMenu: [
        {
          name: "users1",
          label: "Users",
          link: "/dashboard/users",
          icon: <Users className="w-5 h-5" />,
        },
        {
          name: "jobs1",
          label: "Jobs",
          link: "/dashboard/jobs1",
          icon: <Briefcase className="w-5 h-5" />,
        },
        {
          name: "orders1",
          label: "Service Orders",
          link: "/dashboard/orders",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          name: "news1",
          label: "News",
          link: "/dashboard/news",
          icon: <Newspaper className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "report",
      icon: <FileText className="w-5 h-5" />,
      label: "Report",
    },
    { name: "agents", icon: <Calendar className="w-5 h-5" />, label: "Agents" },
    {
      name: "orders",
      icon: <ListOrdered className="w-5 h-5" />,
      label: "Orders",
    },
    {
      name: "partners",
      icon: <User className="w-5 h-5" />,
      label: "Partners",
    },

    user.role === "admin" && {
      name: "services",
      icon: <Briefcase className="w-5 h-5" />,
      label: "Services",
    },
    user.role === "admin" && {
      name: "about",
      icon: <PersonStandingIcon className="w-5 h-5" />,
      label: "About",
    },

    user.role === "admin" && {
      name: "posts",
      icon: <Newspaper className="w-5 h-5" />,
      label: "Posts",
      subMenu: [
        {
          name: "news",
          label: "News",
          link: "/posts/news",
          icon: <Newspaper className="w-5 h-5" />,
        },
        {
          name: "events",
          label: "Events",
          link: "/posts/events",
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          name: "jobs",
          label: "Jobs",
          link: "/posts/jobs",
          icon: <Briefcase className="w-5 h-5" />,
        },
      ],
    },


    user.role === "admin" && {
      name: "location",
      icon: <LocateIcon className="w-5 h-5" />,
      label: "location",
    },
    user.role === "admin" && {
      name: "feadbacks",
      icon: <MessageSquare className="w-5 h-5" />,
      label: "Feedbacks",
    },

    user.role === "admin" && {
      name: "users",
      icon: <Users className="w-5 h-5" />,
      label: "Users",
    },
    user.role === "admin" && {
      name: "contactUs",
      icon: <MessageCircle className="w-5 h-5" />,
      label: " Messages",
    },
    user.role === "admin" && {
      name: "teams",
      icon: <Users className="w-5 h-5" />,
      label: " Our Teams",
    },
  ];

  const sidebarVariants = {
    open: {
      width: "256px",
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    },
    closed: {
      width: "64px",
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        delay: 0.1, // Add a slight delay when closing
      },
    },
  };
  const fadeInOut = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };

  return (
    <>
      <motion.button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-50 text-[#2e3442] hover:text-[#EB6407] focus:outline-none p-2 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center ${
          sidebarOpen ? "hidden" : ""
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu className="w-6 h-6 text-[#EB6407]" />
      </motion.button>
      <motion.div
        className={`bg-[#19274a] text-white flex flex-col h-full fixed sm:static z-40 ${
          sidebarOpen ? "" : "hidden md:flex"
        }`}
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        initial={false}
      >
        <motion.div
          className="p-4 border-b border-[#3a4253] relative flex justify-center"
          {...fadeInOut}
        >
          <div className="flex flex-col items-center space-y-2">
            {sidebarOpen && (
              <motion.img
                src="/assets/logo1.png"
                alt="Logo"
                className="w-20 h-20 rounded-full object-cover shadow-xl ring-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: 1.1 }}
              />
            )}
            {sidebarOpen && (
              <motion.h1
                className="text-lg font-semibold text-white tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Teamwork IT Solution
              </motion.h1>
            )}
          </div>
          <motion.button
            onClick={toggleSidebar}
            className="absolute top-2 right-4 text-white hover:text-[#EB6407] focus:outline-none p-2 rounded-lg bg-white/10 backdrop-blur-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {sidebarOpen ? (
              <ArrowLeft className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5 bold justify-self-center" />
            )}
          </motion.button>
        </motion.div>

        <nav className="flex-1 overflow-y-auto">
          <motion.ul
            className="p-2 space-y-1"
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {menuItems.map((item, index) => (
              <motion.li
                key={item.name}
                className={`mb-1 ${
                  activeTab === item.name ? "bg-[#283c6d] text-white" : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 `}
                  whileHover={{ x: 5, backgroundColor: "#283c6d" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <motion.span
                      className="mr-3"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </div>
                  {sidebarOpen && item.subMenu && (
                    <motion.div
                      animate={{ rotate: openSubMenu === item.name ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {sidebarOpen && item.subMenu && openSubMenu === item.name && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="pl-8 pt-1 space-y-1"
                    >
                      {item.subMenu.map((subItem, subIndex) => (
                        <motion.li
                          key={subItem.name}
                          className="border-l border-[#e8eaed]/30"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.1 }}
                        >
                          <motion.button
                            onClick={() => handleSubMenuClick(subItem)}
                            className={`w-full text-left flex items-center p-2 text-sm rounded-r-lg transition-colors duration-200 ${
                              activeTab === subItem.name
                                ? " bg-[#283c6d]"
                                : " hover:bg-[#283c6d]"
                            }`}
                            whileHover={{ x: 5, color: "#" }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {subItem.icon} &nbsp;&nbsp;&nbsp;{subItem.label}
                          </motion.button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
            <motion.li
              className="border-t border-[#3a4253] my-2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.ul>{" "}
          <Avatar12
            setActiveTab={setActiveTab}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        </nav>
      </motion.div>
    </>
  );
};

export default SideBar;
