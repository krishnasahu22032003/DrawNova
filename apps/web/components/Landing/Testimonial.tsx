"use client";

import { motion } from "framer-motion";
import {
    Quote,
    Sparkles,
    Star,
} from "lucide-react";

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Product Designer",
            company: "Nova Labs",
            review:
                "Draw Nova completely transformed the way our design team collaborates. The realtime experience feels incredibly smooth and premium.",
        },
        {
            name: "James Walker",
            role: "Frontend Engineer",
            company: "Pixel Studio",
            review:
                "The interface feels beautifully crafted. Every interaction is polished, fluid, and thoughtfully designed for modern workflows.",
        },
        {
            name: "Aarav Mehta",
            role: "Startup Founder",
            company: "VisionFlow",
            review:
                "We brainstorm ideas daily using Draw Nova. It genuinely feels like a next-generation collaboration platform.",
        },
        {
            name: "Emily Carter",
            role: "Creative Director",
            company: "Luma Studio",
            review:
                "The collaboration experience feels unbelievably polished. Draw Nova made brainstorming sessions faster, smoother, and far more engaging for our team.",
        },
        {
            name: "Daniel Kim",
            role: "UI Engineer",
            company: "Flowstack",
            review:
                "One of the cleanest collaborative tools I’ve used. The realtime syncing, fluid interactions, and elegant interface genuinely feel next-generation.",
        },
        {
            name: "Sophia Martinez",
            role: "Product Manager",
            company: "BrightLayer",
            review:
                "Draw Nova helped our remote team visualize ideas effortlessly. Everything from the animations to the workspace design feels premium and intentional.",
        },
    ];

    return (
        <section
            id="testimonials"
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
                        x: [0, 50, 0],
                        y: [0, -40, 0],
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
            top-[20%]
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
                            Trusted by creators and modern teams
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
                        Loved by teams building
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
                            extraordinary ideas
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
                        Thousands of creators, designers, and teams use
                        Draw Nova to collaborate visually and bring ideas
                        to life faster.
                    </p>
                </motion.div>

                <div
                    className="
            mt-20
            grid
            gap-5
            lg:grid-cols-3
          "
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
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
                                duration: 0.8,
                                delay: index * 0.1,
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
                rounded-[30px]
                border
                border-border
                bg-surface/65
                p-6
                shadow-[0_20px_80px_rgba(0,0,0,0.08)]
                backdrop-blur-3xl
                transition-all
                duration-500
                hover:border-primary/20
                hover:shadow-[0_25px_100px_rgba(91,92,240,0.14)]
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

                            <div className="relative flex items-center justify-between">
                                <div
                                    className="
                    flex
                    items-center
                    gap-1
                  "
                                >
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={14}
                                            className="
                        fill-yellow-400
                        text-yellow-400
                      "
                                        />
                                    ))}
                                </div>

                                <motion.div
                                    whileHover={{
                                        rotate: 8,
                                        scale: 1.08,
                                    }}
                                    className="
                    flex
                    h-10
                    w-10
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
                                    <Quote size={18} />
                                </motion.div>
                            </div>

                            <p
                                className="
                  relative
                  mt-6
                  text-[15px]
                  leading-relaxed
                  text-foreground-secondary
                "
                            >
                                “{testimonial.review}”
                            </p>

                            <div
                                className="
                  relative
                  mt-8
                  flex
                  items-center
                  gap-4
                "
                            >
                                <div
                                    className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-primary
                    to-accent
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                  "
                                >
                                    {testimonial.name
                                        .split(" ")
                                        .map((word) => word[0])
                                        .join("")}
                                </div>

                                <div>
                                    <h4
                                        className="
                      text-base
                      font-semibold
                      tracking-tight
                    "
                                    >
                                        {testimonial.name}
                                    </h4>

                                    <p
                                        className="
                      mt-1
                      text-sm
                      text-foreground-muted
                    "
                                    >
                                        {testimonial.role} ·{" "}
                                        {testimonial.company}
                                    </p>
                                </div>
                            </div>

                            <motion.div
                                initial={{
                                    width: "0%",
                                }}
                                whileInView={{
                                    width: "100%",
                                }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.2,
                                }}
                                viewport={{ once: true }}
                                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  bg-gradient-to-r
                  from-primary
                  to-accent
                "
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}