import { QRCodeSVG } from "qrcode.react";
import { CopyButton } from "./CopyButton";
import { MonitorUp, MonitorX, Users, QrCode } from "lucide-react";
import { Waveform } from "./Waveform";
import type { HostState } from "@/hooks/usePeerConnection";

export function HostDashboard({
  roomCode,
  host,
  joinUrl,
}: {
  roomCode: string;
  host: HostState;
  joinUrl: string;
}) {
  const { state, viewerCount, isSharing, canShareScreen, startSharing, stopSharing } = host;

  const statusText =
    state === "initializing"
      ? "Opening frequency..."
      : state === "waiting"
        ? `Waiting for a device to tune in on ${roomCode}.`
        : state === "connected"
          ? `${viewerCount} ${viewerCount === 1 ? "viewer" : "viewers"} standing by.`
          : state === "live"
            ? `Live to ${viewerCount} ${viewerCount === 1 ? "viewer" : "viewers"}.`
            : "";

  const waveState = state === "live" ? "live" : state === "connected" ? "connected" : "idle";

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Main */}
      <section className="flex flex-col gap-8 px-6 py-10 lg:px-12 lg:py-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">
            Your frequency
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-4">
            <div className="font-mono text-6xl tracking-[0.35em] text-text-primary sm:text-7xl">
              {roomCode}
            </div>
            <CopyButton value={roomCode} label="copy code" />
            <CopyButton value={joinUrl} label="copy link" />
          </div>
        </div>

        <div className="border border-panel-line bg-panel p-6">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
            <span>Signal status</span>
            <span className="flex items-center gap-2 text-text-primary">
              <Users className="h-3.5 w-3.5" />
              {viewerCount}
            </span>
          </div>
          <div className="mt-4">
            <Waveform state={waveState} bars={48} />
          </div>
          <p className="mt-4 text-sm text-text-muted">{statusText}</p>
        </div>

        <div className="flex flex-col gap-3">
          {!isSharing ? (
            <button
              type="button"
              onClick={startSharing}
              disabled={state === "initializing" || state === "error"}
              className="group flex items-center justify-between border border-signal bg-signal px-6 py-5 text-left text-ink transition-colors hover:bg-signal/90 disabled:opacity-40"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
                  Transmit
                </div>
                <div className="mt-1 text-xl font-semibold">Go Live</div>
              </div>
              <MonitorUp className="h-6 w-6" />
            </button>
          ) : (
            <button
              onClick={stopSharing}
              className="group flex items-center justify-between border border-destructive bg-destructive px-6 py-5 text-left text-white transition-colors hover:bg-destructive/90"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">
                  Cut signal
                </div>
                <div className="mt-1 text-xl font-semibold">End Broadcast</div>
              </div>
              <MonitorX className="h-6 w-6" />
            </button>
          )}
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
            {canShareScreen
              ? "Choose a screen, window, or tab when your browser prompts."
              : "Screen sharing is not available on this device or browser. Use a desktop browser to broadcast."}
          </p>
        </div>
      </section>

      {/* QR panel */}
      <aside className="border-t border-panel-line bg-panel/40 px-6 py-10 lg:border-l lg:border-t-0 lg:px-8">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
          <QrCode className="h-3.5 w-3.5" />
          Scan to tune in
        </div>
        <div className="mt-6 flex justify-center border border-panel-line bg-white p-5">
          <QRCodeSVG value={joinUrl} size={220} bgColor="#ffffff" fgColor="#0E1116" level="M" />
        </div>
        <p className="mt-4 break-all font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
          {joinUrl}
        </p>
      </aside>
    </div>
  );
}
