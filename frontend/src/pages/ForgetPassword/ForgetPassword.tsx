import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToastContext } from "../../providers/Toast/useToastContext";
import { forgetPasswordSchema } from "../../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmailIcon from "@mui/icons-material/Email";
import { z } from "zod";
import useForgetPassword from "../../hooks/auth/useForgetPassword";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { toast } = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSuccess = (message: string) => {
    toast.success(message);
    setSuccessMsg(message);
    navigate("/signin");
  };

  const onError = (error: string) => {
    toast.error(error);
    setErr(error);
  };

  const { mutate, isPending, error } = useForgetPassword(onSuccess, onError);

  const onSubmit = (values: z.infer<typeof forgetPasswordSchema>) => {
    setErr("");
    //    console.log(values);
    mutate({ email: values.email });
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
              Forget Password
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ width: "100%" }}>
              {err && <Alert severity="error">{err}</Alert>}
              {error && <Alert severity="error">{error.message}</Alert>}
              {successMsg && <Alert severity="success">{successMsg}</Alert>}
              <Box>
                <TextField
                  sx={{ width: "100%", marginBottom: "1rem" }}
                  type="email"
                  // name="email"
                  placeholder="Email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  {...register("email")}
                />
                {errors.email && (
                  <Alert severity="error">{errors.email!.message}</Alert>
                )}
              </Box>
              <Button variant="contained" disabled={isPending} type="submit">
                Forget Password
              </Button>
            </FormControl>
          </form>
        </CardContent>
        <CardActions sx={{ justifyContent: "right" }}></CardActions>
      </Card>
    </Box>
  );
};

export default ForgetPassword;
