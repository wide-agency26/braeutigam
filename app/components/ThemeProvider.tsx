"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "braeutigam-theme";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyDomTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

function readDomTheme(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

/**
 * Owns the light/dark toggle and mirrors it onto <html class="dark">.
 * That lets Tailwind `dark:` utilities (and CSS `.dark …` rules) drive
 * appearance without re-rendering every section on each toggle.
 */
export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: ReactNode;
  defaultTheme?: Theme;
}) {
  // Match the server during hydration, then read the theme already restored
  // by the layout's pre-paint script without overwriting that DOM state.
  const theme = useSyncExternalStore(subscribeTheme, readDomTheme, () => defaultTheme);

  const setTheme = useCallback((next: Theme) => {
    applyDomTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The switch still works when the browser disallows persistent storage.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(readDomTheme() === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
