import axios from "axios";
import { store } from "../Reduxstore/Reduxstore";

const axiosInstance = axios.create({
  baseURL:"http://localhost:3000",
  headers: { 
    "Content-Type": "application/json",
  },
}); 

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
const accessToken = state.accessStore.userTocken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
