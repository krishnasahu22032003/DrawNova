"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../Button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
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
            bottom-[-10%]
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
            opacity-[0.03]
            [background-image:linear-gradient(rgba(120,120,120,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.14)_1px,transparent_1px)]
            [background-size:72px_72px]
          "
        />
      </div>

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
        className="
          relative
          mx-auto
          max-w-5xl
        "
      >
        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[38px]
            border
            border-border
            bg-surface/70
            px-8
            py-14
            shadow-[0_30px_120px_rgba(0,0,0,0.12)]
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
              opacity-80
            "
          />

          <div
            className="
              absolute
              inset-0
              opacity-0
              transition-opacity
              duration-700
              group-hover:opacity-100
            "
          >
            <div
              className="
                absolute
                left-[-20%]
                top-0
                h-full
                w-[40%]
                rotate-12
                bg-white/5
                blur-3xl
              "
            />
          </div>

          <div
            className="
              relative
              mx-auto
              max-w-3xl
              text-center
            "
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
                bg-background-secondary/70
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
                Start collaborating visually today
              </span>
            </motion.div>

            <motion.h2
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
                duration: 0.9,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              className="
                text-[2.6rem]
                font-bold
                leading-[1.05]
                tracking-[-0.05em]
                sm:text-[3.4rem]
              "
            >
              Build your next idea with
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
                Draw Nova
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
                mx-auto
                mt-6
                max-w-2xl
                text-base
                leading-relaxed
                text-foreground-secondary
                sm:text-lg
              "
            >
              Collaborate in realtime, brainstorm visually,
              and turn ideas into interactive experiences
              with a beautifully crafted modern workspace.
            </motion.p>

            <motion.div
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
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              className="
                mt-11
                flex
                justify-center
              "
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
          </div>
        </div>
      </motion.div>
    </section>
  );
}