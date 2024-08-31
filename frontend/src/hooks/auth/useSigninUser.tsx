import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  SignInResponseType,
  signInService,
} from "../../services/authService/authService";

interface SignInData {
  email: string;
  password: string;
}

interface ErrorResponseData {
  message: string; // Adjust this based on your API's error response structure
}

const useSigninUser = (
  onSuccess: (data: SignInResponseType) => void,
  onError: (error: string) => void
) => {
  return useMutation<
    SignInResponseType,
    AxiosError<ErrorResponseData>,
    SignInData
  >({
    mutationFn: (data: SignInData) => signInService("/auth/signin").post(data),
    onSuccess: (result) => {
      onSuccess(result);
    },
    onError: (error) => {
      onError(error.response?.data?.message || "Something Went Wrong");
    },
  });
};

export default useSigninUser;
