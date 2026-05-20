import { CookieOptions } from "express";

export const AUTH_COOKIE_NAME = "user_token";

export const AUTH_COOKIE_OPTIONS:CookieOptions = {
  httpOnly: true,

  secure: process.env.NODE_ENV === "production",

  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",

  path: "/",

  maxAge: 7 * 24 * 60 * 60 * 1000,
};