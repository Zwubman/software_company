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
  getAllAgents,
  updateAgent,
  deleteAgent,
  updateAgentStatus,
} from "../../services/AgentService";
import axios from "axios";
import { api } from "../../constants/api";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import MyToast from "../Notification/MyToast";
import { useNavigate } from "react-router-dom";
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
    className={`fixed bottom-4 right-48 md:right-72 lg:right-64 xl:right-72 p-4 rounded-md shadow-lg flex items-center space-x-2 ${
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

const AgentDetailModal = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-center items-center border border-gray-100 pt-4 my-2 rounded-md bg-gray-50">
            {/* <h2 className="text-2xl font-bold text-[#3a4253]">Agent Details</h2> */}
            <div className=" items-center mb-4 ">
              {agent?.profilePicture ? (
                <img
                  src={agent.profilePicture}
                  alt={agent.fullName}
                  className="w-16 h-16 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg ring-4 ring-white mr-4">
                  {agent.fullName?.charAt(0) || "A"}
                </div>
              )}
              <h2 className="text-xl font-bold text-[#3a4253]">
                {agent.fullName}
              </h2>
            </div>
            {/* <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button> */}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#EB6407] mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="text-base font-medium">{agent.fullName}</p>
                  <p className="text-base font-light">{agent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-base font-medium capitalize">
                    {agent.sex}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="text-base font-medium">{agent.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agent Type</p>
                  <p className="text-base font-medium capitalize">
                    {agent.agentType}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#EB6407] mb-4">
                Location Details
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Region</p>
                  <p className="text-base font-medium">
                    {agent.Region?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zone</p>
                  <p className="text-base font-medium">
                    {agent.Zone?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Woreda</p>
                  <p className="text-base font-medium">
                    {agent.Woreda?.name || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#EB6407] mb-4">
                Status Information
              </h3>
              <div className="flex items-center space-x-4">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    agent.agentStatus === "accepted"
                      ? "bg-green-100 text-green-800"
                      : agent.agentStatus === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {agent.agentStatus}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main component for managing agents
const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalAgents: 0,
    regionAgents: 0,
    zoneAgents: 0,
    woredaAgents: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ agentType: "", sex: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [toast, setToast] = useState(null);
  const { user } = useSelector((state) => state.userData);

  const navigate = useNavigate();
  const limit = 8;

  // Fetch agents and regions on mount
  useEffect(() => {
    fetchAgents();
    fetchRegions();
  }, [currentPage, filters, searchQuery]);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await getAllAgents(currentPage, limit, {
        search: searchQuery,
        ...filters,
      });
      const agentsData = response.data || [];
      setAgents(agentsData);
      setFilteredAgents(agentsData);
      setTotalPages(response.totalPages || Math.ceil(response.total / limit));
      setStats({
        totalAgents: response.total || agentsData.length,
        regionAgents: response.regionAgent,
        zoneAgents: response.zoneAgent,
        woredaAgents: response.woredaAgent,
      });
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const response = await updateAgentStatus(id, { agentStatus: newStatus });

      MyToast(response.message || " status changed", "success");
      fetchAgents();
    } catch (error) {
      MyToast(error.response.data.error || "failed to update", "error");
    } finally {
      setUpdatingId(null);
    }
  };
  const fetchRegions = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${api}/regions/all-region`, config);
      setRegions(response?.data?.regions || []);
    } catch (error) {
      setToast({ message: "Failed to fetch regions", type: "error" });
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

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({ agentType: "", sex: "" });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    setAgentId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await deleteAgent(agentId);
      setToast({ message: "Agent deleted successfully", type: "success" });
      fetchAgents();
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

  const recentAgents = [...agents]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleDetail = (id) => {
    const agent = agents.find((a) => a.id === id);
    setSelectedAgent(agent);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirm}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[#3a4253] mb-6">
          Agent Management
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-4"
          >
            <User className="h-8 w-8 text-[#EB6407]" />
            <div>
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.totalAgents}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-4"
          >
            <Shield className="h-8 w-8 text-[#EB6407]" />
            <div>
              <p className="text-sm text-gray-600">Region Agents</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.regionAgents}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-4"
          >
            <MapPin className="h-8 w-8 text-[#EB6407]" />
            <div>
              <p className="text-sm text-gray-600">Zone Agents</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.zoneAgents}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-4"
          >
            <Briefcase className="h-8 w-8 text-[#EB6407]" />
            <div>
              <p className="text-sm text-gray-600">Woreda Agents</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.woredaAgents}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search ..."
                    className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-5 w-5 mr-2 text-[#3a4253]" />
                  <span className="text-[#3a4253]">Filters</span>
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
                        Agent Type
                      </label>
                      <select
                        name="agentType"
                        value={filters.agentType}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                      >
                        <option value="">All Types</option>
                        <option value="Region">Region</option>
                        <option value="Zone">Zone</option>
                        <option value="Woreda">Woreda</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#3a4253] mb-1">
                        Gender
                      </label>
                      <select
                        name="sex"
                        value={filters.sex}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                      >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetFilters}
                      className="px-3 py-1.5 text-sm text-[#3a4253] border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-1 inline" />
                      Reset Filters
                    </motion.button>
                    {/* <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={applyFilters}
                      className="px-4 py-1.5 bg-[#EB6407] text-white text-sm rounded-md hover:bg-[#C05600]"
                    >
                      Apply Filters
                    </motion.button> */}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#3a4253] text-white">
                          <th className="p-3 text-left text-sm font-medium">
                            Name
                          </th>
                          <th className="p-3 text-left text-sm font-medium">
                            Type
                          </th>
                          <th className="p-3 text-left text-sm font-medium hidden md:table-cell">
                            Phone
                          </th>
                          <th className="p-3 text-left text-sm font-medium hidden 2xl:table-cell">
                            date
                          </th>

                          <th className="p-3 text-left text-sm font-medium hidden 3xl:table-cell">
                            Location
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
                          {filteredAgents.length > 0 ? (
                            filteredAgents.map((agent) => (
                              <motion.tr
                                key={agent.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="hover:bg-gray-50"
                              >
                                <td className="p-3 text-sm text-[#3a4253]">
                                  {agent.fullName}
                                </td>
                                <td className="p-3 text-sm text-gray-600 capitalize">
                                  {agent.agentType}
                                </td>
                                <td className="p-3 text-sm text-gray-600 hidden md:table-cell">
                                  {agent.phoneNumber}
                                </td>
                                <td className="p-2 text-sm text-gray-600 hidden 2xl:table-cell">
                                  {new Date(agent.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </td>
                                <td className="p-3 text-sm text-gray-600 hidden 3xl:table-cell">
                                  <div>
                                    {agent.Region?.name || "-"} /{" "}
                                    {agent.Zone?.name || "-"} /{" "}
                                    {agent.Woreda?.name || "-"}
                                  </div>
                                </td>

                                {user?.role == "admin" && (
                                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                    <div className="relative">
                                      <select
                                        className={`px-2 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                                          agent.agentStatus === "accepted"
                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:border-orange-500"
                                            : agent.agentStatus === "rejected"
                                            ? "bg-rose-100 text-rose-700 hover:bg-rose-200 hover:border-orange-500"
                                            : agent.agentStatus === "reviewed"
                                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200 hover:border-orange-500"
                                            : agent.agentStatus === "pending"
                                            ? "bg-amber-100 text-amber-700 hover:bg-amber-200 hover:border-orange-500"
                                            : "bg-gray-100 text-gray-700"
                                        } border border-transparent focus:ring-2 focus:ring-orange-500 focus:border-orange-500 active:border-orange-500 cursor-pointer shadow-sm`}
                                        value={agent.agentStatus}
                                        onChange={(e) =>
                                          handleStatusChange(
                                            agent.id,
                                            e.target.value
                                          )
                                        }
                                        disabled={updatingId === agent.id}
                                      >
                                        <option value="accepted">
                                          accepted
                                        </option>
                                        <option value="rejected">
                                          rejected
                                        </option>
                                        <option value="reviewed">
                                          Reviewed
                                        </option>
                                        <option value="pending">pending</option>
                                      </select>
                                      {updatingId === agent.id && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                                          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                )}
                                <td>
                                  <div className="flex items-center space-x-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      onClick={() => handleDetail(agent.id)}
                                      className="flex items-center text-blue-800 hover:bg-blue-100 transition-colors px-2 py-1 rounded-md text-xs"
                                      title="View agent detail"
                                    >
                                      <Info className="h-4 w-4 mr-1" />
                                      <span>Details</span>
                                    </motion.button>
                                    {user?.role == "admin" && (
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => handleDelete(agent.id)}
                                        className="flex items-center text-red-600 hover:bg-red-100 transition-colors px-2 py-1 rounded-md text-xs"
                                        title="Delete agent request"
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        <span>Delete</span>
                                      </motion.button>
                                    )}
                                  </div>
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
                                No agents found matching your criteria
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
                    <p className="text-sm text-gray-600">
                      Showing page {currentPage} of {totalPages} •{" "}
                      {filteredAgents.length} agents
                    </p>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-[#3a4253] text-white rounded-md disabled:opacity-50 flex items-center"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-[#3a4253] text-white rounded-md disabled:opacity-50 flex items-center"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 h-fit sticky top-6">
            <h2 className="text-lg font-semibold text-[#3a4253] mb-4">
              Recent Agents
            </h2>
            <div className="space-y-3">
              {recentAgents.length > 0 ? (
                recentAgents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 border border-gray-100 rounded-lg hover:border-[#EB6407] transition-colors"
                  >
                    <p className="text-sm font-medium text-[#3a4253]">
                      {agent.fullName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {agent.Woreda?.name ||
                        agent.Zone?.name ||
                        agent.Region?.name ||
                        agent.agentType}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {agent.sex}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent agents
                </p>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showDetailModal && (
            <AgentDetailModal
              agent={selectedAgent}
              onClose={() => {
                setShowDetailModal(false);
                setSelectedAgent(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminAgents;
