"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else {
      const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
        ? "dark"
        : "light";

      setTheme(systemTheme);
    }

    setMounted(true);
  }, []);

  // Apply theme
  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;

    html.classList.toggle("dark", theme === "dark");

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    mounted,
  };
}

export function ThemeToggler() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button size="icon" disabled>
        <div className="size-5" />
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="size-5 transition-all" />
      ) : (
        <Moon className="size-5 transition-all" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}