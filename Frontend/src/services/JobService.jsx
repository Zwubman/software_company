import axios from "axios";
import { api } from "../constants/api";
import MyToast from "../components/Notification/MyToast";
const API_URL = "https://api.teamworksc.com/api/v1/jobs";

export async function getAllJobs(page = 1, limit = 10, filters = {}) {
  try {
    const response = await axios.get(`${api}/jobs/all-job`, {
      params: {
        page,
        limit,
        search: filters.search || "",
        jobType: filters.jobType || "",
        category: filters.category || "",
        jobStatus: filters.jobStatus || "",
        location: filters.location || "",
        sortBy: filters.sortBy || "", 
        sortOrder: filters.sortOrder || "ASC", 
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch jobs";
  }
}


export async function getAllOpenedJobs(page = 1, limit = 10, filters = {}) {

  try {
    const response = await axios.get(`${api}/jobs/open-job`, {
      params: {
        page,
        limit,
        search: filters.filters?.search || "",
        jobType: filters.filters?.jobType || "",
        category: filters.filters?.category || "",
        jobStatus: filters.filters?.jobStatus || "",
        location: filters.filters?.location || "",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch jobs";
  }
}

export async function getOpenJobs(page = 1, limit = 10, filters = {}) {
  try {
    const response = await axios.get(`${API_URL}/open`, {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch open jobs";
  }
}

export async function getJobById(id) {
  try {
    const response = await axios.get(`${api}/jobs/job/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch job";
  }
}

export async function createJob(jobData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${api}/jobs/create-job`,
      jobData,
      config
    );
    MyToast(response.data.message, response.data.success ? "success" : "error");
    return response.data;
  } catch (error) {
    MyToast(error?.data?.message || "Failed to create job", "error");
    throw error.response?.data?.error || "Failed to create job";
  }
}

export async function updateJob(id, jobData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${api}/jobs/update/${id}`,
      jobData,
      config
    );
    MyToast(response.data.message, response.data.success ? "success" : "error");

    return response.data;
  } catch (error) {
    MyToast(error?.data?.message || "Failed to create job", "error");

    throw error.response?.data?.error || "Failed to update job";
  }
}

export async function deleteJob(id) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.delete(`${api}/jobs/delete/${id}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to delete job";
  }
}
export async function applyforJob(jobData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.post(`${api}/job-applications/apply`, jobData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getJobApplications(jobId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(`${api}/job-applications/job-applications/${jobId}`, config);
    return response?.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch job applications";
  }
}
export async function updateApplicationStatus(id, status) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.put(`${api}/job-applications/update-status/${id}`, status, config);
    MyToast(response?.data?.message||"status updated successfully", response?.data?.success ? "success" : "error");
   
    return response?.data;
  } catch (error) {
    MyToast(error.response?.data?.error ||"Failed to update application status", "error");

    throw error.response?.data?.error || "Failed to update application status";
  }
}
export async function deleteAppliciant(id) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.delete(`${api}/job-applications/delete/${id}`, config);
    MyToast(response?.data?.message, response?.data?.success ? "success" : "error");
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete application");
    }
    return response?.data;
  } catch (error) {
    MyToast( error.response?.data?.error ? error.response?.data?.error :"Failed to update application status", "error");
    throw error.response?.data?.error || "Failed to delete application";
  }
}
export async function getMyJobs() {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.get(`${api}/job-applications/my-applications`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Failed to fetch applied jobs";
  }
}