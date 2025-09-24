import React, { useEffect, useRef, useState } from "react";
import { X, Send, MessageCircle } from "react-feather";
import { useSelector } from "react-redux";
import { getMyMessage, markUserMessagesAsRead } from "../services/ChatService";
import io from "socket.io-client";

const UserChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.userData);
  const chatboxRef = useRef(null);

  // Establish Socket.IO connection
  const socket = io("https://api.teamworksc.com", {
    auth: {
      token: localStorage.getItem("token"),
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      markMessagesAsRead();
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      // Add new message to the conversation
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await getMyMessage();
      setMessages(response?.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (content.trim()) {
      // Add user message to the chat immediately
      const userMessage = {
        content: content.trim(),
        senderId: user.id,
        createdAt: new Date().toISOString(),
        isUserMessage: true, // Flag to identify user messages
      };

      setMessages((prev) => [...prev, userMessage]);
      setContent("");

      try {
        // Send message to backend
        await socket.emit("sendMessage", { content: content.trim() });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await markUserMessagesAsRead();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const seconds = Math.floor((now - messageTime) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} />
          <h3 className="font-semibold">Chat with our Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatboxRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.senderId === user?.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.senderId === user?.id
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTimeAgo(msg.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!content.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
