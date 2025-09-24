import axios from "axios";
import { api } from "../constants/api";

// Get all report entries (admin only) with filtration
export async function getReportEntries(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit, ...filters },
  };

  try {
    const response = await axios.get(`${api}/reports/all-reports`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch report entries"
    );
  }
}

// Create a new report entry (admin only)
export async function createReport(reportData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${api}/reports/create-report`,
      reportData,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create report entry"
    );
  }
}

// Update report entry by ID (admin only)
export async function updateReport(id, reportData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${api}/reports/update/${id}`,
      reportData,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update report entry"
    );
  }
}

// Delete report entry (admin only)
export async function deleteReport(reportId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(
      `${api}/reports/delete/${reportId}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to delete report entry"
    );
  }
}

export async function getMyReports(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit, ...filters },
  };

  try {
    const response = await axios.get(`${api}/reports/my-reports`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch my reports"
    );
  }
}

// reports/update-status/:id
export async function updateReportStatus(id, status) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${api}/reports/update-status/${id}`,
      { status },
      config
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update report status"
    );
  }
}

export async function getReportStat() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${api}/reports/report-stat`, config);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch report entries"
    );
  }
}
