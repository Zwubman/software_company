import React, { useState } from "react";
import { AiFillDelete, AiFillEdit, AiFillPrinter } from "react-icons/ai";
import{ motion } from "framer-motion";
const DetailDialog = ({ isOpen, onClose, data, onEdit, onDelete }) => {
  const [expandedContent, setExpandedContent] = useState({});

  if (!isOpen) return null;

  const handleEdit = () => {
    onEdit(data.id);
    onClose();
  };

  const handleDelete = () => {
    onClose();
    onDelete(data.id);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleContent = (id) => {
    setExpandedContent((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // className="max-w-7xl mx-auto"
      
              className="bg-white rounded-lg shadow-lg p-8 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[80vh] relative overflow-hidden">
        <button
          className="absolute top-4 right-4 text-red-500 hover:text-gray-800 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          {data.title}
        </h2>
        <img
          src={data.imageUrl}
          alt="Image"
          className="rounded-lg mb-4 w-1/2 h-auto shadow-md mx-auto"
        />
        
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto max-h-[60vh]">
          {data.content ? (
            <>
              <p
                className={`text-gray-600 text-lg leading-relaxed ${
                  !expandedContent[data.id] ? "line-clamp-3" : ""
                }`}
              >
                {data.content}
              </p>
              {data.content.length > 150 && (
                <button
                  onClick={() => toggleContent(data.id)}
                  className="text-blue-500 hover:text-blue-700 mt-2"
                >
                  {expandedContent[data.id] ? "Show less" : "Read more"}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">No content available</p>
          )}
          <p className="text-gray-500 text-sm text-right mb-4">
            Published on: {new Date(data.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Author:</strong> {data.author || "Unknown"}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Categories:</strong> {data.category}
          </p>
        </div>

        {/* Floating Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-4">
          <button
            onClick={handleEdit}
            className="bg-yellow-500 text-white rounded px-4 py-2 hover:bg-yellow-600 transition"
          >
            <AiFillEdit />
          </button>
          <button
            onClick={handleDelete}
            className="bg-orange-500 text-white rounded px-4 py-2 hover:bg-orange-600 transition"
          >
            <AiFillDelete />
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition"
          >
            <AiFillPrinter />
          </button>
        </div>
       </motion.div>
    </div>
  );
};

export default DetailDialog;