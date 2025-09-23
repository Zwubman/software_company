import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import AOS from "aos";
import "aos/dist/aos.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./i18n";
import AboutUs from "./pages/About/About";
import Services from "./pages/Services/Services";
import { Toaster } from "react-hot-toast";
import PartnershipApply from "./pages/Partnership/PartnershipApply";
import AgentApply from "./pages/Agent/agentApply";
import PostsHome from "./pages/Posts/postHome/postHome";
import News from "./pages/Posts/News/News";
import Events from "./pages/Posts/Events/Events";
import Jobs from "./pages/Posts/Jobs/Jobs";
import Team from "./pages/Posts/More/Team/team";
import Contactus from "./pages/Posts/More/Contact us/Contact us";
import AdminHome from "./pages/AdminPage/AdminHome";
import CustomerOrderForm from "./components/Forms/order/customerOrder";
import Login from "./pages/user/Login";
import Registration from "./pages/user/Registration";
import { useSelector, useDispatch } from "react-redux";
import ConfirmOtp from "./pages/user/ConfirmOtp";
import SkeletonLoader from "./SkeletonLoader";
import Detail from "./pages/Posts/Jobs/Detail";
import MyApplications from "./pages/user/MyApplications";
import MyRequest from "./pages/Agent/MyRequest";
import MyOrder from "./pages/order/MyOrder";
import MyPartnershipRequest from "./pages/Partnership/MyPartnershipRequest";
import Feedback from "./feedback/Feedback";
import AgentHome from "./pages/AdminPage/AgentHome";
import NewsDetail from "./pages/Posts/News/NewsDetail";
import Profile from "./components/profile/Profile";
import Settings from "./components/profile/Settings";
import ChatApp from "./chat/ChatApp";
import ChatBot from "./chat/ChatBot";
import PasswordResetDialog from "./pages/user/PasswordResetDialog";
import { toggleResetPassword } from "./features/dialogSlice";
import PasswordInputDialog from "./pages/user/PasswordInputDialog";
import ConfirmPasswordOtp from "./pages/user/ConfirmPasswordOtp";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialogData);
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.userData
  );
  const route = useSelector((state) => state.routerData.route);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const tokenn = localStorage.getItem("token");
    if (tokenn) {
      dispatch({ type: "user/check-auth" });
    }
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />

      {dialog.isOtpConfirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-0 sm:p-5 rounded-lg relative w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] xl:w-[30%] flex justify-center">
            <ConfirmOtp />
          </div>
        </div>
      )}
      {dialog.inputPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-0 sm:p-5 rounded-lg relative w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] xl:w-[30%] flex justify-center">
            <PasswordInputDialog
              onClose={() => dispatch(toggleInputPassword(false))}
            />
          </div>
        </div>
      )}
      {dialog.resetPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-0 sm:p-5 rounded-lg relative w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] xl:w-[30%] flex justify-center">
            <PasswordResetDialog />
          </div>
        </div>
      )}
      {dialog.verifyPasswordOtp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-0 sm:p-5 rounded-lg relative w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] xl:w-[30%] flex justify-center">
            <ConfirmPasswordOtp />
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white flex justify-center items-center z-[100]">
          <SkeletonLoader />
        </div>
      )}

      <Routes>
        {!isAuthenticated ||
        (user.role !== "admin" &&
          user.role !== "regionAdmin" &&
          user.role !== "zoneAdmin" &&
          user.role !== "assistant" &&
          user.role !== "woredaAdmin") ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/service" element={<Services />} />
            <Route path="/agents" element={<AgentApply />} />
            {/* <Route path="/service" element={<Services />} /> */}
            {/* <Route path="/agents" element={<AgentApply />} /> */}
            <Route path="/partnership" element={<PartnershipApply />} />
            <Route path="/posts" element={<PostsHome />} />
            <Route path="/posts/news" element={<News />} />
            <Route path="/posts/news/:id" element={<NewsDetail />} />

            <Route path="/posts/events" element={<Events />} />
            <Route path="/posts/jobs" element={<Jobs />} />
            <Route path="/posts/jobs/:jobId" element={<Detail />} />

            <Route path="/posts/more/team" element={<Team />} />
            <Route path="/posts/more/contact us" element={<Contactus />} />
            <Route path="/service/order" element={<CustomerOrderForm />} />
          </>
        ) : null}

        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Registration />} />
            <Route path="/feedback" element={<Feedback />} />
            {/* <Route path="/chat" element={<ChatApp />} /> */}
          </>
        ) : (
          <>
            {(user?.role === "zoneAdmin" ||
              user?.role === "regionAdmin" ||
              user?.role === "admin" ||
              user?.role === "woredaAdmin") && (
              <Route path="/admin" element={<AdminHome />} />
            )}
            {user.role === "assistant" && (
              <Route path="/chat" element={<ChatApp />} />
            )}
            {/* {user.role === "agent" && (
              <Route path="/agent" element={<AgentHome />} />
            )} */}
            <Route
              path="/my-applications/:userID"
              element={<MyApplications />}
            />
            <Route path="/my-agent-request" element={<MyRequest />} />
            <Route path="/my-orders" element={<MyOrder />} />
            <Route path="/my-partnership" element={<MyPartnershipRequest />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/settings/:userId" element={<Settings />} />
            <Route path="/posts/jobs/:jobId" element={<Detail />} />
            <Route path="/feedback" element={<Feedback />} />
          </>
        )}

        <Route
          path="*"
          element={
            <Navigate
              to={
                !loading && isAuthenticated
                  ? user?.role == "zoneAdmin" ||
                    user?.role == "regionAdmin" ||
                    user?.role == "admin" ||
                    user?.role == "woredaAdmin"
                    ? "/admin"
                    : user.role == "assistant"
                    ? "/chat"
                    : route || "/"
                  : "/"
              }
              //agent with side bar
              // to={
              //   !loading && isAuthenticated
              //     ? user?.role == "zoneAdmin" ||
              //       user?.role == "regionAdmin" ||
              //       user?.role == "admin" ||
              //       user?.role == "woredaAdmin"
              //       ? "/admin"
              //       : user.role == "agent"
              //       ? "/agent"
              //       : route || "/"
              //     : "/"
              // }
            />
          }
        />
      </Routes>
      {
        isAuthenticated &&
        // user.role !== "admin" &&
        user.role !== "assistant" && <ChatBot />
      }
    </Router>
  );
}

export default App;
