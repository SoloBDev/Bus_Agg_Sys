/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE_URL = "https://n7gjzkm4-3002.euw.devtunnels.ms/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const busAPI = {
  // Fetch all buses
  getBuses: async () => {
    const response = await api.get("/buses");
    return response.data;
  },

  // Create new route
  createRoute: async (routeData: any) => {
    const response = await api.post("/routes", routeData);
    return response.data;
  },

  // Get all routes for specific operator
  getRoutes: async () => {
    const response = await api.get("/routes");
    return response.data;
  },

  //api/routes/route-info/aggregate
  // Get bookings for a specific route
  getAggregatedRoute: async (routeId: string) => {
    const response = await api.get(`/routes/route-info/aggregate/${routeId}`);
    return response.data;
  },

  // Update route status
  updateRouteStatus: async (routeId: string, status: string) => {
    const response = await api.patch(`/routes/${routeId}/status`, { status });
    return response.data;
  },
};

export default api;
