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
  ArrowShape,
  PencilShape,
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

  const currentPencil =
    useRef<PencilShape | null>(null);

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    shape: Shape
  ) => {
      if (!shape) return;
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

      case "arrow": {
        const headLength = 12;

        const angle = Math.atan2(
          shape.endY - shape.startY,
          shape.endX - shape.startX
        );

        ctx.beginPath();

        ctx.moveTo(
          shape.startX,
          shape.startY
        );

        ctx.lineTo(
          shape.endX,
          shape.endY
        );

        ctx.lineTo(
          shape.endX -
            headLength *
              Math.cos(
                angle - Math.PI / 6
              ),
          shape.endY -
            headLength *
              Math.sin(
                angle - Math.PI / 6
              )
        );

        ctx.moveTo(
          shape.endX,
          shape.endY
        );

        ctx.lineTo(
          shape.endX -
            headLength *
              Math.cos(
                angle + Math.PI / 6
              ),
          shape.endY -
            headLength *
              Math.sin(
                angle + Math.PI / 6
              )
        );

        ctx.stroke();
        break;
      }

      case "pencil": {
        if (
          shape.points.length < 2
        )
          return;

        const firstPoint =
          shape.points[0];

        if (!firstPoint) return;

        ctx.beginPath();

        ctx.moveTo(
          firstPoint.x,
          firstPoint.y
        );

        for (
          let i = 1;
          i < shape.points.length;
          i++
        ) {
          const point =
            shape.points[i];

          if (!point)
            continue;

          ctx.lineTo(
            point.x,
            point.y
          );
        }

        ctx.stroke();
        break;
      }
    }
  };

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

      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      shapes.forEach((shape) =>{     
        if (!shape) return;
        drawShape(ctx, shape)}
      );

      if (previewShape.current) {
        ctx.strokeStyle =
          "#5B5CF0";

        drawShape(
          ctx,
          previewShape.current
        );
      }

      if (currentPencil.current) {
        ctx.strokeStyle =
          "#5B5CF0";

        drawShape(
          ctx,
          currentPencil.current
        );
      }
    }, [shapes]);

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
      selectedTool === "select"
    )
      return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    startX.current =
      e.clientX - rect.left;

    startY.current =
      e.clientY - rect.top;

    if (
      selectedTool === "pencil"
    ) {
      currentPencil.current = {
        id: crypto.randomUUID(),
        type: "pencil",
        points: [
          {
            x: startX.current,
            y: startY.current,
          },
        ],
      };
    }

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

    if (
      selectedTool ===
        "pencil" &&
      currentPencil.current
    ) {
      currentPencil.current.points.push(
        {
          x: currentX,
          y: currentY,
        }
      );

      drawCanvas();

      return;
    }

    switch (selectedTool) {
      case "rectangle":
        previewShape.current = {
          id: crypto.randomUUID(),
          type: "rectangle",
          x: startX.current,
          y: startY.current,
          width:
            currentX -
            startX.current,
          height:
            currentY -
            startY.current,
        } satisfies RectangleShape;
        break;

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

        previewShape.current = {
          id: crypto.randomUUID(),
          type: "circle",
          x: startX.current,
          y: startY.current,
          radius,
        } satisfies CircleShape;

        break;
      }

      case "line":
        previewShape.current = {
          id: crypto.randomUUID(),
          type: "line",
          startX:
            startX.current,
          startY:
            startY.current,
          endX: currentX,
          endY: currentY,
        } satisfies LineShape;
        break;

      case "arrow":
        previewShape.current = {
          id: crypto.randomUUID(),
          type: "arrow",
          startX:
            startX.current,
          startY:
            startY.current,
          endX: currentX,
          endY: currentY,
        } satisfies ArrowShape;
        break;
    }

    drawCanvas();
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

  if (selectedTool === "pencil") {
  const pencil =
    currentPencil.current;

  if (pencil) {
    setShapes((prev) => [
      ...prev,
      pencil,
    ]);
  }

  currentPencil.current = null;

  setIsDrawing(false);

  return;
}

    const shape =
      previewShape.current;

    if (!shape) {
      setIsDrawing(false);
      return;
    }
    
setShapes((prev) => [
  ...prev,
  shape,
]);

    previewShape.current =
      null;

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
      onMouseLeave={handleMouseUp}
      onMouseOut={handleMouseUp}
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