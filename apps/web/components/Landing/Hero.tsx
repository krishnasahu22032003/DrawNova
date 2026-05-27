"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    MousePointer2,
    PenTool,
    Sparkles,
    Users,
    Zap,
    Layers3,
} from "lucide-react";

import { Button } from "../Button";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section
            id="home"
            className="
        relative
        overflow-hidden
        px-6
        pb-28
        pt-36
      "
        >
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -40, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
            absolute
            left-[-10%]
            top-[-10%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-primary/15
            blur-3xl
          "
                />

                <motion.div
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="
            absolute
            bottom-[-15%]
            right-[-10%]
            h-[520px]
            w-[520px]
            rounded-full
            bg-accent/15
            blur-3xl
          "
                />

                <div
                    className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(120,120,120,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.18)_1px,transparent_1px)]
            [background-size:80px_80px]
          "
                />
            </div>

            <div className="relative mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mb-8 flex justify-center"
                >
                    <div
                        className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-surface/70
              px-5
              py-2.5
              text-sm
              font-medium
              text-foreground-secondary
              shadow-sm
              backdrop-blur-2xl
            "
                    >
                        <Sparkles size={15} className="text-primary" />

                        <span>
                            Collaborative whiteboard for modern teams
                        </span>
                    </div>
                </motion.div>

                <div className="mx-auto max-w-5xl text-center">
                    <motion.h1
                        initial={{
                            opacity: 0,
                            y: 80,
                            scale: 0.96,
                            filter: "blur(20px)",
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: "blur(0px)",
                        }}
                        transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
              text-4xl
              font-bold
              leading-[1]
              tracking-[-0.06em]
              text-foreground
              sm:text-5xl
              md:text-5xl
              lg:text-[4.2rem]
            "
                    >
                        Create ideas in a
                        <span
                            className="
                block
                bg-gradient-to-r
                from-primary
                via-violet-500
                to-accent
                bg-clip-text
                text-transparent
              "
                        >
                            shared visual space
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{
                            opacity: 0,
                            y: 40,
                            filter: "blur(10px)",
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.2,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
              mx-auto
              mt-7
              max-w-3xl
              text-base
              leading-relaxed
              text-foreground-secondary
              sm:text-lg
            "
                    >
                        Draw Nova helps creators, teams, and developers
                        brainstorm together with fluid real-time
                        collaboration, elegant tools, and a workspace
                        designed for modern creative thinking.
                    </motion.p>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mt-11 flex justify-center"
                    >

                        <Link href="/signin">
                                 <Button
                            variant="gradient"
                            size="lg"
                            className="
                h-14
                px-8
                text-base
                shadow-[0_20px_80px_rgba(91,92,240,0.35)]
              "
                        >
                            Start Drawing

                            <ArrowRight size={18} />
                        </Button>
                        </Link>
               
                    </motion.div>

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 40,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
              mt-14
              flex
              flex-wrap
              items-center
              justify-center
              gap-8
            "
                    >
                        {[
                            {
                                value: "10K+",
                                label: "Active Users",
                            },
                            {
                                value: "99.9%",
                                label: "Realtime Sync",
                            },
                            {
                                value: "50+",
                                label: "Countries",
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="text-center"
                            >
                                <h3
                                    className="
                    text-2xl
                    font-bold
                    tracking-tight
                  "
                                >
                                    {item.value}
                                </h3>

                                <p
                                    className="
                    mt-1
                    text-sm
                    text-foreground-muted
                  "
                                >
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 120,
                        scale: 0.9,
                        filter: "blur(30px)",
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                    }}
                    transition={{
                        duration: 1.4,
                        delay: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative mx-auto mt-24 max-w-6xl"
                >
                    <div
                        className="
              absolute
              inset-0
              rounded-[42px]
              bg-primary/10
              blur-3xl
            "
                    />

                    <div
                        className="
              relative
              overflow-hidden
              rounded-[36px]
              border
              border-border
              bg-surface/70
              shadow-[0_40px_120px_rgba(0,0,0,0.14)]
              backdrop-blur-3xl
            "
                    >
                        <div
                            className="
                flex
                items-center
                justify-between
                border-b
                border-border
                px-6
                py-4
              "
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-danger" />
                                <div className="h-3 w-3 rounded-full bg-warning" />
                                <div className="h-3 w-3 rounded-full bg-success" />
                            </div>

                            <div
                                className="
                  rounded-full
                  border
                  border-border
                  bg-background-secondary
                  px-4
                  py-1.5
                  text-sm
                  text-foreground-secondary
                "
                            >
                                Draw Nova Workspace
                            </div>
                        </div>

                        <div
                            className="
                flex
                items-center
                gap-3
                border-b
                border-border
                px-6
                py-4
              "
                        >
                            {[
                                <PenTool size={18} />,
                                <MousePointer2 size={18} />,
                                <Zap size={18} />,
                                <Users size={18} />,
                                <Layers3 size={18} />,
                            ].map((icon, index) => (
                                <motion.button
                                    whileHover={{
                                        y: -4,
                                        scale: 1.05,
                                    }}
                                    whileTap={{
                                        scale: 0.96,
                                    }}
                                    key={index}
                                    className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-border
                    bg-background-secondary
                    text-foreground-secondary
                    transition-all
                    duration-300
                    hover:border-primary/20
                    hover:bg-primary
                    hover:text-white
                  "
                                >
                                    {icon}
                                </motion.button>
                            ))}
                        </div>

                        <div
                            className="
                relative
                h-[560px]
                overflow-hidden
                bg-background-secondary
              "
                        >
                            <div
                                className="
                  absolute
                  inset-0
                  opacity-30
                  [background-image:linear-gradient(rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.1)_1px,transparent_1px)]
                  [background-size:45px_45px]
                "
                            />

                            <motion.div
                                animate={{
                                    y: [0, -12, 0],
                                    rotate: [0, 1, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 6,
                                    ease: "easeInOut",
                                }}
                                className="
                  absolute
                  left-16
                  top-16
                  h-44
                  w-64
                  rounded-[34px]
                  border-2
                  border-primary
                  bg-gradient-to-br
                  from-primary/15
                  to-primary/5
                  backdrop-blur-xl
                "
                            />

                            <motion.div
                                animate={{
                                    y: [0, 14, 0],
                                    x: [0, 10, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 8,
                                    ease: "easeInOut",
                                }}
                                className="
                  absolute
                  right-24
                  top-24
                  h-40
                  w-40
                  rounded-full
                  border-2
                  border-accent
                  bg-accent/10
                "
                            />

                            <motion.div
                                animate={{
                                    rotate: [-4, -1, -4],
                                    y: [0, -6, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 5,
                                }}
                                className="
                  absolute
                  bottom-28
                  left-28
                  rounded-3xl
                  bg-warning
                  px-6
                  py-5
                  shadow-2xl
                "
                            >
                                <p className="font-semibold text-black">
                                    Product roadmap 🚀
                                </p>

                                <p className="mt-2 text-sm text-black/70">
                                    Brainstorm ideas visually together
                                </p>
                            </motion.div>

                            <motion.div
                                animate={{
                                    x: [0, 40, 0],
                                    y: [0, -18, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 5,
                                    ease: "easeInOut",
                                }}
                                className="
                  absolute
                  bottom-20
                  right-20
                "
                            >
                                <div className="flex items-center gap-2">
                                    <MousePointer2
                                        size={20}
                                        className="
                                              text-foreground
                                                drop-shadow-sm
                                                   "
                                    />

                                    <div
                                        className="
                      rounded-full
                      bg-primary
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-white
                      shadow-lg
                    "
                                    >
                                        DrawNova
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                    scale: [1, 1.08, 1],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 4,
                                }}
                                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-28
                  w-28
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-primary/10
                  blur-2xl
                "
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}