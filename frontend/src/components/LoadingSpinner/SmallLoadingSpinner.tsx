import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const SmallLoadingSpinner = () => {
  return (
    <Box
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <CircularProgress />
    </Box>
  );
};

export default SmallLoadingSpinner;
