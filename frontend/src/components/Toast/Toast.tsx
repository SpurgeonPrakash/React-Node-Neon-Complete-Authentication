import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useToastContext } from "../../providers/Toast/useToastContext";

export default function Toast() {
  const { open, setOpen, status, message } = useToastContext();

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={status}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
