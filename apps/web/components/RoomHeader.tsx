"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Copy, LogOut, Menu, Trash2, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToggleTheme } from "./theme-toogle";
import { toast } from "sonner";
import { deleteRoom, getRoom, isRoomOwner, leaveRoom } from "../lib/roomApi";

interface RoomHeaderProps {
  roomId: string;
}

export default function RoomHeader({ roomId }: RoomHeaderProps) {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomName, setRoomName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function checkOwnership() {
      try {
        const owner = await isRoomOwner(roomId);
        setIsOwner(owner);
      } catch (error) {
        console.error(error);
      }
    }

    if (roomId) {
      checkOwnership();
    }
  }, [roomId]);

  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied");
  };

  const handleDeleteRoom = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await deleteRoom(roomId);

      toast.success("Room deleted successfully");

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    getRoom(roomId)
      .then((room) => setRoomName(room.name))
      .catch(() => setRoomName("Untitled Room"));
  }, [roomId]);

  async function handleLeaveRoom() {
    if (loading) return;
    try {
      setLoading(true);
      await leaveRoom(roomId);
      toast.success("Left the room");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-[78px] w-full max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={48}
              height={48}
              priority
              className="rounded-2xl object-cover"
            />
            <div className="flex flex-col">
              <span className="text-[1.02rem] font-semibold tracking-[-0.03em] text-foreground">
                {roomName || "Loading..."}
              </span>
              <span className="text-xs text-foreground-secondary tracking-wide">
                Collaborative Room
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ToggleTheme />

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-border/70 bg-background-secondary/60 text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-background-secondary hover:shadow-[0_10px_30px_rgba(91,92,240,0.12)]"
              >
                <User className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-[120%] w-[220px] overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-2 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="mb-2 rounded-xl border border-border/70 bg-background-secondary/50 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider text-foreground-secondary">
                        Current Room
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-foreground">
                        🎨 {roomName || "Loading..."}
                      </p>
                    </div>
                       <button
                      onClick={handleCopyRoomId}
                    className="flex w-full items-center cursor-pointer gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                    >
                      <Copy className="h-4 w-4" />
                      Share Room
                    </button>
                    {
                      isOwner && (
                        <button
                          disabled={loading}
                          onClick={() => {
                            setOpen(false);
                            handleDeleteRoom();
                          }}
                          className="flex w-full items-center cursor-pointer gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          {loading ? "Deleting..." : "Delete Room"}
                        </button>
                      )}


                    <button
                      disabled={loading}
                      onClick={() => { setOpen(false); handleLeaveRoom(); }}
                      className="flex w-full items-center cursor-pointer gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      {loading ? "Please Wait..." : "Leave Room"}
                    </button>

                 
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/70 bg-background-secondary/60 text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-background-secondary md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-screen w-[85%] max-w-[340px] flex-col border-l border-border/70 bg-background/95 p-6 backdrop-blur-2xl md:hidden"
            >
              <div className="mb-10 flex items-center justify-end">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background-secondary/60 text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-background-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4 rounded-xl border border-border/70 bg-background-secondary/50 px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-foreground-secondary">
                  Current Room
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-foreground">
                  🎨 {roomName || "Loading..."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background-secondary/50 px-5 py-4">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <ToggleTheme />
                </div>
 <button
                  onClick={handleCopyRoomId}
                  className="flex w-full items-center cursor-pointer gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                  >
                  <Copy className="h-4 w-4" />
                  Share Room
                </button>
                {isOwner && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDeleteRoom();
                    }}
                    disabled={loading}
                    className="flex items-center gap-3 rounded-2xl border cursor-pointer border-red-500/30 bg-red-500/15 px-5 py-4 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/25 hover:border-red-500/40"
                  >
                    <Trash2 className="h-5 w-5" />
                    {loading ? "Deleting..." : "Delete Room"}
                  </button>
                )}

                <button
                  onClick={() => { setMobileMenuOpen(false); handleLeaveRoom(); }}
                  disabled={loading}
                  className="flex items-center gap-3 rounded-2xl border cursor-pointer border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500/15"
                >
                  <LogOut className="h-5 w-5" />
                  {loading ? "Please Wait..." : "Leave Room"}
                </button>

               
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}