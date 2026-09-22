import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

const defaultTheme = {
  black: "#080a0b",
  blue: "#06304d",
  blueLight: "#0b4265",
  gold: "#e9a91a",
  red: "#d83b32",
  cream: "#f2e8d5",
  muted: "#aaa69b",
  border: "#c88b12",
  surface: "#111820",
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}