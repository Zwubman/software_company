import axios from 'axios';
import { api } from "../constants/api";

// Get all orders (admin only) with filtration
export async function getAllOrders(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit, ...filters },
  };

  try {
    const response = await axios.get(`${api}/service-orders/all-orders`, config);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch orders');
  }
}

// Get order by ID (admin only)
export async function getOrderById(orderId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${api}/service-orders/order/${orderId}`, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch order');
  }
}

// Create a new order (user)
export async function createOrder(orderData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(`${api}/service-orders/create-order`, orderData, config);

    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create order');
  }
}

// Update order by ID (user can only update own orders with pending/reviewed status)
export async function updateOrder(orderId, orderData) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${api}/service-orders/update/${orderId}`, orderData, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response.data?.message || 'Failed to update orders');
  }
}

// Delete order (admin only)
export async function deleteOrder(orderId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(`${api}/service-orders/delete/${orderId}`, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete order');
  }
}

// Delete order (admin only)
export async function deleteMyOrder(orderId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(`${api}/service-orders/delete-order/${orderId}`, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete order');
  }
}

// Update order status (admin only)
export async function updateOrderStatus(orderId, status) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(`${api}/service-orders/update-status/${orderId}`, { status }, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update order status');
  }
}

// Cancel order (user can cancel own reviewed/pending orders)
export async function cancelOrder(orderId) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.patch(`${api}/service-orders/cancel-order/${orderId}`, {}, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to cancel order');
  }
}

// Get user's own orders with filtration
export async function getMyOrders(page = 1, limit = 10, filters = {}) {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, limit, ...filters },
  };

  try {
    const response = await axios.get(`${api}/service-orders/my-orders`, config);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch your orders');
  }
}