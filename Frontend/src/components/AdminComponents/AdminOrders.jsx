import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, FileText, User, Calendar, Clock, XCircle, Loader, CheckCircle, Hourglass, FileTextIcon } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "../../services/OrderService";
import AddOrderModal from "./AddOrderModal";
import OrderList from "./OrderList";
import RecentOrders from "./RecentOrders";
import Notification from "./Notification";
import { useSelector } from "react-redux";
import { getAllOrderStat } from "../../services/Statistics";

const AdminOrders = () => {
  const [orderList, setOrderList] = useState([]);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [statusAlert, setStatusAlert] = useState(null);
  const [statusLoadingState, setStatusLoadingState] = useState({});
  const [orderStat, setOrderStat] = useState({});
  const [sortOption, setSortOption] = useState("region");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState("");
  const { user } = useSelector((state) => state.userData);
  const pageLimit = 9;

  useEffect(() => {
    fetchOrderData();
  }, [currentPageNum, searchText, selectedFilterStatus, sortOption]);

  useEffect(() => {
    fetchStat();
  }, [orderList]);

  const fetchStat = async () => {
    const response = await getAllOrderStat();
    setOrderStat(response?.orderStat);
  };

  const fetchOrderData = async () => {
    setIsDataLoading(true);
    try {
      const filters = { search: searchText, status: selectedFilterStatus };
      const response = await getAllOrders(currentPageNum, pageLimit, filters);
      let sortedOrders = response?.statistics?.orders || [];
      if (sortOption === "region") {
        sortedOrders.sort((a, b) =>
          (a.country === "Ethiopia"
            ? a.Region?.name || a.manualRegion
            : a.manualRegion
          ).localeCompare(
            b.country === "Ethiopia"
              ? b.Region?.name || b.manualRegion
              : b.manualRegion
          )
        );
      } else if (sortOption === "status") {
        sortedOrders.sort((a, b) => a.status.localeCompare(b.status));
      }
      setOrderList(sortedOrders);
      setTotalPageCount(
        response?.statistics?.totalPages ||
          Math.ceil(response?.statistics?.total / pageLimit)
      );
      setTotalOrderCount(response?.statistics.total || 0);
    } catch (error) {
      setStatusAlert({ message: error.message, type: "error" });
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.trim());
    setCurrentPageNum(1);
  };

  const handleStatusChange = async (orderId, status) => {
    setStatusLoadingState((prev) => ({ ...prev, [orderId]: true }));
    try {
      await updateOrderStatus(orderId, status);
      setStatusAlert({
        message: "Order status updated successfully",
        type: "success",
      });
      fetchOrderData();
    } catch (error) {
      setStatusAlert({ message: error.message, type: "error" });
    } finally {
      setStatusLoadingState((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPageCount) {
      setCurrentPageNum(newPage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen p-4">
      <h1 className="text-3xl font-bold text-start mb-6">
        Order Management
      </h1>

      {/* Order Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          {
            title: "Total Orders",
            value: orderStat.data?.totalOrders,
            icon: <FileTextIcon className="h-6 w-6 text-blue-600" />,
          },
          {
            title: "Pending Orders",
            value: orderStat.data?.pendingOrders,
            icon: <Hourglass className="h-6 w-6 text-yellow-600" />, // Hourglass for pending
          },
          {
            title: "Completed Orders",
            value: orderStat.data?.completedOrders,
            icon: <CheckCircle className="h-6 w-6 text-green-600" />, // CheckCircle for completed
          },
          {
            title: "In Progress Orders",
            value: orderStat.data?.inProgressOrders,
            icon: <Loader className="h-6 w-6 text-blue-400" />, // Loader for in progress
          },
          {
            title: "Rejected Orders",
            value: orderStat.data?.rejectedOrders,
            icon: <XCircle className="h-6 w-6 text-red-600" />, // XCircle for rejected
          },
        ].map(({ title, value, icon }) => (
          <div
            key={title}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search order..."
              className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] transition duration-200 ease-in-out"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-600 w-full md:w-auto">
            <div className="flex items-center">
              <label htmlFor="filterStatus" className="mr-2">
                Filter by Status:
              </label>
              <select
                id="filterStatus"
                value={selectedFilterStatus}
                onChange={(e) => setSelectedFilterStatus(e.target.value)}
                className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] transition duration-200 ease-in-out"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center">
              <label htmlFor="sortOption" className="mr-2">
                Sort by:
              </label>
              <select
                id="sortOption"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB6407] transition duration-200 ease-in-out"
              >
                <option value="region">Region</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Order List and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <OrderList
            orderList={orderList}
            isDataLoading={isDataLoading}
            currentPageNum={currentPageNum}
            totalPageCount={totalPageCount}
            handlePageChange={handlePageChange}
            handleStatusChange={handleStatusChange}
            statusLoadingState={statusLoadingState}
          />
        </div>

        <div className="lg:col-span-1">
          <RecentOrders orderList={orderList} />
        </div>
      </div>

      <AnimatePresence>
        {statusAlert && (
          <Notification
            message={statusAlert.message}
            type={statusAlert.type}
            onClose={() => setStatusAlert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
