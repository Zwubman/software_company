import axios from "axios";
import { api } from "../constants/api";

// Get all Team entries (admin only) with filtration
export async function getTeamEntries(page = 1, limit = 100, filters = {}) {
  const initialTeamMembers = [
    {
      id: 1,
      name: "Nigussie Sefinew",
      title: "Chief Executive Officer",
      imageUrl: "/assets/logo1.png",
      quote:
        '"I believe digital innovation should empower every citizen and create pathways to opportunity for all."',
    },
    {
      id: 2,
      name: "Eyuel",
      title: "Backend Developer",
      imageUrl: "/assets/eyu.png",
      quote:
        '"Behind every reliable service is invisible architecture. I build systems that citizens can trust."',
    },
    {
      id: 3,
      name: "Seble Sefineh",
      title: "Frontend Developer",
      imageUrl: "/assets/seb.jpg",
      quote:
        '"Interfaces are more than pixels--they are bridges between people and public service."',
    },
    {
      id: 4,
      name: "Seble Sefineh",
      title: "Frontend Developer",
      imageUrl: "/assets/seb.jpg",
      quote:
        '"Interfaces are more than pixels--they are bridges between people and public service."',
    },
    {
      id: 5,
      name: "Seble Sefineh",
      title: "Frontend Developer",
      imageUrl: "/assets/seb.jpg",
      quote:
        '"Interfaces are more than pixels--they are bridges between people and public service."',
    },
    {
      id: 6,
      name: "Seble Sefineh",
      title: "Frontend Developer",
      imageUrl: "/assets/seb.jpg",
      quote:
        '"Interfaces are more than pixels--they are bridges between people and public service."',
    },
  ];

  try {
    const response = await axios.get(`${api}/teams`, {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch Team entries"
    );
  }
}

// Create a new Team entry (admin only)
export async function createTeamEntry(entryData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(`${api}/teams`, entryData, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to create Team entry"
    );
  }
}

// Update Team entry by ID (admin only)
export async function updateTeamEntry(id, entryData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${api}/teams/${id}`, entryData, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update Team entry"
    );
  }
}

// Delete Team entry (admin only)
export async function deleteTeamEntry(entryId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(`${api}/teams/${entryId}`, config);
    return response.data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to delete Team entry"
    );
  }
}
