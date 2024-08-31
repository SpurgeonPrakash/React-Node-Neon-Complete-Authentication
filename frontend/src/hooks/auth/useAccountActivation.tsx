import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  accountActivationService,
  CommonResult,
} from "../../services/authService/authService";

interface AccountActivation {
  token: string;
}

interface ErrorResponseData {
  message: string; // Adjust this based on your API's error response structure
}

const useAccountActivation = (
  onSuccess: (message: string) => void,
  onError: (error: string) => void
) => {
  return useMutation<
    CommonResult,
    AxiosError<ErrorResponseData>,
    AccountActivation
  >({
    mutationFn: (data: AccountActivation) =>
      accountActivationService("/auth/verify-account").post(data),
    onSuccess: (result) => {
      onSuccess(result.message);
    },
    onError: (error) => {
      onError(error.response?.data?.message || "Something Went Wrong");
    },
  });
};

export default useAccountActivation;
