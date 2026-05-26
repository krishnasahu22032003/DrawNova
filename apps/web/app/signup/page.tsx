"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { useMemo, useState } from "react";
import { Button } from "../../components/Button";

export default function SignupPage() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const passwordChecks = useMemo(
    () => ({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special:
        /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }),
    [password]
  );

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const allValid =
    Object.values(passwordChecks).every(Boolean) &&
    passwordsMatch;

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
        py-12
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
                Create Account
              </h1>

              <p
                className="
                  mt-2.5
                  text-[15px]
                  leading-relaxed
                  text-foreground-secondary
                "
              >
                Join Draw Nova and start collaborating
                visually in realtime.
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
                  Full Name
                </label>

                <div className="relative">
                  <User
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
                    type="text"
                    placeholder="Enter your name"
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
                <label
                  className="
                    text-sm
                    font-medium
                    text-foreground-secondary
                  "
                >
                  Password
                </label>

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
                    placeholder="Create password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
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

              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-foreground-secondary
                  "
                >
                  Confirm Password
                </label>

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
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
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
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
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
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-background-secondary/50
                  p-4
                "
              >
                <div className="space-y-2.5 ">
                  {[
                    {
                      label:
                        "At least 8 characters",
                      valid:
                        passwordChecks.minLength,
                    },
                    {
                      label:
                        "One uppercase letter",
                      valid:
                        passwordChecks.uppercase,
                    },
                    {
                      label:
                        "One lowercase letter",
                      valid:
                        passwordChecks.lowercase,
                    },
                    {
                      label: "One number",
                      valid:
                        passwordChecks.number,
                    },
                    {
                      label:
                        "One special character",
                      valid:
                        passwordChecks.special,
                    },
                    {
                      label: "Passwords match",
                      valid: passwordsMatch,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >
                      <div
                        className={`
                          flex
                          h-5
                          w-5
                          items-center
                          justify-center
                          rounded-full
                          transition-all
                          duration-300
                          ${
                            item.valid
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500"
                          }
                        `}
                      >
                        {item.valid ? (
                          <Check size={12} />
                        ) : (
                          <X size={12} />
                        )}
                      </div>

                      <span
                        className={`
                          text-[13px]
                          transition-colors
                          duration-300
                          ${
                            item.valid
                              ? "text-foreground"
                              : "text-foreground-secondary"
                          }
                        `}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="gradient"
                size="lg"
                disabled={!allValid}
                className="
                  mt-1
                  h-13
                  w-full
                  text-sm
                  shadow-[0_20px_80px_rgba(91,92,240,0.28)]
                "
              >
                Create Account

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
              Already have an account?{" "}
              <Link
                href="/signin"
                className="
                  font-medium
                  text-primary
                  transition-colors
                  duration-300
                  hover:text-accent
                "
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}