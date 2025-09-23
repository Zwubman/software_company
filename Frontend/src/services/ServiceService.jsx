import axios from "axios";
import { api } from "../constants/api";
import MyToast from "../components/Notification/MyToast";

// Create a new service (only by admin)
export async function createService(serviceData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${api}/services/create-service`,
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    MyToast(response?.data?.message || "service created", "success");
    return response.data;
  } catch (error) {
    MyToast(
      error?.response?.data?.error || "Failed to create service",
      "error"
    );
    throw new Error(error || "Failed to create service");
  }
}

// Update an existing service (only by admin)
export async function updateService(serviceId, serviceData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${api}/services/update/${serviceId}`,
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    MyToast(response?.data?.message || "service updated", "success");
    return response.data;
  } catch (error) {
    MyToast(
      error?.response?.data?.error || "Failed to create service",
      "error"
    );
    throw new Error(error.response?.data?.error || "Failed to update service");
  }
}

// Delete a service (only by admin)
export async function deleteService(serviceId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${api}/services/delete/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    MyToast(response?.data?.message || "deleted", "success");
    return response.data;
  } catch (error) {
    MyToast(
      error?.response?.data?.message || "Failed to create service",
      "error"
    );
    throw new Error(error.response?.data?.error || "Failed to delete service");
  }
}

export async function cancelService(serviceId) {
  const token = localStorage.getItem("token");

  // Check if the token exists
  if (!token) {
    MyToast("Authorization token is missing", "error");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.put(
      `${api}/service-orders/cancel-order/${serviceId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    MyToast(
      response?.data?.message || "Order cancelled successfully",
      "success"
    );
    return response.data;
  } catch (error) {
    MyToast(
      error?.response?.data?.message || "Failed to cancel service",
      "error"
    );
    throw new Error(error.response?.data?.error || "Failed to cancel service");
  }
}

export async function cancelPartnership(id) {
  const token = localStorage.getItem("token");

  // Check if the token exists
  if (!token) {
    MyToast("Authorization token is missing", "error");
    throw new Error("Authorization token is missing");
  }

  try {
    const response = await axios.put(`${api}/partnerships/cancel/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    MyToast("partnership request cancelled successfully", "success");
    return response.data;
  } catch (error) {
    MyToast(
      error?.response?.data?.message || "Failed to cancel service",
      "error"
    );
    throw new Error(error.response?.data?.error || "Failed to cancel service");
  }
}

// Get all services with pagination and filtration (without login)
export async function getAllServices(page = 1, limit = 10, filters = {}) {
  try {
    const response = await axios.get(`${api}/services/all-services`, {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch services");
  }
}

// Get service by ID (without login)
export async function getServiceById(serviceId) {
  try {
    const response = await axios.get(`${api}/services/service/${serviceId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch service");
  }
}

export async function getMyRequest(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${api}/service-orders/my-orders`, {
      params: { page, limit, ...filters },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching my requests:", error); // Log the error for debugging
    throw error; // Optionally re-throw the error for further handling
  }
}


