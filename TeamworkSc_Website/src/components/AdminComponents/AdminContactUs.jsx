import React, { useState, useEffect } from "react";
import { Eye, X, Trash, ChevronRight, ChevronLeft } from "lucide-react";

import MyToast from "../Notification/MyToast";
import {
  deleteContactUsEntry,
  getContactUsEntries,
} from "../../services/ContactUs";

const TableSkeleton = () => {
  const skeletonRows = Array.from({ length: 4 }); // Adjust the number of rows as needed

  return (
    <div className="animate-pulse overflow-x-auto my-2">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {skeletonRows.map((_, rowIndex) => (
            <tr key={rowIndex}>
              {skeletonRows.map((column, index) => (
                <td key={index} className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-300 rounded w-full"></div>{" "}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FeedbackModal = ({ selectedFeedback, setIsModalVisible }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-full w-full md:max-w-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Message Details</h2>
          <button
            onClick={() => setIsModalVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-600">{selectedFeedback.fullName}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-600">{selectedFeedback.email}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Message:</span>
            <p className="text-gray-600">{selectedFeedback.message}</p>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">Date:</span>
            <span className="text-gray-600">
              {new Date(selectedFeedback.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsModalVisible(false)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminContactUs = () => {
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [stat, setStat] = useState({}); // New state for total feedback count

  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Track the ID of the entry being deleted

  useEffect(() => {
    fetchFeedbackEntries();
  }, [page, filters]);

  const fetchFeedbackEntries = async () => {
    setLoading(true);
    try {
      const response = await getContactUsEntries(page, limit, filters);
      setFeedbackEntries(response.contactUs.services); // Ensure this matches your response structure
      setStat(response.contactUs);
      setTotalFeedbackCount(response.contactUs.totalMessages); // Set total feedback count
    } catch (error) {
      console.error("Error fetching feedback entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalFeedbackCount / limit); // Update total pages calculation

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id); // Set the ID of the entry being deleted
      await deleteContactUsEntry(id);
      MyToast("success", "Feedback entry deleted successfully!");
      fetchFeedbackEntries();
    } catch (error) {
      MyToast("error", "Failed to delete feedback entry!");
    } finally {
      setDeletingId(null); // Reset after deletion
    }
  };

  const columns = [
    {
      header: "Full Name",
      accessor: "fullName",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Description",
      accessor: "message",
    },
  ];

  const truncateMessage = (message) => {
    if (message.length > 50) {
      return message.substring(0, 50) + "...";
    }
    return message;
  };

  return (
    <div className=" py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6"> Message Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.totalMessages || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.todayMessages || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Week Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.thisWeekMessages || 0}{" "}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.thisMonthMessages || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white mx-auto h-auto flex flex-col sm:flex-row items-center shadow-md rounded-lg p-4">
        <div className="mx-auto w-full flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            className="w-full sm:flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Search..."
            onChange={(e) => {
              const searchValue = e.target.value;
              setFilters((prev) => ({ ...prev, search: searchValue }));
              setPage(1); // Reset to the first page on search
            }}
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <select
              className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) =>
                setFilters({ ...filters, feedbackType: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="suggestion">Today</option>
              <option value="complaint">This Week</option>
              <option value="praise">This Month</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto my-2">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions{" "}
                </th>
              </tr>{" "}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedbackEntries?.map((row, id) => (
                <tr key={row.id}>
                  <td className=" py-4 text-center">{id + 1}</td>
                  {columns.map((column, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap">
                      {column.accessor === "message"
                        ? truncateMessage(row[column.accessor])
                        : row[column.accessor]}
                    </td>
                  ))}
                  <td>
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center p-2 border border-blue-300 hover:bg-blue-100 rounded-md transition duration-150 ease-in text-blue-600"
                        onClick={() => {
                          setSelectedFeedback(row);
                          setIsModalVisible(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="text-sm">Details</span>
                      </button>

                      <button
                        className={`flex items-center p-2 border ${
                          deletingId === row.id
                            ? "border-gray-300"
                            : "border-red-300"
                        } hover:bg-red-100 rounded-md transition duration-150 ease-in text-red-600`}
                        onClick={() => {
                          handleDelete(row.id);
                        }}
                        disabled={deletingId === row.id} // Disable specific button while loading
                      >
                        {deletingId === row.id ? (
                          <span className="text-sm">Deleting...</span>
                        ) : (
                          <>
                            <Trash className="w-4 h-4 mr-1" />
                            <span className="text-sm">Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-600">
              Showing page {page} of {totalPages} • {totalFeedbackCount}{" "}
              feedbacks
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 border rounded-md flex items-center ${
                  page === 1
                    ? "text-gray-400 border-gray-200"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Previous</span>
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 border rounded-md flex items-center ${
                  page === totalPages
                    ? "text-gray-400 border-gray-200"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Feedback Details</h2>
              <button
                onClick={() => setIsModalVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {isModalVisible && selectedFeedback && (
              <FeedbackModal
                selectedFeedback={selectedFeedback}
                setIsModalVisible={setIsModalVisible}
              />
            )}
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                onClick={() => setIsModalVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactUs;
