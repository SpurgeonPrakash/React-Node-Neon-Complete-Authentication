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
          Neon DB
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
          This app is made for Neon DB Challenge Which is an awesome Serverless
          DB for postgresql database.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
