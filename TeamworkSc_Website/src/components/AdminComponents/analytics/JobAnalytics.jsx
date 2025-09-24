import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getlJobStat, getlJobStatTwo } from "../../../services/Statistics";

const JobAnalytics = () => {
  const [jobData, setJobData] = useState({});
  const [jobTypesData, setJobTypesData] = useState([]);
  const [applicationsData, setApplicationsData] = useState([]);
  const [applicationsDataTwo, setApplicationsDataTwo] = useState([]);

  useEffect(() => {
    fetchJobData();
  }, []);

  const fetchJobData = async () => {
    const response = await getlJobStat();
    const responseTwo = await getlJobStatTwo();

    setJobData(response.data);
    setApplicationsDataTwo(responseTwo.applicationStatus);

    generateJobTypesData(response.data);
    generateApplicationsData(responseTwo.applicationStatus);
  };

  const generateJobTypesData = (jobData) => {
    const jobTypes = [
      { name: "Full-Time", value: jobData.fullTimeJobs || 0 },
      { name: "Internship", value: jobData.internshipJobs || 0 },
      { name: "Part-Time", value: jobData.partTimeJobs || 0 },
      { name: "Contract", value: jobData.contractJobs || 0 },
      { name: "Remote", value: jobData.remoteJobs || 0 },
    ];
    setJobTypesData(jobTypes);
  };

  const generateApplicationsData = (applicationsDataTwo) => {
    const applications = [
      {
        name: "Total Applicants",
        value: applicationsDataTwo.totalApplication || 0,
      },
      {
        name: "Pending ",
        value: applicationsDataTwo.appliedApplication || 0,
      },
      {
        name: "Interviewed ",
        value: applicationsDataTwo.interviewedApplication || 0,
      },
      {
        name: "Rejected ",
        value: applicationsDataTwo.rejectedApplication || 0,
      },
      {
        name: "Hired ",
        value: applicationsDataTwo.hiredApplication || 0,
      },
      {
        name: "Reviewed ",
        value: applicationsDataTwo.reviewedApplication || 0,
      },
    ];
    setApplicationsData(applications);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Job Dashboard</h3>

      {/* Job Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Total Jobs", value: jobData.totalJobs, bg: "bg-blue-100" },
          { title: "Open Jobs", value: jobData.openJobs, bg: "bg-green-100" },
          {
            title: "Closed Jobs",
            value: jobData.closedJobs,
            bg: "bg-yellow-100",
          },
          { title: "Today Jobs", value: jobData.todayJobs, bg: "bg-gray-100" },
          {
            title: "Week one Jobs",
            value: jobData.weekOneJobs,
            bg: "bg-purple-100",
          },
          {
            title: "Jobs Created This Month",
            value: jobData.thisMonthJobs,
            bg: "bg-orange-100",
          },
        ].map((item, index) => (
          <div key={index} className={`${item.bg} p-4 rounded-lg shadow-md`}>
            <h4 className="text-lg font-semibold">{item.title}</h4>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Types Pie Chart */}
        <div className="w-full">
          <h4 className="text-lg font-semibold mt-4">Job Types Distribution</h4>
          {jobTypesData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobTypesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {jobTypesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#10B981", "#F59E0B", "#3B82F6"][index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Applications Engagement Bar Chart */}
        <div className="w-full">
          <h4 className="text-lg font-semibold mt-4">
            Applications Engagement
          </h4>
          {applicationsData.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Jobs Created Trend Line Chart */}
        <div className="w-full md:col-span-2">
          <h4 className="text-lg font-semibold mt-4">
            Jobs Created Trend (Last 4 Weeks)
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { week: "Week 1", jobs: jobData.weekOneJobs },
                { week: "Week 2", jobs: jobData.weekTwoJobs },
                { week: "Weeks 3", jobs: jobData.weekThreeJobs },
                { week: "Weeks 4", jobs: jobData.weekFourJobs },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="jobs"
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

export default JobAnalytics;
