import AdminAgent from "./AdminAgent";
import AdminJobs from "./AdminJobs";
import AdminRegion from "./AdminRegion";
import Dashboard from "./Dashboard";
import AdminOrders from "./AdminOrders";
import AdminZone from "./AdminZone";
import AdminWoreda from "./AdminWoreda";
import News from "../../pages/AdminPage/news/News.jsx";
import AdminNews from "./AdminNews.jsx";
import AdminEvent from "./AdminEvent.jsx";
import AdminService from "./AdminService.jsx";
import AdminPartner from "./AdminPartner.jsx";
import Address from "./Address.jsx";
import AdminAbout from "./AdminAbout.jsx";
import AdminFeadback from "./AdminFeadback.jsx";
import AdminUser from "./AdminUser.jsx";
import UserAnalytics from "./analytics/UserAnalytics.jsx";
import JobAnalytics from "./analytics/JobAnalytics.jsx";
import OrderAnalytics from "./analytics/OrderAnalytics.jsx";
import NewsAnalytics from "./analytics/NewsAnalytics.jsx";
import MyApplications from "../../pages/user/MyApplications.jsx";
import MyOrder from "../../pages/order/MyOrder.jsx";
import Services from "../../pages/Services/Services.jsx";
import MyRequest from "../../pages/Agent/MyRequest.jsx";
import Jobs from "../../pages/Posts/Jobs/Jobs.jsx";
import AdminReport from "./AdminReport.jsx";
import Profile from "../profile/Profile.jsx";
import Settings from "../profile/Settings.jsx";
import AdminContactUs from "./AdminContactUs.jsx";
import AdminTeams from "./AdminTeams.jsx";
const MainContent = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <UserAnalytics />;
      case "home":
        return <h1>Home</h1>;
      case "about":
        return <AdminAbout />;
      case "services":
        return <AdminService />;
      case "news":
        return <AdminNews />;
      case "events":
        return <AdminEvent />;
      case "jobs":
        return <AdminJobs />;
      case "agents":
        return <AdminAgent />;
      case "partners":
        return <AdminPartner />;
      case "orders":
        return <AdminOrders />;
      case "users1":
        return <UserAnalytics />;
      case "jobs1":
        return <JobAnalytics />;
      case "orders1":
        return <OrderAnalytics />;
      case "news1":
        return <NewsAnalytics />;
      case "location":
        return <Address />;
      case "feadbacks":
        return <AdminFeadback />;
      case "users":
        return <AdminUser />;
      case "my-job-applications":
        return <MyApplications />;
      case "my-order":
        return <MyOrder />;
      case "report":
        return <AdminReport />;
      case "order-service":
        return <Services />;
      case "my-agent-request":
        return <MyRequest />;
      case "apply-job":
        return <Jobs />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "contactUs":
        return <AdminContactUs />;
      case "teams":
        return <AdminTeams />;

      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            Select a menu item
          </div>
        );
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      {renderContent()}
    </main>
  );
};

export default MainContent;
