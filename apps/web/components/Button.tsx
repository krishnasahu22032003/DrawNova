"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "success"
  | "gradient";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      disabled={disabled || loading}
      className={cn(
        `
        group
        relative
        inline-flex
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        font-medium
        tracking-tight
        transition-all
        duration-300
        ease-out
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/40
        disabled:pointer-events-none
        disabled:opacity-50
        active:scale-[0.98]
        select-none
        whitespace-nowrap
      `,

        // ======================
        // SIZES
        // ======================

        size === "sm" &&
          `
          h-10
          px-4
          text-sm
        `,

        size === "md" &&
          `
          h-12
          px-6
          text-sm
        `,

        size === "lg" &&
          `
          h-14
          px-8
          text-base
        `,

        size === "icon" &&
          `
          h-12
          w-12
        `,

        // ======================
        // VARIANTS
        // ======================

        variant === "primary" &&
          `
          bg-primary
          text-white
          shadow-[0_10px_40px_rgba(91,92,240,0.28)]
          hover:-translate-y-0.5
          hover:shadow-[0_18px_60px_rgba(91,92,240,0.42)]
        `,

        variant === "gradient" &&
          `
          bg-gradient-to-r
          from-primary
          via-violet-500
          to-accent
          text-white
          shadow-[0_12px_50px_rgba(91,92,240,0.35)]
          hover:-translate-y-0.5
          hover:shadow-[0_22px_70px_rgba(91,92,240,0.45)]
        `,

        variant === "secondary" &&
          `
          border
          border-border
          bg-surface
          text-foreground
          backdrop-blur-xl
          hover:bg-background-secondary
          hover:-translate-y-0.5
        `,

        variant === "outline" &&
          `
          border
          border-primary/20
          bg-transparent
          text-primary
          hover:bg-primary/10
          hover:border-primary/40
        `,

        variant === "ghost" &&
          `
          bg-transparent
          text-foreground-secondary
          hover:bg-background-secondary
          hover:text-foreground
        `,

        variant === "danger" &&
          `
          bg-danger
          text-white
          shadow-[0_10px_40px_rgba(239,68,68,0.25)]
          hover:-translate-y-0.5
        `,

        variant === "success" &&
          `
          bg-success
          text-white
          shadow-[0_10px_40px_rgba(16,185,129,0.25)]
          hover:-translate-y-0.5
        `,

        className
      )}
      {...props}
    >
      {/* Glow Effect */}
      <span
        className="
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      >
        <span
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white/0
            via-white/10
            to-white/0
            translate-x-[-120%]
            group-hover:translate-x-[120%]
            transition-transform
            duration-1000
          "
        />
      </span>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {children}
      </span>
    </Comp>
  );
}