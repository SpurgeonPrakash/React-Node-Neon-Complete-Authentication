import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Stack, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";

const style = {
  position: "absolute",
  left: "0",
  top: "0",
  //   transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  // p: 4,
  minHeight: "100vh",
};

const closeBtnStyles = {
  position: "absolute",
  right: ".5rem",
  top: ".5rem",
};

const LinkComponent = styled(Link)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: ".5rem 1rem",
  boxShadow: "0 0 2px 0 hsl(204, 5%, 38%)",
  textDecoration: "none",
  color: "inherit",
  // borderRadius: "5px",
  width: "100%",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.background.default,
    // scale: "1.1",
  },
  // textAlign: "center",
}));

const SideBar = ({
  open,
  handleClose,
  isLoggedIn,
}: {
  open: boolean;
  handleClose: () => void;
  isLoggedIn: boolean;
}) => {
  const { pathname } = useLocation();
  const theme = useTheme();

  const activeLinkStyles = {
    backgroundColor: theme.palette.secondary.main,
    // padding: "5px .5rem",
    color: "white",
    // borderRadius: "10px",
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack spacing={0} sx={{ marginTop: "3rem" }}>
          <LinkComponent
            onClick={() => handleClose()}
            style={pathname === "/" ? activeLinkStyles : {}}
            to="/"
          >
            Web Dev Paradise
          </LinkComponent>
          {!isLoggedIn && (
            <LinkComponent
              onClick={() => handleClose()}
              style={pathname === "/signin" ? activeLinkStyles : {}}
              to="/signin"
            >
              Sign In
            </LinkComponent>
          )}
          {!isLoggedIn && (
            <LinkComponent
              onClick={() => handleClose()}
              style={pathname === "/signup" ? activeLinkStyles : {}}
              to="/signup"
            >
              Sign Up
            </LinkComponent>
          )}
        </Stack>
        <Box sx={closeBtnStyles}>
          <CloseIcon onClick={() => handleClose()} />
        </Box>
      </Box>
    </Modal>
  );
};

export default SideBar;
