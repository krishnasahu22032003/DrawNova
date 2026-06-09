"use client";

import { WSProvider } from "../contexts/WSContext";

export default function RoomProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WSProvider>{children}</WSProvider>;
}