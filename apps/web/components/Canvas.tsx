"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Tool } from "../types/ToolTypes";
import {
  Shape,
  RectangleShape,
  CircleShape,
  LineShape,
  ArrowShape,
  PencilShape,
} from "../types/Shape";
import { Trash2 } from "lucide-react";
import { Button } from "./Button";

interface RemoteCursor {
  userId: string;
  x: number;
  y: number;
}

interface CanvasProps {
  selectedTool: Tool;
  shapes: Shape[];
  setShapes: (
    updater: Shape[] | ((prev: Shape[]) => Shape[]),
    zoom: number,
    offset: { x: number; y: number }
  ) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  offset: { x: number; y: number };
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  resetBoard: () => Promise<void>;
  cursors?: RemoteCursor[];
  sendCursor?: (x: number, y: number) => void;
  updateShape?: (
  shape: Shape,
  elements: Shape[]
) => void;
deleteShape?: (
  shapeId: string,
  elements: Shape[]
) => void;
addShape?: (
  elements: Shape[],
  zoom: number,
  offset: { x: number; y: number }
) => void;
}

export const Canvas = ({
  selectedTool,
  shapes,
  setShapes,
  zoom,
  setZoom,
  offset,
  setOffset,
  resetBoard,
    updateShape,
  deleteShape,
  addShape,
   cursors = [],
  sendCursor,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── interaction state (local – no need to persist) ──────────────────────────
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isDraggingShape, setIsDraggingShape] = useState(false);
  const movedShapeRef = useRef<Shape | null>(null);

  // ── refs mirror props so event-handlers never capture stale closures ─────────
  const zoomRef = useRef(zoom);
  const offsetRef = useRef(offset);
  const shapesRef = useRef(shapes);
  const selectedShapeIdRef = useRef(selectedShapeId);

  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { offsetRef.current = offset; }, [offset]);
  useEffect(() => { shapesRef.current = shapes; }, [shapes]);
  useEffect(() => { selectedShapeIdRef.current = selectedShapeId; }, [selectedShapeId]);

  // ── drawing helpers ──────────────────────────────────────────────────────────
  const startX = useRef(0);
  const startY = useRef(0);
  const dragOffset = useRef({ x: 0, y: 0 });
  const previewShape = useRef<Shape | null>(null);
  const currentPencil = useRef<PencilShape | null>(null);

  // ── convenience: call setShapes with current zoom/offset baked in ────────────
  // This saves us from repeating zoomRef.current / offsetRef.current everywhere.
  const syncedSetShapes = useCallback(
    (updater: Shape[] | ((prev: Shape[]) => Shape[])) => {
      setShapes(updater, zoomRef.current, offsetRef.current);
    },
    [setShapes]
  );

  // ── wheel zoom ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) =>
        e.deltaY < 0 ? Math.min(prev + 0.1, 5) : Math.max(prev - 0.1, 0.2)
      );
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [setZoom]);

  // ── coordinate helpers ───────────────────────────────────────────────────────
  const toWorld = (px: number, py: number) => ({
    x: (px - offsetRef.current.x) / zoomRef.current,
    y: (py - offsetRef.current.y) / zoomRef.current,
  });

  const distanceToLine = (
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number
  ) => {
    const A = px - x1, B = py - y1;
    const C = x2 - x1, D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = lenSq !== 0 ? dot / lenSq : -1;
    const xx = param < 0 ? x1 : param > 1 ? x2 : x1 + param * C;
    const yy = param < 0 ? y1 : param > 1 ? y2 : y1 + param * D;
    return Math.sqrt((px - xx) ** 2 + (py - yy) ** 2);
  };

  const findShapeAtPoint = (x: number, y: number): Shape | null => {
    for (let i = shapesRef.current.length - 1; i >= 0; i--) {
      const shape = shapesRef.current[i];
      if (!shape) continue;

      switch (shape.type) {
        case "rectangle":
          if (
            x >= shape.x && x <= shape.x + shape.width &&
            y >= shape.y && y <= shape.y + shape.height
          ) return shape;
          break;

        case "circle":
          if (Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2) <= shape.radius)
            return shape;
          break;

        case "line":
        case "arrow":
          if (distanceToLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY) < 8)
            return shape;
          break;

        case "text":
          if (x >= shape.x && x <= shape.x + 150 && y >= shape.y - 24 && y <= shape.y + 10)
            return shape;
          break;

        case "pencil":
          for (const point of shape.points) {
            if (Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2) < 8)
              return shape;
          }
          break;
      }
    }
    return null;
  };

  // ── render helpers ───────────────────────────────────────────────────────────
  const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    if (!shape) return;

    switch (shape.type) {
      case "text":
        ctx.font = "20px Inter";
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillText(shape.text, shape.x, shape.y);
        break;

      case "rectangle":
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;

      case "circle":
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case "line":
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        break;

      case "arrow": {
        const headLength = 12;
        const angle = Math.atan2(shape.endY - shape.startY, shape.endX - shape.startX);
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.lineTo(
          shape.endX - headLength * Math.cos(angle - Math.PI / 6),
          shape.endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(shape.endX, shape.endY);
        ctx.lineTo(
          shape.endX - headLength * Math.cos(angle + Math.PI / 6),
          shape.endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        break;
      }

      case "pencil": {
        if (shape.points.length < 2) return;
        const first = shape.points[0];
        if (!first) return;
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < shape.points.length; i++) {
          const point = shape.points[i];
          if (!point) continue;
          ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        break;
      }
    }
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetRef.current.x, offsetRef.current.y);
    ctx.scale(zoomRef.current, zoomRef.current);

    const isDark = document.documentElement.classList.contains("dark");
    ctx.strokeStyle = isDark ? "#F8FAFC" : "#111827";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    shapesRef.current.forEach((shape) => {
      if (!shape) return;
      drawShape(ctx, shape);

      if (shape.id === selectedShapeIdRef.current) {
        ctx.save();
        ctx.strokeStyle = "#5B5CF0";
        ctx.lineWidth = 2;
        if (shape.type === "rectangle") {
          ctx.strokeRect(shape.x - 4, shape.y - 4, shape.width + 8, shape.height + 8);
        }
        ctx.restore();
      }
    });

    if (previewShape.current) {
      ctx.save();
      ctx.strokeStyle = "#5B5CF0";
      drawShape(ctx, previewShape.current);
      ctx.restore();
    }

    if (currentPencil.current) {
      ctx.save();
      ctx.strokeStyle = "#5B5CF0";
      drawShape(ctx, currentPencil.current);
      ctx.restore();
    }

    ctx.restore();
    // intentionally uses refs — never goes stale
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // re-draw whenever any visual dependency changes (shapes come from props now)
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas, shapes, selectedShapeId, zoom, offset]);

  // dark-mode observer
  useEffect(() => {
    const observer = new MutationObserver(() => drawCanvas());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [drawCanvas]);

  // resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 78;
      drawCanvas();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [drawCanvas]);

  // ── mouse events ─────────────────────────────────────────────────────────────
  const getCanvasXY = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { px: e.clientX - rect.left, py: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { px, py } = getCanvasXY(e);
    const { x, y } = toWorld(px, py);

    // ── text ────────────────────────────────────────────────────────────────────
if (selectedTool === "text") {
  const text = prompt("Enter text");

  if (!text) return;

  const textShape = {
    id: crypto.randomUUID(),
    type: "text" as const,
    x,
    y,
    text,
  };

  const nextShapes = [
    ...shapesRef.current,
    textShape,
  ];

  setShapes(
    nextShapes,
    zoomRef.current,
    offsetRef.current
  );

  addShape?.(
    nextShapes,
    zoomRef.current,
    offsetRef.current
  );

  return;
}

    // ── eraser ──────────────────────────────────────────────────────────────────
if (selectedTool === "eraser") {
  const clickedShape = findShapeAtPoint(x, y);

  if (!clickedShape) return;

  const nextShapes = shapesRef.current.filter(
    (s) => s.id !== clickedShape.id
  );

  setShapes(
    nextShapes,
    zoomRef.current,
    offsetRef.current
  );

  deleteShape?.(
    clickedShape.id,
    nextShapes
  );

  return;
}

    // ── select ──────────────────────────────────────────────────────────────────
    if (selectedTool === "select") {
      const clickedShape = findShapeAtPoint(x, y);

      if (clickedShape) {
        setSelectedShapeId(clickedShape.id);

        if (clickedShape.type === "line" || clickedShape.type === "arrow") {
          dragOffset.current = { x: x - clickedShape.startX, y: y - clickedShape.startY };
        } else if (clickedShape.type === "pencil") {
          const first = clickedShape.points[0];
          if (first) dragOffset.current = { x: x - first.x, y: y - first.y };
        } else if ("x" in clickedShape && "y" in clickedShape) {
          dragOffset.current = { x: x - (clickedShape as { x: number; y: number }).x, y: y - (clickedShape as { x: number; y: number }).y };
        }

        setIsDraggingShape(true);
      } else {
        setSelectedShapeId(null);
        setIsPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY };
      }
      return;
    }

    // ── drawing tools ────────────────────────────────────────────────────────────
    startX.current = x;
    startY.current = y;

    if (selectedTool === "pencil") {
      currentPencil.current = {
        id: crypto.randomUUID(),
        type: "pencil",
        points: [{ x, y }],
      };
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { px, py } = getCanvasXY(e);

    // ── panning ──────────────────────────────────────────────────────────────────
    if (isPanning) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      panStart.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!isDrawing && !isDraggingShape) return;

    const { x: currentX, y: currentY } = toWorld(px, py);

    // ── dragging a shape ─────────────────────────────────────────────────────────
    // NOTE: drag fires on every mousemove — we only persist to DB on mouseUp
    // to avoid hammering the debounce. We call the raw prop setShapes here
    // so intermediate drag positions don't each queue a DB save.
    // The final position is committed in handleMouseUp via syncedSetShapes.
  if (
  selectedTool === "select" &&
  isDraggingShape &&
  selectedShapeIdRef.current
) {
  setShapes(
    (prev) =>
      prev.map((shape) => {
        if (shape.id !== selectedShapeIdRef.current) {
          return shape;
        }

        switch (shape.type) {
          case "rectangle":
          case "circle":
          case "text": {
            const updated = {
              ...shape,
              x: currentX - dragOffset.current.x,
              y: currentY - dragOffset.current.y,
            };

            movedShapeRef.current = updated;

            return updated;
          }

          case "line":
          case "arrow": {
            const updated = {
              ...shape,
              startX:
                currentX - dragOffset.current.x,
              startY:
                currentY - dragOffset.current.y,
              endX:
                currentX -
                dragOffset.current.x +
                (shape.endX - shape.startX),
              endY:
                currentY -
                dragOffset.current.y +
                (shape.endY - shape.startY),
            };

            movedShapeRef.current = updated;

            return updated;
          }

          case "pencil": {
            const first = shape.points[0];

            if (!first) {
              return shape;
            }

            const dx =
              currentX -
              dragOffset.current.x -
              first.x;

            const dy =
              currentY -
              dragOffset.current.y -
              first.y;

            const updated = {
              ...shape,
              points: shape.points.map((p) => ({
                x: p.x + dx,
                y: p.y + dy,
              })),
            };

            movedShapeRef.current = updated;

            return updated;
          }

          default:
            return shape;
        }
      }),
    zoomRef.current,
    offsetRef.current
  );

  return;
}

    // ── pencil live drawing ──────────────────────────────────────────────────────
    if (selectedTool === "pencil" && currentPencil.current) {
      currentPencil.current.points.push({ x: currentX, y: currentY });
      drawCanvas();
      return;
    }

    // ── shape preview (not committed yet, just visual) ───────────────────────────
    switch (selectedTool) {
      case "rectangle":
        previewShape.current = {
          id: crypto.randomUUID(),
          type: "rectangle",
          x: startX.current,
          y: startY.current,
          width: currentX - startX.current,
          height: currentY - startY.current,
        } satisfies RectangleShape;
        break;

      case "circle": {
        const radius = Math.sqrt(
          (currentX - startX.current) ** 2 + (currentY - startY.current) ** 2
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
          startX: startX.current,
          startY: startY.current,
          endX: currentX,
          endY: currentY,
        } satisfies LineShape;
        break;

      case "arrow":
        previewShape.current = {
          id: crypto.randomUUID(),
          type: "arrow",
          startX: startX.current,
          startY: startY.current,
          endX: currentX,
          endY: currentY,
        } satisfies ArrowShape;
        break;
    }

    drawCanvas();
  };

  const handleMouseUp = () => {
    if (
  selectedTool === "select" &&
  movedShapeRef.current
) {
  updateShape?.(
    movedShapeRef.current,
    shapesRef.current
  );

  movedShapeRef.current = null;
}
    setIsPanning(false);
    setIsDraggingShape(false);

if (isDrawing) {
  if (selectedTool === "pencil") {
    const pencil = currentPencil.current;

    if (pencil && pencil.points.length >= 2) {
      const nextShapes = [
        ...shapesRef.current,
        pencil,
      ];

      setShapes(
        nextShapes,
        zoomRef.current,
        offsetRef.current
      );

      addShape?.(
        nextShapes,
        zoomRef.current,
        offsetRef.current
      );
    }

    currentPencil.current = null;
  } else {
    const shape = previewShape.current;

    if (shape) {
      const nextShapes = [
        ...shapesRef.current,
        shape,
      ];

      setShapes(
        nextShapes,
        zoomRef.current,
        offsetRef.current
      );

      addShape?.(
        nextShapes,
        zoomRef.current,
        offsetRef.current
      );
    }

    previewShape.current = null;
  }

  setIsDrawing(false);
}
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="fixed left-0 right-0 bottom-0 top-[78px] z-0 cursor-crosshair bg-transparent"
      />

      {/* Zoom controls — call prop setZoom directly, no sync needed for zoom UI */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-background/90 backdrop-blur-xl">
        <button
          onClick={() => setZoom((prev) => Math.min(prev + 0.1, 5))}
          className="h-12 cursor-pointer w-12 text-xl hover:bg-background-secondary"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.2))}
          className="h-12 cursor-pointer w-12 border-t border-border text-xl hover:bg-background-secondary"
        >
          −
        </button>
      </div>

      <div className="fixed top-[94px] right-6 z-50 rounded-2xl border border-border bg-background/90 backdrop-blur-xl">
  <Button
    onClick={async () => {
      if (!confirm("Reset board? This will delete all shapes permanently.")) return;
      await resetBoard();
    }}
    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-background/80 backdrop-blur-md text-xs font-medium text-muted-foreground hover:text-red-400 hover:border-red-400/40 hover:bg-red-500/10 transition-all duration-200"
  >
    <Trash2 size={13} strokeWidth={2.2} />
    Reset
  </Button>
</div>
    </div>
  );
};
