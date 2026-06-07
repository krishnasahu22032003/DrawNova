"use client";

import { Canvas } from "../../components/Canvas";
import { ToolBar } from "../../components/ToolBar";
import { useBoardSync } from "../../hooks/useBoardSync";
import { useState } from "react";
import { Tool } from "../../types/ToolTypes";
import DashboardHeader from "../../components/DashboardHeader";
import {
  Loader2,
  CloudUpload,
  CloudCheck,
  CloudOff,
  Clock3,
} from "lucide-react";

type SyncStatus = "loading" | "saving" | "saved" | "error" | "idle";

interface SyncState {
  status: SyncStatus;
  lastSaved: Date | null;
}

const STATUS_CONFIG: Record<
  SyncStatus,
  {
    icon: React.ElementType;
    label: (lastSaved: Date | null) => string;
    iconClass: string;
    badgeClass: string;
    spin?: boolean;
  }
> = {
  loading: {
    icon: Loader2,
    label: () => "Loading board…",
    iconClass: "text-muted-foreground",
    badgeClass:
      "bg-background/70 border-border text-muted-foreground",
    spin: true,
  },
  saving: {
    icon: CloudUpload,
    label: () => "Saving…",
    iconClass: "text-blue-400",
    badgeClass:
      "bg-blue-500/10 border-blue-500/30 text-blue-400",
    spin: false,
  },
  saved: {
    icon: CloudCheck,
    label: () => "Saved",
    iconClass: "text-emerald-400",
    badgeClass:
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    spin: false,
  },
  error: {
    icon: CloudOff,
    label: () => "Offline — saved locally",
    iconClass: "text-amber-400",
    badgeClass:
      "bg-amber-500/10 border-amber-500/30 text-amber-400",
    spin: false,
  },
  idle: {
    icon: Clock3,
    label: (lastSaved) =>
      lastSaved
        ? `Saved at ${lastSaved.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : "All changes saved",
    iconClass: "text-muted-foreground",
    badgeClass:
      "bg-background/70 border-border text-muted-foreground",
    spin: false,
  },
};

function SyncBadge({ syncState }: { syncState: SyncState }) {
  const config = STATUS_CONFIG[syncState.status];
  const Icon = config.icon;
  const label = config.label(syncState.lastSaved);

  return (
    <div
      className={[

        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-2",
        "px-3.5 py-2 rounded-full",

        "border backdrop-blur-md",

        "text-[11px] font-medium tracking-wide whitespace-nowrap",

        "transition-all duration-300 ease-out",
        config.badgeClass,
      ].join(" ")}
    >
      <Icon
        size={13}
        className={[
          config.iconClass,
          config.spin ? "animate-spin" : "",
        ].join(" ")}
        strokeWidth={2.2}
      />
      <span>{label}</span>

      {syncState.status === "saving" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
        </span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [selectedTool, setSelectedTool] = useState<Tool>("select");

  const {
    shapes,
    setShapes,
    zoom,
    setZoom,
    offset,
    setOffset,
    syncState,
  } = useBoardSync();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <DashboardHeader />

      <ToolBar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
      />

      <SyncBadge syncState={syncState} />

      {syncState.status !== "loading" && (
        <Canvas
          selectedTool={selectedTool}
          shapes={shapes}
          setShapes={setShapes}
          zoom={zoom}
          setZoom={setZoom}
          offset={offset}
          setOffset={setOffset}
        />
      )}
    </div>
  );
}
