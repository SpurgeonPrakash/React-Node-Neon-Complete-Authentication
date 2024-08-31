import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const Signup = () => {
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
            <HowToRegIcon sx={{ fontSize: "2.5rem", marginRight: ".5rem" }} />
            <Typography
              gutterBottom
              variant="h4"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Sign up
            </Typography>
          </Box>

          <SignUpForm />
        </CardContent>
        <CardActions sx={{ justifyContent: "right" }}></CardActions>
      </Card>
    </Box>
  );
};

export default Signup;
