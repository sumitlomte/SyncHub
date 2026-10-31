import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeContext, type ThemeMode } from "../contexts/ThemeContext";
const STORAGE_KEY = "synchub-theme";

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const savedMode = window.localStorage.getItem(STORAGE_KEY);
  if (savedMode === "light" || savedMode === "dark") return savedMode;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((currentMode) => (currentMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
