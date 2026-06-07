"use client";

import { Canvas } from "../../components/Canvas";
import { ToolBar } from "../../components/ToolBar";
import { useBoardSync } from "../../hooks/useBoardSync";
import { useState } from "react";
import { Tool } from "../../types/ToolTypes";
import DashboardHeader from "../../components/DashboardHeader";
import { SyncBadge } from "../../components/SyncBadge";

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
    resetBoard,
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
          resetBoard={resetBoard}
        />
      )}
    </div>
  );
}