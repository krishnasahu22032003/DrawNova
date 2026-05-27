"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";

import { ToggleTheme } from "./theme-toogle";

export default function DashboardHeader() {
  const [open, setOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <>
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
            px-4
            md:px-6
          "
        >
          <div
           
            className="
              flex
              items-center
            "
          >
            <Image
              src="/Logo.png"
              alt="Logo"
              width={48}
              height={48}
              priority
              className="
                rounded-2xl
                object-cover
              "
            />

            <span
              className="
                text-[1.02rem]
                font-semibold
                tracking-[-0.03em]
                text-foreground
              "
            >
              Draw Nova
            </span>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              className="
                group
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-primary/20
                bg-primary/10
                px-5
                py-2.5
                cursor-pointer
                text-sm
                font-medium
                text-foreground
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-primary/40
                hover:bg-primary/15
                hover:shadow-[0_10px_30px_rgba(91,92,240,0.18)]
              "
            >
              <Plus
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:rotate-90
                "
              />
              Create Room
            </button>

            <button
              className="
                group
                flex
                items-center
                gap-2
                rounded-2xl
                cursor-pointer
                border
                border-border/70
                bg-background-secondary/60
                px-5
                py-2.5
                text-sm
                font-medium
                text-foreground-secondary
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-primary/30
                hover:bg-background-secondary
                hover:text-foreground
                hover:shadow-[0_10px_30px_rgba(91,92,240,0.12)]
              "
            >
              <Users
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              />
              Join Room
            </button>

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
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-border/70
                  bg-background-secondary/60
                  text-foreground
                  transition-all
                  duration-300
                  hover:border-primary/50
                  hover:bg-background-secondary
                  hover:shadow-[0_10px_30px_rgba(91,92,240,0.12)]
                "
              >
                <User className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.96,
                    }}
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

          <button
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-border/70
              bg-background-secondary/60
              text-foreground
              transition-all
              duration-300
              hover:border-primary/50
              hover:bg-background-secondary
              md:hidden
            "
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="
                fixed
                inset-0
                z-40
                bg-black/40
                backdrop-blur-sm
                md:hidden
              "
            />

            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                fixed
                right-0
                top-0
                z-50
                flex
                h-screen
                w-[85%]
                max-w-[340px]
                flex-col
                border-l
                border-border/70
                bg-background/95
                p-6
                backdrop-blur-2xl
                md:hidden
              "
            >
          <div
  className="
    mb-10
    flex
    items-center
    justify-end
  "
>
  <button
    onClick={() =>
      setMobileMenuOpen(false)
    }
    className="
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      border
      border-border/70
      bg-background-secondary/60
      text-foreground
      transition-all
      duration-300
      hover:border-primary/40
      hover:bg-background-secondary
    "
  >
    <X className="h-5 w-5" />
  </button>
</div>

              <div className="flex flex-col gap-3">
                <button
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-primary/20
                    bg-primary/10
                    px-5
                    py-4
                    text-sm
                    font-medium
                    text-foreground
                    transition-all
                    duration-300
                    hover:border-primary/40
                    hover:bg-primary/15
                  "
                >
                  <Plus
                    className="
                      h-5
                      w-5
                      transition-transform
                      duration-300
                      group-hover:rotate-90
                    "
                  />
                  Create Room
                </button>

                <button
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-border/70
                    bg-background-secondary/60
                    px-5
                    py-4
                    text-sm
                    font-medium
                    text-foreground-secondary
                    transition-all
                    duration-300
                    hover:border-primary/30
                    hover:bg-background-secondary
                    hover:text-foreground
                  "
                >
                  <Users
                    className="
                      h-5
                      w-5
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                  Join Room
                </button>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-border/70
                    bg-background-secondary/50
                    px-5
                    py-4
                  "
                >
                  <span
                    className="
                      text-sm
                      font-medium
                      text-foreground
                    "
                  >
                    Theme
                  </span>

                  <ToggleTheme />
                </div>

                <Link
                  href="/profile"
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-border/70
                    bg-background-secondary/50
                    px-5
                    py-4
                    text-sm
                    font-medium
                    text-foreground-secondary
                    transition-all
                    duration-300
                    hover:border-primary/30
                    hover:bg-background-secondary
                    hover:text-foreground
                  "
                >
                  <Settings className="h-5 w-5" />
                  Update Profile
                </Link>

                <button
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-5
                    py-4
                    text-sm
                    font-medium
                    text-red-400
                    transition-all
                    duration-300
                    hover:bg-red-500/15
                  "
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}