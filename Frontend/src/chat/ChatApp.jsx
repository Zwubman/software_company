import React, { useEffect, useRef, useState } from "react";
import { LogOut, Menu, Send, Check } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loading } from "../features/userSlice";
import {
  getSingleUserMessage,
  getUsers,
  markMessagesAsRead,
} from "../services/ChatService";
import io from "socket.io-client";
import Profile from "../components/profile/Profile";
import Settings from "../components/profile/Settings";
import ChangePasswordComponent from "../components/profile/ChangePassword";
import { motion, AnimatePresence } from "framer-motion";
import { PersonStandingIcon } from "lucide-react";

const SkeletonLoader = () => (
  <div className="flex items-start mb-4 animate-pulse">
    <div className="flex items-center mr-4">
      <div className="w-10 h-10 bg-pink-300 rounded-full mr-2"></div>
      <div className="h-6 bg-gray-300 rounded-lg w-24"></div>
    </div>
    <div className="flex-1">
      <div className="h-10 bg-gray-300 rounded-lg w-3/4"></div>
      <div className="h-6 bg-gray-300 rounded-lg my-2 w-1/2"></div>
    </div>
  </div>
);

const UserSkeletonLoader = () => (
  <div
    className={`flex items-center mb-4 cursor-pointer p-2 rounded-md flex-col md:flex-row animate-pulse bg-gray-100`}
  >
    <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto md:mr-3 flex items-center justify-center">
      <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
    </div>

    <div className="flex-1">
      <h2 className="text-sm lg:text-lg font-semibold bg-gray-300 h-4 w-1/2 mb-2"></h2>
      <div className="flex flex-col">
        <span className="bg-gray-300 h-3 w-3/4 mb-1"></span>
        <span className="bg-gray-300 h-3 w-1/3"></span>
      </div>
    </div>
  </div>
);

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderID] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { user } = useSelector((state) => state.userData);
  const [content, setContent] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileDisplay, setProfileDisplay] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const chatboxRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Establish Socket.IO connection
  const socket = io("https://teamwork-backend-tlqq.onrender.com", {
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  useEffect(() => {
    getAllChatUsers();
  }, []);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      // Check if the sender is not the currently selected user
      if (message.senderId !== senderId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        }));
      } else {
        // If the user is selected, just append the message
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [senderId]);

  useEffect(() => {
    if (senderId) {
      getSingleUserMessages();
      handleUserSelect(senderId);
    }
  }, [senderId]);

  const handleUserSelect = async (userId) => {
    try {
      // Mark messages as read for the selected user
      await markMessagesAsRead(userId);

      // Reset unread count for the selected user
      setUnreadMessages((prev) => ({ ...prev, [userId]: 0 }));

      // Update the users list to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, unreadMessages: 0 } : u
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (content.trim()) {
      await socket.emit("replyMessage", { receiverId: senderId, content });
      addUserMessage(content);
      setContent("");
    }
  };

  const addUserMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: message,
        senderId: user.id,
        createdAt: new Date().toISOString(), // Get the current time in ISO format
        isRead: false,
      },
    ]);
  };

  const getAllChatUsers = async () => {
    setUserLoading(true);
    try {
      const response = await getUsers();
      const fetchedUsers = response?.data || [];
      setUsers(fetchedUsers);

      const unreadData = {};
      fetchedUsers.forEach((user) => {
        if (user.unreadMessages > 0) {
          unreadData[user.id] = user.unreadMessages;
        }
      });
      setUnreadMessages(unreadData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const getSingleUserMessages = async () => {
    if (senderId) {
      setLoadingMessages(true);
      try {
        const response = await getSingleUserMessage(senderId);
        setMessages(response?.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(loading(false));
    navigate("/");
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };
  const selectedUser = users.find((u) => u.id === senderId);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const seconds = Math.floor((now - messageTime) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className="w-1/4 bg-white border-r border-gray-300"
        onClick={() => setIsDropdownOpen(false)}
      >
        <header className="px-1 md:px-4 py-2 border-b border-gray-300 flex justify-between items-center bg-[#19274a] text-white">
          <h1 className="hidden md:block font-semibold text-center text-sm ">
            Teamwork Assistant
          </h1>

          <h1 className="flex flex-col items-center">
            <img
              src={user?.profilePicture || ".././public/assets/hero1.jpg"}
              alt="A"
              className="w-8 h-8 rounded-full"
            />
            <p className="text-xs">{user?.name}</p>
          </h1>
        </header>
        {userLoading ? (
          <div className="p-4">
            <UserSkeletonLoader />
            <UserSkeletonLoader />
            <UserSkeletonLoader />
          </div>
        ) : (
          <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
            {users?.map((user, index) => (
              <div
                key={index}
                className={`flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md flex-col md:flex-row ${
                  user.id === senderId ? "bg-gray-200" : ""
                }`}
                onClick={() => {
                  setSenderID(user.id);
                  setProfileDisplay(false);
                }}
              >
                <div className="w-12 h-12 bg-pink-300 rounded-full mx-auto md:mr-3 flex items-center justify-center relative">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {user?.name?.charAt(0)}
                    </span>
                  )}

                  {/* Notification badge for unread messages */}
                  {(unreadMessages[user.id] > 0 || user.unreadMessages > 0) && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadMessages[user.id] || user.unreadMessages}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-sm lg:text-lg font-semibold hidden md:block">
                    {user?.name}
                  </h2>
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-sm hidden lg:block">
                      {user.email}
                    </span>
                    <p className="text-xs text-slate-500 hidden lg:block">
                      {/* agent(south wello) */}
                    </p>

                    {(unreadMessages[user.id] > 0 ||
                      user.unreadMessages > 0) && (
                      <span className="text-red-500 text-sm font-medium hidden lg:block">
                        {unreadMessages[user.id] || user.unreadMessages} new
                        message
                        {(unreadMessages[user.id] || user.unreadMessages) > 1
                          ? "s"
                          : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 relative w-full overflow-y-scroll">
        <header className="bg-white px-4 pt-4 text-slate-500 z-50 flex justify-between">
          <h1 className="text-xs md:text-xl font-semibold">
            {selectedUser ? selectedUser.name : "Select a user"}
            {/* <p className="text-xs text-orange-400"> agent(south wello)</p> */}
          </h1>
          <div className="flex justify-center align-text-bottom items-center mb-0">
            <Menu
              className="text-slate-900 mr-4 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
          </div>
        </header>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e8eaed] z-50"
            >
              <div className="py-1">
                <motion.button
                  onClick={() => {
                    setProfileDisplay(true);
                    setSenderID("");
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fee8d9] hover:text-[#EB6407] transition-colors duration-200"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <PersonStandingIcon className="w-4 h-4" />
                  Profile{" "}
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[#3a4253] hover:bg-[#fee8d9] hover:text-[#EB6407] transition-colors duration-200"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <hr className="shadow-md" />

        {profileDisplay ? (
          <div
            className="flex flex-col lg:flex-row gap-4 p-4 rounded-lg shadow-md"
            onClick={() => {
              setIsDropdownOpen(false);
            }}
          >
            <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold mb-2">Profile</h2>
              <Profile />
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow">
              <h2 className="text-xl font-semibold mb-12">Change Password</h2>
              <ChangePasswordComponent />
            </div>
          </div>
        ) : (
          <div>
            <div
              className="h-screen overflow-y-auto p-4 pb-36"
              ref={chatboxRef}
              onClick={() => setIsDropdownOpen(false)}
            >
              {loadingMessages ? (
                <SkeletonLoader />
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <PersonStandingIcon className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center mb-2">
                    No messages available.
                  </p>
                  <p className="text-gray-500 text-center mb-4">
                    Select a user to start chatting.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-7xl mx-auto flex mb-4 items-start ${
                      msg.senderId === user?.id ? "justify-end" : ""
                    }`}
                  >
                    <div className="w-12 h-12 bg-pink-300 rounded-full mr-3 flex items-center justify-center">
                      {msg.senderId !== user?.id ? (
                        selectedUser.profilePicture ? (
                          <img
                            src={selectedUser.profilePicture}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {selectedUser?.name?.charAt(0)}
                          </span>
                        )
                      ) : user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {user?.name?.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div
                      className={`flex flex-col min-w-52 max-w-52 md:max-w-4xl ${
                        msg.senderId === user?.id
                          ? "bg-slate-600 text-white"
                          : "bg-gray-300 text-black"
                      } rounded-lg p-3 gap-3`}
                    >
                      <p>{msg.content}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs ml-2">
                          {formatTimeAgo(msg.createdAt)}
                        </p>
                        {/* Remove in-bubble checks to avoid low contrast */}
                      </div>
                    </div>
                    {msg.senderId === user?.id && (
                      <div className="flex items-center justify-end mt-1 pr-1 text-slate-600">
                        {msg.isRead ? (
                          <>
                            <Check size={14} className="text-slate-600" />
                            <Check size={14} className="-ml-2 text-slate-600" />
                          </>
                        ) : (
                          <Check size={14} className="text-slate-600" />
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full">
              <div className="flex items-center">
                <input
                  value={content}
                  type="text"
                  placeholder="Type a message..."
                  className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                  onChange={(e) => setContent(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={sendMessage}
                  className="bg-slate-600 text-white px-4 py-2 rounded-md ml-2 flex items-center"
                >
                  <span className="hidden sm:block">Send</span>
                  <Send className="ml-1" />
                </button>
              </div>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
