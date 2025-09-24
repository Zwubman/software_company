import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getMyJobs } from "../../services/JobService";
import { useSelector } from "react-redux";
import MyJobDetail from "./MyJobDetail";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const MyApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [isDetailDialog, setDetailDialog] = useState(false);

  const { user } = useSelector((state) => state.userData);

  useEffect(() => {
    fetchApplications();
  }, [user?.id]);

  const fetchApplications = async () => {
    try {
      const response = await getMyJobs();
      setApplications(response?.applications || []);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.Job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.Job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDetail = (data) => {
    setDetailDialog(true);
    setDetailData(data);
  };

  return (
    <div className=" bg-gray-50">
      {/* {user.role !== "agent" && <Navbar />} */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8  py-4 pb-12">
        {isDetailDialog ? (
          <MyJobDetail detailData={detailData} onClose={setDetailDialog} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
              <div className="mb-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#EB6407] tracking-tight">
                    My Applications
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#EB6407]" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        className="w-full pl-10 pr-4 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB6407] bg-white shadow-sm transition duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="w-full sm:w-auto border border-orange-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#EB6407] bg-white shadow-sm cursor-pointer transition duration-200"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="applied">Applied</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <Loader />
              ) : filteredApplications.length > 0 ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-slate-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold  uppercase tracking-wider">
                            Job Title
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold  uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold  uppercase tracking-wider">
                            location
                          </th>
                          <th className="px-0 py-2 text-left text-xs font-semibold  uppercase tracking-wider">
                            Applied Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold  uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold  uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-200">
                        {filteredApplications.map((application) => (
                          <tr
                            key={application.id}
                            className="hover:bg-gray-50 transition duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {application.Job.title}
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">
                                {application.Job.companyName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {application.Job.location}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(
                                application.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${
                                  application.status === "reviewed"
                                    ? "bg-blue-100 text-blue-600"
                                    : application.status === "applied"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : application.status === "interviewed"
                                    ? "bg-purple-100 text-purple-600"
                                    : application.status === "hired"
                                    ? "bg-green-100 text-green-600"
                                    : application.status === "rejected"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {application.status.charAt(0).toUpperCase() +
                                  application.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap ">
                              <div className="flex gap-2">
                                {/* <button className="border border-gray-400 px-4 py-1 rounded-md">
                                  edit
                                </button> */}
                                <button
                                  onClick={() => {
                                    handleDetail(application);
                                  }}
                                  className="border border-gray-400 px-4 py-1 rounded-md text-base font-light hover:bg-slate-600 hover:text-white"
                                >
                                  detail
                                </button>

                                {/* <button className="border border-gray-400 px-4 py-1 rounded-md">
                                  delete
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-orange-100">
                  <p className="text-[#EB6407] text-lg font-medium">
                    No applications found
                  </p>
                  <p className="text-orange-400 mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
            <div className="lg:w-80">
              <div className="bg-white p-4 rounded-lg border border-gray-200 sticky top-24">
                <h2 className="text-lg font-semibold text-[#3a4253] mb-4">
                  Recent Applications
                </h2>
                <div className="space-y-3">
                  {recentApplications.length > 0 ? (
                    recentApplications.map((application) => (
                      <div
                        key={application.id}
                        className="p-3 border border-gray-100 rounded-lg hover:border-[#EB6407] transition-colors"
                      >
                        <p className="text-sm font-medium text-[#3a4253]">
                          {application.Job.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {application.Job.companyName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Applied:{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                            application.status === "reviewed"
                              ? "bg-blue-100 text-blue-600"
                              : application.status === "applied"
                              ? "bg-yellow-100 text-yellow-600"
                              : application.status === "interviewed"
                              ? "bg-purple-100 text-purple-600"
                              : application.status === "hired"
                              ? "bg-green-100 text-green-600"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent applications
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
