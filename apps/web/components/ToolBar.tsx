"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Type,
  Pencil,
  Eraser,
} from "lucide-react";

import { Tool } from "../types/ToolTypes";

interface ToolBarProps {
  selectedTool: Tool;
  setSelectedTool: React.Dispatch<
    React.SetStateAction<Tool>
  >;
}

const tools: {
  id: Tool;
  label: string;
  shortcut: string;
  icon: any;
}[] = [
  {
    id: "select",
    label: "Select",
    shortcut: "V",
    icon: MousePointer2,
  },
  {
    id: "rectangle",
    label: "Rectangle",
    shortcut: "R",
    icon: Square,
  },
  {
    id: "circle",
    label: "Circle",
    shortcut: "C",
    icon: Circle,
  },
  {
    id: "line",
    label: "Line",
    shortcut: "L",
    icon: Minus,
  },
  {
    id: "arrow",
    label: "Arrow",
    shortcut: "A",
    icon: ArrowRight,
  },
  {
    id: "text",
    label: "Text",
    shortcut: "T",
    icon: Type,
  },
  {
    id: "pencil",
    label: "Pencil",
    shortcut: "P",
    icon: Pencil,
  },
  {
    id: "eraser",
    label: "Eraser",
    shortcut: "E",
    icon: Eraser,
  },
];

export const ToolBar = ({
  selectedTool,
  setSelectedTool,
}: ToolBarProps) => {

  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      const target =
        e.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "v":
          setSelectedTool("select");
          break;

        case "r":
          setSelectedTool("rectangle");
          break;

        case "c":
          setSelectedTool("circle");
          break;

        case "l":
          setSelectedTool("line");
          break;

        case "a":
          setSelectedTool("arrow");
          break;

        case "t":
          setSelectedTool("text");
          break;

        case "p":
          setSelectedTool("pencil");
          break;

        case "e":
          setSelectedTool("eraser");
          break;
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  return (
    <div
      className="
       fixed
    left-5
    top-1/2
    z-50
    flex
    -translate-y-1/2
    flex-col
    items-center
    gap-1
    rounded-3xl
    border
    border-border/70
    bg-background/90
    p-2
    shadow-[0_20px_60px_rgba(0,0,0,0.35)]
    backdrop-blur-xl
      "
    >
      {tools.map((tool, index) => {
        const Icon = tool.icon;

        return (
          <div
            key={tool.id}
            className="flex items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              title={`${tool.label} (${tool.shortcut})`}
              onClick={() =>
                setSelectedTool(tool.id)
              }
              className={`
                relative
                flex
                h-11
                w-11
                cursor-pointer
                items-center
                justify-center
                rounded-2xl
                transition-all
                duration-300

                ${
                  selectedTool === tool.id
                    ? `
                      bg-primary
                      text-white
                      shadow-[0_10px_30px_rgba(91,92,240,0.35)]
                    `
                    : `
                      text-foreground-secondary
                      hover:bg-background-secondary
                      hover:text-foreground
                    `
                }
              `}
            >
              <Icon className="h-5 w-5" />
            </motion.button>

            {(index === 0 ||
              index === 4 ||
              index === 6) &&
              index !==
                tools.length - 1 && (
                <div
                  className="
                    mx-1
                    h-7
                    w-px
                    bg-border
                  "
                />
              )}
          </div>
        );
      })}
    </div>
  );
};