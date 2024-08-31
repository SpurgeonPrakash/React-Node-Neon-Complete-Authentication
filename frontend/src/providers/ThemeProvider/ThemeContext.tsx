import { createContext, useContext } from "react";

interface ThemeContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const useThemeContext = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);
  return { toggleTheme, theme };
};

export default ThemeContext;
