import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CommonResult,
  resetPasswordService,
} from "../../services/authService/authService";

interface PasswordData {
  password: string;
  token: string;
}

interface ErrorResponseData {
  message: string; // Adjust this based on your API's error response structure
}

const useResetPassword = (
  onSuccess: (message: string) => void,
  onError: (error: string) => void
) => {
  return useMutation<CommonResult, AxiosError<ErrorResponseData>, PasswordData>(
    {
      mutationFn: (data: PasswordData) =>
        resetPasswordService("/auth/reset-password").post(data),
      onSuccess: (result) => {
        onSuccess(result.message);
      },
      onError: (error) => {
        onError(error.response?.data?.message || "Something Went Wrong");
      },
    }
  );
};

export default useResetPassword;
