import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { getlUsersStat } from "../../../services/Statistics";

const UserAnalytics = () => {
  const [userAnalytics, setUserAnalytics] = useState({});
  const [newUserChartData, setNewUserChartData] = useState([]);
  const [roleDistributionData, setRoleDistributionData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    fetchUserAnalytics();
    generateNewUserChartData();
  }, []);

  useEffect(() => {
    generateRoleDistributionData();
    generateComparisonData();
  }, [userAnalytics]);

  const fetchUserAnalytics = async () => {
    const response = await getlUsersStat();
    setUserAnalytics(response.userData);
  };

  const generateNewUserChartData = () => {
    const days = 30;
    const today = new Date();
    const dateMap = {};

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dateMap[key] = {
        date: key,
        newUsers: Math.floor(Math.random() * 10),
      };
    }
    const last30Days = Object.values(dateMap);
    setNewUserChartData(last30Days);
  };

  const generateRoleDistributionData = () => {
    const others =
      userAnalytics.totalUsers -
      (userAnalytics.agents +
        userAnalytics.partners +
        userAnalytics.admins +
        userAnalytics.woredaAdmins +
        userAnalytics.zoneAdmins +
        userAnalytics.regionAdmins);

    const roleData = [
      { name: "Agents", value: userAnalytics.agents },
      { name: "Partners", value: userAnalytics.partners },
      { name: "Admins", value: userAnalytics.admins },
      { name: "Woreda Admins", value: userAnalytics.woredaAdmins },
      { name: "Zone Admins", value: userAnalytics.zoneAdmins },
      { name: "Region Admins", value: userAnalytics.regionAdmins },
      { name: "Others", value: others },
    ];

    setRoleDistributionData(roleData);
  };

  const generateComparisonData = () => {
    const comparisonData = [
      { name: "Week 1", value: userAnalytics.weekOneUsers },
      { name: " Week 2", value: userAnalytics.weekTwoUsers },
      { name: " Weeks 3", value: userAnalytics.weekThreeUsers },
      { name: " Weeks 4", value: userAnalytics.weekFourUsers },
    ];
    setComparisonData(comparisonData);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">User Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Total Users</h4>
          <p className="text-2xl font-bold">{userAnalytics.totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Active Users</h4>
          <p className="text-2xl font-bold">{userAnalytics.activeUsers}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Inactive Users</h4>
          <p className="text-2xl font-bold">{userAnalytics.inactiveUsers}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">New Users Today</h4>
          <p className="text-2xl font-bold">{userAnalytics.todayUsers}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold"> Week one users</h4>
          <p className="text-2xl font-bold">{userAnalytics.weekOneUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">New Users This Month</h4>
          <p className="text-2xl font-bold">{userAnalytics.thisMonthUsers}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Role Distribution Pie Chart */}
        <div className="w-full">
          <h4 className="text-lg font-semibold mt-4">User Role Distribution</h4>
          {roleDistributionData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#10B981", "#F59E0B", "#3B82F6", "#FFB703"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* New Users Comparison Bar Chart */}
        <div className="w-full">
          <h4 className="text-lg font-semibold mt-4">
            Last Four Weeks Users Comparison
          </h4>
          {comparisonData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* New Users Trend Line Chart */}
        {/* Uncomment if you want to display this chart */}
        {/* <div className="w-full md:col-span-2">
          <h4 className="text-lg font-semibold mt-4">New Users Trend (Last 30 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={newUserChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="newUsers" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </div>
  );
};

export default UserAnalytics;
