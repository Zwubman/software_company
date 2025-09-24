import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  Mail,
} from "lucide-react";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import MyToast from "../Notification/MyToast";
import {
  blockUser,
  createAdmin,
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "../../services/UserService";
import axios from "axios";
import { api } from "../../constants/api";

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

const CreateAdmin = ({ onClose, onCreated }) => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  // const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    // password: "",
    role: "",
    phoneNumber: "+251",
    regionId: "",
    zoneId: "",
    woredaId: "",
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setIsLoadingRegions(true);
      const roleResponse = await axios.get(`${api}/roles/all-roles`, config);
      setRoleData(roleResponse?.data?.roles?.roles || []);

      const response = await axios.get(`${api}/regions/all-region`, config);
      setRegions(response?.data?.regions?.regions || []);
    } catch (error) {
      // Handle error appropriately
    } finally {
      setIsLoadingRegions(false);
    }
  };

  const handleRegionChange = (e) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    setSelectedZone("");
    setFormData({ ...formData, regionId, zoneId: "", woredaId: "" });
  };

  const handleZoneChange = (e) => {
    const zoneId = e.target.value;
    setSelectedZone(zoneId);
    setFormData({ ...formData, zoneId, woredaId: "" });
  };

  const zones = selectedRegion
    ? regions.find((r) => r.id === Number(selectedRegion))?.Zones || []
    : [];

  const woredas = selectedZone
    ? zones.find((z) => z.id === Number(selectedZone))?.woredas || []
    : selectedRegion
    ? regions
        .find((r) => r.id === Number(selectedRegion))
        ?.Zones.flatMap((z) => z.woredas) || []
    : regions.flatMap((r) => r.Zones.flatMap((z) => z.woredas));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate password if password field is being changed
    // if (name === "password") {
    //   validatePassword(value);
    // }

    // Validate phone number if phone number field is being changed
    if (name === "phoneNumber") {
      validatePhoneNumber(value);
    }
  };

  // const validatePassword = (password) => {
  //   const strongPasswordRegex =
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  //   if (!strongPasswordRegex.test(password)) {
  //     setPasswordError(
  //       "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character."
  //     );
  //   } else {
  //     setPasswordError("");
  //   }
  // };

  const validatePhoneNumber = (phoneNumber) => {
    const ethiopianPhoneRegex = /^\+251[1-9]\d{8}$/; // Matches +251 followed by 9 digits

    if (!ethiopianPhoneRegex.test(phoneNumber)) {
      setPhoneError(" +251XXXXXXXXXX");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure formData includes all necessary fields
    const dataToSend = {
      ...formData,
      role: formData.role,
      regionId: selectedRegion,
      zoneId: selectedZone,
    };

    // Check for errors before submitting
    if ( phoneError) {
      setLoading(false);
      return;
    }

    try {
      const response = await createAdmin(dataToSend);
      MyToast(response?.message || " created successfully!!", "success");
      onClose();
      onCreated();
    } catch (error) {
      MyToast(error.message || "Failed to create ", "error");
    } finally {
      setLoading(false);
    }
  };

  // const togglePasswordVisibility = () => {
  //   setIsPasswordVisible(!isPasswordVisible);
  // };

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
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6"
      >
        <h2 className="text-lg font-semibold text-[#3a4253] mb-4 text-center">
          Create Admin/ASsistant
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-[#3a4253] mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3a4253] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3a4253] mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter phone number (+251XXXXXXXXXX)"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              required
            />
            {phoneError && (
              <div className="text-red-600 text-sm mt-1">{phoneError}</div>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-[#3a4253] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
              >
                {isPasswordVisible ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </button>
            </div>
            {passwordError && (
              <div className="text-red-600 text-sm mt-1">{passwordError}</div>
            )}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-[#3a4253] mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
              required
            >
              <option value="">Select Role</option>
              {/* {roleData.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))} */}
              {roleData
                .filter(
                  (role) => !["partner", "user", "agent"].includes(role.name)
                )
                .map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
            </select>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Region:</label>
                <select
                  name="regionId"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  disabled={isLoadingRegions}
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {isLoadingRegions && <p>Loading...</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Zone:</label>
                <select
                  name="zoneId"
                  value={selectedZone}
                  onChange={handleZoneChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  disabled={!selectedRegion}
                  required
                >
                  <option value="">Select Zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Woreda:</label>
                <select
                  name="woredaId"
                  value={formData.woredaId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  disabled={!selectedZone}
                  required
                >
                  <option value="">Select Woreda</option>
                  {woredas.map((woreda) => (
                    <option key={woreda.id} value={woreda.id}>
                      {woreda.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#EB6407] to-[#FF8C00] text-white rounded-md shadow-lg 
                ${
                  loading
                    ? "bg-[#d0954d] opacity-80 cursor-not-allowed"
                    : "hover:bg-orange-600"
                } 
                transition-colors duration-300 ease-in-out h-12`}
            >
              <span>{loading ? "Creating" : "Create Admin"}</span>
              {loading && <Loader className="w-4 animate-spin" />}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#3a4253]">Agent Details</h2>
            {/* <div className="flex items-center mb-4">
              {agent?.profilePicture ? (
                <img
                  src={agent.profilePicture}
                  alt={agent.fullName}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg ring-4 ring-white mr-4">
                  {agent.fullName?.charAt(0) || "A"}
                </div>
              )}
              <h2 className="text-2xl font-bold text-[#3a4253]">
                Agent Details
              </h2>
            </div> */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#EB6407] mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="text-base font-medium">{agent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-base font-medium capitalize">
                    {agent.status}
                  </p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="text-base font-medium">{agent.phoneNumber}</p>
                </div> */}
                <div>
                  <p className="text-sm text-gray-600">Agent Type</p>
                  <p className="text-base font-medium capitalize">
                    {agent.role}
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
                    {/* {agent.Region?.name || "-"} */}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zone</p>
                  <p className="text-base font-medium">
                    {/* {agent.Zone?.name || "-"} */}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Woreda</p>
                  <p className="text-base font-medium">
                    {/* {agent.Woreda?.name || "-"} */}
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
                    agent.userRole === "accepted"
                      ? "bg-green-100 text-green-800"
                      : agent.userRole === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {agent.userRole}
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
const AdminUser = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalUser: 0,
    totalAgent: 0,
    totalPartner: 0,
    activeUser: 0,
    blockedUser: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [type, setType] = useState("");
  const [toast, setToast] = useState(null);

  const [roleData, setRoleData] = useState([]);

  const limit = 6;

  // Fetch agents and regions on mount
  useEffect(() => {
    fetchAgents();
    // fetchRegions();
  }, [currentPage, filters, searchQuery]);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(currentPage, limit, {
        search: searchQuery,
        ...filters,
      });
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const roleResponse = await axios.get(`${api}/roles/all-roles`, config);
      setRoleData(roleResponse?.data?.roles?.roles || []);

      const agentsData = response?.users?.users || [];
      setAgents(agentsData);
      setFilteredAgents(agentsData);
      setTotalPages(Math.ceil(response?.users?.totalUser / limit));
      setStats({
        totalUser: response?.users?.totalUser || 0,
        totalAgent: response?.users?.totalAgent || 0,
        totalPartner: response?.users?.totalPartner || 0,
        activeUser: response?.users?.activeUser || 0,
        blockedUser: response?.users?.blockedUser || 0,
      });
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (id, newStatus, agent) => {
    setUpdatingId(id);

    // const formData = {
    //   fullName: agent.name,
    //   email: agent.email,
    //   password: agent.password,
    //   phoneNumber: agent.phoneNumber,
    //   role: newStatus,
    // };

    try {
      const response = await updateUserRole(id, { userRole: newStatus });

      // const response=createAdmin({ adminData: formData });
      setToast({
        message: response.message
          ? response.message
          : "user role updated successfully",
        type: "success",
      });

      fetchAgents();
    } catch (error) {
      setToast({
        message: "Failed to update role",
        type: "error",
      });
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
    setFilters({ roleId: "", status: "" });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleDelete = async (id, type) => {
    setType(type);
    setAgentId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      if (type === "block" || type === "unblock") {
        if (type === "unblock") {
          await blockUser(agentId, { status: "active" });
          setToast({ message: "user unblocked successfully", type: "success" });
        }
        if (type === "block") {
          await blockUser(agentId, { status: "blocked" });
          setToast({ message: "user blocked successfully", type: "success" });
        }
        fetchAgents();
        setDeleteDialogOpen(false);
      } else {
        await deleteUser(agentId);
        MyToast(  "user deleted successfully",  "success" );
        fetchAgents();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      MyToast( error.message||"failed to delete",  "error" );
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
  const MyTableCell = ({ status }) => {
    return (
      <td
        className={`pt-8 px-2 text-sm hidden md:table-cell ${
          status === "active" ? "text-green-600" : "text-red-600"
        }`}
      >
        {status === "active" ? "Active" : "Blocked"}
      </td>
    );
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
          User Management
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-4"
          >
            <User className="h-8 w-8 text-[#EB6407]" />
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.totalUser}
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
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.totalAgent}
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
              <p className="text-sm text-gray-600">Total Partners</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.totalPartner}
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
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.activeUser}
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
              <p className="text-sm text-gray-600">Blocked Users</p>
              <p className="text-xl md:text-2xl font-bold text-[#3a4253]">
                {stats.blockedUser}
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
                <button
                  onClick={() => {
                    setIsCreateAdminOpen(true);
                  }}
                  className="bg-orange-500 px-3 rounded-md text-white py-2"
                >
                  create admin/assistant
                </button>
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
                        Role Type
                      </label>

                      <select
                        name="roleId"
                        value={filters.roleId}
                        onChange={handleFilterChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                      >
                        <option value="">All</option>
                        {roleData.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                      >
                        <option value="">All</option>
                        <option value="active">active</option>
                        <option value="blocked">blocked</option>
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
                            Email{" "}
                          </th>
                          <th className="p-3 text-left text-sm font-medium  md:table-cell">
                            Status
                          </th>

                          <th className="p-3 text-left text-sm font-medium  lg:table-cell">
                            Role
                          </th>
                          <th className="p-3 text-left text-sm font-medium  lg:table-cell">
                            Date Created
                          </th>

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
                                  {agent.name}
                                </td>
                                <td className="p-3 text-sm text-gray-600 ">
                                  {agent.email}
                                </td>
                                {/* <td className="p-3 text-sm text-gray-600  md:table-cell"> */}
                                <tr>
                                  <MyTableCell status={agent.status} />
                                </tr>{" "}
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                  <div className="relative">
                                    <select
                                      disabled
                                      className={`px-3 py-2 text-base bg-white rounded-md transition-colors duration-300 ease-in-out shadow-none ${
                                        agent.Role.name === "admin"
                                          ? "text-emerald-700 hover:text-emerald-500"
                                          : agent.Role.name === "agent"
                                          ? "text-slate-700 hover:text-slate-500"
                                          : agent.Role.name === "partner"
                                          ? "text-amber-700 hover:text-amber-500"
                                          : agent.Role.name === "user"
                                          ? "text-blue-700 hover:text-blue-500"
                                          : agent.Role.name === "regionAdmin"
                                          ? "text-green-700 hover:text-green-500"
                                          : agent.Role.name === "zoneAdmin"
                                          ? "text-purple-700 hover:text-purple-500"
                                          : agent.Role.name === "woredaAdmin"
                                          ? "text-red-700 hover:text-red-500"
                                          : "text-gray-700"
                                      } cursor-pointer`}
                                      value={agent.Role.name}
                                      onChange={(e) =>
                                        handleRoleChange(
                                          agent.id,
                                          e.target.value,
                                          agent
                                        )
                                      }
                                    >
                                      <option value="">select role</option>
                                      <option value="assistant">
                                        Assistant
                                      </option>

                                      <option value="admin">Admin</option>
                                      <option value="agent">Agent</option>
                                      <option value="partner">Partner</option>
                                      <option value="user">User</option>
                                      <option value="regionAdmin">
                                        Region Admin
                                      </option>
                                      <option value="zoneAdmin">
                                        Zone Admin
                                      </option>
                                      <option value="woredaAdmin">
                                        Woreda Admin
                                      </option>
                                    </select>
                                    {updatingId === agent.id && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-sm text-gray-600  lg:table-cell">
                                  {new Date(agent.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      // hour: "2-digit",
                                      // minute: "2-digit",
                                      // second: "2-digit",
                                    }
                                  )}
                                </td>
                                <td>
                                  <div className="flex items-center space-x-2 mr-2">
                                    {agent.status === "blocked" ? (
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() =>
                                          handleDelete(agent.id, "unblock")
                                        }
                                        className="flex items-center text-green-600 hover:bg-green-100 transition-colors px-2 py-1 rounded-md text-xs border border-green-300"
                                        title="Unblock User"
                                      >
                                        <span>Unblock</span>
                                      </motion.button>
                                    ) : (
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() =>
                                          handleDelete(agent.id, "block")
                                        }
                                        className="flex items-center text-orange-600 hover:bg-orange-100 transition-colors px-2 py-1 rounded-md text-xs border border-orange-300"
                                        title="Block User"
                                      >
                                        <span>Block</span>
                                      </motion.button>
                                    )}
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      onClick={() =>
                                        handleDelete(agent.id, "delete")
                                      }
                                      className="flex items-center text-red-600 hover:bg-red-100 transition-colors px-2 py-1 rounded-md text-xs border border-red-300 "
                                      title="Delete User "
                                    >
                                      {/* <Trash2 className="h-4 w-4 mr-1" /> */}
                                      <span>Delete</span>
                                    </motion.button>
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
                                No users found matching your criteria
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
                      {filteredAgents.length} users
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
              Recent Users
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
                      {agent.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {agent?.email}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {agent?.Role?.name}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No recent users
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
        <AnimatePresence>
          {isCreateAdminOpen && (
            <CreateAdmin
              onClose={() => setIsCreateAdminOpen(false)}
              onCreated={fetchAgents}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminUser;
