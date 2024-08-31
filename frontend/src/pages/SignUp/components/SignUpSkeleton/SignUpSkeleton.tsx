import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const SignUpSkeleton = () => {
  return (
    <Stack spacing={2}>
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", height: "2.9rem" }}
        // height={60}
      />
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", height: "2.9rem" }}
        // height={60}
      />
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", height: "40px" }}
        // height={60}
      />
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", height: "40px" }}
        // height={60}
      />
      <Skeleton
        variant="rounded"
        sx={{ width: "100%", height: "40px" }}
        // height={60}
      />
      <Stack
        spacing={2}
        sx={{ marginTop: "1rem" }}
        direction="row"
        useFlexGap
        justifyContent="center"
        flexWrap="wrap"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            variant="rounded"
            sx={{
              width: "calc(50% - 8px)",
              height: "40px",
              "@media (max-width: 571px)": {
                width: "100%",
              },
            }}
            key={index}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default SignUpSkeleton;
