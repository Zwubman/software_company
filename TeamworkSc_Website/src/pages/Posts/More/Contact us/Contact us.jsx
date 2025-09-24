import {
  Handshake,
  ChevronRight,
  BarChart3,
  Users,
  Globe2,
} from "lucide-react";
import Footer from "../../../../components/Footer/Footer";
import Navbar from "../../../../components/Navbar/Navbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getPartnershipStory } from "../../../../services/TestimonyService";
import { createContactUsEntry } from "../../../../services/ContactUs";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const metrics = [
  { icon: BarChart3, label: "Projects Launched", value: "120+" },
  { icon: Users, label: "Public Servants Trained", value: "3,000+" },
  { icon: Globe2, label: "Regions Covered", value: "11" },
];

const Contactus = () => {
  const [partners, setPartners] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getPartners();
  }, []);

  const getPartners = async () => {
    const response = await getPartnershipStory();
    setPartners(response.partner.rows);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createContactUsEntry(formData);
      setSuccess(true);
      setFormData({ fullName: "", email: "", message: "" });
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);

      setTimeout(() => {
        setSuccess(false);
        setError(false);
      }, 3000);
    }
  };

  return (
    <div className="font-sans bg-white text-[#1a202c] min-h-screen">
      <div className="fixed top-0 w-full z-50 bg-white shadow-lg">
        <Navbar />
      </div>

      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <header className="pt-24 pb-16 sm:pt-32 sm:pb-20">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Text Content Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
              <motion.div variants={sectionVariants}>
                <div className="inline-flex items-center gap-3 justify-center lg:justify-start px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium text-sm shadow-md">
                  🚀 Digital Empowerment
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1F2937] leading-tight"
                variants={sectionVariants}
              >
                Shape Ethiopia’s <br className="hidden sm:block" /> Digital
                Future with Us
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-[#4B5563] max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                variants={sectionVariants}
              >
                Join forces with innovators, governments, and changemakers to
                deliver inclusive and impactful digital transformation across
                Ethiopia.
              </motion.p>

              <motion.a
                href="#form"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#EB6407] to-[#D45605] text-white font-semibold text-base sm:text-lg px-8 py-3 rounded-full shadow-lg hover:from-[#D45605] hover:to-[#BC5006] focus:ring-2 focus:ring-offset-2 focus:ring-[#EB6407] transition-all duration-300"
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 300 }}
                variants={sectionVariants}
              >
                {/* Start the Conversation */}
                Get in touch
                <ChevronRight className="w-5 h-5" />
              </motion.a>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center">
              <motion.div
                className="relative w-full max-w-3xl rounded-2xl border-4 border-orange-100 shadow-xl overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
                variants={sectionVariants}
              >
                <motion.img
                  src="/assets/contact.png"
                  alt="Digital Transformation Collaboration"
                  className="w-full h-auto object-cover rounded-2xl"
                  variants={sectionVariants}
                />
              </motion.div>
            </div>
          </motion.div>
        </header>
        {/* Form & Partners */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mt-16" id="form">
          <div className="bg-white shadow-xl rounded-3xl border border-orange-100 p-8 lg:p-12 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <h2 className="text-3xl font-bold text-[#1a202c] mb-6">
              Get in Touch
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {["Full Name", "Email Address"].map((label, i) => (
                <div key={i} className="relative group">
                  <input
                    type={label === "Email Address" ? "email" : "text"}
                    name={label === "Email Address" ? "email" : "fullName"}
                    value={
                      formData[label === "Email Address" ? "email" : "fullName"]
                    }
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-transparent bg-gray-50 transition-all duration-300"
                  />
                  <label
                    className={`absolute left-4 top-3 text-sm text-gray-500 transition-all duration-200 ease-in-out 
      ${
        formData[label === "Email Address" ? "email" : "fullName"]
          ? "hidden"
          : "block"
      } 
      peer-placeholder-shown:top-3 
      peer-placeholder-shown:left-4 
      peer-placeholder-shown:text-base 
      peer-focus:-top-1.5 
      peer-focus:left-4 
      peer-focus:text-xs 
      peer-focus:text-orange-600 
      peer-focus:bg-white peer-focus:px-1`}
                  >
                    {label}
                  </label>
                </div>
              ))}
              <div className="relative group">
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-transparent bg-gray-50 transition-all duration-300"
                />
                {!formData.message && (
                  <label className="absolute text-sm text-gray-500 left-4 top-3 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-[-0.75rem] peer-focus:text-sm peer-focus:text-orange-600 peer-focus:bg-white peer-focus:px-1 ">
                    Message
                  </label>
                )}
              </div>
              {loading ? (
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
                  disabled
                >
                  <ChevronRight className="w-6 h-6" />
                  Sending...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                  Send Message
                </button>
              )}
            </form>
            {success && (
              <p className="mt-4 text-green-600">
                Your message has been sent successfully!
              </p>
            )}
            {error && (
              <p className="mt-4 text-red-600">Failed to send! Try Again!</p>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#1a202c] mb-6">
              Our Impactful Partners
            </h3>
            <div className="grid gap-6">
              {partners?.slice(0, 3).map((partner) => (
                <div
                  key={partner?.id}
                  className="bg-white border-l-4 border-orange-500 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <blockquote className="text-sm italic text-gray-600 mb-3">
                    {partner?.abilityDescription &&
                    partner?.abilityDescription.length > 100
                      ? `${partner?.abilityDescription.slice(0, 100)}...`
                      : partner?.abilityDescription}
                  </blockquote>
                  <h4 className="font-bold text-gray-800">
                    {partner?.fullName}
                  </h4>
                  <span className="text-xs text-orange-500 font-medium">
                    {partner.profession}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="text-center space-y-10 mt-20">
          <h2 className="text-3xl font-bold text-[#1a202c]">Our Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {metrics.map(({ icon: Icon, label, value }, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border-t-4 border-orange-500 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <Icon className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-4xl font-extrabold text-gray-900">
                  {value}
                </h3>
                <p className="text-sm text-gray-600 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contactus;
