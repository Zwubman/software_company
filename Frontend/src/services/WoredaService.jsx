import axios from 'axios';
import { api } from '../constants/api';

const API_URL = 'https://teamwork-backend-tlqq.onrender.com/api/v1';
const ZONE_API_URL = 'https://teamwork-backend-tlqq.onrender.com/api/v1/zones/all-zone';
const REGION_API_URL = 'https://teamwork-backend-tlqq.onrender.com/api/v1/regions/all-region';

class WoredaService {
  async createWoreda(woredaData) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${api}/woredas/create-woreda`, {
      name: woredaData.name,
      zoneId: woredaData.zoneId,
    },config);
    return response.data;
  }

  async getAllWoredas(page = 1, searchParams = {}) {
    const { search ,limit,zoneId,regionId} = searchParams;
    const response = await axios.get(`${API_URL}/woredas/all-woreda`, {
      params: {
        page,
        search,
        limit,
        zoneId,
        regionId
      },
    });
    return response.data;
  }


  async getZones() {
    const response = await axios.get(ZONE_API_URL);
    return response.data;
  }

  async getRegions() {
    const response = await axios.get(REGION_API_URL);
    return response.data;
  }

  async getWoredaById(woredaId) {
    const response = await axios.get(`${API_URL}/${woredaId}`);
    return response.data;
  }

  async updateWoreda(woredaId, woredaData) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/woredas/update/${woredaId}`, {
      name: woredaData.name,
      zoneId: woredaData.zoneId,
    }, config);
    return response.data;
  }

  async deleteWoreda(woredaId) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${API_URL}/woredas/delete/${woredaId}`,config);
  }
}

export default new WoredaService();