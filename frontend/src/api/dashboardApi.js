import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// This function fetches dashboard statistics
export const getDashboardStats = async (token) => {
  return axios.get(`${BASE_URL}/dashboard/get-dashboard-stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
