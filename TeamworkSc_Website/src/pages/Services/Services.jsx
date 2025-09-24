import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../../components/Footer/Footer";
import {
  Code,
  Globe,
  Briefcase,
  Users,
  UserPlus,
  Globe2,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar/Navbar";
import { getAllServices } from "../../services/ServiceService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderApplication from "../order/OrderApplication";
import { addrouteToStore } from "../../features/routeSlice";
import ServiceDetail from "./ServiceDetail";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const Services = () => {
  const [services, setServices] = useState([]);
  const [expandedServiceId, setExpandedServiceId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [isSeriviceDetail, setServiceDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState({});
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  // Define icons mapping
  const iconMap = {
    "Custom Software Development": (
      <Code className="w-10 h-10 text-[#EB6407] group-hover:text-white" />
    ),
    "Web Development": (
      <Globe className="w-10 h-10 text-[#EB6407] group-hover:text-white" />
    ),
    "IT Consulting": (
      <Briefcase className="w-10 h-10 text-[#EB6407] group-hover:text-white" />
    ),
    // Add default icon for new services
    default: (
      <Globe className="w-10 h-10 text-[#EB6407] group-hover:text-white" />
    ), // Default icon
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getAllServices();
      const fetchedServices = response?.services?.services || [];
      // Map fetched services to include icons
      const servicesWithIcons = fetchedServices.map((service) => ({
        ...service,
        icon: iconMap[service.title] || iconMap.default, // Use default icon if title not found
      }));
      setServices(servicesWithIcons);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAdded = () => {
    // alert("Order created successfully");
  };

  const checkUser = (id, name) => {
    if (isAuthenticated) {
      setServiceId(id);
      setServiceName(name);
      setShowModal(true);
    } else {
      // service
      dispatch(addrouteToStore("/service"));
      navigate("/login");
    }
  };

  const stats = [
    {
      value: 208,
      label: t("New Customers"),
      icon: <UserPlus className="w-12 h-12 text-[#EB6407]" />,
    },
    {
      value: 1567899,
      label: t("Existing Customers"),
      icon: <Users className="w-12 h-12 text-[#EB6407]" />,
    },
    {
      value: 32256,
      label: t("Worldwide Clients"),
      icon: <Globe2 className="w-12 h-12 text-[#EB6407]" />,
    },
  ];

  const handleDetail = (data) => {
    setServiceDetail(true);
    setDetailData(data);
  };

  // Counter animation logic
  const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = end / (duration / 16); // 16ms for smooth 60fps
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCount(Math.floor(start));
      }, 16);

      return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
    }),
  };

  return (
    <div className="font-sans antialiased bg-white text-[#3a4253]">
      {/* {user.role !== "agent" && <Navbar />} */}
      <Navbar />
      <div className="min-h-full mb-24 px-4 sm:px-6 lg:px-8 pt-24 max-w-7xl mx-auto">
        {/* General Information Section */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 mb-12 px-4 max-w-7xl mx-auto"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side */}
          <div className="sm:w-1/3">
            <a
              // href=""
              className="text-[#EB6407] text-sm mb-2 font-semibold inline-block"
            >
              Our Best Service →
            </a>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3a4253] tracking-wide">
              High-Quality Services
            </h1>
          </div>
          {/* Right Side */}
          <div className="sm:w-2/3">
            <p className="mt-6 text-lg text-[#2a313b] leading-relaxed">
              Our comprehensive services are designed to meet all your
              healthcare needs, providing expert care, personalized treatment
              plans, and continuous support to ensure your well-being.
            </p>
          </div>
        </motion.div>

        {loading && <Loader />}
        {/* Services Section */}

        {isSeriviceDetail ? (
          <ServiceDetail
            detailData={detailData}
            onClose={() => {
              setServiceDetail(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-xl border border-gray-50 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fee8d9] group-hover:bg-[#EB6407] transition-colors duration-300">
                    {service.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-[#3a4253] tracking-wide">
                    {service.title}
                  </h2>
                </div>
                <div className="flex items-stretch gap-x-4">
                  <div className="w-1 bg-[#EB6407] group-hover:bg-gradient-to-b group-hover:from-[#EB6407] group-hover:to-[#d45605] self-stretch rounded-full animate-pulse group-hover:animate-none transition-colors duration-300" />
                  <div className="flex flex-col flex-1 gap-y-4">
                    <p className="text-gray-600 mt-2">
                      <span
                        className={`block transition-all duration-300 ${
                          expandedServiceId === service.id
                            ? "max-h-full"
                            : "max-h-24 overflow-hidden"
                        }`}
                      >
                        {expandedServiceId === service.id
                          ? service.description
                          : `${service.description.substring(0, 150)}... `}
                      </span>
                      {/* {service.description.length > 150 && ( */}
                        <button
                          onClick={() => {
                            handleDetail(service);
                          }}
                          // onClick={() =>
                          //   setExpandedServiceId(
                          //     expandedServiceId === service.id
                          //       ? null
                          //       : service.id
                          //   )
                          // }
                          className="text-[#EB6407] hover:text-[#C05600] font-semibold"
                        >
                          {/* {expandedServiceId === service.id
                            ? "Show Less"
                            : "Show More"} */}
                          Show More
                        </button>
                      {/* )} */}
                    </p>
                    <motion.button
                      onClick={() => checkUser(service?.id, service?.title)}
                      className="bg-gradient-to-r from-[#EB6407] to-[#d45605] text-white rounded-lg py-2 px-4 text-base font-medium text-center shadow-md hover:bg-gradient-to-r hover:from-[#d45605] hover:to-[#bc5006] w-full focus:ring-2 focus:ring-[#EB6407] focus:ring-offset-2 transition-colors duration-300"
                      aria-label={t("Learn more about") + " " + service.title}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {t("Order our Service")}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {/* {user.role !== "agent" && ( */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-7xl mx-auto text-center p-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center bg-white rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-100"
            variants={statVariants}
            initial="hidden"
            animate="visible"
            custom={index}
          >
            <div className="mb-5 text-[#EB6407] text-5xl drop-shadow-xl">
              {stat.icon}
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 drop-shadow-md tracking-tight">
              <Counter end={stat.value} duration={2000} />
            </h3>
            <p className="mt-3 text-sm md:text-base text-gray-600 tracking-wide text-center">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
      {/* )} */}
      {showModal && (
        <OrderApplication
          onClose={() => setShowModal(false)}
          isOpen={showModal}
          onOrderAdded={handleOrderAdded}
          serviceId={serviceId}
          serviceName={serviceName}
          user={user}
        />
      )}
      {/* {user.role !== "agent" && <Footer />} */}
      <Footer />
    </div>
  );
};

export default Services;
