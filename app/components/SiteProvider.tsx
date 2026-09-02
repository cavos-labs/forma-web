"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Language, Theme } from "@/lib/site";
import { COPY } from "@/lib/site";

type SiteContextValue = {
  language: Language;
  theme: Theme;
  copy: (typeof COPY)[Language];
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

function readStoredLanguage(): Language | null {
  const stored = window.localStorage.getItem("forma-language");
  return stored === "EN" || stored === "ES" ? stored : null;
}

function readStoredTheme(): Theme | null {
  const stored = window.localStorage.getItem("forma-theme");
  return stored === "dark" || stored === "light" ? stored : null;
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const storedLanguage = readStoredLanguage();
    if (storedLanguage) {
      setLanguageState(storedLanguage);
    } else {
      const browser = navigator.language || navigator.languages[0] || "en";
      setLanguageState(browser.toLowerCase().startsWith("es") ? "ES" : "EN");
    }

    const storedTheme = readStoredTheme();
    if (storedTheme) setTheme(storedTheme);
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("forma-language", next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      window.localStorage.setItem("forma-theme", next);
      return next;
    });
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({
      language,
      theme,
      copy: COPY[language],
      setLanguage,
      toggleTheme,
    }),
    [language, theme, setLanguage, toggleTheme]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used inside SiteProvider");
  }
  return context;
}

export function useOptionalSite() {
  return useContext(SiteContext);
}
