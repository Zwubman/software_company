import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index}>
        <div className="animate-pulse">
          <div className="bg-gray-300 w-full h-48 rounded-lg mb-4" />
          <div className="bg-gray-300 w-full h-6 rounded mb-2" />
          <div className="bg-gray-300 w-1/4 h-4 rounded mb-2" />
          <div className="bg-gray-300 w-full h-4 rounded mb-4" />
          <div className="bg-gray-300 w-full h-6 rounded mb-4" />
          <div className="bg-gray-300 w-1/3 h-10 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const News = () => {
  const [newsList, setNewsList] = useState([]);

  const { t } = useTranslation();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "news/get-news" });
  }, []);

  const { news, loading } = useSelector((state) => state.newsData);
  useEffect(() => {
    setNewsList(news);
  }, [news]);

  const handleNewsClick = (id) => {
    navigate(`/posts/news/${id}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-100 pt-8 pb-16">
      <section id="news-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {t("Latest News")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {t("Stay updated with our latest news.")}
            </p>
          </div>

          {loading ? (
            <SkeletonLoader />
          ) : (
            <Slider {...settings}>
              {newsList.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center rounded-lg px-6 transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3
                    className="text-xl font-semibold text-gray-800 mb-2 truncate"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                  <span className="text-sm text-gray-500 mb-2">
                    {new Date(item.createdAt).toLocaleDateString("en-US")}
                  </span>
                  <p
                    className="text-gray-600 text-base leading-relaxed mb-4 truncate"
                    title={item.content}
                  >
                    {item.content}
                  </p>
                  <button
                    onClick={() => handleNewsClick(item.id)}
                    className="mt-auto bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 transition duration-300"
                  >
                    {t("Read More")}
                  </button>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
