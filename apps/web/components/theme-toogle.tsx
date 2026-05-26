"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      className="
        flex
        h-11
        w-11
        cursor-pointer
        items-center
        justify-center
        rounded-2xl
        text-foreground-secondary
        transition-all
        duration-300
        hover:border-primary/20
        hover:bg-background-secondary
        hover:text-foreground
        hover:scale-105
      "
    >
      {theme === "dark" ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}