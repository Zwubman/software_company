import axios from 'axios';
import {api} from '../constants/api'

class RegionService {
  async createRegion(regionData) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(`${api}/regions/create-region`, { name: regionData.name },config);
    return response.data;
  }

  async getAllRegions(page = 1, searchParams = {}) {
    const { search ,limit} = searchParams;
    const response = await axios.get(`${api}/regions/all-region`, {
      params: {
        page,
        search,
        limit
      },
    });
    return response.data; 
  }

  async getRegionById(regionId) {
    const response = await axios.get(`${api}/regions/region/${regionId}`);
    return response.data;
  }

  async updateRegion(regionId, regionData) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const response = await axios.put(
        `${api}/regions/update/${regionId}`,
        regionData, // Send the entire regionData object
        config // Include the config for headers
      );
      return response.data;
    } catch (error) {
      console.error("Error updating region:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  }
  async deleteRegion(regionId) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    await axios.delete(`${api}/regions/delete/${regionId}`,config);
  }
}

export default new RegionService();