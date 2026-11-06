import { Box, Typography } from "@mui/material";
import { NAV_HEIGHT } from "../../config";

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: `calc(90vh - ${NAV_HEIGHT})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <Box>
        <Typography
          variant="h1"
          sx={(theme) => ({
            fontWeight: "bold",
            color: "secondary.main",
            textAlign: "center",
            marginBottom: "1rem",
            [theme.breakpoints.down("md")]: {
              fontSize: "4rem",
            },
          })}
        >
          Authentication System
        </Typography>

        <Typography
          sx={(theme) => ({
            textAlign: "center",
            fontSize: "1.5rem",
            [theme.breakpoints.down("md")]: {
              fontSize: "1.2rem",
            },
          })}
        >
          A complete authentication implementation built with React, Node.js,
          and Express.js, powered by Neon Serverless PostgreSQL. Explore a
          full-stack authentication solution designed with secure user
          authentication, token management, and session handling.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
