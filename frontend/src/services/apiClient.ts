import axios from "axios";
import { VITE_BACKEND_BASE_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: VITE_BACKEND_BASE_URL,
  withCredentials: true,
});

class APIClient<T> {
  endpoint: string;
  headers = {};
  constructor(endpoint: string, headers = {}) {
    this.endpoint = endpoint;
    this.headers = headers;
  }

  get = () => {
    return axiosInstance
      .get<T>(this.endpoint, {
        headers: {
          ...this.headers,
        },
      })
      .then((res) => res.data);
  };

  getAll = () => {
    // debugger;
    return axiosInstance
      .get<T[]>(this.endpoint, {
        headers: {
          ...this.headers,
        },
      })
      .then((res) => res.data);
  };

  post = <D>(data: D) => {
    return axiosInstance
      .post<T>(this.endpoint, data, {
        headers: {
          ...this.headers,
        },
      })
      .then((res) => res.data);
  };

  put = <D>(data: D) => {
    return axiosInstance
      .put<T>(this.endpoint, data, {
        headers: {
          ...this.headers,
        },
      })
      .then((res) => res.data);
  };

  patch = <D>(data: D) => {
    return axiosInstance
      .patch<T>(this.endpoint, data, {
        headers: {
          ...this.headers,
        },
      })
      .then((res) => res.data);
  };

  delete = () => {
    return axiosInstance
      .delete<T>(this.endpoint, {
        headers: {
          ...this.headers,
        },
      })
      .then((res) => res.data);
  };
}

export default APIClient;
