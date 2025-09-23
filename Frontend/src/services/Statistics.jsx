import axios from "axios";
import { api } from "../constants/api";

export async function getlUsersStat() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/users/user-stat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agents");
  }
}

export async function getlJobStat() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/jobs/job-stat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agents");
  }
}
export async function getlJobStatTwo() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${api}/job-applications/application-stat`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agents");
  }
}

export async function getAllOrderStat() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/service-orders/order-stat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agents");
  }
}

export async function getAllNewsStat() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/news/news-stat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agents");
  }
}

export async function getAllEventStat() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/events/event-stat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agents");
  }
}
