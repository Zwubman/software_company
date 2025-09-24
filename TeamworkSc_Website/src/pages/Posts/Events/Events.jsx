import {
  CalendarDays,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import EventDetail from "../Events/EventDetail";
import { motion } from "framer-motion";

const Loader = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    transition={{ type: "spring", stiffness: 100 }}
    className="flex justify-center items-center py-8"
  >
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </motion.div>
);

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({});
  const [isDetailView, setIsDetailView] = useState(false);
  const { events, loading, totalEvents } = useSelector(
    (state) => state.eventData
  );
  const [eventsList, setEventsList] = useState([]);
  const limit = 6;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "events/get-events",
      payload: { page: currentPage, limit, searchQuery },
    });
  }, [currentPage, searchQuery]);

  useEffect(() => {
    setEventsList(events);
    setTotalPages(Math.ceil(totalEvents / limit) || 1);
  }, [events, totalEvents]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetail = (event) => {
    setIsDetailView(!isDetailView);
    setData(event);
  };

  return (
    <div className="font-sans bg-gradient-to-br from-white via-gray-50 to-white text-gray-800 overflow-x-hidden">
      <Navbar />
      <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isDetailView ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <EventDetail
              event={data}
              onClose={() => setIsDetailView(!isDetailView)}
            />
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="flex items-center gap-4 mb-10"
            >
              <CalendarDays className="text-[#F97316] w-8 h-8" />
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Events
              </h1>
            </motion.div>
            {loading ? (
              <Loader />
            ) : (
              <>
                <motion.section
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {eventsList.map((event, index) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      key={index}
                      onClick={() => handleViewDetail(event)}
                      className="group relative bg-white p-6 rounded-3xl ring-1 ring-gray-100 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={event.images[0]?.imageUrl || "https://via.placeholder.com/300"}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-md mb-4"
                      />
                      <div className="mb-3 flex justify-between items-start">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#EB6407] transition">
                          {event.title.length > 50
                            ? `${event.title.slice(0, 50)}...`
                            : event.title} 
                        </h2>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 gap-2 mb-1">
                        <CalendarDays size={14} />{" "}
                        {new Date(event.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 gap-2 mb-4">
                        <MapPin size={14} /> {event.location}
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {event.description.length > 50
                          ? `${event.description.slice(0, 50)}...`
                          : event.description}
                      </p>
                      <button className="text-blue-600 hover:underline">Show more</button>
                    </motion.div>
                  ))}
                </motion.section>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0"
                >
                  <p className="text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages} •{" "}
                    {eventsList.length} events
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
                </motion.div>
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Events;