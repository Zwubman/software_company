import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

const EventDetail = ({ event, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-8xl flex flex-col mx-auto p-0 bg-gradient-to-b from-gray-50 to-white"
    >
      <motion.div
        className="bg-white p-6 md:p-10 rounded-lg shadow-xl relative"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        exit={{ y: 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <button
          className="absolute top-4 right-4 text-orange-600 text-3xl hover:text-orange-800 transition-colors focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        
        {/* Main Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h2>

        {/* Image Carousel */}
        <motion.div className="mb-6">
          <img
            src={event?.images[0]?.imageUrl}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </motion.div>

        {/* Description Section */}
        <div className="bg-gray-100 p-5 rounded-lg shadow mb-4">
          <h3 className="text-2xl font-semibold text-gray-900">Description</h3>
          <p className="text-gray-700 leading-relaxed text-lg mt-2">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="bg-orange-100 p-4 rounded-lg shadow mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
          <p className="flex items-center gap-2 mt-2 text-gray-800">
            <FaMapMarkerAlt className="text-orange-700" />
            <span className="font-semibold">Location:</span>
            {event.location}
          </p>
          <p className="flex items-center gap-2 mt-2 text-gray-800">
            <FaCalendarAlt className="text-orange-700" />
            <span className="font-semibold">Event Date:</span>
            {new Date(event.eventDate).toLocaleDateString()}
          </p>
        </div>

        {/* Event Gallery */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Event Gallery</h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {event?.images?.map((image, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={image.id}
                className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedImage(image)}
                whileHover={{ scale: 1.05 }}
              >
                <motion.img
                  src={image.imageUrl}
                  alt={event.title}
                  className="object-cover w-full h-full transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timestamps */}
        <div className="mt-4 text-sm text-gray-600">
          <p>Created: {new Date(event?.createdAt).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(event?.updatedAt).toLocaleDateString()}</p>
        </div>

      </motion.div>

      {/* Image Modal */}
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
            className="max-w-[90vw] max-h-[90vh]"
          >
            <motion.img
              src={selectedImage.imageUrl}
              alt={event.title}
              className="max-w-full max-h-[90vh] object-contain"
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

export default EventDetail;