import axios from "axios";
import { api } from "../constants/api";
import MyToast from "../components/Notification/MyToast";

export async function createAgent(agentData) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${api}/agents/apply-agent`, agentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create agent");
  }
}

export async function getAllApprovedAgents(page = 1, limit = 10, filters = {}) {
  try {
    const response = await axios.get(`${api}/agents/approved-agents`, {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agents");
  }
}

export async function getAllAgents(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/agents/all-agents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agents");
  }
}

export async function getAgentById(agentId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/agents/agent/${agentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agent");
  }
}
export async function getMyRequest() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/agents/my-request`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agent");
  }
}

export async function updateAgent(agentId, formDataToSend) {
  formDataToSend.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${api}/agents/update/${agentId}`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update agent");
  }
}

export async function deleteAgent(agentId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${api}/agents/delete/${agentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete agent");
  }
}

export async function updateAgentStatus(id, { agentStatus }) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${api}/agents/update-status/${id}`,
      { agentStatus },
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error updating agent status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update agent status"
    );
  }
}
