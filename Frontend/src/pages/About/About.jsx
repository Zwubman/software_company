import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import { useTranslation } from "react-i18next";
import { getAboutEntries } from "../../services/AboutService";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen font-sans antialiased bg-white text-[#3a4253]">
      <Navbar />

      <header className="pt-24 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          <div className="w-full lg:w-1/2 lg:h-1/2 flex justify-center">
            <div className="bg-gray-200 animate-pulse w-full max-w-md h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl" />
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <div className=" animate-pulse text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100 tracking-wide">
              About Us
            </div>
            <div className="bg-gray-200 animate-pulse h-8 w-3/4 mx-auto lg:mx-0" />
            <div className="bg-gray-200 animate-pulse h-6 w-5/6 mx-auto lg:mx-0" />
            <div className="bg-gray-200 animate-pulse h-6 w-full max-w-2xl mx-auto lg:mx-0" />
            <div className="bg-gray-200 animate-pulse h-6 w-full max-w-2xl mx-auto lg:mx-0" />
            <div className="bg-gray-200 animate-pulse h-6 w-full max-w-2xl mx-auto lg:mx-0" />
            <div className="bg-gray-200 animate-pulse h-6 w-full max-w-2xl mx-auto lg:mx-0" />
            <div className="bg-gray-200 animate-pulse h-10 w-32 mx-auto lg:mx-0 rounded-full" />
          </div>
        </div>
      </header>

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {["vision", "mission", "coreValues"].map((tab) => (
            <div
              key={tab}
              className="bg-gray-200 animate-pulse h-10 w-32 rounded-lg mx-2"
            />
          ))}
        </div>

        <div className="text-center md:text-left">
          <div className="space-y-6">
            <div className="bg-gray-200 animate-pulse h-8 w-3/4 mx-auto md:mx-0" />
            <div className="bg-gray-200 animate-pulse h-6 w-full max-w-3xl mx-auto md:mx-0" />
          </div>
        </div>
      </section>
    </div>
  );
};
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const AboutUs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("vision");
  const [aboutData, setAboutData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);
  const navigate = useNavigate();
  const fetchAbout = async () => {
    setIsLoading(true);
    try {
      const response = await getAboutEntries();
      if (response && response.success) {
        setAboutData(response.statistics.abouts);
      } else {
        console.error("Failed to fetch about entries");
      }
    } catch (error) {
      console.error("Error fetching about entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: index * 0.1 },
    }),
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen font-sans antialiased bg-white text-[#3a4253]">
      <Navbar />
      <header className="pt-24 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full lg:w-1/2 flex justify-center">
            <motion.img
              // src={"/assets/teamwork3.jpg"}
              src={aboutData[0]?.aboutImage || "/assets/teamwork3.jpg"}
              alt={t("Professional Preview")}
              className="w-full max-w-md h-[300px] sm:h-[400px] lg:h-[500px] object-cover rounded-xl"
              variants={sectionVariants}
            />
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2e3442] tracking-wide"
              variants={sectionVariants}
            >
              {t("About Us")}
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-[#7b8494] leading-relaxed max-w-2xl mx-auto lg:mx-0"
              variants={sectionVariants}
            >
              {aboutData[0]?.content ||
                "at Teamwork IT Solution  Company, we empower businesses to scale and innovate through world-class software solutions tailored for collaborative success. Our mission is to foster seamless teamwork, accelerate digital transformation, and craft intuitive, scalable platforms that simplify complex challenges. By blending cutting-edge technology with human-centered design, we deliver reliable, secure, and high-performing applications that enable teams to work smarter, communicate better, and achieve more together."}
            </motion.p>
            <motion.button
              onClick={() => {
                navigate("/posts/more/contact us");
              }}
              className="inline-block bg-gradient-to-r from-[#EB6407] to-[#d45605] text-white rounded-full py-3 px-8 text-base sm:text-lg font-semibold hover:bg-gradient-to-r hover:from-[#d45605] hover:to-[#bc5006] focus:ring-2 focus:ring-[#EB6407] focus:ring-offset-2 transition-colors duration-300"
              aria-label={t("Contact Us")}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              variants={sectionVariants}
            >
              {t("Contact Us ➔")}
            </motion.button>
          </div>
        </motion.div>
      </header>

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          className="flex justify-center flex-wrap gap-4 mb-12"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {["vision", "mission", "coreValues"].map((tab, index) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-base sm:text-lg font-medium transition-colors duration-300 ${
                activeTab === tab
                  ? "bg-[#EB6407] text-white"
                  : "bg-[#f8fafc] text-[#3a4253] hover:bg-[#fee8d9]"
              }`}
              aria-label={t(tab)}
              variants={tabVariants}
              custom={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {tab === "vision" && "🌟 Our Vision"}
              {tab === "mission" && "🚀 Our Mission"}
              {tab === "coreValues" && "💼 Core Values"}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          className="text-center md:text-left"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === "vision" && (
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2e3442] tracking-wide">
                {t("Our Vision")}
              </h2>
              <p className="text-base sm:text-lg text-[#7b8494] leading-relaxed max-w-3xl mx-auto md:mx-0">
                {aboutData[0]?.vision ||
                  "to be the most trusted technology partner, creating software that empowers teams to achieve their full potential and exceed client expectations. We envision a future where software development transcends technical boundaries, becoming a powerful force for team synergy, growth, and sustainable innovation."}
              </p>
            </div>
          )}

          {activeTab === "mission" && (
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2e3442] tracking-wide">
                {t("Our Mission")}
              </h2>
              <p className="text-base sm:text-lg text-[#7b8494] leading-relaxed max-w-3xl mx-auto md:mx-0">
                {aboutData[0]?.mission ||
                  "to deliver high-quality, innovative, and scalable software solutions that enable businesses to thrive in a rapidly evolving digital world. We empower teams to unlock their full potential through solutions that support collaboration, productivity, and creativity."}
              </p>
            </div>
          )}

          {activeTab === "coreValues" && (
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2e3442] tracking-wide text-center md:text-left">
                {t("Our Core Values")}
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-6">
                {aboutData[0]?.values &&
                  aboutData[0].values.map((value, index) => (
                    <motion.div
                      className="bg-[#f8fafc] p-6 rounded-xl border border-[#e8eaed] hover:bg-[#fee8d9] transition-colors duration-300"
                      variants={sectionVariants}
                    >
                      <h4 className="text-lg sm:text-xl font-semibold text-[#EB6407] mb-2">
                        {value.title || t("Teamwork First")}
                      </h4>
                      <p className="text-sm sm:text-base text-[#7b8494] leading-relaxed">
                        {value.description ||
                          t(
                            "We believe in the power of collaboration, transparency, and respect, fostering an environment where every team member can thrive."
                          )}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
