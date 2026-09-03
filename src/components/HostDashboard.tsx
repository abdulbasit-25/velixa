import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CopyButton } from "./CopyButton";
import {
  MonitorUp,
  MonitorX,
  Users,
  QrCode,
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
} from "lucide-react";
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
  const {
    state,
    viewerCount,
    isSharing,
    callMode,
    localStream,
    remoteStream,
    canShareScreen,
    startCall,
    endCall,
    startSharing,
    stopSharing,
  } = host;
  const [isMobile, setIsMobile] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !micEnabled;
    });
    setMicEnabled((enabled) => !enabled);
  };

  const statusText =
    state === "initializing"
      ? "Opening room..."
      : state === "waiting"
        ? `Waiting for someone to join room ${roomCode}.`
        : state === "connected"
          ? `${viewerCount} ${viewerCount === 1 ? "participant" : "participants"} ready.`
          : state === "live"
            ? `Active with ${viewerCount} ${viewerCount === 1 ? "participant" : "participants"}.`
            : "";

  const waveState = state === "live" ? "live" : state === "connected" ? "connected" : "idle";

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
      {remoteStream && (
        <audio
          className="hidden"
          autoPlay
          ref={(element) => {
            if (element) element.srcObject = remoteStream;
          }}
        />
      )}
      {/* Main */}
      <section className="flex flex-col gap-8 px-6 py-10 lg:px-12 lg:py-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">Room created</p>
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

        {host.incomingCall && (
          <div className="flex flex-wrap items-center justify-between gap-4 border border-signal bg-panel p-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
                Incoming {host.incomingCall.mode} call
              </p>
              <p className="mt-2 text-sm text-text-primary">
                A participant is calling from this room.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={host.acceptCall}
                className="inline-flex items-center gap-2 bg-signal px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink"
              >
                <Phone className="h-3.5 w-3.5" /> Accept
              </button>
              <button
                type="button"
                onClick={host.rejectCall}
                className="inline-flex items-center gap-2 border border-destructive px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-destructive"
              >
                <PhoneOff className="h-3.5 w-3.5" /> Decline
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!isSharing && !callMode && (
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => startCall("voice")}
                disabled={state === "initializing" || state === "error" || viewerCount === 0}
                className="flex items-center justify-between border border-signal/60 px-5 py-4 text-left transition-colors hover:bg-signal/10 disabled:opacity-40"
              >
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                    Voice
                  </span>
                  <span className="mt-1 block text-lg font-semibold">Start call</span>
                </span>
                <Phone className="h-5 w-5 text-signal" />
              </button>
              <button
                type="button"
                onClick={() => startCall("video")}
                disabled={state === "initializing" || state === "error" || viewerCount === 0}
                className="flex items-center justify-between border border-signal/60 px-5 py-4 text-left transition-colors hover:bg-signal/10 disabled:opacity-40"
              >
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                    Video
                  </span>
                  <span className="mt-1 block text-lg font-semibold">Start call</span>
                </span>
                <Video className="h-5 w-5 text-signal" />
              </button>
            </div>
          )}
          {callMode && (
            <button
              type="button"
              onClick={endCall}
              className="group flex items-center justify-between border border-destructive bg-destructive px-6 py-5 text-left text-white transition-colors hover:bg-destructive/90"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">
                  {callMode} call
                </div>
                <div className="mt-1 text-xl font-semibold">End call</div>
              </div>
              <PhoneOff className="h-6 w-6" />
            </button>
          )}
          {!callMode && !isSharing && !isMobile && (
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
                <div className="mt-1 text-xl font-semibold">Share screen</div>
              </div>
              <MonitorUp className="h-6 w-6" />
            </button>
          )}
          {isSharing && (
            <button
              onClick={stopSharing}
              className="group flex items-center justify-between border border-destructive bg-destructive px-6 py-5 text-left text-white transition-colors hover:bg-destructive/90"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">
                  Cut signal
                </div>
                <div className="mt-1 text-xl font-semibold">Stop sharing</div>
              </div>
              <MonitorX className="h-6 w-6" />
            </button>
          )}
          {callMode && (
            <button
              type="button"
              onClick={toggleMic}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-panel-line px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
            >
              {micEnabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
              {micEnabled ? "Mute microphone" : "Unmute microphone"}
            </button>
          )}
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
            {isMobile
              ? "Voice and video calls are available here. Screen sharing is available on desktop."
              : canShareScreen
                ? "Choose a screen, window, or tab when your browser prompts."
                : "Screen sharing is not available in this browser. You can still make a voice or video call."}
          </p>
        </div>
      </section>

      {/* QR panel */}
      <aside className="border-t border-panel-line bg-panel/40 px-6 py-10 lg:border-l lg:border-t-0 lg:px-8">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
          <QrCode className="h-3.5 w-3.5" />
          Scan to join
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
