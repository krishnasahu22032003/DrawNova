"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Canvas } from "../../../components/Canvas";
import { ToolBar } from "../../../components/ToolBar";
import { useRoomSync } from "../../../hooks/useRoomSync";
import { Tool } from "../../../types/ToolTypes";
import { SyncBadge } from "../../../components/SyncBadge";
import { Users } from "lucide-react";

export default function RoomPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const [selectedTool, setSelectedTool] = useState<Tool>("select");

    const {
        shapes,
        setShapes,
        zoom,
        setZoom,
        offset,
        setOffset,
        syncState,
        cursors,
        sendCursor,
    } = useRoomSync(roomId);

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

            <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-background/80 backdrop-blur text-xs text-muted-foreground">
                <Users size={13} />
                <span>{syncState.memberCount} online</span>
            </div>

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
                    resetBoard={async () => {}}
                    cursors={cursors}
                    sendCursor={sendCursor}
                />
            )}
        </div>
    );
}