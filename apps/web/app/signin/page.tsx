"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";

import { useState } from "react";
import { Button } from "../../components/Button";

export default function SigninPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-6
        py-14
      "
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[-10%]
            top-[10%]
            h-[380px]
            w-[380px]
            rounded-full
            bg-primary/10
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[-10%]
            bottom-[-10%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.03]
            [background-image:linear-gradient(rgba(120,120,120,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.14)_1px,transparent_1px)]
            [background-size:72px_72px]
          "
        />
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.97,
          filter: "blur(12px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          w-full
          max-w-md
        "
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-[34px]
            border
            border-border
            bg-surface/75
            p-7
            shadow-[0_30px_120px_rgba(0,0,0,0.14)]
            backdrop-blur-3xl
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-primary/10
              via-transparent
              to-accent/10
            "
          />

          <div className="relative">
            <div className="mb-7 text-center">
              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-primary
                  to-accent
                  text-white
                  shadow-lg
                "
              >
                <Sparkles size={22} />
              </div>

              <h1
                className="
                  text-[2rem]
                  font-bold
                  tracking-[-0.04em]
                "
              >
                Welcome Back
              </h1>

              <p
                className="
                  mt-2.5
                  text-[15px]
                  leading-relaxed
                  text-foreground-secondary
                "
              >
                Sign in to continue collaborating with
                Draw Nova.
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-foreground-secondary
                  "
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-foreground-muted
                    "
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="
                      h-13
                      w-full
                      rounded-2xl
                      border
                      border-border
                      bg-background-secondary/60
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-foreground-muted
                      focus:border-primary/30
                      focus:ring-4
                      focus:ring-primary/10
                    "
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <label
                    className="
                      text-sm
                      font-medium
                      text-foreground-secondary
                    "
                  >
                    Password
                  </label>

                </div>

                <div className="relative">
                  <Lock
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-foreground-muted
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    className="
                      h-13
                      w-full
                      rounded-2xl
                      border
                      border-border
                      bg-background-secondary/60
                      pl-11
                      pr-12
                      text-sm
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-foreground-muted
                      focus:border-primary/30
                      focus:ring-4
                      focus:ring-primary/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-foreground-muted
                      transition-colors
                      duration-300
                      hover:text-foreground
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                variant="gradient"
                size="lg"
                className="
                  mt-2
                  h-13
                  w-full
                  text-sm
                  shadow-[0_20px_80px_rgba(91,92,240,0.28)]
                "
              >
                Sign In

                <ArrowRight size={17} />
              </Button>
            </form>

            <p
              className="
                mt-6
                text-center
                text-sm
                text-foreground-secondary
              "
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="
                  font-medium
                  text-primary
                  transition-colors
                  duration-300
                  hover:text-accent
                "
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}