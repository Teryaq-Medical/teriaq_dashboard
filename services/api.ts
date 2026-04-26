// services/api.ts

import axios from "axios";

const is_production = false;

const api = axios.create({
  baseURL: is_production
    ? "https://teriaq-medical-be.onrender.com/api"
    : "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ IMPORTANT
});

// ✅ Handle errors safely (NO REDIRECT HERE)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // فقط log
    if (error.response?.status === 401) {
      console.warn("Unauthorized request");
    }

    return Promise.reject(error);
  }
);

export default api;