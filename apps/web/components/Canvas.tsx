"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Tool } from "../types/ToolTypes";
import {
  Shape,
  RectangleShape,
  CircleShape,
  LineShape,
} from "../types/Shape";

interface CanvasProps {
  selectedTool: Tool;
}

export const Canvas = ({
  selectedTool,
}: CanvasProps) => {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const [shapes, setShapes] =
    useState<Shape[]>([]);

  const [isDrawing, setIsDrawing] =
    useState(false);

  const startX = useRef(0);
  const startY = useRef(0);

  const previewShape =
    useRef<Shape | null>(null);

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

      ctx.strokeStyle = isDark
        ? "#F8FAFC"
        : "#111827";

      ctx.lineWidth = 2;

      const drawShape = (
        shape: Shape
      ) => {
        switch (shape.type) {
          case "rectangle":
            ctx.strokeRect(
              shape.x,
              shape.y,
              shape.width,
              shape.height
            );
            break;

          case "circle":
            ctx.beginPath();

            ctx.arc(
              shape.x,
              shape.y,
              shape.radius,
              0,
              Math.PI * 2
            );

            ctx.stroke();
            break;

          case "line":
            ctx.beginPath();

            ctx.moveTo(
              shape.startX,
              shape.startY
            );

            ctx.lineTo(
              shape.endX,
              shape.endY
            );

            ctx.stroke();
            break;
        }
      };

      shapes.forEach(drawShape);

      if (previewShape.current) {
        ctx.strokeStyle =
          "#5B5CF0";

        drawShape(
          previewShape.current
        );
      }
    }, [shapes]);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width =
        window.innerWidth;

      canvas.height =
        window.innerHeight - 78;

      drawCanvas();
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () =>
      window.removeEventListener(
        "resize",
        resizeCanvas
      );
  }, [drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    if (
      selectedTool ===
      "select"
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

    switch (selectedTool) {
      case "rectangle": {
        const shape: RectangleShape =
          {
            id:
              crypto.randomUUID(),
            type:
              "rectangle",
            x: startX.current,
            y: startY.current,
            width:
              currentX -
              startX.current,
            height:
              currentY -
              startY.current,
          };

        previewShape.current =
          shape;

        break;
      }

      case "circle": {
        const radius =
          Math.sqrt(
            Math.pow(
              currentX -
                startX.current,
              2
            ) +
              Math.pow(
                currentY -
                  startY.current,
                2
              )
          );

        const shape: CircleShape =
          {
            id:
              crypto.randomUUID(),
            type: "circle",
            x: startX.current,
            y: startY.current,
            radius,
          };

        previewShape.current =
          shape;

        break;
      }

      case "line": {
        const shape: LineShape =
          {
            id:
              crypto.randomUUID(),
            type: "line",
            startX:
              startX.current,
            startY:
              startY.current,
            endX: currentX,
            endY: currentY,
          };

        previewShape.current =
          shape;

        break;
      }
    }

    drawCanvas();
  };

const handleMouseUp = () => {
  if (!isDrawing) {
    return;
  }

  const shape = previewShape.current;

  if (!shape) {
    setIsDrawing(false);
    return;
  }

  setShapes((prev) => [
    ...prev,
    shape,
  ]);

  previewShape.current = null;
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
      onMouseUp={
        handleMouseUp
      }
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