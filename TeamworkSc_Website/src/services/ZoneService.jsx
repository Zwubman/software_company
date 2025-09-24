import axios from "axios";
import { api } from "../constants/api";
const API_URL = "https://api.teamworksc.com/api/v1";
const REGION_API_URL = "https://api.teamworksc.com/api/v1/regions/all-region";
const WOREDA_API_URL = "https://api.teamworksc.com/api/v1";

class ZoneService {
  async createZone(zoneData) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(
      `${API_URL}/zones/create-zone`,
      {
        name: zoneData.name,
        regionId: zoneData.regionId,
      },
      config
    );
    return response.data;
  }

  async getAllZones(page = 1, searchParams = {}) {
    const { search, regionId, limit } = searchParams;
    const response = await axios.get(`${API_URL}/zones/all-zone`, {
      params: {
        page,
        search,
        regionId,
        limit, // Add regionId to the request parameters
      },
    });
    return response.data;
  }

  async getRegions() {
    const response = await axios.get(REGION_API_URL);
    return response.data;
  }

  async createWoreda(woredaData, zoneId) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${WOREDA_API_URL}/woredas/create-woreda`,
      {
        name: woredaData.name,
        zoneId: zoneId,
      },
      config
    );
    return response.data;
  }

  async getZoneById(zoneId) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.get(`${api}/woredas/zone-woreda/${zoneId}`, {
        config,
      });
      return response.data;
    } catch (error) {
      return error.response.data || "try again later";
    }
  }

  async updateZone(zoneId, zoneData) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(
      `${api}/zones/update/${zoneId}`,
      {
        name: zoneData.name,
        regionId: zoneData.regionId,
      },
      config
    );
    return response.data;
  }

  async deleteZone(zoneId) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${api}/zones/delete/${zoneId}`, config);
  }
}

export default new ZoneService();
