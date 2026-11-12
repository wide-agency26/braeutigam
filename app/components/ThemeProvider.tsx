"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
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
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // useLayoutEffect: read blocking-script / stored theme before paint so client
  // islands (hero photo, etc.) match <html class="light|dark"> on first render.
  useLayoutEffect(() => {
    let resolved: Theme = defaultTheme;
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        resolved = stored;
      } else {
        resolved = document.documentElement.classList.contains("light") ? "light" : "dark";
      }
    } catch {
      resolved = document.documentElement.classList.contains("light") ? "light" : "dark";
    }
    // Hydration: server state is `defaultTheme`; blocking script may already set `light` on <html>.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync React theme to DOM/localStorage once before paint
    setThemeState(resolved);
    applyDomTheme(resolved);
  }, [defaultTheme]);

  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

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
