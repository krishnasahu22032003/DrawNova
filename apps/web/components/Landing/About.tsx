"use client";

import { motion } from "framer-motion";
import {
  Brush,
  Globe,
  Layers3,
  Sparkles,
  Users2,
  Zap,
} from "lucide-react";

export default function AboutSection() {
  const cards = [
    {
      icon: <Users2 size={21} />,
      title: "Realtime Collaboration",
      description:
        "Collaborate instantly with synchronized updates, live cursors, and seamless multiplayer workflows.",
    },
    {
      icon: <Layers3 size={21} />,
      title: "Infinite Workspace",
      description:
        "Organize ideas visually with an elegant canvas crafted for brainstorming and modern workflows.",
    },
    {
      icon: <Zap size={21} />,
      title: "Fast & Fluid",
      description:
        "Built with performance-first interactions for a smooth and premium collaborative experience.",
    },
  ];

  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        px-6
        py-32
      "
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[-10%]
            top-[10%]
            h-[420px]
            w-[420px]
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
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[-10%]
            top-[20%]
            h-[460px]
            w-[460px]
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(120,120,120,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.16)_1px,transparent_1px)]
            [background-size:72px_72px]
          "
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div
          className="
            grid
            items-center
            gap-16
            lg:grid-cols-2
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              filter: "blur(12px)",
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              viewport={{ once: true }}
              className="
                mb-6
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
                backdrop-blur-xl
              "
            >
              <Sparkles
                size={15}
                className="text-primary"
              />

              <span>
                Built for creators and modern teams
              </span>
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              className="
                text-[2.6rem]
                font-bold
                leading-[1.08]
                tracking-[-0.05em]
                sm:text-5xl
              "
            >
              A workspace designed for
              <span
                className="
                  bg-gradient-to-r
                  from-primary
                  to-accent
                  bg-clip-text
                  text-transparent
                "
              >
                {" "}
                visual collaboration
              </span>
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: 24,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              className="
                mt-7
                max-w-2xl
                text-lg
                leading-relaxed
                text-foreground-secondary
              "
            >
              Draw Nova combines elegant design systems,
              fluid collaboration, and intuitive visual
              workflows into one seamless creative workspace
              built for modern teams.
            </motion.p>

            <div className="mt-10 space-y-5">
              {[
                "Fluid realtime collaboration",
                "Minimal and distraction-free workspace",
                "Fast, scalable, and beautifully crafted UI",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    x: 8,
                  }}
                  className="
                    group
                    flex
                    items-center
                    gap-4
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-primary
                      to-accent
                      text-white
                      shadow-lg
                      transition-all
                      duration-300
                      group-hover:scale-110
                      group-hover:rotate-6
                    "
                  >
                    <Brush size={17} />
                  </div>

                  <p
                    className="
                      text-base
                      font-medium
                      text-foreground-secondary
                      transition-colors
                      duration-300
                      group-hover:text-foreground
                    "
                  >
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
              filter: "blur(18px)",
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
            className="relative"
          >
            <div
              className="
                absolute
                inset-0
                rounded-[40px]
                bg-primary/10
                blur-3xl
              "
            />

            <div
              className="
                relative
                overflow-hidden
                rounded-[34px]
                border
                border-border
                bg-surface/65
                p-7
                shadow-[0_30px_100px_rgba(0,0,0,0.12)]
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
                  pb-6
                "
              >
                <div>
                  <h3
                    className="
                      text-xl
                      font-semibold
                      tracking-tight
                    "
                  >
                    Draw Nova Workspace
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-foreground-muted
                    "
                  >
                    Elegant collaboration experience
                  </p>
                </div>

                <motion.div
                  whileHover={{
                    rotate: 8,
                    scale: 1.08,
                  }}
                  className="
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
                  <Globe size={19} />
                </motion.div>
              </div>

              <div className="mt-7 space-y-5">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -6,
                      scale: 1.015,
                    }}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-3xl
                      border
                      border-border
                      bg-background-secondary/60
                      p-6
                      transition-all
                      duration-300
                      hover:border-primary/20
                      hover:shadow-[0_18px_60px_rgba(91,92,240,0.14)]
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-primary/0
                        via-primary/5
                        to-accent/0
                        opacity-0
                        transition-opacity
                        duration-500
                        group-hover:opacity-100
                      "
                    />

                    <div className="relative flex gap-5">
                      <div
                        className="
                          flex
                          h-13
                          w-13
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-gradient-to-br
                          from-primary
                          to-accent
                          text-white
                          shadow-lg
                          transition-all
                          duration-300
                          group-hover:scale-110
                          group-hover:rotate-3
                        "
                      >
                        {card.icon}
                      </div>

                      <div>
                        <h4
                          className="
                            text-lg
                            font-semibold
                            tracking-tight
                          "
                        >
                          {card.title}
                        </h4>

                        <p
                          className="
                            mt-2
                            text-base
                            leading-relaxed
                            text-foreground-secondary
                          "
                        >
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}