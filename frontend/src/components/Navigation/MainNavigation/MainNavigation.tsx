import { useState } from "react";

import { Box, styled, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DarkModeToggleButton from "../DarkModeToggleButton/DarkModeToggleButton";
import { NAV_HEIGHT } from "../../../config";
import { useToastContext } from "../../../providers/Toast/useToastContext";
import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import { logout } from "../../../lib/redux/slices/user/userThunks";
// import DarkModeToggleButton from "@/components/DarkModeToggleButton/DarkModeToggleButton";
// import { ErrorFromAction } from "@/types/shared.types";
// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
// import { logout } from "@/lib/redux/slices/user/userThunks";

const MainNavigationContainer = styled("div")(({ theme }) => ({
  padding: ".5rem 1.5rem",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 0 2px 0 hsl(204, 5%, 38%)",
  minHeight: NAV_HEIGHT,
}));

const MainNavigationContent = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const LinkComponent = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  // minWidth: "100px",
  color: "inherit",
  transition: "all 0.2s",
  "&:hover": {
    scale: "1.1",
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
}));

const MainNavigation = () => {
  const { pathname } = useLocation();
  // const pathname = usePathname();
  const theme = useTheme();
  const { toast } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      // await logout();
      await dispatch(logout());
      toast.success("Logged Out Successfully");
      navigate("/");
      // window.location.to = "/";
      setIsLoading(false);
    } catch (error) {
      // toast.error((error as ErrorFromAction).message);
      //    console.log(error);

      setIsLoading(false);
    }
  };

  const activeLinkStyles = {
    backgroundColor: theme.palette.secondary.main,
    padding: "5px .5rem",
    color: "white",
    borderRadius: "10px",
  };

  return (
    <MainNavigationContainer>
      <MainNavigationContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LinkComponent
            style={{
              flexGrow: 1,
              marginRight: ".5rem",

              display: "inline-block",
              // marginBottom: "-7px",
            }}
            to="/"
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "secondary.main",
              }}
            >
              Logo
            </Typography>
          </LinkComponent>
        </Box>
        <Stack direction="row" spacing={2} alignItems={"center"}>
          {/* {(user?.role === "admin" || user?.role === "creator") && (
            <LinkComponent
              style={pathname === "/add-post" ? activeLinkStyles : {}}
              to="/add-post"
            >
              Add Post
            </LinkComponent>
          )} */}
          {/* {(user?.role === "admin" || user?.role === "creator") && (
            <LinkComponent
              to="/dashboard"
              style={pathname === "/dashboard" ? activeLinkStyles : {}}
            >
              Dashboard
            </LinkComponent>
          )} */}

          {/* {user?.role === "admin" && (
            <LinkComponent
              to="/admin-panel/analytics"
              style={
                pathname === "/admin-panel/analytics" ? activeLinkStyles : {}
              }
            >
              Admin Panel
            </LinkComponent>
          )} */}

          {!user && (
            <LinkComponent
              to="/signup"
              style={pathname === "/signup" ? activeLinkStyles : {}}
            >
              Sign up
            </LinkComponent>
          )}
          {!user && (
            <LinkComponent
              to="/signin"
              style={pathname === "/signin" ? activeLinkStyles : {}}
            >
              Sign In
            </LinkComponent>
          )}
          {user && (
            <Button
              disabled={isLoading}
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          )}
          <DarkModeToggleButton />
        </Stack>
      </MainNavigationContent>
    </MainNavigationContainer>
  );
};

export default MainNavigation;
