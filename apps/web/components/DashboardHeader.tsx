"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { ToggleTheme } from "./theme-toogle";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        border-b
        border-border/70
        bg-background/80
        backdrop-blur-2xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[78px]
          w-full
          max-w-7xl
          items-center
          justify-between
          px-6
        "
      >
        <Link
          href="/dashboard"
          className="
            flex
            items-center
            gap-3
          "
        >
          <Image
            src="/Logo.png"
            alt="Logo"
            width={50}
            height={50}
            priority
            className="
              rounded-2xl
              object-cover
            "
          />

          <div className="flex flex-col">
            <span
              className="
                text-[1.05rem]
                font-semibold
                tracking-[-0.03em]
                text-foreground
              "
            >
              Draw Nova
            </span>

          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ToggleTheme />

          <div
            ref={dropdownRef}
            className="relative"
          >
            <button
              onClick={() => setOpen(!open)}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                border
                cursor-pointer
                border-border/70
                bg-background-secondary/60
                text-foreground
                transition-all
                duration-300
                hover:border-primary/50
                hover:bg-background-secondary
              "
            >
              <User className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    absolute
                    right-0
                    top-[120%]
                    w-[220px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border/70
                    bg-background/95
                    p-2
                    shadow-2xl
                    backdrop-blur-2xl
                  "
                >
                  <Link
                    href="/profile"
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-foreground-secondary
                      transition-all
                      duration-300
                      hover:bg-background-secondary
                      hover:text-foreground
                    "
                  >
                    <Settings className="h-4 w-4" />
                    Update Profile
                  </Link>

                  <button
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-red-400
                      transition-all
                      duration-300
                      hover:bg-red-500/10
                    "
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}