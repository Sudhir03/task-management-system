// ─────────────────────────────────────────────
//  src/api.js — Axios Instance & API Helpers
// ─────────────────────────────────────────────
import axios from "axios";

// Base URL from environment variable (set in .env)
// Falls back to localhost:5000 for development
// Falls back to localhost:5000/api for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create an axios instance with pre-configured base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Request interceptor — automatically attach the JWT token
 * from localStorage to every outgoing request header.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor — if the server returns 401 (Unauthorized),
 * clear local auth data and redirect to login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
