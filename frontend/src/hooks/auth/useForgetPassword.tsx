import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CommonResult,
  forgetPasswordService,
} from "../../services/authService/authService";

interface EmailData {
  email: string;
}

interface ErrorResponseData {
  message: string; // Adjust this based on your API's error response structure
}

const useForgetPassword = (
  onSuccess: (message: string) => void,
  onError: (error: string) => void
) => {
  return useMutation<CommonResult, AxiosError<ErrorResponseData>, EmailData>({
    mutationFn: (data: EmailData) =>
      forgetPasswordService("/auth/forget-password").post(data),
    onSuccess: (result) => {
      onSuccess(result.message);
    },
    onError: (error) => {
      onError(error.response?.data?.message || "Something Went Wrong");
    },
  });
};

export default useForgetPassword;
