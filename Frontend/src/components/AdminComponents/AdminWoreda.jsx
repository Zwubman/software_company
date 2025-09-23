import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  SortAsc,
  SortDesc,
  XCircle,
  CheckCircle,
} from "lucide-react";
import WoredaService from "../../services/WoredaService";

const Notification = ({ notification, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-8 right-8 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
      notification.type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`}
  >
    {notification.type === "success" ? (
      <CheckCircle className="h-5 w-5" />
    ) : (
      <XCircle className="h-5 w-5" />
    )}
    <span className="font-medium">{notification.message}</span>
    <button onClick={onClose} className="ml-2 hover:text-gray-200">
      <X className="h-5 w-5" />
    </button>
  </motion.div>
);

const UpdateWoredaModal = ({
  isOpen,
  onClose,
  woreda,
  onWoredaUpdated,
  zones,
}) => {
  const [woredaData, setWoredaData] = useState({ name: "", zoneId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && woreda) {
      setWoredaData({ name: woreda?.name, zoneId: woreda.zoneId });
    }
  }, [isOpen, woreda]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!woredaData?.name.trim() || !woredaData.zoneId) {
      setError("Woreda name and zone are required");
      return;
    }
    setIsSubmitting(true);
    try {
      await WoredaService.updateWoreda(woreda.id, woredaData);
      onWoredaUpdated();
      onClose();
    } catch (err) {
      setError("Failed to update woreda");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#A04600]">
            Update Woreda
          </h3>
          <button
            onClick={onClose}
            className="text-[#A04600] hover:text-[#C05600]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#A04600]">
              Woreda Name
            </label>
            <input
              type="text"
              value={woredaData?.name}
              onChange={(e) =>
                setWoredaData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C05600] text-[#A04600] shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#A04600]">
              Zone
            </label>
            <select
              value={woredaData?.zoneId}
              onChange={(e) =>
                setWoredaData((prev) => ({ ...prev, zoneId: e.target.value }))
              }
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C05600] text-[#A04600] shadow-sm"
            >
              <option value="">Select Zone</option>
              {zones?.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone?.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#A04600] hover:text-[#C05600] rounded-md border hover:bg-[#FBE9E7] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Woreda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminWoreda = () => {
  const [woredas, setWoredas] = useState([]);
  const [zones, setZones] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredWoredas, setFilteredWoredas] = useState([]);
  const [newWoredaData, setNewWoredaData] = useState({
    regionId: "",
    zoneId: "",
    name: "",
  });
  const [filter, setFilter] = useState({ regionId: "", zoneId: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedWoreda, setSelectedWoreda] = useState(null);
  const [totalWoredas, setTotalWoredas] = useState(0);
  useEffect(() => {
    fetchRegions();
    fetchZones();
    // fetchWoredas();
  }, []);

  useEffect(() => {
    fetchWoredas();
  }, [searchText, currentPageNum, filter]);
  const limit = 6;
  const fetchRegions = async () => {
    try {
      const data = await WoredaService.getRegions();
      setRegions(data?.regions?.regions || []);
    } catch (error) {
      setNotification({ message: "Failed to load regions", type: "error" });
    }
  };

  const fetchZones = async () => {
    try {
      const data = await WoredaService.getZones();
      setZones(data?.zones);
    } catch (error) {
      setNotification({ message: "Failed to load zones", type: "error" });
    }
  };

  const fetchWoredas = async () => {
    setIsLoading(true);
    try {
      const response = await WoredaService.getAllWoredas(currentPageNum, {
        search: searchText,
        limit: limit, // Use limit variable
        zoneId: filter.zoneId,
        regionId: filter.regionId,
      });
      setTotalWoredas(response?.woredas?.total || 0);

      setWoredas(response?.woredas?.rows || []);
      setTotalPageCount(Math.ceil(response?.woredas?.total / limit));
    } catch (error) {
      setNotification({ message: "Failed to load woredas", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPageCount) {
      setCurrentPageNum(newPage);
      // fetchWoredas(); // Fetch new data for the new page
    }
  };

  const handleCreateWoreda = async (e) => {
    e.preventDefault();
    if (!newWoredaData?.name.trim() || !newWoredaData.zoneId) {
      setNotification({
        message: "Woreda name and zone are required",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    try {
      await WoredaService.createWoreda(newWoredaData);
      setNewWoredaData({ regionId: "", zoneId: "", name: "" });
      fetchWoredas();
      setNotification({
        message: "Woreda created successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({ message: "Failed to create woreda", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWoreda = () => {
    fetchWoredas();
    setNotification({
      message: "Woreda updated successfully",
      type: "success",
    });
  };

  const handleDeleteWoreda = async (woredaId) => {
    // if (!confirm("Are you sure you want to delete this woreda?")) return;
    setIsLoading(true);
    try {
      await WoredaService.deleteWoreda(woredaId);
      fetchWoredas();
      setNotification({
        message: "Woreda deleted successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({ message: "Failed to delete woreda", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.trim());
    setCurrentPageNum(1);
  };

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPageCount) {
  //     setCurrentPageNum(newPage);
  //   }
  // };

  const filteredZones = newWoredaData?.regionId
    ? zones.filter(
        (zone) => zone?.regionId === parseInt(newWoredaData?.regionId)
      )
    : zones;

  const stats = {
    totalRegions: regions?.length,
    totalZones: zones?.length,
    totalWoredas: totalWoredas,
  };

  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex gap-6"
      >
        <div className="flex-1 p-6">
          <header className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">
              Woreda Management
            </h1>
            <form
              onSubmit={handleCreateWoreda}
              className="flex flex-col lg:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
            >
              <select
                value={newWoredaData?.regionId}
                onChange={(e) =>
                  setNewWoredaData((prev) => ({
                    ...prev,
                    regionId: e.target.value,
                    zoneId: "",
                  }))
                }
                className="p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C05600] text-[#A04600] bg-white"
              >
                <option value="">Select Region</option>
                {regions?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region?.name}
                  </option>
                ))}
              </select>
              <select
                value={newWoredaData?.zoneId}
                onChange={(e) =>
                  setNewWoredaData((prev) => ({
                    ...prev,
                    zoneId: e.target.value,
                  }))
                }
                className="p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C05600] text-[#A04600] bg-white"
                disabled={!newWoredaData?.regionId}
              >
                <option value="">Select Zone</option>
                {filteredZones?.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone?.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newWoredaData?.name}
                onChange={(e) =>
                  setNewWoredaData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Woreda Name"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C05600] text-[#A04600] bg-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 w-full py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" /> Add 
              </button>
            </form>
          </header>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-300 shadow-md">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#EB6407]" />
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="Search woredas by name..."
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] text-[#333] shadow-sm"
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={filter?.regionId}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      regionId: e.target.value,
                      zoneId: "",
                    }))
                  }
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] text-[#333] shadow-sm"
                >
                  <option value="">Filter by Region</option>
                  {regions?.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filter.zoneId}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, zoneId: e.target.value }))
                  }
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] text-[#333] shadow-sm"
                  disabled={!filter?.regionId}
                >
                  <option value="">Filter by Zone</option>
                  {filter.regionId &&
                    zones
                      .filter(
                        (zone) => zone?.regionId === parseInt(filter?.regionId)
                      )
                      .map((zone) => (
                        <option key={zone?.id} value={zone.id}>
                          {zone?.name}
                        </option>
                      ))}
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-2 border border-gray-300 rounded-md text-[#EB6407] hover:bg-[#FBE9E7] transition-shadow shadow-sm"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-5 w-5" />
                  ) : (
                    <SortDesc className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-12 w-12 border-4 border-t-[#EB6407] border-gray-200 rounded-full animate-spin"></div>
              </div>
            ) : woredas?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {woredas
                  // .slice((currentPageNum - 1) * limit, currentPageNum * limit)
                  .map((woreda) => (
                    <motion.div
                      key={woreda.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow relative"
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-2">
                          {woreda?.name}
                        </h3>
                      </div>
                      <AnimatePresence>
                        {/* {expandedWoreda === woreda.id ? ( */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 text-sm text-[#555] space-y-2"
                        >
                          <p>
                            <strong>ID:</strong> {woreda.id}
                          </p>
                          <p>
                            <strong>Zone:</strong> {woreda?.zone?.name}
                          </p>
                          <p>
                            <strong>Region:</strong>{" "}
                            {regions.find(
                              (region) => region?.id === woreda?.zone?.regionId
                            )?.name || "Unknown"}
                          </p>
                        </motion.div>
                        {/* ) : null} */}
                      </AnimatePresence>

                      <div className="flex justify-end mt-4 gap-4">
                        <button
                          onClick={() => {
                            setSelectedWoreda(woreda);
                            setIsUpdateModalOpen(true);
                          }}
                          className="flex items-center px-3 py-1 text-[#798191] border border-[#798191] rounded-md hover:bg-[#798191] hover:text-white transition-colors"
                          title="Edit Woreda"
                        >
                          <Edit className="h-5 w-5" />
                          <span className="ml-2 font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteWoreda(woreda.id)}
                          className="flex items-center px-3 py-1 text-[#EB6407] border border-[#EB6407] rounded-md hover:bg-[#EB6407] hover:text-white transition-colors"
                          title="Delete Woreda"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="ml-2 font-medium">Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#A04600]">
                <p>No woredas found</p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6 text-sm text-[#A04600]">
            <span>
              Page {currentPageNum} of {totalPageCount} •{" "}
              {filteredWoredas?.length} woredas
            </span>
            <div className="flex space-x-4">
              <button
                onClick={() => handlePageChange(currentPageNum - 1)}
                disabled={currentPageNum === 1}
                className="px-4 py-2 bg-white border rounded-md text-[#A04600] hover:bg-[#FBE9E7] disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPageNum + 1)}
                disabled={currentPageNum === totalPageCount}
                className="px-4 py-2 bg-white border rounded-md text-[#A04600] hover:bg-[#FBE9E7] disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-64 bg-white rounded-lg p-4 border border-gray-200 sticky top-6 h-fit">
          <h2 className="text-lg font-semibold text-[#A04600] mb-4">
            Statistics
          </h2>
          <div className="space-y-3 text-sm text-[#A04600]">
            <p>
              <strong>Total Regions:</strong> {stats.totalRegions}
            </p>
            <p>
              <strong>Total Zones:</strong> {stats.totalZones}
            </p>
            <p>
              <strong>Total Woredas:</strong> {stats.totalWoredas}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {notification && (
            <Notification
              notification={notification}
              onClose={() => setNotification(null)}
            />
          )}
          {isUpdateModalOpen && (
            <UpdateWoredaModal
              isOpen={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              woreda={selectedWoreda}
              onWoredaUpdated={handleUpdateWoreda}
              zones={zones}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminWoreda;
