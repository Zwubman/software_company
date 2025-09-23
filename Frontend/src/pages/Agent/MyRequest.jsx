import React, { useEffect, useState } from "react";
import { Loader2, User, Phone, MapPin, Edit3 } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import AgentApplication from "./AgentApplication"; // Adjust the import path as necessary
import { getMyRequest } from "../../services/AgentService"; // Adjust the import path for your API function
import { useSelector } from "react-redux";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <Loader2 className="h-8 w-8 text-[#EB6407] animate-spin" />
  </div>
);

const SkeletonLoader = () => (
  <div className="bg-gradient-to-br from-white rounded-xl p-8 border animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="h-8 w-32 bg-gray-200 rounded-full mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
      <div className="bg-white/80 p-6 rounded-xl border">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/80 p-6 rounded-xl border">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="md:col-span-2 bg-white/80 p-6 rounded-xl border">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MyRequest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [myAgentData, setMyAgentData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.userData);

  useEffect(() => {
    myRequest();
  }, []);

  const myRequest = async () => {
    try {
      const response = await getMyRequest();
      setMyAgentData(response?.myRequest);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* {user.role !== "agent" && <Navbar />} */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4  pb-12  max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-[#EB6407] tracking-tight mb-8">
          My Request
        </h2>

        {isLoading ? (
          <SkeletonLoader />
        ) : myAgentData ? (
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <h3 className="text-xl font-semibold mb-6 flex items-center justify-between mx-8">
              <div className=" items-center mb-4 justify-center">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="w-20 h-20 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg ring-4 ring-white mr-4">
                    {myAgentData.fullName?.charAt(0) || "A"}
                  </div>
                )}
               <span>{myAgentData.fullName}</span> 
              </div>
              <p
                className={` text-sm mb-6 inline-block px-4 py-1.5 rounded-full font-bold ${
                  myAgentData.agentStatus === "accepted"
                    ? "bg-green-100 text-green-600"
                    : myAgentData.agentStatus === "rejected"
                    ? "bg-red-100 text-red-600"
                    : myAgentData.agentStatus === "reviewed"
                    ? "bg-blue-100 text-blue-600"
                    : myAgentData.agentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Status: {myAgentData.agentStatus}
              </p>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-6">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-50 w-full">
                <h4 className="font-bold flex items-center text-lg mb-4 text-[#3a4253]">
                  <User className="mr-2 text-[#EB6407]" /> Personal Information
                </h4>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium">{myAgentData.fullName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium">{myAgentData.sex}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Profession:</span>
                    <span className="font-medium">
                      {myAgentData.profession}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Education Level:</span>
                    <span className="font-medium">
                      {myAgentData.educationLevel}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Agent Type:</span>
                    <span className="font-medium">{myAgentData.agentType}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-50 w-full">
                <h4 className="font-bold flex items-center text-lg mb-4 text-[#3a4253]">
                  <Phone className="mr-2 text-[#EB6407]" /> Contact Information
                </h4>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">
                      {myAgentData.agentStatus}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Languages:</span>
                    <span className="font-medium">
                      {myAgentData.languages.join(", ")}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Phone Number:</span>
                    <span className="font-medium">
                      {myAgentData.phoneNumber}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{myAgentData.email}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-orange-50 md:col-span-2 w-full">
                <h4 className="font-bold flex items-center text-lg mb-4 text-[#3a4253]">
                  <MapPin className="mr-2 text-[#EB6407]" /> Location Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <p className="flex flex-col">
                    <span className="text-gray-600">Region</span>
                    <span className="font-medium">
                      {myAgentData.Region?.name}
                    </span>
                  </p>
                  <p className="flex flex-col">
                    <span className="text-gray-600">Zone</span>
                    <span className="font-medium">
                      {myAgentData.Zone?.name}
                    </span>
                  </p>
                  <p className="flex flex-col">
                    <span className="text-gray-600">Woreda</span>
                    <span className="font-medium">
                      {myAgentData.Woreda?.name}
                    </span>
                  </p>
                  <p className="flex flex-col">
                    <span className="text-gray-600">Applied Date</span>
                    <span className="font-medium">
                      {new Date(myAgentData.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <button
                  className="flex items-center border border-[#EB6407] text-[#EB6407] px-5 py-2.5 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 transform hover:scale-105 mt-4"
                  onClick={() => setShowModal(true)}
                >
                  <Edit3 className="mr-2 h-4 w-5" /> Edit
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-orange-100">
            <p className="text-[#EB6407] text-lg font-medium">
              No agent request found
            </p>
          </div>
        )}

        {/* Modal for Editing Agent Details */}
        {showModal && (
          <AgentApplication
            onClose={() => setShowModal(false)}
            user={myAgentData}
            myAgentData={myAgentData}
          />
        )}
      </div>
    </div>
  );
};

export default MyRequest;
