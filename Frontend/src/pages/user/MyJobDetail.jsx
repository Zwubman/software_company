import React from "react";
import {
  FileText,
  Link,
  Phone,
  User,
  MapPin,
  Briefcase,
  Backpack,
  StepBack,
} from "lucide-react";
import { ArrowLeft, SkipBack } from "react-feather";

const MyJobDetail = ({ detailData, onClose }) => {
  const {
    applicantFullName,
    applicantEmail,
    applicantPhone,
    applicantAddress,
    applicantLinkedIn,
    applicantPortfolio,
    applicantExperience,
    applicantEducation,
    coverLetter,
    resume,
    bio,
    Job,
  } = detailData;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-slate-600 mb-6">
          Application Details
        </h2>
        <div className="flex items-center border border-slate-400 rounded-lg p-2 bg-gray-100 hover:bg-slate-600 transition duration-200 max-h-8 mx-2">
          <button
            className="flex items-center text-xl font-bold text-slate-600 hover:text-white transition duration-200"
            onClick={() => onClose(false)}
          >
            <ArrowLeft className="mr-2" />
            Back
          </button>
        </div>
      </div>
      <div className={`grid grid-cols-1 ${Job ? "md:grid-cols-2" : ""} gap-6`}>
        {" "}
        {/* Applicant Information */}
        <div className="border border-gray-300 p-4 rounded-lg ">
          <h3 className="text-xl font-semibold mb-4">Applicant Information</h3>
          <div className="flex items-center mb-2">
            <User className="mr-2 text-[#EB6407]" />
            <span>{applicantFullName}</span>
          </div>
          <div className="flex items-center mb-2">
            <Link className="mr-2 text-[#EB6407]" />
            <span>{applicantEmail}</span>
          </div>
          <div className="flex items-center mb-2">
            <Phone className="mr-2 text-[#EB6407]" />
            <span>{applicantPhone}</span>
          </div>
          <div className="flex items-center mb-2">
            <MapPin className="mr-2 text-[#EB6407]" />
            <span>{applicantAddress}</span>
          </div>
          {applicantLinkedIn && (
            <div className="flex items-center mb-2">
              <Link className="mr-2 text-[#EB6407]" />
              <a
                href={applicantLinkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
          {applicantPortfolio && (
            <div className="flex items-center mb-2">
              <Link className="mr-2 text-[#EB6407]" />
              <a
                href={applicantPortfolio}
                target="_blank"
                rel="noopener noreferrer"
              >
                Portfolio
              </a>
            </div>
          )}
        </div>
        {/* Job Information */}
        {Job && (
          <div className="border border-gray-300 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Job Information</h3>
            <div className="flex items-center mb-2">
              <Briefcase className="mr-2 text-[#EB6407]" />
              <span>{Job?.title}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium">Company: </span>
              <span className="ml-2">{Job?.companyName}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium">Location: </span>
              <span className="ml-2">{Job?.location}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium">Salary: </span>
              <span className="ml-2">{Job?.salary} birr</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium">Job Type: </span>
              <span className="ml-2">{Job?.jobType}</span>
            </div>
          </div>
        )}
      </div>

      {/* Additional Details in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Cover Letter */}
        <div className="border border-gray-300 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Cover Letter</h3>
          <a
            href={coverLetter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Cover Letter
          </a>
        </div>

        {/* Resume */}
        <div className="border border-gray-300 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Resume</h3>
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Resume
          </a>
        </div>

        {/* Experience */}
        <div className="border border-gray-300 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Experience</h3>
          <p>{applicantExperience}</p>
        </div>

        {/* Education */}
        <div className="border border-gray-300 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Education</h3>
          <p>{applicantEducation}</p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="border border-gray-300 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-semibold mb-4">Bio</h3>
        <p>{bio}</p>
      </div>
    </div>
  );
};

export default MyJobDetail;
