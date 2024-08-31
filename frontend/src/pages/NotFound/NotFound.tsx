import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: `60vh`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography
          variant="h1"
          sx={{ fontWeight: "bold", color: "secondary.main" }}
        >
          Not Found
        </Typography>
        <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
          Oops..!! Page Not Found!
        </Typography>
      </Box>
    </Box>
  );
};

export default NotFound;
