import { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import { FiPhoneCall, FiClipboard, FiTrendingUp } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import {
  FaHandshake,
  FaUserTie,
  FaEnvelopeOpenText,
  FaQuoteLeft,
} from "react-icons/fa";
const images = ["/assets/hero/teamwork-hero.png"];
import CountUp from "react-countup";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import News from "./News";
import Tesmony from "./Tesmony";
import ChatBot from "../../chat/ChatBot";
import { getPartnershipStory } from "../../services/TestimonyService";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [partners, setPartners] = useState([]);

  const { t } = useTranslation();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    getPartners();
  }, []);
  const getPartners = async () => {
    const response = await getPartnershipStory();
    setPartners(response.partner?.rows);
  };

  const navigate = useNavigate();

  const services = [
    {
      icon: <FaHandshake />,
      title: "Order Service ",
      description:
        "Place a custom software product or service request tailored to your organizational needs.",
      link: "/service",
      buttonText: "Place Order",
    },
    {
      icon: <FaUserTie />,
      title: "Job Application",
      description:
        "Apply for open positions and join our mission-driven technology team.",
      link: "/posts/jobs",
      buttonText: "Apply for Job",
    },
    {
      icon: <FaEnvelopeOpenText />,
      title: "Customer Assistance",
      description:
        "Need help or have questions? Contact our support team — we’re ready to assist.",
      link: "/posts/more/contact us",
      buttonText: "Get Help",
    },
  ];

  const whyChooseUs = [
    {
      title: t("Innovative Solutions"),
      description: t("Cutting-edge software tailored to your needs."),
      icon: <FiTrendingUp size={24} className="text-[#EB6407]" />,
    },
    {
      title: t("Reliable Support"),
      description: t("24/7 assistance with dedicated support teams."),
      icon: <FiPhoneCall size={24} className="text-[#EB6407]" />,
    },
    {
      title: t("Proven Expertise"),
      description: t("Years of experience delivering successful projects."),
      icon: <FiClipboard size={24} className="text-[#EB6407]" />,
    },
  ];

  const partnerLogos = [
    "/assets/PLogo.avif",
    "/assets/PLogo2.avif",
    "/assets/PLogo3.avif",
    "/assets/PLogo4.avif",
  ];

  return (
    <div className="font-sans antialiased bg-white text-[#3a4253] scroll-smooth">
      <Navbar />

      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scale-up {
            from { transform: scale(1); }
            to { transform: scale(1.05); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          .hover-scale:hover {
            animation: scale-up 0.3s ease-out forwards;
          }
          .gradient-cta {
            background: linear-gradient(to right, #EB6407, #d45605);
            transition: background 0.3s ease, transform 0.3s ease;
          }
          .gradient-cta:hover {
            background: linear-gradient(to right, #d45605, #bc5006);
            transform: scale(1.05);
          }
          .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
      {/* Hero Section */}
      <header
        className="relative bg-white overflow-hidden  pt-16  lg:pt-32 pb-12 "
        style={{
          background: `linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.85)), url(${images[currentImageIndex]}) center/cover no-repeat fixed`,
        }}
      >
        <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div
            className="text-center lg:text-left max-w-2xl space-y-6"
            data-aos="fade-right"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2e3442] tracking-wide leading-tight animate-fade-in">
              {t("Welcome to Teamwork")}
              <br />
            </h1>
            <p className="text-lg sm:text-xl text-[#6c7484] leading-relaxed animate-fade-in">
              {t(
                "Engage with customers, agents, and partners seamlessly via our intelligent platform.Collaboration, reinvented. We build secure, scalable, and human-centric software that empowers teams to turn ideas into action  coding with purpose, delivering with unity."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-6">
              <button
                onClick={() => navigate("/service")}
                className="gradient-cta text-white rounded-full py-3 px-8 text-lg font-semibold shadow-md hover-scale"
              >
                {t("Get Started Now")}
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 text-center text-[#3a4253]">
              <div>
                <h3 className="text-3xl font-bold">
                  <CountUp end={5} duration={3} />+
                </h3>
                <p className="text-sm">
                  Real-world problems solved with smart software
                </p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">
                  <CountUp end={100} duration={3} />%
                </h3>
                <p className="text-sm">
                  Empowering businesses with dependable systems
                </p>
                {/* <p className="text-sm">
                  Join thousands who trust us for seamless operations.
                </p> */}
              </div>
            </div>
          </div>
          <div
            className="w-full lg:w-1/2 flex justify-center"
            data-aos="fade-left"
          >
            <div className="relative  overflow-hidden  backdrop-blur-xl bg-white/30 border border-white/40 p-4">
              <img
                src="/assets/teamwork2.jpg"
                alt={t("Professional Preview")}
                className="w-full h-[420px] object-cover rounded-xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white text-gray-800 text-sm text-center py-3 font-bold">
                {t("your Digital Partner")}
              </div>
            </div>
          </div>
        </div>
      </header>
      <News />

      {/* Connect Section */}
      <section id="connect" className="py-16 sm:py-24 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3a4253] tracking-wide">
              {t("How Can We Support You?")}
            </h2>
            <p className="mt-4 text-lg text-[#7b8494] max-w-3xl mx-auto">
              {t(
                "Whether you’re looking to place a custom order, apply for a job, or get support — Teamwork Software Company is here to help you every step of the way."
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 justify-items-center">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white w-full max-w-sm rounded-xl px-5 py-8 shadow-md hover:shadow-xl transition text-center flex flex-col items-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#fee8d9] text-[#EB6407] text-2xl mb-5">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#3a4253] mb-2">
                  {service.title}
                </h3>
                <p className="text-[#7b8494] text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                <button
                  onClick={() => navigate(service.link)}
                  className="inline-block px-5 py-2 rounded-md text-white bg-[#EB6407] hover:bg-[#d45605] font-medium transition text-sm"
                  aria-label={t("Go to") + " " + service.title}
                >
                  {service.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Choose Us */}
      <section
        id="why-choose-us"
        className="py-16 sm:py-24 bg-gradient-to-r from-[#fff5ef] to-[#fee8d9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3a4253] tracking-wide">
              {t("Why Choose Us")}
            </h2>
            <p className="mt-4 text-lg text-[#7b8494] max-w-3xl mx-auto">
              {t("Discover what sets Teamwork Software apart from the rest.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fee8d9] group-hover:scale-105 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#3a4253]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[#7b8494] text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold">{t("What Our Clients Say")}</h2>
            <p className="mt-3 text-lg text-[#6b7280]">
              {t("Real success stories from companies like yours.")}
            </p>
          </div>

          <div className="relative">
            {/* Arrow Container */}
            <div className="flex justify-between items-center mb-6 px-2 sm:px-4">
              <div
                ref={prevRef}
                className="swiper-button-prev text-[#EB6407] text-2xl sm:text-3xl cursor-pointer"
              ></div>
              <div
                ref={nextRef}
                className="swiper-button-next text-[#EB6407] text-2xl sm:text-3xl cursor-pointer"
              ></div>
            </div>

            <Tesmony prevRef={prevRef} nextRef={nextRef} />
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8fafc] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-extrabold mb-10 text-gray-800 relative inline-block"
          >
            <span className="relative z-10">
              {t("Trusted by Leading Companies")}
            </span>
            <span className="absolute left-0  w-full h-2 z-0 rounded-md"></span>
          </h2>
          <div className="marquee-container">
            <div className="marquee-track">
              {[...partners, ...partners].map(
                (partner, index) =>
                  partner.user.profilePicture && (
                    <div key={index} className="marquee-item">
                      <img
                        src={partner.user.profilePicture}
                        alt={`${partner.fullName}'s logo`}
                        className="h-28 sm:h-32 object-contain mx-auto"
                      />
                    </div>
                  )
              )}
            </div>
          </div>
          {/* <div className="marquee-container">
            <div className="marquee-track">
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div key={index} className="marquee-item">
                  <img
                    src={logo}
                    alt={`Logo ${index}`}
                    className="h-28 sm:h-32 object-contain mx-auto"
                  />
                </div>
              ))}
            </div>
          </div> */}
        </div>
        <style>
          {`
      .marquee-container {
        overflow: hidden;
        position: relative;
        width: 100%;
      }

      .marquee-track {
        display: flex;
        width: max-content;
        animation: scroll-marquee 15s linear infinite;
      }

      .marquee-item {
        flex: 0 0 auto;
        width: 12rem;
        padding: 0 1rem;
      }

      @keyframes scroll-marquee {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }
    `}
        </style>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
