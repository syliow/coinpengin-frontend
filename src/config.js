import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://crypto-price-tracker-backend.herokuapp.com/",
});
