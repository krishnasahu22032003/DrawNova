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
  const [selectedShapeId, setSelectedShapeId] =
  useState<string | null>(null);
const [isDraggingShape, setIsDraggingShape] =
  useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const dragOffset =
  useRef({
    x: 0,
    y: 0,
  });

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

        case "text":
  ctx.font =
    "20px Inter";

  ctx.fillStyle =
    ctx.strokeStyle;

  ctx.fillText(
    shape.text,
    shape.x,
    shape.y
  );

  break;

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
        drawShape(ctx, shape)
     
        if (
    shape.id ===
    selectedShapeId
  ) {
    ctx.save();

    ctx.strokeStyle =
      "#5B5CF0";

    ctx.lineWidth = 2;

    if (
      shape.type ===
      "rectangle"
    ) {
      ctx.strokeRect(
        shape.x - 4,
        shape.y - 4,
        shape.width + 8,
        shape.height + 8
      );
    }

    ctx.restore();
  }
    }    
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

       
    }, [shapes, selectedShapeId,]);

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

const distanceToLine = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const A = px - x1;
  const B = py - y1;

  const C = x2 - x1;
  const D = y2 - y1;

  const dot =
    A * C + B * D;

  const lenSq =
    C * C + D * D;

  const param =
    lenSq !== 0
      ? dot / lenSq
      : -1;

  let xx;
  let yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx =
      x1 + param * C;
    yy =
      y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  return Math.sqrt(
    dx * dx + dy * dy
  );
};

  const findShapeAtPoint = (
  x: number,
  y: number
): Shape | null => {
  for (
    let i = shapes.length - 1;
    i >= 0;
    i--
  ) {
    const shape = shapes[i];

    if (!shape) continue;

    switch (shape.type) {
      case "rectangle":
        if (
          x >= shape.x &&
          x <= shape.x + shape.width &&
          y >= shape.y &&
          y <= shape.y + shape.height
        ) {
          return shape;
        }
        break;

      case "circle":
        const distance =
          Math.sqrt(
            (x - shape.x) ** 2 +
            (y - shape.y) ** 2
          );

        if (
          distance <= shape.radius
        ) {
          return shape;
        }

        break;

        case "line": {
  const distance =
    distanceToLine(
      x,
      y,
      shape.startX,
      shape.startY,
      shape.endX,
      shape.endY
    );

  if (distance < 8)
    return shape;

  break;
}

case "arrow": {
  const distance =
    distanceToLine(
      x,
      y,
      shape.startX,
      shape.startY,
      shape.endX,
      shape.endY
    );

  if (distance < 8)
    return shape;

  break;
}

case "text":
  if (
    x >= shape.x &&
    x <= shape.x + 150 &&
    y >= shape.y - 24 &&
    y <= shape.y + 10
  ) {
    return shape;
  }
  break;

  case "pencil":
  for (
    const point of shape.points
  ) {
    const distance =
      Math.sqrt(
        (x - point.x) ** 2 +
        (y - point.y) ** 2
      );

    if (distance < 8)
      return shape;
  }
  break;
    }
  }

  return null;
};

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {

    if (
  selectedTool === "text"
) {
  const rect =
    e.currentTarget.getBoundingClientRect();

  const x =
    e.clientX - rect.left;

  const y =
    e.clientY - rect.top;

  const text =
    prompt(
      "Enter text"
    );

  if (!text) return;

  setShapes((prev) => [
    ...prev,
    {
      id:
        crypto.randomUUID(),
      type: "text",
      x,
      y,
      text,
    },
  ]);

  return;
}

if (
  selectedTool ===
  "eraser"
) {
  const rect =
    e.currentTarget.getBoundingClientRect();

  const x =
    e.clientX - rect.left;

  const y =
    e.clientY - rect.top;

  const shape =
    findShapeAtPoint(
      x,
      y
    );

  if (shape) {
    setShapes((prev) =>
      prev.filter(
        (s) =>
          s.id !== shape.id
      )
    );
  }

  return;
}

if (
  selectedTool === "select"
) {
  const rect =
    e.currentTarget.getBoundingClientRect();

  const x =
    e.clientX - rect.left;

  const y =
    e.clientY - rect.top;

  const clickedShape =
    findShapeAtPoint(
      x,
      y
    );

if (clickedShape) {

  setSelectedShapeId(
    clickedShape.id
  );

  if (
  "x" in clickedShape &&
  "y" in clickedShape
) {
  dragOffset.current = {
    x:
      x -
      clickedShape.x,
    y:
      y -
      clickedShape.y,
  };
}

if (
  clickedShape.type ===
  "line" ||
  clickedShape.type ===
  "arrow"
) {
  dragOffset.current = {
    x:
      x -
      clickedShape.startX,
    y:
      y -
      clickedShape.startY,
  };
}

if (
  clickedShape.type ===
  "line" ||
  clickedShape.type ===
  "arrow"
) {
  dragOffset.current = {
    x:
      x -
      clickedShape.startX,
    y:
      y -
      clickedShape.startY,
  };
}

if (
  clickedShape.type ===
  "pencil"
) {
  const first =
    clickedShape.points[0];

  if (first) {
    dragOffset.current = {
      x:
        x - first.x,
      y:
        y - first.y,
    };
  }
}

  setIsDraggingShape(true);
}

  return;
}

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
    if (
  !isDrawing &&
  !isDraggingShape
)
  return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    const currentX =
      e.clientX - rect.left;

    const currentY =
      e.clientY - rect.top;

if (
  selectedTool ===
    "select" &&
  isDraggingShape &&
  selectedShapeId
) {
  setShapes((prev) =>
    prev.map((shape) => {
      if (
        shape.id !==
        selectedShapeId
      )
        return shape;

      switch (shape.type) {
    case "rectangle":
  return {
    ...shape,
    x:
      currentX -
      dragOffset.current.x,
    y:
      currentY -
      dragOffset.current.y,
  };

case "circle":
  return {
    ...shape,
    x:
      currentX -
      dragOffset.current.x,
    y:
      currentY -
      dragOffset.current.y,
  };

  case "line":
  return {
    ...shape,
    startX:
      currentX -
      dragOffset.current.x,
    startY:
      currentY -
      dragOffset.current.y,
    endX:
      currentX -
      dragOffset.current.x +
      (shape.endX -
        shape.startX),
    endY:
      currentY -
      dragOffset.current.y +
      (shape.endY -
        shape.startY),
  };

  case "arrow":
  return {
    ...shape,
    startX:
      currentX -
      dragOffset.current.x,
    startY:
      currentY -
      dragOffset.current.y,
    endX:
      currentX -
      dragOffset.current.x +
      (shape.endX -
        shape.startX),
    endY:
      currentY -
      dragOffset.current.y +
      (shape.endY -
        shape.startY),
  };

  case "text":
  return {
    ...shape,
    x:
      currentX -
      dragOffset.current.x,
    y:
      currentY -
      dragOffset.current.y,
  };

  case "pencil": {
  const first =
    shape.points[0];

  if (!first)
    return shape;

  const dx =
    currentX -
    dragOffset.current.x -
    first.x;

  const dy =
    currentY -
    dragOffset.current.y -
    first.y;

  return {
    ...shape,
    points:
      shape.points.map(
        (point) => ({
          x:
            point.x + dx,
          y:
            point.y + dy,
        })
      ),
  };
}

        default:
          return shape;
      }
    })

    
  );

  return;
}

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
    setIsDraggingShape(false);
   if (
  !isDrawing &&
  !isDraggingShape
)
  return;

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