import React, { useState } from "react";
import { motion } from "framer-motion";

const NewsDetail = ({ news, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const contentLimit = 300;
  const isContentLong = news.content?.length > contentLimit;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full max-w-8xl flex flex-col mx-auto"
    >
      <motion.div
        className="bg-white p-4 md:p-8 rounded-lg shadow-lg relative"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <button
          className="absolute top-4 right-4 text-orange-700 text-2xl hover:scale-110 transition-transform focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col gap-4 md:gap-6">
          {news.imageUrl && (
            <div>
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-[400px] object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                loading="lazy"
                onClick={() => setSelectedImage(news.imageUrl)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-image.jpg";
                }}
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
              <p className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-orange-800">Category:</span>
                <span className="text-gray-800 capitalize">
                  {news.category}
                </span>
              </p>
              <p className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="font-semibold text-orange-800">
                  Compnay Name:
                </span>
                <span className="text-gray-800 capitalize">
                  {news.companyName ? news.companyName : news.author}
                </span>
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
              <p className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-orange-800">
                  Published Date:
                </span>
                <span className="text-gray-800">
                  {new Date(news.publishDate).toLocaleDateString()}
                </span>
              </p>
              <p className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="font-semibold text-orange-800">
                  Last Updated:
                </span>
                <span className="text-gray-800">
                  {new Date(news.updatedAt).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 px-2">
            {news.title}
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-800 leading-relaxed text-base md:text-lg">
              {showFullContent
                ? news.content
                : news.content?.slice(0, contentLimit)}
              {isContentLong && !showFullContent && "..."}
            </p>
            {isContentLong && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="mt-2 text-orange-700 hover:text-orange-800 font-medium"
              >
                {showFullContent ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            className="max-w-[90vw] max-h-[90vh] overflow-hidden"
          >
            <motion.img
              src={selectedImage}
              alt={news.title}
              className="max-w-full max-h-full object-contain"
              initial={{ rotate: -5 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsDetail;
