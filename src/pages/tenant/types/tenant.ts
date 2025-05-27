import axios from "axios";

const API_BASE_URL = "https://n7gjzkm4-3001.euw.devtunnels.ms/api/bus-tenant";

export const updateTenantStatus = async (id: string, status: string) => {
  const response = await axios.post(`${API_BASE_URL}/update-status/${id}`, {
    status,
  });
  return response.data;
};

export const fetchTenants = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};
