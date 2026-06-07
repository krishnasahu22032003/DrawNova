import { useCallback, useEffect, useRef, useState } from "react";
import { fetchUserBoard , saveUserBoard , resetUserBoard} from "../lib/boardApi";
import { Shape } from "../types/Shape";

const LS_KEY = "board_draft"; // localStorage key
const DEBOUNCE_MS = 2000;      // 2 seconds after last change → save to DB

interface SyncState {
  status: "idle" | "loading" | "saving" | "saved" | "error";
  lastSaved: Date | null;
}

export function useBoardSync() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [syncState, setSyncState] = useState<SyncState>({
    status: "loading",
    lastSaved: null,
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardLoadedRef = useRef(false);

  // ---- 1. On mount: load from API, fall back to localStorage ----
  useEffect(() => {
    async function loadBoard() {
      setSyncState({ status: "loading", lastSaved: null });

      try {
        const board = await fetchUserBoard();

        // API returned a board with elements
        if (board.elements && board.elements.length > 0) {
          setShapes(board.elements as Shape[]);
          if (board.appState) {
            setZoom(board.appState.zoom ?? 1);
            setOffset({
              x: board.appState.scrollX ?? 0,
              y: board.appState.scrollY ?? 0,
            });
          }
          // Sync localStorage with server truth
          localStorage.setItem(LS_KEY, JSON.stringify(board.elements));
        } else {
          // API board is empty — check localStorage for unsaved draft
          const draft = localStorage.getItem(LS_KEY);
          if (draft) {
            const parsed = JSON.parse(draft) as Shape[];
            if (parsed.length > 0) {
              setShapes(parsed);
              // Immediately push the draft to DB so it's not lost
              await saveUserBoard(parsed, {
                zoom: 1, scrollX: 0, scrollY: 0, theme: "dark",
              });
            }
          }
        }

        setSyncState({ status: "idle", lastSaved: new Date() });
      } catch (err) {
        console.error("Board load failed, falling back to localStorage", err);

        // Offline fallback
        const draft = localStorage.getItem(LS_KEY);
        if (draft) {
          setShapes(JSON.parse(draft) as Shape[]);
        }
        setSyncState({ status: "error", lastSaved: null });
      }

      boardLoadedRef.current = true;
    }

    loadBoard();
  }, []);

  const persistShapes = useCallback(
  (newShapes: Shape[], currentZoom: number, currentOffset: { x: number; y: number }) => {
    if (!boardLoadedRef.current) {
      return;
    }

   
    localStorage.setItem(LS_KEY, JSON.stringify(newShapes));

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSyncState((prev) => ({ ...prev, status: "saving" }));

    debounceTimer.current = setTimeout(async () => {
   
      try {
        const result = await saveUserBoard(newShapes, {
          zoom: currentZoom,
          scrollX: currentOffset.x,
          scrollY: currentOffset.y,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
        });
   
        setSyncState({ status: "saved", lastSaved: new Date() });
        setTimeout(() => {
          setSyncState((prev) =>
            prev.status === "saved" ? { ...prev, status: "idle" } : prev
          );
        }, 2000);
      } catch (err) {
        console.error("❌ DB save failed:", err);
        setSyncState((prev) => ({ ...prev, status: "error" }));
      }
    }, DEBOUNCE_MS);
  },
  []
);

  // Wrapped setShapes that also triggers sync
  const updateShapes = useCallback(
    (updater: Shape[] | ((prev: Shape[]) => Shape[]), currentZoom: number, currentOffset: { x: number; y: number }) => {
      setShapes((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        persistShapes(next, currentZoom, currentOffset);
        return next;
      });
    },
    [persistShapes]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const resetBoard = useCallback(async () => {
    setSyncState({ status: "saving", lastSaved: null });
    try {
        await resetUserBoard();
        setShapes([]);
        localStorage.removeItem(LS_KEY);
        setSyncState({ status: "saved", lastSaved: new Date() });
        setTimeout(() => {
            setSyncState((prev) =>
                prev.status === "saved" ? { ...prev, status: "idle" } : prev
            );
        }, 2000);
    } catch (err) {
        setSyncState((prev) => ({ ...prev, status: "error" }));
    }
}, []);

  return {
    shapes,
    setShapes: updateShapes,   // use this instead of raw setShapes in Canvas
    zoom,
    setZoom,
    offset,
    setOffset,
    syncState,
    resetBoard
  };
}