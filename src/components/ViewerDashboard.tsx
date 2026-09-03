import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Maximize,
  MonitorX,
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
} from "lucide-react";
import type { ViewerState } from "@/hooks/usePeerConnection";
import { Waveform } from "./Waveform";

export function ViewerDashboard({ viewer, roomCode }: { viewer: ViewerState; roomCode: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    if (videoRef.current && viewer.remoteStream) {
      videoRef.current.srcObject = viewer.remoteStream;
    }
  }, [viewer.remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && viewer.localStream) {
      localVideoRef.current.srcObject = viewer.localStream;
    }
  }, [viewer.localStream]);

  const isLive = viewer.state === "live" && viewer.remoteStream;

  const toggleMic = () => {
    viewer.localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !micEnabled;
    });
    setMicEnabled((enabled) => !enabled);
  };

  const toggleCamera = () => {
    viewer.localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !cameraEnabled;
    });
    setCameraEnabled((enabled) => !enabled);
  };

  const fullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <div className="relative aspect-video w-full overflow-hidden border border-panel-line bg-black">
        {viewer.callMode === "voice" && viewer.remoteStream ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-panel">
            <div className="grid h-20 w-20 place-items-center border border-signal/60 text-2xl text-signal">
              {roomCode.slice(0, 2)}
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
                Voice call active
              </p>
              <p className="mt-2 text-sm text-text-muted">Room participant</p>
            </div>
            <audio
              ref={(element) => {
                if (element) element.srcObject = viewer.remoteStream;
              }}
              autoPlay
              muted={muted}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className={`h-full w-full object-contain ${isLive ? "opacity-100" : "opacity-0"}`}
          />
        )}

        {viewer.callMode === "video" && viewer.localStream && (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 aspect-video w-28 border border-panel-line bg-ink object-cover sm:w-40"
          />
        )}

        {!isLive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
            {viewer.state === "error" ? (
              <>
                <MonitorX className="h-10 w-10 text-destructive" />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-destructive">
                  Signal error
                </p>
                <p className="max-w-sm text-sm text-text-muted">
                  {viewer.error || "Could not connect to this room."}
                </p>
              </>
            ) : viewer.state === "disconnected" ? (
              <>
                <MonitorX className="h-10 w-10 text-text-muted" />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
                  Off the air
                </p>
                <p className="max-w-sm text-sm text-text-muted">
                  The participant disconnected. You can stay here and wait for them to reconnect.
                </p>
              </>
            ) : (
              <>
                <Waveform state={viewer.state === "connected" ? "connected" : "idle"} bars={40} />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
                  {viewer.state === "initializing"
                    ? "Opening room..."
                    : viewer.state === "waiting"
                      ? `Connecting to room ${roomCode}...`
                      : "Ready to connect with a participant."}
                </p>
              </>
            )}
          </div>
        )}

        {isLive && (
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 border border-signal/60 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            {viewer.callMode === "voice"
              ? "Voice call active"
              : viewer.callMode === "video"
                ? "Video call active"
                : "Screen sharing active"}
          </div>
        )}
      </div>

      {viewer.incomingCall && (
        <div className="flex flex-wrap items-center justify-between gap-4 border border-signal bg-panel p-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
              Incoming {viewer.incomingCall.mode} call
            </p>
            <p className="mt-2 text-sm text-text-primary">
              A participant is calling from this room.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={viewer.acceptCall}
              className="inline-flex items-center gap-2 bg-signal px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink"
            >
              <Phone className="h-3.5 w-3.5" /> Accept
            </button>
            <button
              type="button"
              onClick={viewer.rejectCall}
              className="inline-flex items-center gap-2 border border-destructive px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-destructive"
            >
              <PhoneOff className="h-3.5 w-3.5" /> Decline
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
          Room <span className="text-text-primary tracking-[0.4em]">{roomCode}</span>
        </div>
        <div className="flex items-center gap-2">
          {!viewer.callMode && viewer.state === "connected" && (
            <>
              <button
                type="button"
                onClick={() => viewer.startCall("voice")}
                className="inline-flex items-center gap-2 border border-signal/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
              >
                <Phone className="h-3.5 w-3.5" /> voice
              </button>
              <button
                type="button"
                onClick={() => viewer.startCall("video")}
                className="inline-flex items-center gap-2 border border-signal/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted hover:text-text-primary"
              >
                <Video className="h-3.5 w-3.5" /> video
              </button>
            </>
          )}
          {viewer.callMode && (
            <>
              <button
                type="button"
                onClick={toggleMic}
                className="inline-flex items-center gap-2 border border-panel-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted"
              >
                {micEnabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}{" "}
                mic
              </button>
              {viewer.callMode === "video" && (
                <button
                  type="button"
                  onClick={toggleCamera}
                  className="inline-flex items-center gap-2 border border-panel-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted"
                >
                  {cameraEnabled ? (
                    <Camera className="h-3.5 w-3.5" />
                  ) : (
                    <CameraOff className="h-3.5 w-3.5" />
                  )}{" "}
                  camera
                </button>
              )}
              <button
                type="button"
                onClick={viewer.endCall}
                className="inline-flex items-center gap-2 border border-destructive px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-destructive"
              >
                <PhoneOff className="h-3.5 w-3.5" /> end
              </button>
            </>
          )}
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
