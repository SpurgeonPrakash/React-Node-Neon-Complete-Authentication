import { useContext } from "react";
import ToastContext from "./ToastContext";

export const useToastContext = () => {
  const { open, setOpen, message, status, toast } = useContext(ToastContext);

  return { open, setOpen, message, status, toast };
};
