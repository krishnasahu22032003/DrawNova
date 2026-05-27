"use client";

import Image from "next/image";
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
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
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
    <AnimatePresence mode="wait">
      {visible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
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
            bg-background/75
            backdrop-blur-2xl
          "
        >
          <div
            className="
              mx-auto
              flex
              h-[78px]
              w-full
              max-w-6xl
              items-center
              justify-between
              px-6
            "
          >
            <Link
              href="#home"
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
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  transition-all
                  duration-500
                  group-hover:scale-[1.03]
                "
              >
                <div
                  className="
                    absolute
                    inset-0
                    rounded-2xl
                    bg-primary/20
                    blur-xl
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                <Image
                  src="/Logo.png"
                  alt="Draw Nova Logo"
                  width={54}
                  height={54}
                  priority
                  className="
                    relative
                    z-10
                    rounded-2xl
                    object-cover
                  "
                />
              </div>

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

                <span
                  className="
                    text-xs
                    font-medium
                    tracking-wide
                    text-foreground-muted
                  "
                >
                  Collaborative Whiteboard
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-10">
              <nav className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="
                      group
                      relative
                      px-4
                      py-2
                      text-sm
                      font-medium
                      tracking-[-0.01em]
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
                        inset-x-2
                        bottom-0
                        h-[2px]
                        origin-center
                        scale-x-0
                        rounded-full
                        bg-gradient-to-r
                        from-primary
                        to-accent
                        transition-transform
                        duration-300
                        ease-out
                        group-hover:scale-x-100
                      "
                    />

                    <span
                      className="
                        absolute
                        inset-0
                        rounded-xl
                        bg-background-secondary
                        opacity-0
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                      "
                    />
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <ToggleTheme />
               
<Link href="/signin">
   <Button
                  variant="ghost"
                  className="
                    hidden
                    md:inline-flex
                  "
                >
                  Sign In
                </Button>
</Link>
             
<Link href="/signup">

                <Button
                  variant="gradient"
                  size="md"
                  className="
                    shadow-[0_12px_40px_rgba(91,92,240,0.28)]
                  "
                >
                  Sign Up
                </Button>
</Link>
              </div>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}