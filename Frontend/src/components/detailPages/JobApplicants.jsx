import React, { useEffect, useState } from "react";
import { FaEye, FaSearch, FaFileAlt, FaTrash } from "react-icons/fa";
import {
  deleteAppliciant,
  getJobApplications,
  updateApplicationStatus,
} from "../../services/JobService";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import {
  DecimalsArrowLeftIcon,
  Loader2,
  SquareChevronRight,
} from "lucide-react";
import MyJobDetail from "../../pages/user/MyJobDetail";
import { Briefcase } from "react-feather";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const JobApplicants = ({ jobId, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appliciantId, setappliciantId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [detailData, setDetailData] = useState({});
  const [isDetailDialog, setDetailDialog] = useState(false);

  const [applicants, setApplicantData] = React.useState([]);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await getJobApplications(jobId);
      setApplicantData(response);
      // fetchApplications();
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const filteredApplications = applicants?.applications?.filter((app) => {
    const matchesSearch =
      app.applicantFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const notDeleted = !deletedIds.has(app.id);
    return matchesSearch && matchesStatus && notDeleted;
  });
  const handleDetail = (data) => {
    setDetailDialog(true);
    setDetailData(data);
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, { status: newStatus });
      await fetchApplications();
    } catch (error) {
    } finally {
      setUpdatingId(null);
    }
  };
  const handleDelete = async (id) => {
    setappliciantId(id);
    setDeleteDialogOpen(true);
  };
  const handleConfirm = async () => {
    setDeleteDialogOpen(false);
    setIsDeleting(true);
    try {
      await deleteAppliciant(appliciantId);
      setDeletedIds((prev) => new Set([...prev, appliciantId]));
      setappliciantId("");
    } catch (error) {
      setDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirm}
        isLoading={isDeleting}
      />
      <div>
        <button
          onClick={onBack}
          className="mb-4 px-4 md:px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center gap-2 text-sm md:text-base"
        >
          ← Back
        </button>
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Total Applications: {applicants?.statistics?.total}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-auto border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
      ) : isDeleting ? (
        <Loader />
      ) : filteredApplications && filteredApplications.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          {isDetailDialog ? (
            <MyJobDetail detailData={detailData} onClose={setDetailDialog} />
          ) : (
            <div className="min-w-full overflow-x-scroll">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                      File
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((applicant, index) => (
                    <tr key={applicant.id}>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {applicant.applicantFullName}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500">
                              {applicant.applicantEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {applicant.applicantPhone}
                        </div>
                        <div className="text-xs md:text-sm text-gray-500">
                          {applicant.applicantAddress}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {applicant.applicantExperience.length > 20
                          ? applicant.applicantExperience.slice(0, 20) + " ..."
                          : applicant.applicantExperience || "not specified"}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select
                            className={`px-2 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                              applicant.status === "reviewed"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:border-orange-500"
                                : applicant.status === "applied"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200 hover:border-orange-500"
                                : applicant.status === "interviewed"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:border-orange-500"
                                : applicant.status === "hired"
                                ? "bg-green-100 text-green-700 hover:bg-green-200 hover:border-orange-500"
                                : "bg-rose-100 text-rose-700 hover:bg-rose-200 hover:border-orange-500"
                            } border border-transparent focus:ring-2 focus:ring-orange-500 focus:border-orange-500 active:border-orange-500 cursor-pointer shadow-sm`}
                            value={applicant.status}
                            onChange={(e) =>
                              handleStatusChange(applicant.id, e.target.value)
                            }
                            disabled={updatingId === applicant.id}
                          >
                            <option value="applied">Applied</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          {updatingId === applicant.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4 items-center">
                          <button
                            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200 "
                            title="View Resume"
                            onClick={() =>
                              window.open(applicant.resume, "_blank")
                            }
                          >
                            <FaFileAlt className="w-5 h-5 mr-1" />
                            <span className="hidden md:inline">Resume</span>
                          </button>

                          <button
                            className="flex items-center text-green-600 hover:text-green-800 transition duration-200"
                            title="View Cover Letter"
                            onClick={() =>
                              window.open(applicant.coverLetter, "_blank")
                            }
                          >
                            <FaFileAlt className="w-5 h-5 mr-1" />
                            <span className="hidden md:inline">
                              Cover Letter
                            </span>
                          </button>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4 items-center">
                          <button
                            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
                            title="View Detail "
                            onClick={() => {
                              handleDetail(applicant);
                            }}
                            disabled={isDeleting}
                          >
                            <SquareChevronRight className="w-5 h-5 mr-1" />
                            <span className="hidden md:inline">Detail</span>
                          </button>
                          <button
                            className="flex items-center text-red-600 hover:text-red-800 transition duration-200"
                            title="Delete Application"
                            onClick={() => handleDelete(applicant.id)}
                            disabled={isDeleting}
                          >
                            <FaTrash className="w-5 h-5 mr-1" />
                            <span className="hidden md:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 md:py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-base md:text-lg">
            No applicants found for this job
          </p>
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
