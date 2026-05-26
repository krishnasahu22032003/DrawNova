"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { ToggleTheme } from "../theme-toogle";

export default function Header() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const navLinks = [
    {
      label: "Home",
      href: "#home",
    },
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "Testimonials",
      href: "#testimonials",
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed
            top-0
            left-0
            right-0
            z-50
            flex
            justify-center
            px-4
            pt-4
          "
        >
          <div
            className="
              flex
              w-full
              max-w-7xl
              items-center
              justify-between
              rounded-3xl
              border
              border-border
              bg-surface/80
              px-6
              py-4
              shadow-[0_8px_40px_rgba(0,0,0,0.08)]
              backdrop-blur-2xl
              transition-all
              duration-300
            "
          >

            <Link
              href="/"
              className="
                group
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  relative
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  bg-gradient-to-br
                  from-primary
                  via-violet-500
                  to-accent
                  shadow-[0_10px_40px_rgba(91,92,240,0.35)]
                  transition-all
                  duration-500
                  group-hover:scale-105
                  group-hover:rotate-3
                "
              >
                <span
                  className="
                    text-lg
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  DN
                </span>

                <div
                  className="
                    absolute
                    inset-0
                    bg-white/10
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />
              </div>

              <div className="flex flex-col">
                <span
                  className="
                    text-lg
                    font-semibold
                    tracking-tight
                    text-foreground
                  "
                >
                  Draw Nova
                </span>

                <span
                  className="
                    text-xs
                    font-medium
                    text-foreground-muted
                  "
                >
                  Collaborative Whiteboard
                </span>
              </div>
            </Link>

            <nav
              className="
                hidden
                items-center
                gap-2
                rounded-2xl
                border
                border-border
                bg-background/60
                px-3
                py-2
                backdrop-blur-xl
                md:flex
              "
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-foreground-secondary
                    transition-all
                    duration-300
                    hover:text-foreground
                  "
                >
                  <span className="relative z-10">
                    {link.label}
                  </span>

                  <span
                    className="
                      absolute
                      inset-0
                      z-0
                      scale-90
                      rounded-xl
                      bg-background-secondary
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:scale-100
                      group-hover:opacity-100
                    "
                  />

                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2
                      h-[2px]
                      w-0
                      -translate-x-1/2
                      rounded-full
                      bg-gradient-to-r
                      from-primary
                      to-accent
                      transition-all
                      duration-300
                      group-hover:w-8
                    "
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <ToggleTheme />

              <Button
                variant="ghost"
                className="hidden md:inline-flex"
              >
                Sign In
              </Button>

              <Button variant="gradient">
                Sign Up
              </Button>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}