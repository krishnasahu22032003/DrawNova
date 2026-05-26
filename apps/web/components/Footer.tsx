"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
        border-t
        border-border
        bg-background/80
        backdrop-blur-xl
       
      "
    >
      <div
        className="
          mx-auto
          flex
          max-w-6xl
          flex-col
          items-center
          justify-center
          gap-2
          px-6
          py-5
          text-center
          text-sm
          text-foreground-muted
          sm:flex-row
        "
      >
        <span>
          © {new Date().getFullYear()} Draw Nova
        </span>

        <span className="opacity-40">•</span>

        <span className="flex items-center gap-1">
          Made with
          <Heart
            size={14}
            className="
              fill-red-500
              text-red-500
            "
          />
          by Krishna
        </span>
      </div>
    </footer>
  );
}