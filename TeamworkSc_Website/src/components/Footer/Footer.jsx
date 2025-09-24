import React from "react";
import { Facebook, Youtube } from "react-feather";
import { SiTiktok } from "react-icons/si";
import { useTranslation } from "react-i18next";
import { FaTelegramPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Footer = () => {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.userData
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <footer className="bg-gradient-to-r from-[#1a3c5e] via-gray-600 to-[#1a3c5e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-5 gap-8 text-sm">
        <div>
          <h3 className="text-xl font-semibold mb-4">{t("About Teamwork")}</h3>
          <p>
            {t(
              "Teamwork is a digital solutions provider helping customers, agents, and businesses grow together."
            )}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">{t("Quick Links")}</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                {t("Home")}
              </Link>
            </li>

            <li>
              <Link to="/about-us" className="hover:underline">
                {t("about us")}
              </Link>
            </li>
            <li>
              <Link to="/service" className="hover:underline">
                {t("Services")}
              </Link>
            </li>
            <li>
              <Link to="/agents" className="hover:underline">
                {t("Agents")}
              </Link>
            </li>

            <li>
              <Link to="/partnership" className="hover:underline">
                {t("Partnership")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-justify">
            {t("Follow Us")}
          </h3>
          <div className="flex space-x-4">
            <a
              href="https://web.facebook.com/groups/540668018528410"
              target="_blank"
              className="hover:text-gray-300 w-10 h-10 flex items-center justify-center text-xl"
            >
              <Facebook />
            </a>
            <a
              href="https://t.me/teamwork_12"
              target="_blank"
              className="hover:text-gray-300 w-10 h-10 flex items-center justify-center text-xl"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://www.youtube.com/@teamworksc"
              target="_blank"
              className="hover:text-gray-300 w-10 h-10 flex items-center justify-center text-xl"
            >
              <Youtube />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              className="hover:text-gray-300 w-10 h-10 flex items-center justify-center text-xl"
            >
              <SiTiktok />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("Contact")}</h3>
          <p>
            info@teamwork.com
            <br />
            +251 923227081 or
            <br />
            &nbsp;&nbsp; 0116506569
          </p>
          <p className="mt-2">{t("Addis Ababa, Ethiopia")}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {t("General Feedback")}
          </h3>
          {/* {isAuthenticated ? (
            <p className="mb-4">
              {t(
                "We value your feedback. Please share your thoughts to help us improve."
              )}
            </p>
          ) : ( */}
            <button
              onClick={() => navigate("/feedback")}
              className="bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:bg-orange-700 hover:scale-105 focus:outline-none"
            >
              Give Us Feedback
            </button>
          {/* )} */}
        </div>
      </div>
      <div className="text-center py-4 border-t border-white text-sm">
        &copy; {new Date().getFullYear()} Teamwork Software Company.{" "}
        {t("All rights reserved")}.
      </div>
    </footer>
  );
};

export default Footer;
