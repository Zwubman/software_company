import React, { useState } from "react";
import AdminWoreda from "../../components/AdminComponents/AdminWoreda";
import AdminRegion from "../../components/AdminComponents/AdminRegion";
import AdminZone from "../../components/AdminComponents/AdminZone";

const Address = () => {
  const [activeTab, setActiveTab] = useState("regions");

  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
        Location Management
      </h1>

      {/* Tabs */}
      <div className="mb-4">
        <ul className="flex flex-wrap justify-center md:justify-start space-x-2 px-4">
          <li>
            <button
              className={`w-full md:w-40 p-3 rounded-lg text-orange-500 font-medium transition duration-200 ${
                activeTab === "regions" ? "bg-[#798191] text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab("regions")}
              role="tab"
              aria-selected={activeTab === "regions"}
            >
              Regions
            </button>
          </li>
          <li>
            <button
              className={`w-full md:w-40 p-3 rounded-lg text-orange-500 font-medium transition duration-200 ${
                activeTab === "zones" ? "bg-[#798191] text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab("zones")}
              role="tab"
              aria-selected={activeTab === "zones"}
            >
              Zones
            </button>
          </li>
          <li>
            <button
              className={`w-full md:w-40 p-3 rounded-lg text-orange-500 font-medium transition duration-200 ${
                activeTab === "woredas" ? "bg-[#798191] text-white" : "bg-white"
              }`}
              onClick={() => setActiveTab("woredas")}
              role="tab"
              aria-selected={activeTab === "woredas"}
            >
              Woredas
            </button>
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        <div id="default-tab-content">
          {activeTab === "regions" && <AdminRegion />}
          {activeTab === "zones" && <AdminZone />}
          {activeTab === "woredas" && <AdminWoreda />}
        </div>
      </div>
    </div>
  );
};

export default Address;