import axios from "axios";
import { api } from "../constants/api";

export async function createAdmin(adminData) {
  // console.log(adminData);
  const { fullName, email, password, regionId, role, zoneId, woredaId ,phoneNumber} =
    adminData;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${api}/users/create-admin`,
      {
        name: fullName,
        email,
        password,
        regionId,
        zoneId,
        woredaId,
        roleId: role,
        phoneNumber
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create admin");
  }
}

export async function getAllUsers(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/users/all-users`, {
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

export async function getUserById(userId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${api}/users/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch agent");
  }
}

export async function blockUser(agentId, status) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${api}/users/update-status/${agentId}`,
      status,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to Block User");
  }
}

export async function deleteUser(userId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${api}/users/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete ");
  }
}

export async function updateUserRole(id, { userRole }) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${api}/user/update-role/${id}`,
      { userRole },
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

export async function changePassword(
  currentPassword,
  newPassword,
  confirmNewPassword
) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${api}/users/change-password`,
      { currentPassword, newPassword, confirmNewPassword },
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error(
      error.response?.data?.message || "Failed to change password"
    );
  }
}

export async function updateProfile(userData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await axios.put(
      `${api}/users/update-profile`,
      userData,
      config
    );

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
}

export async function resetPassword(email) {
  try {
    const response = await axios.post(`${api}/users/forgot-password`, {
      email,
    });

    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error(
      error.response?.data?.message || "Failed to change password"
    );
  }
}

export async function verifyPasswordOtp(email,otp) {
  try {
    const response = await axios.post(`${api}/users/verify-reset-otp`, {email, otp });

    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error(
      error.response?.data?.message || "Failed to change passwordh"
    );
  }
}
export async function chagneVerifiedPassword(
   email,
    newPassword,
    confirmNewPassword 
) {
  console.log(email,confirmNewPassword,newPassword)
  try {
    const response = await axios.post(`${api}/users/reset-password`, {
      email,
      newPassword,
      confirmNewPassword,
    });

    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw new Error(
      error.response?.data?.message || "Failed to change password"
    );
  }
}
