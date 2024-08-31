import { ReactNode, useState } from "react";

import ThemeContext from "./ThemeContext";
import { ThemeProvider as ThemeMUIProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { getThemes } from "../../theme/theme";

interface ThemeContextType {
  children: ReactNode;
}

const themeCheck = (): "dark" | "light" => {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    return "dark";
  } else {
    return "light";
  }
};

const ThemeProvider = ({ children }: ThemeContextType) => {
  const localTheme: "dark" | "light" = themeCheck();
  const [themeName, setThemeName] = useState<"dark" | "light">(
    localTheme || "dark"
  );
  const toggleTheme = () => {
    setThemeName((prev) => {
      localStorage.setItem("theme", prev === "dark" ? "light" : "dark");
      return prev === "dark" ? "light" : "dark";
    });
  };

  const theme = getThemes(themeName);

  const values = {
    theme: themeName,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={values}>
      <ThemeMUIProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeMUIProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
