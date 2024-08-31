import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate, useParams } from "react-router-dom";
import useAccountActivation from "../../hooks/auth/useAccountActivation";
import { useState } from "react";
import { useToastContext } from "../../providers/Toast/useToastContext";

const AccountActivation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { toast } = useToastContext();

  const onSuccess = (message: string) => {
    toast.success(message);
    setSuccessMsg(message);
    navigate("/signin");
  };

  const onError = (error: string) => {
    toast.error(error);
    setErr(error);
  };

  const { mutate, isPending, error } = useAccountActivation(onSuccess, onError);

  const handleClick = () => {
    setErr("");
    if (!token) {
      toast.error("Something Fishy!");
      setErr("Something Fishy");
      return;
    }
    mutate({ token });
  };

  return (
    <Box sx={{ padding: "1rem" }}>
      <Card
        sx={{
          minWidth: 300,
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <AdminPanelSettingsIcon
              sx={{ fontSize: "2.5rem", marginRight: ".5rem" }}
            />
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Account Activation
            </Typography>
          </Box>
          {err && <Alert severity="error">{err}</Alert>}
          {error && <Alert severity="error">{error.message}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <Button
              variant="contained"
              disabled={isPending}
              onClick={handleClick}
            >
              Activate Account
            </Button>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "right" }}></CardActions>
      </Card>
    </Box>
  );
};

export default AccountActivation;
