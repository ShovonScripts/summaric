"use client";

import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("anucched-theme", next);
    } catch {
      // The theme still changes for this visit when storage is unavailable.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="থিম বদলান"
      title="থিম বদলান"
      className={
        compact
          ? "theme-toggle theme-toggle--compact"
          : "theme-toggle"
      }
    >
      <SunIcon className="theme-icon theme-icon--sun" />
      <MoonIcon className="theme-icon theme-icon--moon" />
    </button>
  );
}
