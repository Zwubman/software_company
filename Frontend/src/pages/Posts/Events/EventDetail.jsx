import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const EventDetail = ({ event, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-8xl  flex flex-col mx-auto p-0 "
    >
      <motion.div
        className=" p-6 md:p-10 rounded-lg -xl relative overflow-hidden"
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

        {/* Image Carousel at the top */}
        <div className="mb-6">
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="transform 500ms ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            rtl={true}
          >
            {event?.images?.map((image, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="relative w-full h-[500px] overflow-hidden rounded-lg -md cursor-pointer group"
                onClick={() => setSelectedImage(image)}
                whileHover={{ scale: 1.05 }}
              >
                <motion.img
                  src={image.imageUrl}
                  alt={`Event Image ${index + 1}`}
                  className="object-cover w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
                  <h3 className="text-lg lg:text-4xl font-bold mb-4">{event.title}</h3>
                  <p className="text-lg text-center">
                    Click to view full image
                  </p>
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>

        {/* Event Title */}
        <h2 className="text-xl lg:text-4xl font-bold text-gray-900 mb-2">{event.title}</h2>

        {/* Description Section */}
        <div className=" p-5  mb-4">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="bg-orange-100 p-4 rounded-lg  mb-4">
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
