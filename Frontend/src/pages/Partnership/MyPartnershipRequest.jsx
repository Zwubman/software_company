import React, { useEffect, useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import {
  cancelPartnership,
  cancelService,
  getMyRequest,
} from "../../services/ServiceService";
import { useSelector } from "react-redux";
import OrderDetailPopup from "../../components/AdminComponents/OrderDetailPopup";
import SkeletonLoader from "../../components/UI/TableSkeleton";
import OrderApplication from "../order/OrderApplication";
import Navbar from "../../components/Navbar/Navbar";
import {
  deleteMyPartnership,
  getMyPartnerships,
} from "../../services/PartnershipService";
import PartnershipDetail from "./PartnershipDetail";
import Partnership from "./PartnershipApply";
import PartnershipForm from "./PartnershipForm";
import MyToast from "../../components/Notification/MyToast";
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);
const MyPartnershipRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    jobType: "",
    category: "",
    jobStatus: "",
    location: "",
  });
  const [loadingOrders, setLoadingOrders] = useState({});
  const { userId } = useParams();
  const { user } = useSelector((state) => state.userData);
  const [isDialogOpend, setIsDialogOpened] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const limit = 7;

  useEffect(() => {
    fetchOrders();
  }, [userId, currentPage]);

  const fetchOrders = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await getMyPartnerships(currentPage, limit, {
        search: searchQuery,
        filters,
      });

      const ordersData = response?.partnerships || [];
      setOrders(ordersData);

      const filtered = ordersData.filter((order) =>
        ["title", "category", "location", "status"].some((field) =>
          order[field]?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredOrders(filtered);

      setTotalPages(Math.ceil(response.orders.total / limit)); // Update total pages
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  //1000424554298
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const handleEdit = (data) => {
    setEditedData(data);
    setShowModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleCancle = async (id) => {
    try {
      setLoadingOrders((prev) => ({ ...prev, [id]: true })); // Set loading for specific order
      await cancelPartnership(id);
      await fetchOrders();
    } catch (error) {
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [id]: false })); // Reset loading for specific order
    }
  };

  const handleDelete = async (id) => {
    setLoadingOrders((prev) => ({ ...prev, [id]: true })); // Set loading for specific order
    try {
      const response = await deleteMyPartnership(id);
      MyToast(response?.data?.message || "deleted", "success");
      // await fetchOrders();
      setFilteredOrders((orderData) =>
        orderData.filter((order) => order.id !== id)
      );
    } catch (error) {
      MyToast(error.message || "failed to delete request", "error");
      console.error("Error deleting order:", error);
    } finally {
      setLoadingOrders((prev) => ({ ...prev, [id]: false })); // Reset loading for specific order
    }
  };
  // deleteMyPartnership
  const handleDetail = (data) => {
    setDetailData(data);
    setIsDialogOpened(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      {isDialogOpend && (
        <PartnershipDetail
          partnership={detailData}
          onClose={() => setIsDialogOpened(false)}
        />
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            <div className="mb-4 space-y-2 bg-white p-6 rounded-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h2 className="text-2xl  md:text-3xl font-bold text-[#EB6407] tracking-tight">
                  My Partnership Request
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#EB6407]" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2  bg-white shadow-sm transition duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="w-full sm:w-auto border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2  bg-white shadow-sm cursor-pointer transition duration-200"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              // <Loader />
              <SkeletonLoader />
            ) : filteredOrders.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#EB6407] uppercase tracking-wider">
                          Full Name
                        </th>
                        {/* <th className="px-6 py-4 text-left text-xs font-semibold text-[#EB6407] uppercase tracking-wider">
                          Gender{" "}
                        </th> */}
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#EB6407] uppercase tracking-wider">
                          Phone Number{" "}
                        </th>
                        {/* <th className="px-6 py-4 text-left text-xs font-semibold text-[#EB6407] uppercase tracking-wider">
                          Profession{" "}
                        </th> */}
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#EB6407] uppercase tracking-wider">
                          Type{" "}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#EB6407] uppercase tracking-wider">
                          Request Date{" "}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#EB6407] uppercase tracking-wider">
                          Status{" "}
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[#EB6407] uppercase tracking-wider ">
                          {" "}
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.fullName}
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {order.sex}
                            </div>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {order.phoneNumber}
                            </div>
                          </td>{" "}
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {order.profession}
                            </div>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {order.abilityForPartnership}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${
                                order.status === "reviewed"
                                  ? "bg-blue-100 text-blue-600"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : order.status === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : order.status === "rejected"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(order)}
                                className="flex items-center px-2 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-100 transition duration-200 text-xs sm:text-sm"
                              >
                                <Edit3 className="mr-1 sm:mr-2 text-lg hidden sm:inline" />
                                <span className=" sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  handleDetail(order);
                                }}
                                className="flex items-center px-2 py-1 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-100 transition duration-200 text-xs sm:text-sm"
                              >
                                <FaEye className="mr-1 sm:mr-2 text-lg hidden sm:inline" />
                                <span className=" sm:inline">Detail</span>
                              </button>
                              {/* <button
                                onClick={() => handleCancle(order.id)}
                                className={`flex items-center px-2 py-1 border text-xs sm:text-sm rounded-md transition duration-200 max-h-8 ${
                                  loadingOrders[order.id]
                                    ? "border-orange-500 text-orange-500"
                                    : "border-orange-500 text-orange-500 hover:bg-orange-100"
                                }`}
                              >
                                {loadingOrders[order.id] ? (
                                  <>
                                    <Loader className="h-2 w-2 mr-2 animate-spin" />{" "}
                                    <span>Waiting...</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="mr-1 sm:mr-2 text-lg hidden sm:inline" />
                                    <span className="sm:inline">Cancel</span>
                                  </>
                                )}
                              </button> */}

                              {order.status === "Cancelled" ||
                              order.status === "cancelled" ? (
                                <button
                                  onClick={() => handleDelete(order.id)}
                                  className={`flex items-center px-2 py-1 border text-xs sm:text-sm rounded-md transition duration-200 max-h-8 ${
                                    loadingOrders[order.id]
                                      ? "border-orange-500 text-orange-500"
                                      : "border-orange-500 text-orange-500 hover:bg-orange-100"
                                  }`}
                                >
                                  <Trash2 className="mr-1 sm:mr-2 text-lg hidden sm:inline" />
                                  {loadingOrders[order.id] ? (
                                    <>
                                      <Loader className="h-2 w-2 mr-2 animate-spin" />{" "}
                                      {/* Adjusted loader size */}
                                      <span>Waiting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="sm:inline">Delete</span>
                                    </>
                                  )}{" "}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleCancle(order.id)}
                                  className={`flex items-center px-2 py-1 border text-xs sm:text-sm rounded-md transition duration-200 max-h-8 ${
                                    loadingOrders[order.id]
                                      ? "border-orange-500 text-orange-500"
                                      : "border-orange-500 text-orange-500 hover:bg-orange-100"
                                  }`}
                                >
                                  {loadingOrders[order.id] ? (
                                    <>
                                      <Loader className="h-2 w-2 mr-2 animate-spin" />{" "}
                                      {/* Adjusted loader size */}
                                      <span>Waiting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <X className="mr-1 sm:mr-2 text-lg hidden sm:inline" />
                                      <span className="sm:inline">Cancel</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 space-y-2 sm:space-y-0">
                  <p className="text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages} •{" "}
                    {filteredOrders.length} jobs
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
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-orange-100">
                <p className="text-[#EB6407] text-lg font-medium">
                  No Partnership Request found
                </p>
                <p className="text-orange-400 mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
          {/* <div className="lg:w-80">
            <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-24">
              <h2 className="text-lg font-semibold text-[#3a4253] mb-4">
                Recent Orders
              </h2>
              <div className="space-y-3">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 border border-gray-100 rounded-lg hover:border-[#EB6407] transition-colors"
                    >
                      <p className="text-sm font-medium text-[#3a4253]">
                        {order.orderTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.fullName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                          order.status === "reviewed"
                            ? "bg-blue-100 text-blue-600"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : order.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : order.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent orders
                  </p>
                )}
              </div>
            </div>
          </div> */}
        </div>
        {showModal && (
          <PartnershipForm
            onClose={() => setShowModal(false)}
            isOpen={showModal}
            onOrderAdded={() => fetchOrders()} // Call fetchOrders after adding order
            serviceId={editedData?.serviceId}
            partnershipData={editedData}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default MyPartnershipRequest;
