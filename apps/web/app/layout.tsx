import type { Metadata } from "next";
import { Inter, Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/Providers/theme-provider";
import Footer from "../components/Footer";
import { Toaster } from "sonner";
import { WSProvider } from "../contexts/WSContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Draw Nova — Real-Time Collaborative Whiteboard",
  description:
    "A modern collaborative drawing board to sketch, brainstorm, and create together in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` 
          ${inter.variable}
          ${sora.variable}
          ${spaceGrotesk.variable}`}>
        <ThemeProvider>
          <WSProvider>
          {children}
          <Toaster richColors position="top-center"/>
          <Footer />
          </WSProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
