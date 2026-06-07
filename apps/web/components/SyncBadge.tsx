"use client";

import { Loader2, CloudUpload, CloudCheck, CloudOff, Clock3 } from "lucide-react";

type SyncStatus = "loading" | "saving" | "saved" | "error" | "idle";

interface SyncState {
    status: SyncStatus;
    lastSaved: Date | null;
    memberCount?: number;
}

const STATUS_CONFIG = {
    loading: {
        icon: Loader2,
        label: () => "Loading board…",
        iconClass: "text-muted-foreground",
        badgeClass: "bg-background/70 border-border text-muted-foreground",
        spin: true,
    },
    saving: {
        icon: CloudUpload,
        label: () => "Saving…",
        iconClass: "text-blue-400",
        badgeClass: "bg-blue-500/10 border-blue-500/30 text-blue-400",
        spin: false,
    },
    saved: {
        icon: CloudCheck,
        label: () => "Saved",
        iconClass: "text-emerald-400",
        badgeClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        spin: false,
    },
    error: {
        icon: CloudOff,
        label: () => "Offline — saved locally",
        iconClass: "text-amber-400",
        badgeClass: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        spin: false,
    },
    idle: {
        icon: Clock3,
        label: (lastSaved: Date | null) =>
            lastSaved
                ? `Saved at ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "All changes saved",
        iconClass: "text-muted-foreground",
        badgeClass: "bg-background/70 border-border text-muted-foreground",
        spin: false,
    },
};

export function SyncBadge({ syncState }: { syncState: SyncState }) {
    const config = STATUS_CONFIG[syncState.status];
    const Icon = config.icon;
    const label = config.label(syncState.lastSaved);

    const isVisible =
        syncState.status !== "idle" ||
        syncState.lastSaved !== null;

    return (
        <div className={[
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
            "flex items-center gap-2 px-3.5 py-2 rounded-full",
            "border backdrop-blur-md",
            "text-[11px] font-medium tracking-wide whitespace-nowrap",
            "transition-all duration-300 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
            config.badgeClass,
        ].join(" ")}>
            <Icon
                size={13}
                className={[config.iconClass, config.spin ? "animate-spin" : ""].join(" ")}
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