import axios from 'axios';
import { api } from "../constants/api";

// Get all about entries (admin only) with filtration
export async function getAboutEntries() {

  try {
    const response = await axios.get(`${api}/abouts/all-abouts`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch about entries');
  }
}



// Create a new about entry (admin only)
export async function createAboutEntry(entryData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(`${api}/abouts/create-about`, entryData, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create about entry');
  }
}

// Update about entry by ID (admin only)
export async function updateAboutEntry(id, entryData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${api}/abouts/update/${id}`, entryData, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update about entry');
  }
}

// Delete about entry (admin only)
export async function deleteAboutEntry(entryId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(`${api}/abouts/delete/${entryId}`, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete about entry');
  }
}

