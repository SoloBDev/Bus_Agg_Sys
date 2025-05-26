import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api/bus-tenant";

export const updateTenantStatus = async (id: string, status: string) => {
  const response = await axios.patch(`${API_BASE_URL}/update-status/${id}`, {
    status,
  });
  return response.data;
};

export const fetchTenants = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};
