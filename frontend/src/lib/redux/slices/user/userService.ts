import { axiosInstance } from "./httpClient";

export const API_URL = `/auth`;

// Get Login Status
const getUser = async (headers = {}) => {
  const response = await axiosInstance.get(API_URL + "/me", {
    headers: headers,
  });
  return response.data;
};

const logout = async () => {
  //    console.log(API_URL);

  const response = await axiosInstance.post(API_URL + "/logout");
  //    console.log(response);

  return response.data;
};

const userService = {
  getUser,
  logout,
};

export default userService;
