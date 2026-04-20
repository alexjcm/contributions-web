import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Reads localStorage and, if no explicit user preference is found,
 * falls back to the OS preference via prefers-color-scheme.
 * Wrapped in try/catch to handle blocked localStorage
 * (Safari private mode, strict CSP).
 */
function resolveInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (_) {}

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Toggles the .dark class on document.documentElement (<html>). */
function applyThemeToDOM(mode: ThemeMode): void {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

/**
 * Hook that manages the application's Dark/Light theme.
 *
 * Behavior:
 * - No localStorage value: respects the OS prefers-color-scheme on load.
 * - With localStorage value: uses the user's explicit stored preference.
 * - Calling toggle(): switches the theme and persists the choice to localStorage.
 *
 * Note: the useEffect reconciles with the anti-FOUC script in index.html.
 * Both will resolve the same value, so there is no additional flash.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(resolveInitialTheme);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode): void => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (_) {}
    setThemeState(mode);
  }, []);

  const toggle = useCallback((): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, toggle } as const;
}
