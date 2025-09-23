import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FilePlus,
  ChevronRight,
  ChevronLeft,
  Loader2,
  FileText,
  User,
  Calendar,
  Clock,
  ArrowLeft,
  X,
} from "lucide-react";
import { Tag, CheckCircle, MapPin, Globe, Users, Edit2 } from "lucide-react"; // Import the necessary icons

import axios from "axios";
import { api } from "../../constants/api";
import {
  createReport,
  deleteReport,
  getMyReports,
  getReportEntries,
  getReportStat,
  updateReport,
  updateReportStatus,
} from "../../services/ReportService";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);
const AdminReport = () => {
  const [reports, setReports] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: null,
    videoUrl: null,
    fileUrl: null,
    regionId: "",
    zoneId: "",
    woredaId: "",
    category: "infrastructure",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useSelector((state) => state.userData);

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [activeTab, setActiveTab] = useState(
    user.role == "agent" ? "my" : "view"
  );
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [total, setTotal] = useState(0);
  const [loadingStates, setLoadingStates] = useState({});
  const [stat, setStat] = useState({});

  useEffect(() => {
    if (user?.role === "admin") {
      fetchReport();
    } else {
      if (activeTab === "view" && user.role !== "agent") {
        fetchReport();
      } else if (activeTab === "my") {
        myReports();
      }
    }
  }, [currentPage, searchText]);

  useEffect(() => {
    fetchRegions();
    user.role !== "agent" && fetchReportStat();
  }, []);

  const fetchReportStat = async () => {
    const response = await getReportStat();
    setStat(response.stats);
  };

  const backFromDetail = () => {
    setActiveTab(user?.role !== "agent" ? "view" : "my");
    if(user?.role !== "agent"){
      fetchReport();
    }else{
      myReports();
    }
    setSelectedReport(null);
  };

  const fetchRegions = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      setIsLoadingRegions(true);
      const response = await axios.get(`${api}/regions/all-region`, config);
      setRegions(response?.data?.regions?.regions || []);
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    } finally {
      setIsLoadingRegions(false);
    }
  };
  const limit = 5;

  const fetchReport = async () => {
    setReports([]);

    try {
      setLoading(true); // Start loading

      const response = await getReportEntries(currentPage, limit, {
        search: searchText,
      });

      setReports(response?.statistics?.reports || []);
      setTotal(response?.statistics?.total);
      setTotalPages(Math.ceil(response?.statistics?.total / limit));
    } catch (error) {
      toast.error(error.message || "failed!");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const myReports = async () => {
    setReports([]);

    try {
      setLoading(true);
      setActiveTab("my");
      setSelectedReport(null);
      const response = await getMyReports(currentPage, limit, {
        search: searchText,
      });
      setReports(response?.report?.reports || []);
      setTotal(response?.report?.total);
      setTotalPages(Math.ceil(response?.report?.total / limit));
    } catch (error) {
      toast.error(error.message || "failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "image") {
      setFormData({ ...formData, imageUrl: file });
      setImagePreview(URL.createObjectURL(file));
    } else if (type === "video") {
      setFormData({ ...formData, videoUrl: file });
      setVideoPreview(URL.createObjectURL(file));
    } else if (type === "file") {
      setFormData({ ...formData, fileUrl: file });
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading

    const data = new FormData();

    // Append the form data
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("regionId", formData.regionId);
    data.append("zoneId", formData.zoneId);
    data.append("woredaId", formData.woredaId);

    // Append files if they exist
    if (formData.imageUrl) data.append("imageUrl", formData.imageUrl);
    if (formData.videoUrl) data.append("videoUrl", formData.videoUrl);
    if (formData.fileUrl) data.append("fileUrl", formData.fileUrl);

    try {
      if (formData.id != null) {
        const response = await updateReport(formData.id, data);
        toast.success(response.message || "Report updated successfully!!!");

        await myReports();
        setActiveTab("my"); // Switch back to view tab after update
      } else {
        const response = await createReport(data);
        toast.success(response.message || "Report created successfully!!!");
        await myReports();
        setActiveTab("my"); // Switch back to view tab after creation
      }
    } catch (error) {
      toast.error(error?.message || "failled, please try again!");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
    resetForm();
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

  const handleEdit = (report) => {
    setFormData({
      id: report.id,
      title: report.title,
      description: report.description,
      category: report.category,
      regionId: report.regionId,
      zoneId: report.zoneId,
      woredaId: report.woredaId,
      imageUrl: report.imageUrl,
      videoUrl: report.videoUrl,
      fileUrl: report.fileUrl,
    });

    setImagePreview(report.imageUrl ? report.imageUrl : null);
    setVideoPreview(report.videoUrl ? report.videoUrl : null);
    setFilePreview(report.fileUrl ? report.fileUrl : null);

    setSelectedRegion(report.regionId);
    setSelectedZone(report.zoneId);
    setActiveTab("add");
  };

  useEffect(() => {
    if (user) {
      const region = regions.find((r) => r.name === user.region);
      const zone = region?.Zones.find((z) => z.name === user.zone);
      const woreda = zone?.woredas.find(
        (w) => w.name === (user.Woreda || user.woreda)
      );

      if (region) {
        setSelectedRegion(region.id);
        setFormData((prev) => ({ ...prev, regionId: region.id }));
      }
      if (zone) {
        setSelectedZone(zone.id);
        setFormData((prev) => ({ ...prev, zoneId: zone.id }));
      }
      if (woreda) {
        setFormData((prev) => ({ ...prev, woredaId: woreda.id }));
      }
    }
  }, [user, regions, zones, woredas]);

  const handleDelete = async (reportId) => {
    setLoadingStates((prev) => ({ ...prev, [reportId]: true })); // Set loading for the specific report
    try {
      const response = await deleteReport(reportId);
      toast.success("Report deleted successfully!!!");
      await fetchReport();

      // if (response.status == "success") {
      //   toast.success(response.message || "Report deleted successfully!!!");
      //   fetchReport();
      // } else {
      //   toast.error(
      //     response.message || "Failed to delete report, please try again!"
      //   );
      // }
    } catch (error) {
      toast.error(
        error?.message || "Failed to delete report, please try again!"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [reportId]: false })); // Set loading for the specific report
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      description: "",
      imageUrl: null,
      videoUrl: null,
      fileUrl: null,
      category: "infrastructure",
      regionId: "",
      zoneId: "",
      woredaId: "",
    });
    setImagePreview(null);
    setVideoPreview(null);
    setFilePreview(null);
    setSelectedRegion("");
    setSelectedZone("");
  };

  const viewReportDetails = (report) => {
    setSelectedReport(report);
    setActiveTab("viewDetails");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.trim());
    // setCurrentPageNum(1);
  };

  const viewAll = () => {
    setActiveTab("view");
    setSelectedReport(null);
    setSearchText("");
    setCurrentPage(1);
    fetchReport();
  };

  const handleStatusChange = async (reportId, e) => {
    const selectedStatus = e.target.value;
    if (selectedStatus) {
      setLoading(true);
      try {
        await updateReportStatus(reportId, selectedStatus); // Update status directly on selection
        toast.success("Status updated successfully!");
        fetchReport(); // Refresh the report list to show updated status
      } catch (error) {
        toast.error(
          error?.message || "Failed to update status, please try again!"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      in_progress: "bg-blue-100 text-blue-800",
      open: "bg-orange-100 text-orange-800",
      resolved: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status];
  };
  return (
    <div className="max-w-7xl mx-auto   ">
      <div>
        <h1 className="text-3xl font-bold text-start mb-6 px-6">
          {user.role === "agent" ? "  Report Management" : " Report Management"}
        </h1>

        {user.role !== "agent" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.totalReports}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.todayReports}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Cancelled Report</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.cancelledReports}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.pendingReports}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 rounded-lg  mx-auto ">
        <div className="w-full bg-white mx-auto h-auto flex flex-col sm:flex-row items-center shadow-md rounded-lg p-4 mb-4">
          <div className="mx-auto w-full flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <input
              type="text"
              className="w-full sm:flex-1 p-3 text-sm  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearchChange}
            />

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              {!(user.role == "agent" || user?.role == "adminn") && (
                <button
                  className={`flex-1 px-4 py-2 rounded ${
                    activeTab === "view"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={viewAll}
                >
                  All Reports
                </button>
              )}
              {user?.role !== "admin" && (
                <button
                  className={`flex-1 px-4 py-2 rounded ${
                    activeTab === "my"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={myReports}
                >
                  My Reports
                </button>
              )}
              {user?.role !== "admin" && (
                <button
                  className={`flex-1 px-4 py-2 rounded ${
                    activeTab === "add"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => {
                    setActiveTab("add");
                    setSelectedReport(null); // Reset the selected report
                  }}
                >
                  Add Report
                </button>
              )}
            </div>
          </div>
        </div>

        {activeTab === "add" && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <h2 className="text-2xl font-bold mb-4">Add Report</h2>
            <div>
              <label className="block text-sm font-medium">Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description:</label>
              <textarea
                name="description"
                rows="8"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              >
                <option value="infrastructure">Infrastructure</option>
                <option value="security">Security</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="environment">Environment</option>
                <option value="transport">Transport</option>
                <option value="emergency">Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Region:</label>
                <select
                  name="regionId"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  // disabled={isLoadingRegions}
                  disabled
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {isLoadingRegions && <p>Loading regions...</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Zone:</label>
                <select
                  name="zoneId"
                  value={selectedZone}
                  onChange={handleZoneChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  // disabled={!selectedRegion}
                  disabled
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
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407]"
                  // disabled={!selectedZone}
                  disabled
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
            <div className="flex-1">
              <label className="block text-sm font-medium">File:</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "file")}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {filePreview && (
                <motion.a
                  href={filePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-blue-600 underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Preview File
                </motion.a>
              )}
            </div>
            <div className="space-y-2 flex flex-col md:flex-row md:space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {imagePreview && (
                  <motion.img
                    src={imagePreview}
                    alt="Image Preview"
                    className="mt-2 rounded-md h-48 w-full object-cover transition-transform duration-200 transform hover:scale-105"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium">Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "video")}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                {videoPreview && (
                  <motion.video
                    src={videoPreview}
                    controls
                    className="mt-2 rounded-md h-48 w-full object-cover transition-transform duration-200 transform hover:scale-105"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </div>
            </div>
            <button
              type="submit"
              className={`mt-4 bg-orange-600 text-white py-2 px-4 rounded-md flex items-center ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <FilePlus className="mr-2" />
              )}
              {isSubmitting
                ? "Processing..."
                : formData.id
                ? "Update Report"
                : "Submit Report"}
            </button>
          </form>
        )}

        {activeTab === "view" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Existing Reports</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full  rounded-lg  overflow-x-scroll">
                <thead className="bg-slate-700 text-white">
                  <tr>
                    <th className=" px-6 py-3 text-left text-sm font-semibold ">
                      Title
                    </th>
                    <th className=" px-6 py-3 text-left text-sm font-semibold   md:table-cell">
                      Description
                    </th>
                    <th className=" px-6 py-3 text-left text-sm font-semibold   md:table-cell">
                      {user?.role === "admin"
                        ? "Region"
                        : user?.role === "regionAdmin"
                        ? "Zone"
                        : "Woreda"}
                    </th>
                    <th className=" px-6 py-3 text-left text-sm font-semibold   md:table-cell">
                      Reported By
                    </th>
                    <th className=" px-6 py-3 text-left text-sm font-semibold ">
                      Status
                    </th>
                    <th className=" px-6 py-3 text-left text-sm font-semibold ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white ">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className=" px-4 py-2 text-center">
                        <Loader /> {/* Loader component displayed here */}
                      </td>
                    </tr>
                  ) : reports?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className=" px-4 py-2 text-center text-gray-500"
                      >
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports?.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b border-gray-300 hover:bg-gray-50 transition duration-150"
                      >
                        <td className=" px-6 py-4 text-sm font-medium text-gray-800">
                          {report.title?.length > 40
                            ? `${report.title.substring(0, 40)}...`
                            : report.title}
                        </td>
                        <td className=" px-6 py-4  text-sm font-medium text-gray-800   md:table-cell">
                          {report.description?.length > 60
                            ? `${report.description.substring(0, 60)}...`
                            : report.description}
                        </td>
                        <td className=" px-6 py-4 text-sm text-gray-600  md:table-cell">
                          {user?.role === "admin"
                            ? report.Region?.name
                            : user?.role === "regionAdmin"
                            ? report.Zone?.name
                            : report.Woreda?.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600  md:table-cell  border-b border-gray-200  transition duration-300 rounded-lg">
                          <div className="flex flex-col">
                            <span>{report.reportedBy?.name}</span>
                            <span>{report.reportedBy?.email}</span>
                          </div>
                        </td>
                        <td className=" px-6 py-4 text-sm font-medium text-gray-800">
                          <select
                            value={report.status}
                            onChange={(e) => handleStatusChange(report.id, e)} // Pass report.id
                            className={`min-w-4 px-2 py-3 rounded-md text-xs font-medium ${getStatusColor(
                              report.status
                            )}`}
                            disabled={loading}
                          >
                            <option value="">Status</option>
                            <option value="resolved">Resolved</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                        <td className=" px-6 py-4">
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewReportDetails(report);
                              }}
                              className="text-slate-500 hover:text-white hover:bg-slate-500 border border-slate-500 px-3 py-1 rounded-md transition"
                            >
                              Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(report.id);
                              }}
                              className="flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-3 py-1 rounded-md transition max-h-10"
                              disabled={loadingStates[report.id]}
                              style={{ width: "120px" }}
                            >
                              {loadingStates[report.id] ? (
                                <>
                                  <span className="mr-2">Deleting</span>
                                  <Loader className="h-3 w-4 animate-spin text-white" />{" "}
                                  {/* Show loader */}
                                </>
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-600">
                  Showing page {currentPage} of {totalPages} • {total} reports
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
        )}
        {activeTab === "my" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">My Reports</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-x-scroll">
                <thead className="bg-slate-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold  md:table-cell">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold  md:table-cell">
                      {user?.role === "admin"
                        ? "Region"
                        : user?.role === "regionAdmin"
                        ? "Zone"
                        : "Woreda"}{" "}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold  md:table-cell">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-2 text-center">
                        <Loader /> {/* Loader component displayed here */}
                      </td>
                    </tr>
                  ) : reports?.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b border-gray-300 hover:bg-gray-50 transition duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {report.title?.length > 60
                            ? `${report.title.substring(0, 60)}...`
                            : report.title}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {report.description?.length > 60
                            ? `${report.description.substring(0, 60)}...`
                            : report.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600  md:table-cell">
                          {user?.role === "admin"
                            ? report.Region?.name
                            : user?.role === "regionAdmin"
                            ? report.Zone?.name
                            : report.Woreda?.name}{" "}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600  md:table-cell  border-b border-gray-200  transition duration-300 rounded-lg">
                          <div className="flex flex-col">
                            <span>{report.reportedBy?.name}</span>
                            <span>{report.reportedBy?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={() => handleEdit(report)}
                              className="text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-500 px-3 py-1 rounded-md transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => viewReportDetails(report)}
                              className="text-slate-500 hover:text-white hover:bg-slate-500 border border-slate-500 px-3 py-1 rounded-md transition"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleDelete(report.id)}
                              className="flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 border border-red-500 px-3 py-1 rounded-md transition max-h-10"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Add pagination controls if necessary */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
                <p className="text-sm text-gray-600">
                  Showing page {currentPage} of {totalPages} • {total} reports
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
        )}

        {activeTab === "viewDetails" && selectedReport && (
          <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-md w-full mx-auto">
            <div className="relative flex flex-col w-full">
              <button
                onClick={backFromDetail}
                // onClick={() =>
                //   setActiveTab(user?.role !== "agent" ? "view" : "my")
                // }
                className="absolute top-0 right-2 p-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-300"
              >
                <ArrowLeft />
              </button>
              <h3 className="text-2xl  mb-2 font-bold text-gray-800">
                {selectedReport.title}
              </h3>
            </div>

            <p className="mb-4 text-gray-700">{selectedReport.description}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-200 rounded-md p-4">
              <div className="flex items-start">
                <Tag className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-semibold text-gray-700">Category:</p>
                  <p className="font-normal text-gray-600">
                    {selectedReport.category}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="font-semibold text-gray-700">Status:</p>
                  <p className="font-normal text-gray-600">
                    {selectedReport.status}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-red-600 mr-2" />
                <div>
                  <p className="font-semibold text-gray-700">Region:</p>
                  <p className="font-normal text-gray-600">
                    {selectedReport.Region?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="h-5 w-5 text-orange-600 mr-2" />
                <div>
                  <p className="font-semibold text-gray-700">Zone:</p>
                  <p className="font-normal text-gray-600">
                    {selectedReport.Zone?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <p className="font-semibold text-gray-700">Woreda:</p>
                  <p className="font-normal text-gray-600">
                    {selectedReport.Woreda?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Edit2 className="h-5 w-5 text-teal-600 mr-2" />
                <div>
                  <p className="font-semibold text-gray-700">Reported By:</p>
                  <p className="font-normal text-gray-600">
                    {selectedReport.reportedBy?.name} (Email:{" "}
                    {selectedReport.reportedBy?.email})
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                <div>
                  <p className="font-semibold text-gray-700">Created At:</p>
                  <p className="font-normal text-gray-600">
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start ">
                <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                <div>
                  <p className="font-semibold text-gray-700">Updated At:</p>
                  <p className="font-normal text-gray-600">
                    {new Date(selectedReport.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedReport.fileUrl && (
                <div className="flex items-start ">
                  <a
                    href={selectedReport.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-blue-600 underline"
                  >
                    Preview File
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 rounded-md p-4 w-full">
              {selectedReport.imageUrl && (
                <img
                  src={selectedReport.imageUrl}
                  alt="Report Image"
                  className="rounded-md w-full h-48 object-fill"
                />
              )}
              {selectedReport.videoUrl && (
                <video
                  src={selectedReport.videoUrl}
                  controls
                  className="rounded-md w-full h-48 object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReport;
