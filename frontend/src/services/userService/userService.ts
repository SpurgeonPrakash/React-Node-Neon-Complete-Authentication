import { User } from "../../types/shared.types";
import APIClient from "../apiClient";

const userService = (url: string, headers = {}) => {
  return new APIClient<User>(url, headers);
};

export default userService;
