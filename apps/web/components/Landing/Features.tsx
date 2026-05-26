"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Brush,
  Clock3,
  Layers3,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  Users2,
  Zap,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Users2 size={22} />,
      title: "Realtime Collaboration",
      description:
        "Collaborate instantly with live cursors, synced updates, and multiplayer workflows built for modern teams.",
    },
    {
      icon: <Brush size={22} />,
      title: "Smooth Drawing Experience",
      description:
        "Fluid interactions and elegant drawing tools crafted for creative thinking and visual ideation.",
    },
    {
      icon: <Layers3 size={22} />,
      title: "Infinite Workspace",
      description:
        "Expand ideas freely with a limitless canvas designed for brainstorming, planning, and execution.",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Secure Collaboration",
      description:
        "Built with scalable architecture and secure realtime systems for teams and organizations.",
    },
    {
      icon: <Clock3 size={22} />,
      title: "Instant Sync",
      description:
        "Every action updates in realtime across devices with ultra-fast synchronization performance.",
    },
    {
      icon: <Zap size={22} />,
      title: "Modern Workflow",
      description:
        "A refined collaboration experience combining speed, simplicity, and elegant interface systems.",
    },
  ];

  return (
    <section
      id="features"
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
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[-10%]
            top-[20%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-primary/10
            blur-3xl
          "
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            right-[-10%]
            top-[10%]
            h-[480px]
            w-[480px]
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
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
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
          className="mx-auto max-w-3xl text-center"
        >
          <div
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
              Powerful tools for modern collaboration
            </span>
          </div>

          <h2
            className="
              text-[2.8rem]
              font-bold
              leading-[1.05]
              tracking-[-0.05em]
              sm:text-5xl
            "
          >
            Everything you need to
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
              create together
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-lg
              leading-relaxed
              text-foreground-secondary
            "
          >
            Draw Nova combines elegant collaboration,
            realtime systems, and fluid design experiences
            into one powerful visual workspace.
          </p>
        </motion.div>

 <div
  className="
    mt-20
    grid
    gap-5
    md:grid-cols-2
    xl:grid-cols-3
  "
>
  {features.map((feature, index) => (
    <motion.div
      key={feature.title}
      initial={{
        opacity: 0,
        y: 30,
        filter: "blur(10px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-border
        bg-surface/65
        p-6
        shadow-[0_18px_70px_rgba(0,0,0,0.08)]
        backdrop-blur-3xl
        transition-all
        duration-500
        hover:border-primary/20
        hover:shadow-[0_22px_80px_rgba(91,92,240,0.14)]
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-primary/0
          via-primary/5
          to-accent/0
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      <motion.div
        whileHover={{
          rotate: 6,
          scale: 1.06,
        }}
        className="
          relative
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
        {feature.icon}
      </motion.div>

      <div className="relative mt-6">
        <div className="flex items-start justify-between gap-4">
          <h3
            className="
              text-lg
              font-semibold
              tracking-tight
            "
          >
            {feature.title}
          </h3>

          <motion.div
            whileHover={{
              x: 4,
              y: -4,
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-border
              bg-background-secondary/70
              text-foreground-secondary
              transition-all
              duration-300
              group-hover:border-primary/20
              group-hover:text-primary
            "
          >
            <ArrowUpRight size={16} />
          </motion.div>
        </div>

        <p
          className="
            mt-3
            text-[15px]
            leading-relaxed
            text-foreground-secondary
          "
        >
          {feature.description}
        </p>
      </div>

      <div
        className="
          relative
          mt-7
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-border
            bg-background-secondary/60
            px-3
            py-1.5
            text-[11px]
            font-medium
            text-foreground-muted
          "
        >
          <MousePointer2 size={12} />

          <span>Realtime</span>
        </div>

        <div
          className="
            h-2
            flex-1
            overflow-hidden
            rounded-full
            bg-background-secondary
          "
        >
          <motion.div
            initial={{
              width: "0%",
            }}
            whileInView={{
              width: "92%",
            }}
            transition={{
              duration: 1.4,
              delay: 0.3,
            }}
            viewport={{ once: true }}
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-primary
              to-accent
            "
          />
        </div>
      </div>
    </motion.div>
  ))}
</div>
      </div>
    </section>
  );
}