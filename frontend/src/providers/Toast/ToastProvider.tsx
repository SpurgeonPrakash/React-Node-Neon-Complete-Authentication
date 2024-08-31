import React from "react";

import ToastContext, { statusTypes } from "./ToastContext";

interface Props {
  children: React.ReactNode;
}

const ToastProvider = ({ children }: Props) => {
  const [open, setOpenValue] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<statusTypes>("info");

  const info = (message: string = "Welcome to NeonDB") => {
    setMessage(message);
    setStatus("info");
    setOpenValue(true);
  };

  const success = (message: string = "Success!!") => {
    //    console.log("Got Here");

    setMessage(message);
    setStatus("success");
    setOpenValue(true);
  };

  const warning = (message: string = "Warning!!") => {
    setMessage(message);
    setStatus("warning");
    setOpenValue(true);
  };

  const error = (message: string = "Error!!") => {
    setOpenValue(true);
    setMessage(message);
    setStatus("error");
  };

  const setOpen = (isOpen: boolean = false) => {
    setOpenValue(isOpen);
  };

  const toastContextValue = {
    open,
    setOpen,
    message,
    status,
    toast: {
      info,
      success,
      warning,
      error,
    },
  };
  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
