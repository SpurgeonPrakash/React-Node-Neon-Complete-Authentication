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
  styled,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useToastContext } from "../../../../providers/Toast/useToastContext";
import { signinSchema } from "../../../../schemas";
import SignInSkeleton from "../SignInSkeleton/SignInSkeleton";
import { SignInResponseType } from "../../../../services/authService/authService";
import useSigninUser from "../../../../hooks/auth/useSigninUser";
import { userActions } from "../../../../lib/redux/slices/user/userSlice";
import { useAppDispatch } from "../../../../lib/redux/hooks";
import SocialLogin from "../../../SignUp/components/SocialLogin/SocialLogin";

const LinkComponent = styled(Link)(() => ({
  textDecoration: "none",
  // minWidth: "100px",
  color: "inherit",
  transition: "all 0.2s",
  "&:hover": {
    scale: "1.1",
  },
}));

const SignInForm = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const [successMsg, setSuccessMsg] = useState("");
  const { toast } = useToastContext();

  const onSuccess = async (data: SignInResponseType) => {
    //    console.log(data);

    await dispatch(userActions.setUser(data.user));
    toast.success(data.message);
    setSuccessMsg(data.message);
    navigate("/");
  };

  const onError = (error: string) => {
    //    console.log(error);
    toast.error(error);
  };

  const { mutate, isPending, error } = useSigninUser(onSuccess, onError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    mutate(values);
  }

  if (isPending) {
    return <SignInSkeleton />;
  }

  // const postMatch = useMatch("/post/:postId");
  // const categoryMatch = useMatch("/post/category/:categoryId");

  // let matchedRoute;

  // if (postMatch) {
  //   matchedRoute = "/post/:postId";
  // } else if (categoryMatch) {
  //   matchedRoute = "/post/category/:categoryId";
  // } else {
  //   matchedRoute = "No match found";
  // }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl sx={{ width: "100%" }}>
        {error && (
          <Alert severity="error">{error.response?.data?.message}</Alert>
        )}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        <Stack spacing={2}>
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: "100%" }}
            disabled={isPending}
          >
            Sign In
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <LinkComponent to="/signup">New User?</LinkComponent>
            <LinkComponent to="/forget-password">Forget Password</LinkComponent>
          </Box>
          <SocialLogin />
        </Stack>
      </FormControl>
    </form>
  );
};

export default SignInForm;
