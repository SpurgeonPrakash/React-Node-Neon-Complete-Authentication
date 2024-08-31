import { User } from "../../types/shared.types";
import APIClient from "../apiClient";

export interface CommonResult {
  message: string;
}

export const signUpService = (url: string, headers = {}) => {
  return new APIClient<CommonResult>(url, headers);
};

export const accountActivationService = (url: string, headers = {}) => {
  return new APIClient<CommonResult>(url, headers);
};
export const forgetPasswordService = (url: string, headers = {}) => {
  return new APIClient<CommonResult>(url, headers);
};
export const resetPasswordService = (url: string, headers = {}) => {
  return new APIClient<CommonResult>(url, headers);
};

export interface SignInResponseType {
  user: User;
  message: string;
}

export const signInService = (url: string, headers = {}) => {
  return new APIClient<SignInResponseType>(url, headers);
};
