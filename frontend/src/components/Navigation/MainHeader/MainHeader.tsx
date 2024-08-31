import MainNavigation from "../MainNavigation/MainNavigation";
import { Box, styled } from "@mui/material";
import MobileNavigation from "../MobileNavigation/MobileNavigation";

const MainNavigationBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const MobileNavigationBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    display: "none",
  },
}));

const MainHeader = () => {
  return (
    <Box
      className="main-header-container"
      sx={{
        position: "sticky",
        // zIndex: 1000,
        top: 0,
        left: 0,
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <Box
        sx={
          {
            // display: "inline-bl",
          }
        }
      >
        <MainNavigationBox>
          <MainNavigation />
        </MainNavigationBox>
        <MobileNavigationBox>
          <MobileNavigation />
        </MobileNavigationBox>
      </Box>
    </Box>
  );
};

export default MainHeader;
