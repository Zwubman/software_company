import React, { useState, useEffect } from "react";
import {

  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getAllNewsStat } from "../../../services/Statistics";

const NewsAnalytics = () => {
  const [newsData, setNewsData] = useState({});


  useEffect(() => {
    fetchNewsData();
  
  }, []);

  const fetchNewsData = async () => {
    const response = await getAllNewsStat();
    setNewsData(response.newsStat);
  };


  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">News Dashboard</h3>

      {/* News Article Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Total News</h4>
          <p className="text-2xl font-bold">{newsData.allNews}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Published News</h4>
          <p className="text-2xl font-bold">{newsData.publishedNews}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Draft News</h4>
          <p className="text-2xl font-bold">{newsData.draftNews}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Archived News</h4>
          <p className="text-2xl font-bold">{newsData.archivedNews}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Week One News</h4>
          <p className="text-2xl font-bold">{newsData.weekOneNews}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">News Created This Month</h4>
          <p className="text-2xl font-bold">{newsData.thisMonthNews}</p>
        </div>
      </div>


      {/* Articles Created Trend Line Chart */}
      <h4 className="text-lg font-semibold mt-4">
        Articles Created Trend (Last 4 Weeks)
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={[
            { week: "Week 1", articles: newsData.weekOneNews },
            { week: "Week 2", articles: newsData.weekTwoNews },
            { week: "Week 3", articles: newsData.weekThreeNews },
            { week: "Week 4", articles: newsData.weekFourNews },
          ]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="articles"
            stroke="#10B981"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NewsAnalytics;
