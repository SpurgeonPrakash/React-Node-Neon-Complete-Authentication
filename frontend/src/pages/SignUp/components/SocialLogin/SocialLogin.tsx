import { Stack, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { VITE_BACKEND_BASE_URL } from "../../../../config";

const SocialLogin = () => {
  const commonURL = VITE_BACKEND_BASE_URL + "/auth/redirect";
  const googleURL = commonURL + "/google-oauth";
  const faceBookURL = commonURL + "/facebook-oauth";
  const gitHubURL = commonURL + "/github-oauth";
  const linkedInURL = commonURL + "/linkedin-oauth";

  return (
    <Stack
      spacing={2}
      sx={{ marginTop: "1rem" }}
      direction="row"
      useFlexGap
      justifyContent="center"
      flexWrap="wrap"
    >
      <Button
        variant="contained"
        color="error"
        startIcon={<GoogleIcon />}
        // width="100%"
        href={googleURL}
        sx={{
          width: "calc(50% - 8px)",
          "@media (max-width: 571px)": {
            width: "100%",
          },
        }}
      >
        Sign In with Google
      </Button>
      <Button
        variant="contained"
        color="primary"
        href={faceBookURL}
        startIcon={<FacebookIcon />}
        sx={{
          width: "calc(50% - 8px)",
          "@media (max-width: 571px)": {
            width: "100%",
          },
        }}
      >
        Sign In with Facebook
      </Button>
      <Button
        variant="contained"
        // color="inherit"
        startIcon={<GitHubIcon />}
        href={gitHubURL}
        sx={{
          width: "calc(50% - 8px)",
          backgroundColor: "black",
          color: "white",
          "@media (max-width: 571px)": {
            width: "100%",
          },
        }}
      >
        Sign In with Github
      </Button>
      <Button
        variant="contained"
        // color="secondary"
        startIcon={<LinkedInIcon />}
        href={linkedInURL}
        sx={{
          width: "calc(50% - 8px)",
          backgroundColor: "blue",
          color: "white",
          "@media (max-width: 571px)": {
            width: "100%",
          },
        }}
      >
        Sign In with LinkedIn
      </Button>
    </Stack>
  );
};

export default SocialLogin;
