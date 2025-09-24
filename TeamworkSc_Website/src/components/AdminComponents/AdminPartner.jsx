import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  MapPin,
  Filter,
  X,
  Loader2,
  Briefcase,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  getAllPartnerships,
  updatePartnershipStatus,
  deletePartnership,
} from "../../services/PartnershipService";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import MyToast from "../Notification/MyToast";
import PartnershipDetail from "../../pages/Partnership/PartnershipDetail";
import { useSelector } from "react-redux";

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

// Toast component for notifications
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
      type === "error"
        ? "bg-red-100 text-red-800"
        : "bg-green-100 text-green-800"
    }`}
  >
    {type === "error" ? <AlertCircle className="h-5 w-5" /> : null}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X className="h-4 w-4" />
    </button>
  </motion.div>
);

// Main component for managing partnerships
const AdminPartner = () => {
  const [partnerships, setPartnerships] = useState([]);
  const [filteredPartnerships, setFilteredPartnerships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    abilityForPartnership: "",
    status: "",
  });
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnershipId, setPartnershipId] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [total, setTotal] = useState(0);
  const [pend, setpending] = useState(0);
  const [review, setreview] = useState(0);
  const [accept, setaccepte] = useState(0);
  const [reject, setreject] = useState(0);
  const { user } = useSelector((state) => state.userData);

  const limit = 5;

  // Fetch partnerships on mount
  useEffect(() => {
    fetchPartnerships();
  }, [currentPage, filters, searchQuery]);

  const fetchPartnerships = async () => {
    setIsLoading(true);
    try {
      const response = await getAllPartnerships(currentPage, limit, {
        search: searchQuery,
        ...filters,
      });
      setTotal(response.statistics.total);
      setpending(response.statistics.pending);
      setreview(response.statistics.reviewed);
      setreject(response.statistics.rejected);
      setaccepte(response.statistics.accepted);

      const partnershipsData = response.statistics.partnerships || [];
      setPartnerships(partnershipsData);
      setFilteredPartnerships(partnershipsData);
      setTotalPages(Math.ceil(response.statistics.total / limit));
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetail = (data) => {
    setDetailData(data);
    setIsDetailOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await updatePartnershipStatus(id, { status: newStatus });
      // Toast(response.message || "Status changed", "success");
      // setToast({
      //   message: response.message || "Status changed",
      //   type: "success",
      // });
      MyToast(response.message || "Status changed", "success");
      fetchPartnerships();
    } catch (error) {
      // setToast({ message: error.message || "failed to update", type: "error" });
      MyToast(error.message || "failed to update", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ abilityForPartnership: "", status: "" });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    setPartnershipId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await deletePartnership(partnershipId);
      setToast({
        message: "Partnership deleted successfully",
        type: "success",
      });
      fetchPartnerships();
      setDeleteDialogOpen(false);
    } catch (error) {
      setToast({ message: error.message, type: "error" });
      setDeleteDialogOpen(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const partnershipOptions = [
    { value: "idea", label: "Idea for productive philosophy" },
    { value: "tech_product", label: "New Tech Product" },
    { value: "budget_support", label: "Budget Support" },
    { value: "other", label: "Other" },
  ];

  const recentPartnerships = [...partnerships]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirm}
      />
      <h1 className="text-3xl  mx-auto max-w-screen-xl text-[#3a4253] mb-2">
        Partnership Management
      </h1>
      <div class="bg-[#fafffe9c] p-4 md:p-6 mx-auto max-w-screen-xl rounded-md mb-2">
        <div class="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow duration-300 ">
            <span class="text-gray-600">Total:</span>
            <span class="font-bold text-lg">&nbsp;&nbsp;{total}</span>
          </div>
          <div class="flex-1 bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow duration-300">
            <span class="text-gray-600">Pending:</span>
            <span class="font-bold text-lg">&nbsp;&nbsp;{pend}</span>
          </div>
          <div class="flex-1 bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow duration-300">
            <span class="text-gray-600">Accepted:</span>
            <span class="font-bold text-lg">&nbsp;&nbsp;{accept}</span>
          </div>
          <div class="flex-1 bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow duration-300">
            <span class="text-gray-600">Rejected:</span>
            <span class="font-bold text-lg">&nbsp;&nbsp;{reject}</span>
          </div>
          <div class="flex-1 bg-white p-4 rounded-md shadow hover:shadow-lg transition-shadow duration-300">
            <span class="text-gray-600">Reviewed:</span>
            <span class="font-bold text-lg ">&nbsp;&nbsp;{review}</span>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-4"
      >
        <div className="flex-grow">
          <div className="bg-white shadow-lg rounded-lg p-4 pb-0 border border-gray-200 mb-2">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search ..."
                  className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] transition duration-200 focus:border-[#EB6407]"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-[#EB6407] text-white hover:bg-[#d95f0f] transition-colors"
              >
                <Filter className="h-5 w-5 mr-2" />
                <span>Filters</span>
              </motion.button>
            </div>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3a4253] mb-1">
                      Partnership Type
                    </label>
                    <select
                      name="abilityForPartnership"
                      value={filters.abilityForPartnership}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] transition duration-200"
                    >
                      <option value="">All Types</option>
                      {partnershipOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3a4253] mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition duration-200 `}
                    >
                      <option value="">All Statuses</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="px-3 py-1.5 text-sm text-[#EB6407] border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition duration-200"
                  >
                    <X className="h-4 w-4 mr-1 inline" />
                    Reset Filters
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {isLoading ? (
              <Loader />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#3a4253] text-white">
                      <th className="p-3 text-left text-sm font-medium">
                        Fullname
                      </th>
                      <th className="p-3 text-left text-sm font-medium">
                        Email
                      </th>
                      <th className="p-3 text-left text-sm font-medium">
                        Phone
                      </th>
                      <th className="p-3 text-left text-sm font-medium">
                        Profession
                      </th>
                      <th className="p-3 text-left text-sm font-medium">
                        Type
                      </th>
                      {user?.role == "admin" && (
                        <th className="p-3 text-left text-sm font-medium">
                          Status
                        </th>
                      )}
                      <th className="p-3 text-left text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredPartnerships.length > 0 ? (
                        filteredPartnerships.map((partnership) => (
                          <motion.tr
                            key={partnership.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="p-3 text-sm text-[#3a4253]">
                              {partnership.fullName}
                            </td>
                            <td className="p-3 text-sm text-gray-600 ">
                              {partnership.email}
                            </td>
                            <td className="p-3 text-sm text-gray-600 ">
                              {partnership.phoneNumber}
                            </td>
                            <td className="p-3 text-sm text-gray-600 ">
                              {partnership.profession}
                            </td>
                            <td className="p-3 text-sm text-gray-600 ">
                              {partnership.abilityForPartnership}
                            </td>
                            {user?.role == "admin" && (
                              <td className="p-3 text-sm text-gray-600">
                                <div className="relative">
                                  <select
                                    className={`${
                                      partnership.status === "accepted"
                                        ? "bg-green-300"
                                        : partnership.status === "rejected"
                                        ? "bg-red-300"
                                        : partnership.status === "reviewed"
                                        ? "bg-gray-300"
                                        : partnership.status === "pending"
                                        ? "bg-blue-300"
                                        : "bg-white"
                                    } px-2 py-1 text-sm font-medium rounded-md border ${
                                      updatingId === partnership.id
                                        ? "border-blue-500 bg-blue-100"
                                        : "border-gray-300"
                                    } ${
                                      updatingId === partnership.id
                                        ? "cursor-wait"
                                        : ""
                                    }`}
                                    value={partnership.status} // Ensure this is the correct status
                                    onChange={(e) =>
                                      handleStatusChange(
                                        partnership.id,
                                        e.target.value
                                      )
                                    }
                                    disabled={updatingId === partnership.id}
                                  >
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="pending">Pending</option>
                                  </select>
                                  {updatingId === partnership.id && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                                    </div>
                                  )}
                                </div>
                              </td>
                            )}
                            <td className="flex justify-center space-x-2 p-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleDetail(partnership)}
                                className="bg-[#6d86bb] text-white text-xs px-3 py-2 rounded-md shadow hover:bg-[#4469c1] transition duration-200"
                                title="View partnership details"
                              >
                                <span className="flex items-center">
                                  <Info className="h-3 w-3 mr-1" />
                                  Detail
                                </span>
                              </motion.button>
                              {user?.role == "admin" && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  onClick={() => handleDelete(partnership.id)}
                                  className="bg-[#EB6407] text-white  text-sm px-3 py-2 rounded-md shadow hover:bg-[#e59560] transition duration-200 "
                                  title="Delete partnership"
                                >
                                  <span className="flex items-center">
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </span>
                                </motion.button>
                              )}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <motion.tr
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-32"
                        >
                          <td
                            colSpan="7"
                            className="text-center text-gray-500 p-4"
                          >
                            No partnerships found matching your criteria
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
              <p className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} •{" "}
                {filteredPartnerships.length} partnerships
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
          </div>
        </div>

        {/* Recent Partnerships Section */}
        <div className="w-full xl:w-80 bg-white shadow-lg rounded-lg p-4 border border-gray-200 ">
          <h2 className="text-lg font-semibold text-[#3a4253] mb-4">
            Recent Partnerships
          </h2>
          <ul className="space-y-2">
            {recentPartnerships.length > 0 ? (
              recentPartnerships.map((partnership) => (
                <li
                  key={partnership.id}
                  className="flex flex-col border-b pb-2"
                >
                  <span className="font-medium text-[#3a4253]">
                    {partnership.fullName}
                  </span>
                  <span className="text-sm text-gray-600">
                    {partnership.email}
                  </span>
                  <span className="text-sm text-gray-600">
                    {partnership.phoneNumber}
                  </span>
                  <span className="text-sm text-gray-600">
                    {partnership.abilityForPartnership}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500">
                No recent partnerships
              </li>
            )}
          </ul>
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      {isDetailOpen && (
        <PartnershipDetail
          partnership={detailData}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPartner;
