import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { getAllOrderStat } from "../../../services/Statistics";

const OrderAnalytics = () => {
  const [serviceData, setServiceData] = useState({});
  const [serviceTypesData, setServiceTypesData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    const response = await getAllOrderStat();

    setServiceData(response.orderStat.data);
    const serviceTypesData1 = response.orderStat.serviceTypes;
    setTotalOrders(response.orderStat.totalOrder);
    generateServiceTypesData(serviceTypesData1);
  };

  const generateServiceTypesData = (serviceTypesData1) => {
    const webDevelopment = serviceTypesData1.webDevelopment || 0;
    const itConsulting = serviceTypesData1.itConsulting || 0;
    const customSoftware = serviceTypesData1.customSoftware || 0;
  
    const totalServiceTypes = webDevelopment + itConsulting + customSoftware;
  
    const serviceTypes = [
      { name: "Web Development", value: webDevelopment },
      { name: "IT Consulting", value: itConsulting },
      { name: "Custom Software Development", value: customSoftware },
      {
        name: "Other",
        value: totalOrders > totalServiceTypes ? totalOrders - totalServiceTypes : 0,
      },
    ];
  
    setServiceTypesData(serviceTypes);
  };
  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Service Orders Dashboard
      </h3>

      {/* Service Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Total Orders</h4>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Today Orders</h4>
          <p className="text-2xl font-bold">{serviceData.todayOrders}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Pending Orders</h4>
          <p className="text-2xl font-bold">{serviceData.pendingOrders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">In-Progress Orders</h4>
          <p className="text-2xl font-bold">{serviceData.inProgressOrders}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Completed Orders</h4>
          <p className="text-2xl font-bold">{serviceData.completedOrders}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Cancelled Orders</h4>
          <p className="text-2xl font-bold">{serviceData.cancelledOrders}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Reviewed Orders</h4>
          <p className="text-2xl font-bold">{serviceData.reviewedOrders}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Rejected Orders</h4>
          <p className="text-2xl font-bold">{serviceData.rejectedOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Job Types Pie Chart */}
        <div className="w-full justify-center">
          <h4 className="text-lg font-semibold mt-4">
            Service Types Distribution
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceTypesData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {serviceTypesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#10B981", "#F59E0B", "#3B82F6", "#FFB703"][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Created Trend Line Chart */}
        <div className="w-full">
          <h4 className="text-lg font-semibold mt-4">
            Orders Created Trend (Last 4 Weeks)
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { week: "Week 1", orders: serviceData.weekOneOrders || 0 },
                { week: "Week 2", orders: serviceData.weekTwoOrders || 0 },
                { week: "Week 3", orders: serviceData.weekThreeOrders || 0 },
                { week: "Week 4", orders: serviceData.weekFourOrders || 0 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalytics;