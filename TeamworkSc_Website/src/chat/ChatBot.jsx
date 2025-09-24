import React, { useState, useRef, useEffect } from "react";
import { getMyMessage, markUserMessagesAsRead } from "../services/ChatService";
import { useSelector } from "react-redux";
import { MessageCircle, Send, Check } from "react-feather";
import io from "socket.io-client";
import { AlertTriangle } from "lucide-react";

const ChatBot = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatboxRef = useRef(null);
  const { user } = useSelector((state) => state.userData);
  const [content, setContent] = useState("");
  const [unreadCount, setUnreadCount] = useState(0); // Track unread assistant messages
  const [toastError, setToastError] = useState("");

  // Establish Socket.IO connection
  // const socket = io("http://localhost:7777", {
  const socket = io("https://api.teamworksc.com", {
    auth: {
      token: localStorage.getItem("token"), // Ensure token is stored correctly
    },
  });

  const computeUnreadFromMessages = (allMessages, currentUserId) => {
    if (!Array.isArray(allMessages)) return 0;
    return allMessages.filter(
      (message) => !message.isRead && message.senderId !== currentUserId
    ).length;
  };

  const fetchUserMessages = async () => {
    try {
      const response = await getMyMessage();
      const fetched = response?.data || [];
      setMessages(fetched);
      setUnreadCount(computeUnreadFromMessages(fetched, user.id));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (!user.id) {
      setChatVisible(false);
      setMessages([]);
      setUnreadCount(0);
      return;
    }
    // Listen for incoming messages
    socket.on("receive_message", async (message) => {
      setMessages((prevMessages) => {
        const next = [...prevMessages, message];
        return next;
      });

      // If message is from assistant and chat is not visible, bump unread
      const isFromAssistant = message.senderId !== user.id;
      if (isFromAssistant && !chatVisible) {
        setUnreadCount((prevCount) => prevCount + 1);
      }

      // Refresh conversation to update read statuses (so checks flip automatically)
      if (isFromAssistant) {
        await fetchUserMessages();
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [user.id, chatVisible]);

  useEffect(() => {
    if (user.id) {
      fetchUserMessages();
    }
  }, [user.id]);

  const markAllAssistantMessagesAsRead = async () => {
    try {
      // Mark on backend for the logged-in user
      await markUserMessagesAsRead();
      // Update UI state to reflect read status for assistant messages
      setMessages((prev) =>
        prev.map((m) => (m.senderId !== user.id ? { ...m, isRead: true } : m))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  const toggleChatbox = async () => {
    if (!user.id) {
      setToastError("Sign up to chat with our Assistant!");
      setTimeout(() => {
        setToastError("");
      }, 2000);
      return;
    }

    const nextVisible = !chatVisible;
    setChatVisible(nextVisible);

    // When opening the chat, mark assistant messages as read
    if (nextVisible && unreadCount > 0) {
      await markAllAssistantMessagesAsRead();
    }
  };

  const handleSendMessage = async () => {
    if (content.trim() !== "") {
      await socket.emit("sendMessage", { content });
      setContent("");
    }
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const hoverMessage =
    user.id && !chatVisible && unreadCount > 0
      ? `You have ${unreadCount} new ${
          unreadCount === 1 ? "message" : "messages"
        }`
      : "";

  return (
    <div>
      <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
        {toastError ? (
          <div className="flex items-center bg-red-100 text-red-600 py-2 px-4 rounded-md shadow-md">
            <AlertTriangle className="mr-2" />
            <span>{toastError}</span>
          </div>
        ) : (
          <button
            onClick={toggleChatbox}
            className="bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 transition duration-300 flex items-center"
          >
            {/* Mobile icon with badge */}
            <span className="relative group block sm:hidden mr-2">
              <MessageCircle size={30} />
              {user.id && !chatVisible && unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {unreadCount}
                  </span>
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-white text-red-600 border border-red-300 rounded-md px-3 py-1 text-sm sm:text-base font-semibold whitespace-nowrap shadow-lg">
                    {hoverMessage}
                  </span>
                </>
              )}
            </span>

            <span className="flex flex-row items-center">
              {/* Desktop icon with badge */}
              <span className="relative group hidden sm:inline-block mr-2">
                <MessageCircle size={40} />
                {user.id && !chatVisible && unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {unreadCount}
                    </span>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-white text-red-600 border border-red-300 rounded-md px-3 py-1 text-base font-semibold whitespace-nowrap shadow-lg">
                      {hoverMessage}
                    </span>
                  </>
                )}
              </span>

              <span className="hidden sm:block">Chat with our Assistant</span>
            </span>
            <span className="block sm:hidden">Chat</span>
          </button>
        )}
      </div>

      {chatVisible && (
        <div className="fixed bottom-16 right-1 w-96">
          <div className="bg-white shadow-md rounded-lg max-w-lg w-full">
            <div className="p-4 border-b bg-slate-600 text-white rounded-t-lg flex justify-between items-center">
              <p className="text-lg font-semibold">Teamwork Assistant</p>
              <button
                onClick={toggleChatbox}
                className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div ref={chatboxRef} className="p-4 h-80 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle
                    size={48}
                    className="mx-auto mb-2 text-gray-300"
                  />
                  <p>
                    You can start to chat wiht our assistant freely. for ask
                    every question be free
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.senderId === user.id ? "text-right" : ""
                    }`}
                  >
                    <div className="inline-flex items-end">
                      <p
                        className={`rounded-lg py-2 px-4 inline-block ${
                          msg.senderId === user.id
                            ? "bg-slate-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {msg.content}
                      </p>
                      {msg.senderId === user.id && (
                        <span
                          className={`ml-1 inline-flex items-center ${
                            msg.senderId === user.id
                              ? "text-slate-600"
                              : "hidden"
                          }`}
                        >
                          {msg.isRead ? (
                            <>
                              <Check size={14} />
                              <Check size={14} className="-ml-2" />
                            </>
                          ) : (
                            <Check size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                placeholder="Type a message"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="bg-slate-600 text-white px-4 py-2 mx-2 rounded-r-md hover:bg-slate-600 transition duration-300"
              >
                <Send />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
