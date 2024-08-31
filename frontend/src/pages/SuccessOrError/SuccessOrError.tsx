import { Box, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

const SuccessOrError = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "success";
  const message = searchParams.get("message") || "Success";

  let actualMessage: string = "";
  if (type.toLowerCase() !== "success" && type.toLowerCase() !== "danger") {
    actualMessage = "Oops!! Something Went Wrong";
  } else {
    actualMessage = message;
  }
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          height: "300px",
          padding: "1rem",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            type.toLowerCase() === "success"
              ? "hsla(152, 69%, 31%, 0.5)"
              : "hsla(354, 70%, 54%, 0.5)",
        }}
      >
        <Typography variant="h1" className="text-4xl">
          {type.toLowerCase() === "success" ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DoneAllIcon
                sx={{
                  fontSize: "2.5rem",
                  border: "8px solid white",
                  borderRadius: "50%",
                  marginRight: "1rem",
                  padding: "12px",
                }}
              />
              <Box>{`Success: ${actualMessage}`}</Box>
            </Box>
          ) : (
            <Box className="flex items-center">
              <NotInterestedIcon
                sx={{ fontSize: "2.5rem", marginRight: "1rem" }}
              />

              <span>{`Error: ${actualMessage}`}</span>
            </Box>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default SuccessOrError;
