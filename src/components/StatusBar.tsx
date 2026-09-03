import { Link } from "@tanstack/react-router";
import { LogOut, Radio } from "lucide-react";
import { Waveform } from "./Waveform";

type State = "idle" | "connected" | "live" | "error";

export function StatusBar({
  roomCode,
  role,
  status,
  statusLabel,
  onDisconnect,
}: {
  roomCode: string;
  role: "Host" | "Viewer";
  status: State;
  statusLabel: string;
  onDisconnect: () => void;
}) {
  const dot =
    status === "live"
      ? "bg-signal"
      : status === "connected"
        ? "bg-link-cyan"
        : status === "error"
          ? "bg-destructive"
          : "bg-text-muted/50";

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-panel-line bg-panel px-4 py-3 sm:flex sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-text-muted hover:text-text-primary"
        >
          <div className="grid h-7 w-7 place-items-center border border-signal/60 text-signal">
            <Radio className="h-3.5 w-3.5" />
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] sm:inline">
            Viorax
          </span>
        </Link>
        <div className="h-6 w-px shrink-0 bg-panel-line" />
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
          <span>
            freq <span className="ml-2 text-text-primary tracking-[0.4em]">{roomCode}</span>
          </span>
          <span>
            role <span className="ml-2 text-text-primary">{role}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
            <span className="text-text-primary">{statusLabel}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:block">
          <Waveform state={status === "error" || status === "idle" ? "idle" : status} bars={14} />
        </div>
        <button
          onClick={onDisconnect}
          className="inline-flex items-center gap-2 border border-panel-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:border-destructive/70 hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
          Disconnect
        </button>
      </div>
    </header>
  );
}
