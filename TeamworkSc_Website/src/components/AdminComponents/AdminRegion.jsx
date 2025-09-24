import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ChevronLeft,
  X,
  ChevronRight,
  Edit,
  Trash,
} from "lucide-react";
import RegionService from "../../services/RegionService";
import ZoneService from "../../services/ZoneService";

const AdminRegion = () => {
  const [regions, setRegions] = useState([]);
  const [newRegionName, setNewRegionName] = useState("");
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [editingRegion, setEditingRegion] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [expandedRegions, setExpandedRegions] = useState({});

  useEffect(() => {
    fetchRegions();
  }, [currentPageNum, searchText]);
  const limit = 5;
  const fetchRegions = async () => {
    setIsLoading(true);
    try {
      const data = await RegionService.getAllRegions(currentPageNum, {
        search: searchText,
        limit: limit,
      });
      setRegions(data?.regions?.regions || []);
      setTotalPageCount(Math.ceil(data?.regions?.totalRegion / limit));
    } catch (error) {
      setNotification({ message: "Failed to load regions", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRegion = async (e) => {
    e.preventDefault();
    if (!newRegionName.trim()) {
      setNotification({ message: "Region name is required", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      await RegionService.createRegion({ name: newRegionName });
      setNewRegionName("");
      fetchRegions();
      setNotification({
        message: "Region created successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({ message: "Failed to create region", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRegion = async (e) => {
    e.preventDefault();
    if (!newRegionName.trim()) {
      setNotification({ message: "Region name is required", type: "error" });
      return;
    }
    setIsLoading(true);
    try {
      await RegionService.updateRegion(editingRegion.id, {
        name: newRegionName,
      });
      setEditingRegion(null);
      setShowEditDialog(false);
      setNewRegionName("");
      fetchRegions();
      setNotification({
        message: "Region updated successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({ message: "Failed to update region", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteZone = async (zoneId, woredas) => {
    if (woredas !== 0) {
      setNotification({
        message: "Delete Woredas First!!",
        type: "error",
      });
    } else {
      setIsLoading(true);
      try {
        await ZoneService.deleteZone(zoneId); // Assuming you have this function
        fetchRegions();
        setNotification({
          message: "Zone deleted successfully",
          type: "success",
        });
      } catch (error) {
        setNotification({ message: "Failed to delete zone", type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteRegion = async (regionId, zones) => {
    if (zones !== 0) {
      setNotification({
        message: "First delete zones before deleting the region",
        type: "error",
      });
    } else {
      setIsLoading(true);
      try {
        await RegionService.deleteRegion(regionId);
        fetchRegions();
        setNotification({
          message: "Region deleted successfully",
          type: "success",
        });
      } catch (error) {
        setNotification({ message: "Failed to delete region", type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.trim());
    setCurrentPageNum(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPageCount) {
      setCurrentPageNum(newPage);
      // fetchRegions(); // Fetch regions when page changes
    }
  };

  const toggleExpand = (regionId) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regionId]: !prev[regionId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            Manage Regions
          </h1>
          <form
            onSubmit={handleCreateRegion}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={newRegionName}
              onChange={(e) => setNewRegionName(e.target.value)}
              placeholder="New Region Name"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 w-full md:w-64"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Plus className="h-5 w-5 mr-2" /> Add
            </button>
          </form>
        </div>

        <div className="relative mb-6">
          <div className="absolute left-3 top-2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search regions..."
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="h-8 w-8 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="p-4">
              {regions?.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {regions?.map((region) => (
                    <motion.div
                      key={region.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow relative"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-2">
                        {region.name}
                      </h3>
                      <div className="my-2 text-sm text-gray-600">
                        <p className="font-medium text-gray-700 mb-1">
                          <strong>Zones:</strong> {region?.Zones?.length}
                        </p>
                        {region?.Zones?.length > 0 ? (
                          <ul className="ml-4 list-disc">
                            {region?.Zones?.slice(
                              0,
                              expandedRegions[region.id]
                                ? region?.Zones?.length
                                : 3
                            ).map((zone) => (
                              <li
                                key={zone.id}
                                className={`flex justify-between items-center p-2 rounded-md ${
                                  zone?.woredas?.length === 0
                                    ? "bg-gray-50 text-blue-950"
                                    : "bg-gray-50 text-blue-950"
                                } mb-1`}
                              >
                                <span>{zone.name}</span>
                                <span
                                  className={`flex justify-between semi bold items-center p-2 rounded-md ${
                                    zone?.woredas?.length === 0
                                      ? "text-red-600"
                                      : "text-green-600"
                                  } mb-1`}
                                >
                                  {zone?.woredas?.length} Woredas
                                </span>
                                <button
                                  onClick={() =>
                                    handleDeleteZone(
                                      zone.id,
                                      zone?.woredas?.length
                                    )
                                  }
                                  className={` ${
                                    zone?.woredas?.length > 0
                                      ? "text-gray-300"
                                      : "text-red-500"
                                  }`}
                                >
                                  <Trash className="h-5 w-5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No zones available</p>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-2 md:space-y-0 md:space-x-2">
                        {region?.Zones?.length > 5 ? (
                          <button
                            onClick={() => toggleExpand(region.id)}
                            className="flex items-center text-blue-500 hover:underline"
                          >
                            {expandedRegions[region.id]
                              ? "Show Less"
                              : "View More"}
                          </button>
                        ) : null}
                        <div className="flex space-x-2 items-end">
                          <button
                            onClick={() => {
                              setEditingRegion(region);
                              setNewRegionName(region.name);
                              setShowEditDialog(true);
                            }}
                            className="flex items-center px-3 py-1 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
                          >
                            <Edit className="h-5 w-5 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteRegion(
                                region.id,
                                region?.Zones?.length
                              )
                            }
                            className="flex items-center px-3 py-1 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                          >
                            <Trash className="h-5 w-5 mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No regions found
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Showing page {currentPageNum} of {totalPageCount} •{" "}
              {regions?.length} regions
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPageNum - 1)}
                disabled={currentPageNum === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPageNum + 1)}
                disabled={currentPageNum === totalPageCount}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-12 lg:bottom-6 right-30 lg:right-80 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
                notification.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <span className="text-sm font-medium">
                {notification.message}
              </span>
              <button
                onClick={() => setNotification(null)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showEditDialog && editingRegion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white p-6 rounded-lg shadow-lg w-80"
          >
            <h2 className="text-lg font-semibold mb-4">Edit Region</h2>
            <form onSubmit={handleEditRegion} className="flex flex-col">
              <input
                type="text"
                value={newRegionName}
                onChange={(e) => setNewRegionName(e.target.value)}
                placeholder="Region Name"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 mb-4"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditDialog(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminRegion;
