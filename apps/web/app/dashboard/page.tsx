// app/dashboard/page.tsx  (or wherever Canvas is rendered)
"use client";
import { Canvas } from "../../components/Canvas";
import { ToolBar } from "../../components/ToolBar";
import { useBoardSync } from "../../hooks/useBoardSync";
import { useState } from "react";
import { Tool } from "../../types/ToolTypes";
import DashboardHeader from "../../components/DashboardHeader";

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
      <DashboardHeader/>
      <ToolBar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
      />

      {/* Sync status badge */}
      <div className="fixed top-4 right-4 z-50 text-xs px-3 py-1 rounded-full bg-background/80 border border-border backdrop-blur">
        {syncState.status === "loading" && "⏳ Loading board..."}
        {syncState.status === "saving" && "💾 Saving..."}
        {syncState.status === "saved" && "✅ Saved"}
        {syncState.status === "error" && "⚠️ Offline — saved locally"}
        {syncState.status === "idle" && syncState.lastSaved && (
          `Last saved ${syncState.lastSaved.toLocaleTimeString()}`
        )}
      </div>

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