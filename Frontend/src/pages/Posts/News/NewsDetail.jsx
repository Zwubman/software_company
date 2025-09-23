import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import motion from Framer Motion
import { useTranslation } from "react-i18next";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const SkeletonLoader = () => (
  <div className="flex flex-col lg:flex-row min-h-screen pt-28 max-w-7xl mx-auto">
    {/* Left side: News detail skeleton */}
    <div className="flex-1 p-6">
      <div className="animate-pulse">
        <div className="bg-gray-200 h-40 rounded-lg mb-4" />
        <div className="bg-gray-200 h-8 rounded mb-4" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-1/4" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-full" />
        <div className="bg-gray-200 h-4 rounded mb-4 w-1/3" />
      </div>
    </div>

    {/* Right side: Related news skeleton */}
    <div className="w-full lg:w-1/4 p-6">
      <h2 className="text-xl font-bold mb-4 bg-gray-200 h-6 rounded" />
      <ul className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <li
            key={index}
            className=" items-start rounded-lg p-4 shadow-md animate-pulse"
          >
            <div className="bg-gray-200 w-full h-12 rounded mr-4 flex-shrink-0" />
            <div className="flex-1">
              <div className="bg-gray-200 h-4 w-full rounded mb-2" />
              <div className="bg-gray-200 h-4 rounded" />
              <div className="bg-gray-200 h-4 rounded" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
const NewsDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [newsDetail, setNewsDetail] = useState({});
  const [relatedNews, setRelatedNews] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "news/get-news" });
  }, []);

  const { news, loading } = useSelector((state) => state.newsData);
  useEffect(() => {
    const foundNews = news.find((item) => item.id == id);
    const related = news.filter((item) => item.id != id).slice(0, 2);
    setRelatedNews(related);
    setNewsDetail(foundNews || {});
  }, [news, id]);
  const navigate = useNavigate();

  const handleNewsClick = (id) => {
    navigate(`/posts/news/${id}`);
  };

  return (
    <div className="min-h-screen text-gray-800">
      <div className="fixed w-full z-50 shadow">
        <Navbar />
      </div>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <motion.div
          className="flex flex-col lg:flex-row min-h-screen pt-24 max-w-7xl mx-auto"
          initial={{ opacity: 0 }} // Initial opacity
          animate={{ opacity: 1 }} // Final opacity
          transition={{ duration: 0.5 }} // Animation duration
        >
          <div className="flex-1 p-12 overflow-y-auto max-h-screen">
            <motion.img
              src={newsDetail?.imageUrl}
              alt="News"
              className="w-full h-1/2 object-cover rounded-lg mb-4 shadow-lg"
              initial={{ scale: 0.9 }} // Initial scale
              animate={{ scale: 1 }} // Final scale
              transition={{ duration: 0.5 }} // Animation duration
            />
            <motion.h1
              className="text-lg lg:text-3xl font-bold mb-4"
              initial={{ y: -20, opacity: 0 }} // Initial position and opacity
              animate={{ y: 0, opacity: 1 }} // Final position and opacity
              transition={{ duration: 0.5 }}
            >
              {newsDetail?.title}
            </motion.h1>
            <motion.span
              className="text-sm text-gray-600 mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {new Date(newsDetail.createdAt).toLocaleDateString("en-US")}
            </motion.span>
            <motion.p
              className="text-gray-800 leading-relaxed mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {newsDetail?.content}
            </motion.p>
          </div>

          {/* Right side: Related news */}
          <div className="w-full lg:w-1/4 p-6 shadow-sm rounded-lg h-full">
            <h2 className="text-xl font-bold mb-4">{t("Recent News")}</h2>
            <ul className="space-y-4">
              {relatedNews.map((item, index) => (
                <motion.li
                  key={index}
                  className=" items-start rounded-lg p-4 shadow-md"
                  initial={{ opacity: 0 }} // Initial opacity
                  animate={{ opacity: 1 }} // Final opacity
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={item?.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover rounded mr-4 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {item.title.length > 50
                        ? `${item.title.slice(0, 50)}...`
                        : item.title}
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
                      <span className="text-sm text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString("en-US")}
                      </span>
                      <button
                        onClick={() => handleNewsClick(item.id)}
                        className="px-4 py-1 text-white bg-orange-600 rounded hover:bg-orange-700 transition duration-300"
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
            <button  onClick={()=>{navigate("/posts/news")}} className="border  mx-8 my-2 px-4 py-2 rounded-md hover:bg-orange-600 hover:text-white text-orange-600">
              visit all company news
            </button>
          </div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
};

export default NewsDetail;
