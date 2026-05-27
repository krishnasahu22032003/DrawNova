"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Plus,
  Users,
  X,
} from "lucide-react";

import { useState } from "react";
import createRoom from "../../lib/createRoom";
import { toast } from "sonner";

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateRoomModal({
  open,
  onClose,
}: CreateRoomModalProps) {
  const [name, setName] =
    useState("");

  const [maxUser, setMaxUser] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleCreateRoom() {
    if (loading) return;

    const cleanedRoomName =
      name.trim();

    const cleanedMaxUsers =
      maxUser.trim();

    try {
      setLoading(true);

      const response = await createRoom({name : cleanedRoomName , maxUser :Number(cleanedMaxUsers)})
      toast.success(response.message || "Room created successfully");
    } catch (error : any) {
      toast.error(error.message || "Something Went Wrong")
    }finally{
      setLoading(false) ;
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-[90]
              bg-black/60
              backdrop-blur-md
            "
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 30,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              fixed
              left-1/2
              top-1/2
              z-[100]
              w-[92%]
              max-w-[520px]
              -translate-x-1/2
              -translate-y-1/2
              overflow-hidden
              rounded-[32px]
              border
              border-border/70
              bg-background/95
              shadow-[0_30px_80px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
            "
          >
            <div
              className="
                relative
                overflow-hidden
                border-b
                border-border/60
                p-6
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_top,rgba(91,92,240,0.15),transparent_70%)]
                "
              />

              <div
                className="
                  relative
                  flex
                  items-start
                  justify-between
                "
              >
                <div>
                  <div
                    className="
                      mb-4
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-primary/20
                      bg-primary/10
                      shadow-[0_10px_40px_rgba(91,92,240,0.18)]
                    "
                  >
                    <Plus
                      className="
                        h-7
                        w-7
                        text-primary
                      "
                    />
                  </div>

                  <h2
                    className="
                      text-2xl
                      font-semibold
                      tracking-[-0.03em]
                      text-foreground
                    "
                  >
                    Create Room
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-relaxed
                      text-foreground-muted
                    "
                  >
                    Create a collaborative
                    drawing room and invite
                    your teammates instantly.
                  </p>
                </div>

                <button
                  onClick={onClose}
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
                    bg-background-secondary/50
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
            </div>

            <div className="space-y-5 p-6">
              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  Room Name
                </label>

                <input
                  type="text"
                  placeholder="Enter room name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    border
                    border-border/70
                    bg-background-secondary/50
                    px-5
                    text-sm
                    text-foreground
                    outline-none
                    transition-all
                    duration-300
                    placeholder:text-foreground-muted
                    focus:border-primary/50
                    focus:bg-background-secondary
                    focus:shadow-[0_0_0_4px_rgba(91,92,240,0.12)]
                  "
                />
              </div>

              <div className="space-y-2">
                <label
                  className="
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  Max Users
                </label>

                <div className="relative">
                  <Users
                    className="
                      absolute
                      left-5
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-foreground-muted
                    "
                  />

                  <input
                    type="number"
                    placeholder="Enter max users"
                    value={maxUser}
                    onChange={(e) =>
                      setMaxUser(
                        e.target.value
                      )
                    }
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-border/70
                      bg-background-secondary/50
                      pl-12
                      pr-5
                      text-sm
                      text-foreground
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-foreground-muted
                      focus:border-primary/50
                      focus:bg-background-secondary
                      focus:shadow-[0_0_0_4px_rgba(91,92,240,0.12)]
                    "
                  />
                </div>
              </div>

              <button
                disabled={loading}
                onClick={
                  handleCreateRoom
                }
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-primary
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_14px_40px_rgba(91,92,240,0.28)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_20px_50px_rgba(91,92,240,0.38)]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading && (
                  <Loader2
                    className="
                      h-4
                      w-4
                      animate-spin
                    "
                  />
                )}

                {loading
                  ? "Creating Room..."
                  : "Create Room"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}