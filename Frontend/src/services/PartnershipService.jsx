import axios from "axios";
import { api } from "../constants/api";
import MyToast from "../components/Notification/MyToast";

// Create or Apply for Partnership Request
export async function createPartnership(data) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${api}/partnerships/apply-partnership`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // MyToast(error.response?.data?.message || "Failed to create agent", "error");
    throw new Error(error.response?.data?.message || "Failed to create agent");
  }
}

// Get All Partnerships (Admin Only)
export async function getAllPartnerships(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/partnerships/all-partnerships`, {
      params: { page, limit, ...filters },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch partnerships"
    );
  }
}

// Get Partnership by ID (Admin Only)
export async function getPartnershipById(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/partnerships/partnership/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch partnership"
    );
  }
}

// Update Partnership Request (User)
export async function updatePartnership(id, data) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${api}/partnerships/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update partnership"
    );
  }
}

// Delete Partnership Request (Admin Only)
export async function deletePartnership(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${api}/partnerships/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete partnership"
    );
  }
}

// Delete Partnership Request (Admin Only)
export async function deleteMyPartnership(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${api}/partnerships/delete-partnership/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete partnership"
    );
  }
}

// Update Partnership Request Status (Admin Only)
export async function updatePartnershipStatus(id, data) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${api}/partnerships/update-status/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update partnership status"
    );
  }
}
// Update Partnership Request Status (Admin Only)
export async function updateMyPartnership(id, data) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`${api}/partnerships/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // MyToast(error.response?.data?.message, "error");
    throw new Error(
      error.response?.data?.message || "Failed to update partnership status"
    );
  }
}

// Get User's Own All Partnership Requests
export async function getMyPartnerships(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/partnerships/my-partnerships`, {
      params: { page, limit, ...filters },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch your partnerships"
    );
  }
}
