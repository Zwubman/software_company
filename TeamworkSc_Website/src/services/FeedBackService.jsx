import axios from "axios";
import { api } from "../constants/api";

// Get all feedback entries (admin only) with filtration

export async function getFeedbackEntries(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit, ...filters },
  };
  try {
    const response = await axios.get(
      `${api}/user-feedbacks/all-feedbacks`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch feedback entries"
    );
  }
}
export async function getFeedBackRating() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(
      `${api}/user-feedbacks/average-rating`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch feedback entries"
    );
  }
}

// Create a new feedback entry
export async function createFeedbackEntry(feedbackData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${api}/user-feedbacks/send-feedback`,
      feedbackData
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create feedback entry"
    );
  }
}

// Update feedback entry by ID (admin only)
export async function updateFeedbackEntryStatus(id, feedbackData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${api}/user-feedbacks/update-status/${id}`,
      feedbackData,
      config
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update feedback entry"
    );
  }
}

// Delete feedback entry (admin only)
export async function deleteFeedbackEntry(entryId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(
      `${api}/user-feedbacks/delete/${entryId}`,
      config
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to delete feedback entry"
    );
  }
}
