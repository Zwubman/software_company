import React, { useState, useEffect } from "react";
import { Eye, Check, X, Trash, ChevronRight, ChevronLeft } from "lucide-react";
import {
  deleteFeedbackEntry,
  getFeedbackEntries,
  getFeedBackRating,
  updateFeedbackEntryStatus,
} from "../../services/FeedBackService";
import MyToast from "../Notification/MyToast";

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

const FeedbackModal = ({
  selectedFeedback,
  setIsModalVisible,
  getFeedbackTypeColor,
  renderStars,
  getStatusColor, //
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(selectedFeedback.status); // Initialize with current status

  const updateStatus = async (status) => {
    setLoading(true);
    try {
      await updateFeedbackEntryStatus(selectedFeedback.id, {
        status,
      });
      await setIsModalVisible(false);
      await onUpdate();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    if (selectedStatus) {
      updateStatus(selectedStatus); // Update status directly on selection
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-full w-full md:max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Feedback Details</h2>
          <button
            onClick={() => setIsModalVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {selectedFeedback.fullName}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {selectedFeedback.email}
          </p>
          <p>
            <span className="font-semibold">Type:</span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getFeedbackTypeColor(
                selectedFeedback.feedbackType
              )}`}
            >
              {typeof selectedFeedback.feedbackType === "string"
                ? selectedFeedback.feedbackType.replace("_", " ").toUpperCase()
                : "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold">Rating:</span>
            <span className="ml-2 flex">
              {renderStars(selectedFeedback.rating || 0)}
            </span>
          </p>
          <p>
            <span className="font-semibold">Status:</span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                newStatus
              )}`}
            >
              {typeof newStatus === "string" ? newStatus.toUpperCase() : "N/A"}
            </span>
          </p>
          <p>
            <span className="font-semibold">Message:</span>
            {selectedFeedback.message}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(selectedFeedback.createdAt).toLocaleDateString()}
          </p>
        </div>
        {/* Loader Message */}
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Update Status:</label>
          {loading && (
            <p className="text-orange-500">Updating status...</p>
          )}{" "}
          <select
            value={newStatus}
            onChange={handleStatusChange}
            className={`ml-2 w-full px-2 py-3 rounded-md text-xs font-medium ${getStatusColor(
              newStatus
            )}`}
            disabled={loading} // Disable dropdown while loading
          >
            <option value="">Status</option> {/* Placeholder option */}
            <option value="sent">Sent</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const AdminFeedback = () => {
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const [stat, setStat] = useState({}); // New state for total feedback count
  const [rate, setRate] = useState(0);
  const [deletingId, setDeletingId] = useState(null); // Track the ID of the entry being deleted
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchFeedbackEntries();
  }, [page, filters]);

  const fetchFeedbackEntries = async () => {
    setLoading(true);
    try {
      const response = await getFeedbackEntries(page, limit, filters);
      const rating = await getFeedBackRating();
      setRate(rating?.data?.averageRating || 0); // Set the average rating
      setFeedbackEntries(response?.statistics?.feedbacks || []);
      setTotalFeedbackCount(response?.statistics?.total || 0);
      setStat(response?.statistics); // Set total count from response
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    MyToast("success", "Thank you! Feedback Status Changed successfully!");
    await fetchFeedbackEntries();
  };

  const totalPages = Math.ceil(totalFeedbackCount / limit); // Calculate total pages

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDelete = async (id) => {

    try {
      setDeletingId(id); // Set the ID of the entry being deleted

      const response=await deleteFeedbackEntry(id);
      // MyToast({ status: "success", message: "Feedback entry deleted successfully!" }); // Toast notification
      MyToast("Feedback entry deleted successfully!","success"); // Toast notification
      
      fetchFeedbackEntries();
    } catch (error) {
      MyToast("error", "Failed to delete feedback entry!");
    } finally {
      setDeletingId(null); // Reset after deletion
    }
  };
  const getStatusColor = (status) => {
    const colors = {
      sent: "bg-blue-100 text-blue-800",
      reviewed: "bg-orange-100 text-orange-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const getFeedbackTypeColor = (type) => {
    const colors = {
      suggestion: "bg-cyan-100 text-cyan-800",
      complaint: "bg-red-100 text-red-800",
      praise: "bg-green-100 text-green-800",
      bug_report: "bg-purple-100 text-purple-800",
    };
    return colors[type];
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
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
      header: "Type",
      accessor: "feedbackType",
      cell: (type) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getFeedbackTypeColor(
            type
          )}`}
        >
          {type.replace("_", " ").toUpperCase()}
        </span>
      ),
    },
    {
      header: "Rating",
      accessor: "rating",
      cell: (rating) => <div className="flex">{renderStars(rating || 0)}</div>,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {status.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Feedback Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalFeedbackCount}
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
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stat.pending}</p>
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
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.resolved}
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
              <p className="text-sm text-gray-500">Compliants</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.complaints}
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
              <p className="text-sm text-gray-500">Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.suggestions}
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
              <p className="text-sm text-gray-500">Bug Report</p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.bugReports}
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
              <p className="text-sm text-gray-500">Testimony</p>
              <p className="text-2xl font-bold text-gray-900">{stat.praises}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avarge Rating</p>
              <p className="text-2xl font-bold text-gray-900">{rate}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
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
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <select
              className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Status</option>
              <option value="sent">Sent</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) =>
                setFilters({ ...filters, feedbackType: e.target.value })
              }
            >
              <option value="">Type</option>
              <option value="suggestion">Suggestion</option>
              <option value="complaint">Complaint</option>
              <option value="praise">Praise</option>
              <option value="bug_report">Bug Report</option>
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
              {feedbackEntries.map((row) => (
                <tr key={row.id}>
                  {columns.map((column, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap">
                      {column.cell
                        ? column.cell(row[column.accessor], row)
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
                        <span className="text-sm ">Details</span>
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
                getFeedbackTypeColor={getFeedbackTypeColor}
                renderStars={renderStars}
                getStatusColor={getStatusColor}
                onUpdate={onUpdate}
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

export default AdminFeedback;
