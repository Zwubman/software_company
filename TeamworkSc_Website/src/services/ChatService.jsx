import axios from "axios";
import { api } from "../constants/api";

//reply message
export async function replayMessage(messageData, id) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${api}/messages/reply/${id}`,
      messageData,
      config
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to send message");
  }
}

//send message
export async function sendMessage(messageData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${api}/messages/send`,
      messageData,
      config
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to send message");
  }
}

//get my message
export async function getMyMessage() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(`${api}/messages/conversation`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch about entries"
    );
  }
}

//get my message by userId (assistant only)
export async function getSingleUserMessage(id) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${api}/messages/conversation/${id}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch about entries"
    );
  }
}

//get users
export async function getUsers() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(`${api}/messages/all-senders`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch about entries"
    );
  }
}

// Mark messages as read for a specific user (assistant uses this with sender id)
export async function markMessagesAsRead(userId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(
      `${api}/messages/mark-read/${userId}`,
      {},
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to mark messages as read"
    );
  }
}

// Get unread message count for a specific user (assistant querying by sender id)
export async function getUnreadMessageCount(userId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${api}/messages/unread-count/${userId}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to get unread message count"
    );
  }
}

// User endpoints: unread count and mark read for the logged-in user
export async function getUserUnreadMessageCount() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(`${api}/messages/user/unread-count`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to get unread message count"
    );
  }
}

export async function markUserMessagesAsRead() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(`${api}/messages/user/mark-read`, {}, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to mark messages as read"
    );
  }
}
