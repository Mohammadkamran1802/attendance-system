import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://attendance-system-8x89.onrender.com/api",
  withCredentials: true
});

// attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
