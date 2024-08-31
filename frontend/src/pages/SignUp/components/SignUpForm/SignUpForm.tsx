import { useState } from "react";

import * as z from "zod";

import {
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import BadgeIcon from "@mui/icons-material/Badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastContext } from "../../../../providers/Toast/useToastContext";
import { signupSchema } from "../../../../schemas";
import useSignupUser from "../../../../hooks/auth/useSignupUser";
import SignUpSkeleton from "../SignUpSkeleton/SignUpSkeleton";
import SocialLogin from "../SocialLogin/SocialLogin";

const SignUpForm = () => {
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { toast } = useToastContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const onSuccess = (message: string) => {
    toast.success(message);
    setSuccessMsg(message);
    reset();
  };

  const onError = (error: string) => {
    toast.error(error);
    setErr(error);
  };

  const { mutate, isPending, error } = useSignupUser(onSuccess, onError);

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setErr("");
    //    console.log(values);
    const { firstname, lastname, email, password } = values;
    mutate({ firstname, lastname, email, password });
  }

  if (isPending) {
    return <SignUpSkeleton />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl sx={{ width: "100%" }}>
        {err && <Alert severity="error">{err}</Alert>}
        {error && <Alert severity="error">{error.message}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        <Stack spacing={2}>
          <Box>
            <TextField
              sx={{ width: "100%" }}
              type="text"
              // name="email"
              placeholder="First Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
              {...register("firstname")}
            />
            {errors.firstname && (
              <Alert severity="error">{errors.firstname!.message}</Alert>
            )}
          </Box>
          <Box>
            <TextField
              sx={{ width: "100%" }}
              type="text"
              // name="email"
              placeholder="Last Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon />
                  </InputAdornment>
                ),
              }}
              {...register("lastname")}
            />
            {errors.lastname && (
              <Alert severity="error">{errors.lastname!.message}</Alert>
            )}
          </Box>
          <Box>
            <TextField
              sx={{ width: "100%" }}
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
              <Alert severity="error">{errors.confirmPassword!.message}</Alert>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: "100%" }}
            disabled={isPending}
          >
            Sign Up
          </Button>
          {/* <Button size="small">Forget Password</Button> */}
          <SocialLogin />
        </Stack>
      </FormControl>
    </form>
  );
};

export default SignUpForm;
