import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";

const MobileNAvigationSkeleton = () => {
  return (
    <Stack
      spacing={2}
      direction={"row"}
      sx={{
        padding: ".5rem 1.5rem",
        backgroundColor: "background.paper",
        boxShadow: "0 0 2px 0 hsl(204, 5%, 38%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Skeleton
            style={{
              flexGrow: 1,
              marginRight: ".5rem",
              display: "inline-block",
              //   marginBottom: "-7px",
              width: "40px",
              height: "40px",
            }}
          />
          <Skeleton
            sx={{
              width: "150px",
              height: "40px",
              "@media (max-width: 480PX)": {
                display: "none",
              },
            }}
          />
        </Box>
        <Stack direction="row" spacing={2} alignItems={"center"}>
          <Skeleton
            sx={{
              width: "75px",
              height: "40px",
            }}
          />
          <Skeleton
            sx={{
              width: "40px",
              height: "40px",
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default MobileNAvigationSkeleton;
