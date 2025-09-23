import axios from "axios";
import { api } from "../constants/api";

// Get all ContactUs entries (admin only) with filtration
export async function getContactUsEntries(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit, ...filters },
  };

  try {
    const response = await axios.get(`${api}/contact-us`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch ContactUs entries"
    );
  }
}

// Create a new ContactUs entry (admin only)
export async function createContactUsEntry(entryData) {
  try {
    const response = await axios.post(`${api}/contact-us`, entryData);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to create ContactUs entry"
    );
  }
}

// Delete ContactUs entry (admin only)
export async function deleteContactUsEntry(entryId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(`${api}/contact-us/${entryId}`, config);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to delete ContactUs entry"
    );
  }
}
