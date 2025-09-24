import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight, Info, X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import OrderDetailPopup from "./OrderDetailPopup";
import { deleteOrder } from "../../services/OrderService";
import MyToast from "../Notification/MyToast";
import { useSelector } from "react-redux";
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);
const OrderList = ({
  orderList,
  isDataLoading,
  currentPageNum,
  totalPageCount,
  handlePageChange,
  handleStatusChange,
  statusLoadingState,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderData, setOrderList] = useState([]);
  const [loading, setLoading] = useState({});
  const { user } = useSelector((state) => state.userData);

  useEffect(() => {
    setOrderList(orderList);
  }, [orderList]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "pending":
        return "bg-orange-500";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleDelete = async (id) => {
    setLoading((prev) => ({ ...prev, [id]: true })); // Set loading for specific order
    try {
      const response = await deleteOrder(id);
      MyToast(response?.data?.message || "deleted", "success");
      setOrderList((orderData) => orderData.filter((order) => order.id !== id));
    } catch (error) {
      MyToast(error.message || "failed to delete", "error");
      console.error("Error deleting order:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false })); // Reset loading for specific order
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isDataLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {orderList.length > 0 ? (
              orderData
                // .filter((order) => order.status.toLowerCase() !== "cancelled") // Exclude canceled orders
                .map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-semibold text-gray-800">
                        #{order.id}
                      </span>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {order.orderTitle} (
                      {order.country === "Ethiopia"
                        ? `${order.Region?.name || order.manualRegion}`
                        : order.manualRegion}
                      )
                    </p>
                    <div className="text-xs text-gray-500 flex items-center space-x-2 mb-2">
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      <span className="w-px h-4 bg-gray-300"></span>
                      <span>{order.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <motion.button
                        title="View Detail"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedOrder(order)}
                        className="px-2 py-1/2 border border-blue-800 rounded-md bg-green-100 hover:bg-green-200 transition-colors"
                      >
                        Detail
                      </motion.button>

                      {user.role == "admin" && (
                        <motion.button
                          title="Delete"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(order.id)}
                          className={`max-h-8 px-2 py-1/2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-100 transition-colors duration-200 ${
                            loading[order.id]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={loading[order.id]} // Disable the button while loading
                        >
                          {loading[order.id] ? (
                            <span className="text-orange-800">Waiting...</span>
                          ) : (
                            <>Delete</>
                          )}
                        </motion.button>
                      )}
                      {user.role == "admin" && (
                        <div className="flex space-x-2 border border-gray-100 py-1/2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            disabled={statusLoadingState[order.id]}
                            className="px-1 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#EB6407] capitalize disabled:opacity-50"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">rejected</option>
                          </select>
                          {statusLoadingState[order.id] && (
                            <Loader2 className="h-4 w-4 text-[#EB6407] animate-spin" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No orders found matching your criteria
              </div>
            )}
          </div>
        )}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing page {currentPageNum} of {totalPageCount} •{" "}
            {orderList.length} orders
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPageNum - 1)}
              disabled={currentPageNum === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(currentPageNum + 1)}
              disabled={currentPageNum === totalPageCount}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Render the Detail Popup */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailPopup
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderList;
