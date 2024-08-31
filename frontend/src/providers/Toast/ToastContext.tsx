import { createContext } from "react";

export type statusTypes = "info" | "success" | "warning" | "error";

export interface ToastProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  status: statusTypes;
  message: string;
  toast: {
    info: (message?: string) => void;
    success: (message?: string) => void;
    warning: (message?: string) => void;
    error: (message?: string) => void;
  };
}

export const ToastContext = createContext<ToastProps>({} as ToastProps);

export default ToastContext;
