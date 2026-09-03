import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Maximize, MonitorX } from "lucide-react";
import type { ViewerState } from "@/hooks/usePeerConnection";
import { Waveform } from "./Waveform";

export function ViewerDashboard({ viewer, roomCode }: { viewer: ViewerState; roomCode: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current && viewer.remoteStream) {
      videoRef.current.srcObject = viewer.remoteStream;
    }
  }, [viewer.remoteStream]);

  const isLive = viewer.state === "live" && viewer.remoteStream;

  const fullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="relative aspect-video w-full overflow-hidden border border-panel-line bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className={`h-full w-full object-contain ${isLive ? "opacity-100" : "opacity-0"}`}
        />

        {!isLive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
            {viewer.state === "error" ? (
              <>
                <MonitorX className="h-10 w-10 text-destructive" />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-destructive">Signal error</p>
                <p className="max-w-sm text-sm text-text-muted">{viewer.error || "Could not lock onto frequency."}</p>
              </>
            ) : viewer.state === "disconnected" ? (
              <>
                <MonitorX className="h-10 w-10 text-text-muted" />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">Off the air</p>
                <p className="max-w-sm text-sm text-text-muted">
                  Host went off the air. Hold tight — reconnect automatically when they're back.
                </p>
              </>
            ) : (
              <>
                <Waveform state={viewer.state === "connected" ? "connected" : "idle"} bars={40} />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
                  {viewer.state === "initializing"
                    ? "Locking onto frequency..."
                    : viewer.state === "waiting"
                      ? `Reaching frequency ${roomCode}...`
                      : "Connected — waiting for host to go live."}
                </p>
              </>
            )}
          </div>
        )}

        {isLive && (
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 border border-signal/60 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            Live
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
          Receiving on <span className="text-text-primary tracking-[0.4em]">{roomCode}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            disabled={!isLive}
            className="inline-flex items-center gap-2 border border-panel-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:text-text-primary disabled:opacity-40"
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            {muted ? "unmute" : "mute"}
          </button>
          <button
            onClick={fullscreen}
            disabled={!isLive}
            className="inline-flex items-center gap-2 border border-panel-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:text-text-primary disabled:opacity-40"
          >
            <Maximize className="h-3.5 w-3.5" />
            fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}
