import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import JobApplicants from "./JobApplicants";
import { useSelector } from "react-redux";
import Jobs from "../../pages/Posts/Jobs/Jobs";

const JobDetail = ({ job, onClose }) => {
  const [showApplicants, setShowApplicants] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.userData);
  const [showJobApply, setShowJobApply] = useState(false);
  if (showApplicants) {
    return (
      <JobApplicants jobId={job.id} onBack={() => setShowApplicants(false)} />
    );
  }
  if (showJobApply) {
    return <Jobs jobId={job.id} onBack={() => setShowApplicants(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="w-full max-w-8xl flex flex-col mx-auto"
    >
      <motion.div
        className="bg-white p-4 md:p-8 rounded-lg shadow-lg relative"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <button
          className="absolute top-4 right-4 text-orange-700 text-2xl hover:scale-110 transition-transform focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-orange-700 transition-colors">
                {job.title}
              </h2>
              {/* <p className="text-blue-500">{job.jobStatus}</p> */}
              <p className="text-orange-700 font-medium mt-2 hover:text-orange-800">
                {job.companyName}
              </p>
            </div>

            {user.role === "agent" ? (
              <button
                onClick={() => setShowJobApply(true)}
                className="mt-4 md:mt-0 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold text-sm md:text-base"
              >
                Apply For Job
              </button>
            ) : (
              user?.role == "admin" && <button
                onClick={() => setShowApplicants(true)}
                className="mt-4 md:mt-0 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold text-sm md:text-base"
              >
                View Applicants
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-gray-800 leading-relaxed text-base md:text-lg">
              {job.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
              <p className="flex items-center gap-2 flex-wrap">
                <FaMapMarkerAlt className="text-orange-700" />
                <span className="font-semibold text-orange-800">Location:</span>
                <span className="text-gray-800">{job.location}</span>
              </p>
              <p className="flex items-center gap-2 mt-3 flex-wrap">
                <FaDollarSign className="text-orange-700" />
                <span className="font-semibold text-orange-800">Salary:</span>
                <span className="text-gray-800">{job.salary} birr/month</span>
              </p>
              <p className="flex items-center gap-2 mt-3 flex-wrap">
                <FaBriefcase className="text-orange-700" />
                <span className="font-semibold text-orange-800">Job Type:</span>
                <span className="text-gray-800 capitalize">{job.jobType}</span>
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg shadow-sm">
              <p className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-orange-800">
                  Experience:
                </span>
                <span className="text-gray-800">{job.experience}</span>
              </p>
              <p className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="font-semibold text-orange-800">Category:</span>
                <span className="text-gray-800 capitalize">{job.category}</span>
              </p>
              <p className="flex items-center gap-2 mt-3 flex-wrap">
                <FaCalendarAlt className="text-orange-700" />
                <span className="font-semibold text-orange-800">Deadline:</span>
                <span className="text-gray-800">
                  {new Date(job.deadline).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Requirements
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
              <div className="space-y-2 text-gray-800">
                <p className="text-base md:text-lg">{job.requirements}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm md:text-base"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 md:mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Benefits
            </h3>
            <p className="text-gray-800 bg-green-50 p-4 rounded-lg shadow-sm text-base md:text-lg">
              {job.benefits}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobDetail;
