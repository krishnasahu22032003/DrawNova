"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Tool } from "../types/ToolTypes";

interface CanvasProps {
  selectedTool: Tool;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const Canvas = ({
  selectedTool,
}: CanvasProps) => {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [shapes, setShapes] =
    useState<Rectangle[]>([]);

  const [isDrawing, setIsDrawing] =
    useState(false);

  const startX = useRef(0);
  const startY = useRef(0);

  const currentRect =
    useRef<Rectangle | null>(null);

  const drawCanvas =
    useCallback(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) return;

      const ctx =
        canvas.getContext("2d");

      if (!ctx) return;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const isDark =
        document.documentElement.classList.contains(
          "dark"
        );

      const strokeColor = isDark
        ? "#F8FAFC"
        : "#111827";

      shapes.forEach((shape) => {
        ctx.strokeStyle =
          strokeColor;

        ctx.lineWidth = 2;

        ctx.strokeRect(
          shape.x,
          shape.y,
          shape.width,
          shape.height
        );
      });

      if (currentRect.current) {
        ctx.strokeStyle =
          "#5B5CF0";

        ctx.lineWidth = 2;

        ctx.strokeRect(
          currentRect.current.x,
          currentRect.current.y,
          currentRect.current.width,
          currentRect.current.height
        );
      }
    }, [shapes]);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const resizeCanvas = () => {
      const headerHeight = 78;

      canvas.width =
        window.innerWidth;

      canvas.height =
        window.innerHeight -
        headerHeight;

      drawCanvas();
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, [drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    const observer =
      new MutationObserver(() => {
        drawCanvas();
      });

    observer.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["class"],
      }
    );

    return () =>
      observer.disconnect();
  }, [drawCanvas]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (
      selectedTool !==
      "rectangle"
    )
      return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    startX.current =
      e.clientX - rect.left;

    startY.current =
      e.clientY - rect.top;

    setIsDrawing(true);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    const currentX =
      e.clientX - rect.left;

    const currentY =
      e.clientY - rect.top;

    currentRect.current = {
      x: startX.current,
      y: startY.current,
      width:
        currentX -
        startX.current,
      height:
        currentY -
        startY.current,
    };

    drawCanvas();
  };

 const handleMouseUp = () => {
  if (!isDrawing) return;

  const rect = currentRect.current;

  if (!rect) {
    setIsDrawing(false);
    return;
  }

  setShapes((prev) => [...prev, rect]);

  currentRect.current = null;
  setIsDrawing(false);
};

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={
        handleMouseDown
      }
      onMouseMove={
        handleMouseMove
      }
      onMouseUp={handleMouseUp}
      className="
        fixed
        left-0
        right-0
        bottom-0
        top-[78px]
        z-0
        cursor-crosshair
        bg-transparent
      "
    />
  );
};