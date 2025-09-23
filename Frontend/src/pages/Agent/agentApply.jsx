import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  getAllApprovedAgents,
  getMyRequest,
} from "../../services/AgentService";
import AgentApplication from "./AgentApplication";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

export default function AgentApply() {
  const [showModal, setShowModal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [myAgentData, setMyAgentData] = useState([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    myRequest();
    fetchAgents();
  }, []);

  const myRequest = async () => {
    const response = await getMyRequest();

    setMyAgentData(response?.myRequest);
  };

  const fetchAgents = async () => {
    try {
      const response = await getAllApprovedAgents();
      setAgents(response?.agents);
    } catch (error) {
      // setToast({ message: error.message, type: "error" });
    } finally {
    }
  };
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.userData);

  const checkUser = () => {
    if (isAuthenticated) {
      setShowModal(true);
    } else {
      navigate("/login");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageToggle = (lang) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://api.teamworksc.com/api/v1/agentapplication",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Request failed");

      toast.success("✅ Application submitted!");
      setTimeout(() => {
        setShowModal(false);
        setFormData(initialForm);
      }, 2000);
    } catch (err) {
      toast.error("❌ Submission failed. Please try again.");
    }
  };

  const settings = {
    dots: true,
    infinite: agents.length > 1, // Only allow infinite if more than 1 agent
    speed: 500,
    slidesToShow: Math.min(3, agents.length), // Show a maximum of 3 or less if fewer agents
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, agents.length), // Adjust for medium screens
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(1, agents.length), // Adjust for small screens
        },
      },
    ],
  };

  return (
    <div className="font-sans bg-white text-[#3a4253] ">
      <div className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6  overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full  z-0" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
          {/* Text Block */}
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-[#EB6407] text-transparent bg-clip-text mb-6 leading-tight drop-shadow-sm">
              Lead the Change as an Agent
            </h1>
            <p className="text-lg text-gray-700 mb-5 max-w-lg">
              Be the bridge between communities and technology. As an agent,
              you're not just delivering services — you're shaping the future of
              digital Ethiopia.
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>✅ Free training, recognition & resources</li>
              <li>✅ Work at your local Woreda or Kebele</li>
              <li>✅ Access exclusive partner tools & networks</li>
            </ul>
            <span className="inline-block bg-orange-200 text-orange-900 font-semibold px-4 py-1 rounded-full text-sm mb-6 shadow">
              🌟 Trusted by 80+ Agents
            </span>
            {myAgentData?.agentStatus ? (
              <div>
                <button
                  onClick={checkUser}
                  // onClick={() => navigate("/my-agent-request")}
                  className="bg-gradient-to-r from-[#EB6407] to-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-full transition-shadow shadow-lg hover:shadow-2xl text-lg"
                >
                  Become an Agent{" "} 
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={checkUser}
                  className="bg-gradient-to-r from-[#EB6407] to-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-full transition-shadow shadow-lg hover:shadow-2xl text-lg"
                >
                  Become an Agent
                </button>
              </div>
            )}
          </div>

          <div className="relative w-full h-[350px] flex items-center justify-center">
            <div className="bg-white/40 backdrop-blur-2xl border border-orange-200 shadow-2xl rounded-[2rem] w-full max-w-sm h-full animate-float-slow ring-4 ring-orange-100 overflow-hidden flex items-center justify-center">
              <img
                src="assets/agent.png"
                alt="Agent Illustration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-br from-orange-50 via-white to-orange-100 text-center relative overflow-hidden">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-[#EB6407] mb-20">
          Company's Agents
        </h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Slider {...settings}>
            {agents.map((agent, i) => (
              <div className="group bg-white/40 backdrop-blur-xl border border-orange-200/40 p-10 rounded-[2rem] shadow-2xl transition-transform duration-300 hover:scale-[1.03] ">
                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg ring-4 ring-white overflow-hidden mx-auto">
                  {!imgError ? (
                    <img
                      src={agent?.User?.profilePicture}
                      alt={agent.fullName}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)} // Set error state if image fails to load
                    />
                  ) : (
                    <span className="text-3xl text-center">
                      {agent.fullName?.charAt(0) || "A"}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-orange-700 mb-2">
                  {agent.fullName}
                </h3>
                <p className="text-base text-gray-700 font-medium mb-1">
                  {agent.profession} | {agent.sex}
                </p>
                <p className="text-sm text-gray-600">{agent.email}</p>
              </div>
            ))}{" "}
          </Slider>
          {/* 
          <button className="swiper-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white text-[#EB6407] shadow-lg w-12 h-12 rounded-full z-10 hover:scale-110 transition border-2 border-orange-400">
            ‹
          </button>
          <button className="swiper-next absolute right-0 top-1/2 -translate-y-1/2 bg-white text-[#EB6407] shadow-lg w-12 h-12 rounded-full z-10 hover:scale-110 transition border-2 border-orange-400">
            ›
          </button> */}
        </div>
      </section>
      {/* Why Become an Agent */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white text-center">
        <h2 className="text-3xl font-extrabold text-[#EB6407] mb-12">
          Why Become an Agent?
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-xl rounded-2xl hover:shadow-2xl transition">
            <div className="text-4xl mb-4 text-[#EB6407]">💼</div>
            <h3 className="text-xl font-semibold mb-2">Build Your Career</h3>
            <p className="text-gray-600 text-sm">
              Gain access to training, certificates, and professional
              opportunities.
            </p>
          </div>
          <div className="p-6 bg-white shadow-xl rounded-2xl hover:shadow-2xl transition">
            <div className="text-4xl mb-4 text-[#EB6407]">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Serve Your Community</h3>
            <p className="text-gray-600 text-sm">
              Help your neighbors access technology and digital services.
            </p>
          </div>
          <div className="p-6 bg-white shadow-xl rounded-2xl hover:shadow-2xl transition">
            <div className="text-4xl mb-4 text-[#EB6407]">📈</div>
            <h3 className="text-xl font-semibold mb-2">Grow With Us</h3>
            <p className="text-gray-600 text-sm">
              Advance from Bronze to Gold Agent and shape the future of digital
              Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* Agent Tiers */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-[#EB6407] mb-12">Agent Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Bronze Agent",
              icon: "🥉",
              desc: "Start your journey. Access training and community.",
            },
            {
              title: "Silver Agent",
              icon: "🥈",
              desc: "Lead projects and guide new agents.",
            },
            {
              title: "Gold Agent",
              icon: "🥇",
              desc: "Shape digital strategy and earn recognition.",
            },
          ].map((tier, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-orange-50 hover:bg-orange-100 transition shadow-md hover:shadow-xl text-left"
            >
              <div className="text-5xl mb-2">{tier.icon}</div>
              <h3 className="text-xl font-semibold text-[#EB6407]">
                {tier.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-orange-100 text-center">
        <h2 className="text-3xl font-bold mb-12 text-[#3a4253]">
          Your Impact Timeline
        </h2>
        <div className="max-w-4xl mx-auto space-y-10">
          {[
            "Apply to become an Agent",
            "Train & onboard digitally",
            "Deploy tools in your community",
            "Share insights & scale impact",
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 animate-slideInUp delay-[0.1s]"
            >
              <div className="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-200/30 via-white/50 to-white/0 text-gray-800 w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-lg ring-2 ring-orange-300">
                {index + 1}
              </div>
              <p className="text-gray-700 text-lg">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Form */}
      {showModal && (
        <AgentApplication
          onClose={() => setShowModal(false)}
          user={user}
          // myAgentData={myAgentData}
        />
      )}

      <Footer />
    </div>
  );
}
