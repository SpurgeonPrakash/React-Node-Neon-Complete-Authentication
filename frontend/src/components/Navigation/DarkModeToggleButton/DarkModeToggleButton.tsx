import { Stack, styled } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useThemeContext } from "../../../providers/ThemeProvider/ThemeContext";

const DarkModeToggleStack = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: ".2rem",
  borderRadius: "5px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
  },
}));

const DarkModeToggleButton = () => {
  const { theme, toggleTheme } = useThemeContext();
  return (
    <DarkModeToggleStack onClick={() => toggleTheme()} alignItems={"center"}>
      {theme === "light" ? <LightModeIcon /> : <DarkModeIcon />}
    </DarkModeToggleStack>
  );
};

export default DarkModeToggleButton;
