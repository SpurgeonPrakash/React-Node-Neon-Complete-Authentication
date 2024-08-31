import CircularProgress from "@mui/material/CircularProgress";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress size={80} thickness={4} />
    </div>
  );
};

export default LoadingSpinner;
