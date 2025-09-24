import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import ZoneService from "../../services/ZoneService";

const AddWoredaModal = ({ isOpen, onClose, zoneId, onWoredaAdded }) => {
  const [woredaName, setWoredaName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!woredaName.trim()) {
      setError("Woreda name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      await ZoneService.createWoreda({ name: woredaName }, zoneId);
      setWoredaName("");
      onWoredaAdded();
      onClose();
    } catch (err) {
      setError("Failed to add woreda");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 border border-[#d1d3d4] shadow-md ">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1F2937]">
            Add New Woreda
          </h3>
          <button
            onClick={onClose}
            className="text-[#1F2937] hover:text-[#4B5563]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">
              Woreda Name
            </label>
            <input
              type="text"
              value={woredaName}
              onChange={(e) => setWoredaName(e.target.value)}
              className="w-full p-2 border border-[#dfe1e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] text-[#1F2937]"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#1F2937] hover:text-[#4B5563] rounded-md border border-[#dcdddf] hover:bg-[#E5E7EB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
            >
              {isSubmitting ? "Adding..." : "Add Woreda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ZoneDetailModal = ({ isOpen, onClose, zone }) => {
  const [woredas, setWoredas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isOpen && zone) {
      const fetchWoredas = async () => {
        setLoading(true);
        try {
          const data = await ZoneService.getZoneById(zone.id);
          setWoredas(data?.woredas || []); // Handle empty array
        } catch (err) {
          console.error(err);
          setError(err.message||"Failed to fetch woredas");
        } finally {
          setLoading(false);
        }
      };
      fetchWoredas();
    }
  }, [isOpen, zone]);

  if (!isOpen || !zone) return null;

  // Calculate pagination
  const totalWoredas = woredas.length;
  const totalPages = Math.ceil(totalWoredas / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWoredas = woredas.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 border border-[#4B5563] shadow-lg overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1F2937]">Zone Details</h3>
          <button
            onClick={onClose}
            className="text-[#1F2937] hover:text-[#4B5563]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-[#1F2937]">
          <p>
            <strong>Zone ID:</strong> {zone?.id}
          </p>
          <p>
            <strong>Zone Name:</strong> {zone?.name}
          </p>
          <p>
            <strong>Region:</strong> {zone?.egion?.name} (ID: {zone?.regionId})
          </p>
          <p>
            <strong>Woredas:</strong>
          </p>
          {loading ? (
            <p>Loading woredas...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : currentWoredas.length > 0 ? (
            <ul className="ml-4 list-disc">
              {currentWoredas.map((woreda) => (
                <li key={woreda.id}>{woreda.name}</li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-4 border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">🚫 No Woredas Found</p>
              <p className="text-sm text-gray-400">
                Try adding some woredas to this zone!
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-200 text-[#1F2937] rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-[#1F2937]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-4 py-2 bg-gray-200 text-[#1F2937] rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const UpdateZoneModal = ({ isOpen, onClose, zone, onZoneUpdated, regions }) => {
  const [zoneName, setZoneName] = useState(zone?.name || "");
  const [regionId, setRegionId] = useState(zone?.regionId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zoneName.trim() || !regionId) {
      setError("Zone name and region are required");
      return;
    }
    setIsSubmitting(true);
    try {
      await ZoneService.updateZone(zone.id, { name: zoneName, regionId });
      onZoneUpdated(); // Refresh the zone list or specific zone data
      onClose();
    } catch (err) {
      setError("Failed to update zone");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 border border-[#d1d3d4] shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1F2937]">Update Zone</h3>
          <button
            onClick={onClose}
            className="text-[#1F2937] hover:text-[#4B5563]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">
              Zone Name
            </label>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="w-full p-2 border border-[#dfe1e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] text-[#1F2937]"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1F2937]">
              Region
            </label>
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full p-2 border border-[#dfe1e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] text-[#1F2937]"
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#1F2937] hover:text-[#4B5563] rounded-md border border-[#dcdddf] hover:bg-[#E5E7EB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Zone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminZone = () => {
  const [zones, setZones] = useState([]);
  const [regions, setRegions] = useState([]);
  const [newZoneData, setNewZoneData] = useState({ name: "", regionId: "" });
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isAddWoredaModalOpen, setIsAddWoredaModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isUpdateZoneModalOpen, setIsUpdateZoneModalOpen] = useState(false);
  const [deletingZoneId, setDeletingZoneId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [filteredZones, setFilteredZones] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState(""); // New state for selected region
  // useEffect(() => {
  //   fetchRegions();
  //   fetchZones();
  // }, [currentPageNum, searchText]);

  const limit = 6;
  useEffect(() => {
    fetchRegions();
    fetchZones();
  }, [currentPageNum, searchText, selectedRegionId]);
  const fetchRegions = async () => {
    try {
      const data = await ZoneService.getRegions();
      setRegions(data?.regions?.regions || []);
    } catch (error) {
      setNotification({ message: "Failed to load regions", type: "error" });
    }
  };

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const data = await ZoneService.getAllZones(currentPageNum, {
        search: searchText,
        regionId: selectedRegionId,
        limit: limit,
      });
      setZones(data?.zones || []);
      setTotalPageCount(Math.ceil(data?.totalZone / limit));
      setFilteredZones(data?.zones || []);
    } catch (error) {
      setNotification({ message: "Failed to load zones", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleZoneDetail = (zone) => {
    setSelectedZone(zone);
    setIsDetailModalOpen(true);
  };

  const handleCreateZone = async (e) => {
    e.preventDefault();
    if (!newZoneData?.name.trim() || !newZoneData.regionId) {
      setNotification({
        message: "Zone name and region are required",
        type: "error",
      });
      return;
    }
    setIsLoading(true);
    try {
      await ZoneService.createZone(newZoneData);
      setNewZoneData({ name: "", regionId: "" });
      fetchZones();
      setNotification({
        message: "Zone created successfully",
        type: "success",
      });
    } catch (error) {
      setNotification({ message: "Failed to create zone", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.trim());
    setCurrentPageNum(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPageCount) {
      setCurrentPageNum(newPage);
      // fetchZones();
    }
  };

  const handleWoredaAdded = () => {
    setNotification({
      message: "woreda created successfully",
      type: "success",
    });
    fetchZones();
  };
  const onZoneUpdated = () => {
    setNotification({
      message: "zone updated successfully",
      type: "success",
    });
    fetchZones();
  };
  const regionStats = regions?.map((region) => {
    const regionZones = zones?.filter((zone) => zone.regionId === region.id);
    const woredaCount = regionZones?.reduce(
      (acc, zone) => acc + (zone?.woredas ? zone?.woredas?.length : 0),
      0
    );
    return { ...region, zoneCount: regionZones?.length, woredaCount };
  });

  return (
    <div className="min-h-screen bg-gray-50 lg:p-6 ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 ">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-4 md:mb-0">
            Manage Zones
          </h1>
          <div className="flex  space-x-4">
            <form
              onSubmit={handleCreateZone}
              className="flex flex-col lg:flex-row items-center space-x-2"
            >
              <select
                value={newZoneData.regionId}
                onChange={(e) =>
                  setNewZoneData((prev) => ({
                    ...prev,
                    regionId: e.target.value,
                  }))
                }
                className="p-2 w-full border border-[#dfe1e2] rounded-md focus:outline-none text-[#1F2937] bg-white"
              >
                <option value="">Select Region</option>
                {regions?.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region?.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newZoneData?.name}
                onChange={(e) =>
                  setNewZoneData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="New Zone Name"
                className="p-2 border w-full border-[#dfe1e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] text-[#1F2937] placeholder-[#6B7280]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-[#EB6407] text-white rounded-md hover:bg-[#C05600] transition-colors disabled:opacity-50 w-full"
              >
                <Plus className="h-5 w-5 mr-2" /> Add Zone
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 border border-[#e0e1e2] flex flex-col md:flex-row md:justify-between">
          <div className="relative mb-4 md:mb-0 md:flex-1 ">
            <Search className="absolute left-3 top-3 h-5 w-5 text-[#6B7280]" />
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search zones..."
              className="w-full pl-10 p-2 border border-[#e0e1e2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] text-[#1F2937] placeholder-[#6B7280] transition duration-200 ease-in-out"
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <select
              value={selectedRegionId}
              onChange={(e) => {
                const regionId = e.target.value;
                setSelectedRegionId(regionId);
              }}
              className="p-2 border border-[#dfe1e2] rounded-md focus:outline-none text-[#1F2937] bg-white transition duration-200 ease-in-out"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg overflow-hidden border border-[#e0e1e2]">
              {isLoading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="h-8 w-8 border-4 border-t-[#EB6407] border-gray-200 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="p-4">
                  {filteredZones.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredZones.map((zone) => (
                        <motion.div
                          key={zone.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow relative"
                        >
                          <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mb-2">
                            {zone?.name}
                          </h3>
                          <div className="text-sm text-[#6B7280]">
                            {regions.map((region) => {
                              if (region.id === zone.regionId) {
                                return (
                                  <p key={region.id}>
                                    <strong>Region:</strong> {region.name}
                                  </p>
                                );
                              }
                              return null;
                            })}
                          </div>

                          <div className="mt-2 text-sm text-[#6B7280]">
                            <p>
                              <strong>Woredas: {zone?.woredas?.length}</strong>
                            </p>
                            <ul className="ml-4 list-disc truncate">
                              {zone?.woredas && zone?.woredas?.length > 0 ? (
                                zone?.woredas
                                  ?.slice(0, 2)
                                  .map((woreda) => (
                                    <li key={woreda.id}>{woreda?.name}</li>
                                  ))
                              ) : (
                                <li>No woredas</li>
                              )}
                              {zone?.woredas && zone?.woredas?.length > 2 && (
                                <li className="text-[#6B7280]">
                                  +{zone?.woredas?.length - 2} more...
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="mt-4 flex flex-wrap justify-end space-x-2">
                            {/* Add Woreda Button */}
                            <div className="group relative">
                              <button
                                onClick={() => {
                                  setSelectedZone(zone);
                                  setIsAddWoredaModalOpen(true);
                                }}
                                className="flex items-center px-3 py-1 text-[#EB6407] border border-[#EB6407] rounded-md hover:bg-[#EB6407] hover:text-white transition-colors"
                                aria-label="Add Woreda"
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                              <span className="absolute hidden group-hover:block text-[#EB6407] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                                Add Woreda
                              </span>
                            </div>

                            {/* Edit Button */}
                            <div className="group relative">
                              <button
                                onClick={() => {
                                  setSelectedZone(zone);
                                  setIsUpdateZoneModalOpen(true);
                                }}
                                className="flex items-center px-3 py-1 text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-[#007BFF] hover:text-white transition-colors"
                                aria-label="Edit Zone"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <span className="absolute hidden group-hover:block text-[#007BFF] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                                Edit
                              </span>
                            </div>

                            {/* Show Details Button */}
                            <div className="group relative">
                              <button
                                onClick={() => handleZoneDetail(zone)}
                                className="flex items-center px-3 py-1 text-[#6C757D] border border-[#6C757D] rounded-md hover:bg-[#6C757D] hover:text-white transition-colors"
                                aria-label="Show Zone Details"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <span className="absolute hidden group-hover:block text-[#6C757D] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                                Detail
                              </span>
                            </div>

                            {/* Delete Button */}
                            <div className="group relative">
                              <button
                                onClick={async () => {
                                  setDeletingZoneId(zone.id); // Set the ID of the zone being deleted
                                  setIsDeleting(true); // Start loading
                                  try {
                                    await ZoneService.deleteZone(zone.id); // Implement this service method
                                    fetchZones(); // Refresh the zone list after deletion
                                    setNotification({
                                      message: "Zone deleted successfully",
                                      type: "success",
                                    });
                                  } catch (error) {
                                    setNotification({
                                      message: "Failed! First delete woredas",
                                      type: "error",
                                    });
                                  } finally {
                                    setIsDeleting(false); // Stop loading
                                    setDeletingZoneId(null); // Reset the deleting zone ID
                                  }
                                }}
                                className={`flex items-center px-3 py-1 text-[#DC3545] border border-[#DC3545] rounded-md transition-colors ${
                                  isDeleting && deletingZoneId === zone.id
                                    ? "opacity-50"
                                    : "hover:bg-[#DC3545] hover:text-white"
                                }`}
                                disabled={
                                  isDeleting && deletingZoneId === zone.id
                                } // Disable only for the specific zone being deleted
                                aria-label="Delete Zone"
                              >
                                {isDeleting && deletingZoneId === zone.id ? (
                                  <div className="loader h-5 w-5 border-2 border-t-red-600 rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                              <span className="absolute hidden group-hover:block text-[#DC3545] text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2">
                                Delete
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-[#6B7280] py-4">
                      No zones found
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-[#e0e1e2]">
                <span className="text-sm text-[#6B7280]">
                  Showing page {currentPageNum} of {totalPageCount} •{" "}
                  {zones.length} zones
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPageNum - 1)}
                    disabled={currentPageNum === 1}
                    className="px-3 py-1 bg-white border border-[#e0e1e2] text-[#1F2937] rounded-md disabled:opacity-50 hover:bg-[#E5E7EB]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPageNum + 1)}
                    disabled={currentPageNum === totalPageCount}
                    className="px-3 py-1 bg-white border border-[#e0e1e2] text-[#1F2937] rounded-md disabled:opacity-50 hover:bg-[#E5E7EB]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 sticky top-6 border border-[#e0e1e2] shadow-sm">
              <h2 className="text-xl font-semibold text-[#1F2937] mb-4">
                Region Statistics
              </h2>
              <div className="space-y-4">
                {regionStats?.length > 0 ? (
                  regionStats?.map((region, index) => (
                    <div
                      key={region.id}
                      className={`p-3 ${
                        index < regionStats?.length - 1
                          ? "border-b-2 border-[#EB6407]"
                          : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-[#1F2937]">
                        {region?.name}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Zones: {region?.zoneCount}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Woredas: {region?.woredaCount}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6B7280] text-center py-4">
                    No regions available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-6 right-6 p-4 rounded-lg flex items-center space-x-2 ${
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
          {isAddWoredaModalOpen && (
            <AddWoredaModal
              isOpen={isAddWoredaModalOpen}
              onClose={() => setIsAddWoredaModalOpen(false)}
              zoneId={selectedZone?.id}
              onWoredaAdded={handleWoredaAdded}
            />
          )}
          {isDetailModalOpen && (
            <ZoneDetailModal
              isOpen={isDetailModalOpen}
              onClose={() => setIsDetailModalOpen(false)}
              zone={selectedZone}
            />
          )}
          {isUpdateZoneModalOpen && (
            <UpdateZoneModal
              isOpen={isUpdateZoneModalOpen}
              onClose={() => setIsUpdateZoneModalOpen(false)}
              zone={selectedZone}
              onZoneUpdated={onZoneUpdated} // Refresh zones after update
              regions={regions} // Pass regions for the dropdown
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AdminZone;
