import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PasswordIcon from "@mui/icons-material/Password";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useToastContext } from "../../providers/Toast/useToastContext";
import { resetPasswordSchema } from "../../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useResetPassword from "../../hooks/auth/useResetPassword";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { toast } = useToastContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
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

  const { mutate, isPending, error } = useResetPassword(onSuccess, onError);

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    setErr("");
    //    console.log(values);
    //    console.log(token);
    if (!token) {
      setErr("Something Fishy!!");
    }
    mutate({ password: values.password, token: token! });
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
              Reset Password
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ width: "100%" }}>
              {err && <Alert severity="error">{err}</Alert>}
              {error && <Alert severity="error">{error.message}</Alert>}
              {successMsg && <Alert severity="success">{successMsg}</Alert>}
              <Stack spacing={2}>
                <Box>
                  <TextField
                    sx={{ width: "100%" }}
                    type="password"
                    // name="password"
                    placeholder="Password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PasswordIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...register("password")}
                  />
                  {errors.password && (
                    <Alert severity="error">{errors.password!.message}</Alert>
                  )}
                </Box>
                <Box>
                  <TextField
                    sx={{ width: "100%" }}
                    type="password"
                    // name="password"
                    placeholder="Confirm Password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PasswordIcon />
                        </InputAdornment>
                      ),
                    }}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <Alert severity="error">
                      {errors.confirmPassword!.message}
                    </Alert>
                  )}
                </Box>
                <Button variant="contained" disabled={isPending} type="submit">
                  Reset Password
                </Button>
              </Stack>
            </FormControl>
          </form>
        </CardContent>
        <CardActions sx={{ justifyContent: "right" }}></CardActions>
      </Card>
    </Box>
  );
};

export default ResetPassword;
