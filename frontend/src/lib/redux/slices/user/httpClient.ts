import axios from "axios";
import { VITE_BACKEND_BASE_URL } from "../../../../config";

const BACKEND_URL = VITE_BACKEND_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});
