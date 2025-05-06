import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://coinpengin-backend.onrender.com",
});
