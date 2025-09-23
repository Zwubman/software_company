import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";
import ChangePasswordComponent from "./ChangePassword";
import MyOrder from "../../pages/order/MyOrder";
import MyRequest from "../../pages/Agent/MyRequest";
import MyApplications from "../../pages/user/MyApplications";
import MyPartnershipRequest from "../../pages/Partnership/MyPartnershipRequest";
import Profile from "./Profile";
import AdminReport from "../AdminComponents/AdminReport";
const Settings = () => {
  const [profile, setProfile] = useState({
    firstName: "Musharof",
    lastName: "Chy",
    email: "existingemail@gmail.com",
    website: "exampla@domain.com",
  });

  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const { user } = useSelector((state) => state.userData);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="font-sans min-h-screen">
      {user.role !== "admin" &&
        user.role !== "regionAdmin" &&
        user.role !== "zoneAdmin" &&
        // user.role !== "agent"&&
        user.role !== "woredaAdmin" && <Navbar />}
      <div className="flex py-32 flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Account Information Section */}
        <div className="flex-1 bg-white p-6  rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Account Information</h3>
          {/* <p className="text-gray-600 mb-6">Edit your profile quickly</p> */}
          <div className="text-center mb-6">
            <img
              src={user.profilePicture ? user.profilePicture : "../assets/teamwork.jpg"}
              alt="Profile"
              className="rounded-full mx-auto mb-4 w-48 h-48"
            />
            {/* <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              📷
            </button> */}
          </div>
          <form>
            <div className="mb-4">
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="firstName"
                value={user?.name}
                onChange={handleProfileChange}
                className="w-full p-2 border rounded-md"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={user?.email}
                onChange={handleProfileChange}
                className="w-full p-2 border rounded-md"
                disabled
              />
            </div>
          </form>
        </div>

        {/* Password Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <ChangePasswordComponent />
        </div>
      </div>
      <div className="max-w-7xl mx-auto border rounded-lg border-gray-200 pt-4">
        {!(
          user.role == "admin" ||
          user.role == "regionAdmin" ||
          user.role == "zoneAdmin" ||
          user.role == "woredaAdmin"
        ) && (
          <div className="  w-full mb-6 items-center px-4 ">
            <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-white font-medium">
              <button
                onClick={() => handleTabChange("profile")}
                className={`p-2 rounded-lg ${
                  activeTab === "profile"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-600"
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => handleTabChange("myJobs")}
                className={`p-2 rounded-lg ${
                  activeTab === "myJobs"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-600"
                }`}
              >
                My Jobs
              </button>
              <button
                onClick={() => handleTabChange("myOrders")}
                className={`p-2 rounded-lg ${
                  activeTab === "myOrders"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-600"
                }`}
              >
                Order Requests
              </button>
              {user.role !== "partner" && (
                <button
                  onClick={() => handleTabChange("myAgentRequests")}
                  className={`p-2 rounded-lg ${
                    activeTab === "myAgentRequests"
                      ? "bg-orange-500 text-white"
                      : "bg-slate-600"
                  }`}
                >
                  Agent Requests
                </button>
              )}
              {user.role !== "agent" && (
                <button
                  onClick={() => handleTabChange("myPartnershipRequests")}
                  className={`p-2 rounded-lg ${
                    activeTab === "myPartnershipRequests"
                      ? "bg-orange-500 text-white"
                      : "bg-slate-600"
                  }`}
                >
                  Partnership Requests
                </button>
              )}
              {user.role === "agent" && (
                <button
                  onClick={() => handleTabChange("reports")}
                  className={`p-2 rounded-lg ${
                    activeTab === "reports"
                      ? "bg-orange-500 text-white"
                      : "bg-slate-600"
                  }`}
                >
                  Reports
                </button>
              )}
            </div>
          </div>
        )}
        <div className="">
          {activeTab === "profile" && <Profile />}
          {activeTab === "myJobs" && <MyApplications />}
          {activeTab === "myOrders" && <MyOrder />}
          {activeTab === "myAgentRequests" && <MyRequest />}
          {user.role !== "agent" && activeTab === "myPartnershipRequests" && (
            <MyPartnershipRequest />
          )}
          {user.role === "agent" && activeTab === "reports" && <AdminReport />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
