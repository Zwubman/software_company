import { useState } from "react";
import SideBar from "../../components/AdminComponents/SideBar";
import TopBar from "../../components/AdminComponents/TopBar";
import MainContent from "../../components/AdminComponents/MainContent";
import { useSelector } from "react-redux";

const AdminPage = () => {
  const { user } = useSelector((state) => state.userData);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(
    user.role === "admin" ? "users1" : "report"
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { name: "dashboard", label: "Dashboard" },
    { name: "about", label: "About Content" },
    { name: "services", label: "Services" },
    { name: "news", label: "Teamwork News" },
    { name: "events", label: "Teamwork Events" },
    { name: "jobs", label: "Job Board" },
    { name: "agents", label: "Our Agents" },
    { name: "partners", label: "Partners" },
    { name: "regions", label: "Regions In Ethiopia" },
    { name: "zones", label: "Regional Zones" },
    { name: "woredas", label: "Zonal Woredas" },
    { name: "events", label: "Events" },
    { name: "feadbacks", label: "Feadbacks" },
    { name: "users", label: "Users" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          navItems={navItems}
        />

        <MainContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default AdminPage;
