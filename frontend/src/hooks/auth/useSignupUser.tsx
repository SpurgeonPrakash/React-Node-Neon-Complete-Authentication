import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  CommonResult,
  signUpService,
} from "../../services/authService/authService";

interface SignUpData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface ErrorResponseData {
  message: string; // Adjust this based on your API's error response structure
}

const useSignupUser = (
  onSuccess: (message: string) => void,
  onError: (error: string) => void
) => {
  return useMutation<CommonResult, AxiosError<ErrorResponseData>, SignUpData>({
    mutationFn: (data: SignUpData) => signUpService("/auth/signup").post(data),
    onSuccess: (result) => {
      onSuccess(result.message);
    },
    onError: (error) => {
      onError(error.response?.data?.message || "Something Went Wrong");
    },
  });
};

export default useSignupUser;
