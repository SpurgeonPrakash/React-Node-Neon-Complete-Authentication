import { useState } from "react";
// import Link from "next/link";

import { Box, styled, Stack, Typography, Button } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import CloseIcon from "@mui/icons-material/Close";
import SideBar from "../SideBar/SideBar";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggleButton from "../DarkModeToggleButton/DarkModeToggleButton";
import { NAV_HEIGHT } from "../../../config";
import { useToastContext } from "../../../providers/Toast/useToastContext";
import { useAppDispatch, useAppSelector } from "../../../lib/redux/hooks";
import { logout } from "../../../lib/redux/slices/user/userThunks";
// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
// import { logout } from "@/lib/redux/slices/user/userThunks";

const MobileNavigationContainer = styled(Box)(({ theme }) => ({
  padding: ".5rem 1.5rem",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 0 2px 0 hsl(204, 5%, 38%)",
  minHeight: NAV_HEIGHT,
}));

const MobileNavigationContent = styled(Box)(() => ({
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

const MobileNavigation = () => {
  // const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const { toast } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAppSelector((state) => state.userData);
  // const router = useRouter();

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

  return (
    <MobileNavigationContainer>
      <MobileNavigationContent>
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
          {isLoggedIn && (
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
          {open ? (
            <CloseIcon onClick={() => handleClose()} />
          ) : (
            <MenuIcon onClick={() => handleOpen()} />
          )}
        </Stack>
      </MobileNavigationContent>
      <SideBar open={open} handleClose={handleClose} isLoggedIn={isLoggedIn} />
    </MobileNavigationContainer>
  );
};

export default MobileNavigation;
