import axios from 'axios';
import { api } from "../constants/api";



// Get all about entries (admin only) with filtration
export async function getTestimonies() {

  try {
    const response = await axios.get(`${api}/user-feedbacks/testimony`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch about entries');
  }
}


// Get all about entries (admin only) with filtration
export async function getPartnershipStory() {

    try {
      const response = await axios.get(`${api}/partnerships/all-partner`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch about entries');
    }
  }
  