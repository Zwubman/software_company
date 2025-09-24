import React from "react";

const ServiceDetail = ({ detailData, onClose }) => {
  // Return a message if no data is provided
  if (!detailData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-gray-600 font-semibold">
          No service details available.
        </p>
      </div>
    );
  }

  const {
    title,
    description,
    imageUrl,
    videoUrl,
    fileUrl,
    createdAt,
    updatedAt,
  } = detailData;

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return original if formatting fails
    }
  };

  return (
    <div className=" flex items-center justify-center  font-sans">
      <div className="w-full bg-white  rounded-xl overflow-hidden transform transition-all duration-300">
        {/* Header Section */}
        <div className="flex  justify-between px-4 ">
          <div className="  text-start rounded-t-xl ">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2 text-orange-500">
              {title || "Service Details"}
            </h1>
            <p className="text-base sm:text-lg opacity-90">
              Explore the depths of our{" "}
              {title ? title.toLowerCase() : "service"} offering.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md text-orange-500 underline"
          >
            Back to our Services
          </button>{" "}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:py-8 lg:py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section (conditionally rendered) */}
          {imageUrl && (
            <div className="md:col-span-1 flex justify-center items-center">
              <img
                src={imageUrl}
                alt={title || "Service Image"}
                className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md border border-gray-200"
                loading="lazy" // Improve performance for images
              />
            </div>
          )}

          {/* Description Section */}
          <div className={imageUrl ? "md:col-span-1" : "md:col-span-2"}>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2 border-gray-200">
              About This Service
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
              {description || "No description available for this service."}
            </p>
          </div>

          {/* Video Section (conditionally rendered) */}
          {videoUrl && (
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2 border-gray-200">
                Watch Our Service Overview
              </h2>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                {" "}
                {/* 16:9 Aspect Ratio for responsive video */}
                <video
                  controls
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md bg-black"
                  src={videoUrl}
                  title={`${title || "Service"} Video`}
                  preload="metadata" // Load metadata first, not the whole video
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {/* File/Document Section (conditionally rendered) */}
          {fileUrl && (
            <div className="md:col-span-2 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b pb-2 border-gray-200">
                Related Documents
              </h2>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                View Document (PDF)
              </a>
            </div>
          )}

          {/* Metadata Section */}
          {/* <div className="md:col-span-2 mt-6 border-t pt-4 border-gray-200 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"> */}
            {/* <p>
              <span className="font-semibold text-gray-600">Created On:</span>{" "}
              {formatDate(createdAt)}
            </p>
            <p>
              <span className="font-semibold text-gray-600">Last Updated:</span>{" "}
              {formatDate(updatedAt)}
            </p> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
