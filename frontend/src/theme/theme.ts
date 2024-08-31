import { createTheme, PaletteMode, PaletteOptions } from "@mui/material";
import { colors } from "./colors";

interface ThemePalette extends PaletteOptions {
  mode: PaletteMode;
  primary: { main: string };
  secondary: { main: string };
  background: { default: string; paper: string };
}

const darkThemePalette: ThemePalette = {
  mode: "dark",
  primary: {
    main: colors.dark.primary,
  },
  secondary: {
    main: colors.dark.secondary,
  },
  background: {
    default: colors.dark.background.default,
    paper: colors.dark.background.paper,
  },
};

const lightThemePalette: ThemePalette = {
  mode: "light",
  primary: {
    main: colors.light.primary,
  },
  secondary: {
    main: colors.light.secondary,
  },
  background: {
    default: colors.light.background.default,
    paper: colors.light.background.paper,
  },
};

export const typography = {
  fontFamily: [
    "Roboto",
    "sans-serif",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
  ].join(","),
};

export const breakpoints = {
  values: {
    xs: 0,
    sm: 320,
    md: 480,
    lg: 768,
    xl: 1025,
    "2xl": 1281,
  },
};

// const darkThemeComponents = {
//   MuiDrawer: {
//     styleOverrides: {
//       paper: {
//         background: "orange",
//       },
//       background: {
//         background: "red",
//       },
//     },
//   },
// };
// const lightThemeComponents = {
//   MuiDrawer: {
//     styleOverrides: {
//       paper: {
//         background: "orange",
//       },
//       background: {
//         background: "red",
//       },
//     },
//   },
// };

export const getThemes = (mode: "dark" | "light") =>
  createTheme({
    palette: mode === "dark" ? darkThemePalette : lightThemePalette,
    typography,
    breakpoints,
    // components: mode === "dark" ? darkThemeComponents : lightThemeComponents,
  });

export const theme = getThemes("light");
