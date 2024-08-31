import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SignInForm from "./components/SignInForm/SignInForm";

const Signin = () => {
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
            <LockOpenIcon sx={{ fontSize: "2.5rem", marginRight: ".5rem" }} />
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Sign in
            </Typography>
          </Box>

          <SignInForm />
        </CardContent>
        <CardActions sx={{ justifyContent: "right" }}></CardActions>
      </Card>
    </Box>
  );
};

export default Signin;
