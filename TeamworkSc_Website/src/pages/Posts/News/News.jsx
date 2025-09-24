import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Newspaper, Search } from "lucide-react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
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
  const [selectedType, setSelectedType] = useState("All");
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    byDate: "",
    byCategory: "",
    byCompany: "",
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const limit = 6;
  const dispatch = useDispatch();

  const handleNewsClick = (id) => {
    navigate(`/posts/news/${id}`);
  };

  useEffect(() => {
    dispatch({
      type: "news/get-news",
      payload: { page: currentPage, limit, search: searchQuery, filters },
    });
  }, [currentPage, searchQuery, filters]);

  const { news, loading, totalNews } = useSelector((state) => state.newsData);

  useEffect(() => {
    setNewsList(news);
    setTotalPages(Math.ceil(totalNews / limit) || 1);
  }, [news]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white min-h-screen text-[#3a4253]">
      <div className="fixed w-full z-50 bg-white shadow">
        <Navbar />
      </div>

      <section className="min-h-full mb-24 px-4 sm:px-6 lg:px-8 pt-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <Newspaper className="text-[#EB6407] w-7 h-7" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Company News
          </h1>
        </div>

        {/* Enhanced Search Input */}

        {/* Enhanced Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10 ">
          {/* Search Input */}
          {/* Enhanced Search Input */}
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search news..."
            className="pl-10 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407] transition duration-300 ease-in-out shadow-sm"
          />

          {/* Date Filter Dropdown */}
          <div className="w-full sm:w-1/3">
            <select
              name="byDate"
              value={filters.byDate}
              onChange={handleFilterChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#EB6407] transition duration-300 ease-in-out shadow-sm"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="last-three-month">Last 3 Months</option>
              <option value="last-six">Last 6 Months</option>
              <option value="last-year">Last 1 Year</option>
            </select>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader /> // Show skeleton loader
        ) : newsList.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500 font-semibold">
              No news available.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }} // Initial opacity for animation
            animate={{ opacity: 1 }} // Final opacity for animation
            transition={{ duration: 0.5 }} // Animation duration
          >
            {newsList.map((item) => (
              <motion.div
                key={item.id}
                className="flex flex-col items-start bg-white rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105"
                initial={{ scale: 0.8 }} // Initial scale
                animate={{ scale: 1 }} // Final scale
                transition={{ duration: 0.3 }} // Scale animation duration
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3
                  className="text-xl font-semibold text-gray-800 mb-2"
                  title={item.title}
                >
                  {item?.title?.length > 50
                    ? `${item.title.slice(0, 50)}...`
                    : item.title}
                </h3>
                <span className="text-sm text-gray-500 mb-2">
                  {new Date(item.createdAt).toLocaleDateString("en-US")}
                </span>
                <p
                  className="text-gray-600 text-base leading-relaxed mb-4 max-h-16 overflow-hidden"
                  title={item.content}
                >
                  {item?.content?.length > 100
                    ? `${item.content.slice(0, 100)}...`
                    : item.content}
                </p>
                <button
                  onClick={() => handleNewsClick(item.id)}
                  className="mt-auto bg-orange-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-700 transition duration-300"
                >
                  {t("Read More")}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
          <p className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} • {newsList?.length} news
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md flex items-center ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md flex items-center ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default News;
