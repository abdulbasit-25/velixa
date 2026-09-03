import { useEffect, useRef, useState, useCallback } from "react";
import Peer, { type MediaConnection, type DataConnection } from "peerjs";
import { roomToPeerId } from "@/lib/roomCode";

export type PeerRole = "host" | "viewer";
export type CallMode = "voice" | "video" | "screen";
export type ConnState =
  "initializing" | "waiting" | "connected" | "live" | "error" | "disconnected";

function mediaError(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return fallback;
}

function isPermissionError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: unknown }).name === "NotAllowedError"
  );
}

export interface HostState {
  role: "host";
  peer: Peer | null;
  state: ConnState;
  viewerCount: number;
  isSharing: boolean;
  canShareScreen: boolean;
  callMode: CallMode | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  incomingCall: { caller: string; mode: "voice" | "video"; call: MediaConnection } | null;
  acceptCall: () => void;
  rejectCall: () => void;
  error?: string;
  startCall: (mode: "voice" | "video") => Promise<void>;
  endCall: () => void;
  startSharing: () => Promise<void>;
  stopSharing: () => void;
  destroy: () => void;
}

export interface ViewerState {
  role: "viewer";
  peer: Peer | null;
  state: ConnState;
  error?: string;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;
  callMode: CallMode | null;
  incomingCall: { caller: string; mode: CallMode; call: MediaConnection } | null;
  acceptCall: () => void;
  rejectCall: () => void;
  startCall: (mode: "voice" | "video") => Promise<void>;
  endCall: () => void;
  destroy: () => void;
}

export function useHost(
  roomCode: string,
  onEvent?: (msg: string, kind?: "info" | "error" | "success") => void,
): HostState {
  const [state, setState] = useState<ConnState>("initializing");
  const [viewerCount, setViewerCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [callMode, setCallMode] = useState<CallMode | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<HostState["incomingCall"]>(null);
  const [error, setError] = useState<string | undefined>();
  const canShareScreen =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getDisplayMedia === "function";
  const peerRef = useRef<Peer | null>(null);
  const dataConnsRef = useRef<Map<string, DataConnection>>(new Map());
  const mediaCallsRef = useRef<Map<string, MediaConnection>>(new Map());
  const streamRef = useRef<MediaStream | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const eventRef = useRef(onEvent);
  eventRef.current = onEvent;

  useEffect(() => {
    let cancelled = false;
    const peer = new Peer(roomToPeerId(roomCode), { debug: 1 });
    peerRef.current = peer;

    peer.on("open", () => {
      if (cancelled) return;
      setState("waiting");
    });

    peer.on("connection", (conn) => {
      dataConnsRef.current.set(conn.peer, conn);
      conn.on("open", () => {
        setViewerCount(dataConnsRef.current.size);
        setState((s) => (s === "waiting" ? "connected" : s));
        eventRef.current?.("Participant joined", "success");
        // If already sharing, call this new viewer with the current stream
        if (streamRef.current) {
          const call = peer.call(conn.peer, streamRef.current, { metadata: { mode: "screen" } });
          if (call) {
            mediaCallsRef.current.set(conn.peer, call);
            call.on("stream", setRemoteStream);
            call.on("close", () => mediaCallsRef.current.delete(conn.peer));
          }
        }
      });
      conn.on("close", () => {
        dataConnsRef.current.delete(conn.peer);
        const call = mediaCallsRef.current.get(conn.peer);
        if (call) {
          call.close();
          mediaCallsRef.current.delete(conn.peer);
        }
        setViewerCount(dataConnsRef.current.size);
        if (dataConnsRef.current.size === 0) {
          setState((s) => (s === "live" || s === "connected" ? "waiting" : s));
        }
        eventRef.current?.("Viewer signed off", "info");
      });
    });

    peer.on("call", (call) => {
      const mode = (call.metadata as { mode?: CallMode } | undefined)?.mode;
      if (mode === "voice" || mode === "video") {
        setIncomingCall({ caller: call.peer, mode, call });
      } else {
        call.answer();
      }
    });

    peer.on("error", (err) => {
      console.error("Peer error", err);
      if (err.type === "unavailable-id") {
        setError("This room is already in use.");
      } else if (err.type === "network" || err.type === "server-error") {
        setError("Broker unreachable. Check your connection.");
      } else {
        setError(err.message || String(err));
      }
      setState("error");
    });

    peer.on("disconnected", () => {
      if (cancelled) return;
      // Try to reconnect
      try {
        peer.reconnect();
      } catch (error) {
        console.warn("Peer reconnect failed", error);
      }
    });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      displayStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      streamRef.current = null;
      displayStreamRef.current = null;
      micStreamRef.current = null;
      audioContextRef.current = null;
      mediaCallsRef.current.forEach((c) => c.close());
      mediaCallsRef.current.clear();
      dataConnsRef.current.forEach((c) => c.close());
      dataConnsRef.current.clear();
      peer.destroy();
      peerRef.current = null;
    };
  }, [roomCode]);

  const endCall = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    micStreamRef.current = null;
    setLocalStream(null);
    setCallMode(null);
    mediaCallsRef.current.forEach((call) => call.close());
    mediaCallsRef.current.clear();
    setRemoteStream(null);
    setState(dataConnsRef.current.size > 0 ? "connected" : "waiting");
    eventRef.current?.("Call ended", "info");
  }, []);

  const acceptCall = useCallback(async () => {
    const pending = incomingCall;
    if (!pending) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: pending.mode === "video",
      });
      pending.call.answer(stream);
      mediaCallsRef.current.set(pending.caller, pending.call);
      pending.call.on("stream", setRemoteStream);
      streamRef.current = stream;
      micStreamRef.current = stream;
      setLocalStream(stream);
      setCallMode(pending.mode);
      setIncomingCall(null);
      setState("live");
    } catch (err: unknown) {
      const message = isPermissionError(err)
        ? `Allow ${pending.mode === "video" ? "camera and microphone" : "microphone"} access to accept the call.`
        : mediaError(err, "Could not access your microphone.");
      setError(message);
      eventRef.current?.(message, "error");
    }
  }, [incomingCall]);

  const rejectCall = useCallback(() => {
    incomingCall?.call.close();
    setIncomingCall(null);
    eventRef.current?.("Call declined", "info");
  }, [incomingCall]);

  const startCall = useCallback(async (mode: "voice" | "video") => {
    const peer = peerRef.current;
    if (!peer || dataConnsRef.current.size === 0) {
      eventRef.current?.("Connect a participant before starting a call.", "error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === "video",
      });
      streamRef.current = stream;
      micStreamRef.current = stream;
      setLocalStream(stream);
      setCallMode(mode);
      setState("live");
      dataConnsRef.current.forEach((_, participantId) => {
        const call = peer.call(participantId, stream, { metadata: { mode } });
        if (call) {
          mediaCallsRef.current.set(participantId, call);
          call.on("stream", setRemoteStream);
        }
      });
      eventRef.current?.(`${mode === "video" ? "Video" : "Voice"} call started`, "success");
    } catch (err: unknown) {
      const message = isPermissionError(err)
        ? `Allow ${mode === "video" ? "camera and microphone" : "microphone"} access to start the call.`
        : mediaError(err, "Could not access your microphone.");
      setError(message);
      eventRef.current?.(message, "error");
    }
  }, []);

  const startSharing = useCallback(async () => {
    const peer = peerRef.current;
    if (!peer) return;

    if (!canShareScreen) {
      const message =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
          ? "Screen sharing is not available on mobile. Use voice or video here, or share your screen from desktop."
          : "This browser does not support screen sharing.";
      setError(message);
      eventRef.current?.(message, "error");
      return;
    }

    try {
      setError(undefined);
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const sharingStream = new MediaStream();

      displayStream.getVideoTracks().forEach((track) => sharingStream.addTrack(track));

      let micStream: MediaStream | null = null;
      let audioContext: AudioContext | null = null;
      let mixedAudioTrack: MediaStreamTrack | null = null;

      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch {
        micStream = null;
      }

      if (displayStream.getAudioTracks().length > 0 || micStream) {
        audioContext = new AudioContext();
        const destination = audioContext.createMediaStreamDestination();

        if (displayStream.getAudioTracks().length > 0) {
          const displayAudioSource = audioContext.createMediaStreamSource(displayStream);
          displayAudioSource.connect(destination);
        }

        if (micStream) {
          const micSource = audioContext.createMediaStreamSource(micStream);
          micSource.connect(destination);
        }

        mixedAudioTrack = destination.stream.getAudioTracks()[0] ?? null;
        if (mixedAudioTrack) {
          sharingStream.addTrack(mixedAudioTrack);
        }
      }

      displayStreamRef.current = displayStream;
      micStreamRef.current = micStream;
      audioContextRef.current = audioContext;
      streamRef.current = sharingStream;
      setIsSharing(true);
      setState("live");
      eventRef.current?.("Screen sharing started", "success");

      sharingStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        // User stopped sharing via browser UI
        stopSharingInternal();
      });

      dataConnsRef.current.forEach((_, viewerId) => {
        const call = peer.call(viewerId, sharingStream, { metadata: { mode: "screen" } });
        if (call) {
          mediaCallsRef.current.set(viewerId, call);
          call.on("close", () => mediaCallsRef.current.delete(viewerId));
        }
      });
    } catch (err: unknown) {
      if (isPermissionError(err)) {
        eventRef.current?.("Screen share was cancelled before it started.", "error");
      } else {
        eventRef.current?.(mediaError(err, "Could not access screen."), "error");
      }
    }
  }, [canShareScreen]);

  const stopSharingInternal = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    displayStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    streamRef.current = null;
    displayStreamRef.current = null;
    micStreamRef.current = null;
    audioContextRef.current = null;
    mediaCallsRef.current.forEach((c) => c.close());
    mediaCallsRef.current.clear();
    setIsSharing(false);
    setState(dataConnsRef.current.size > 0 ? "connected" : "waiting");
    eventRef.current?.("Screen sharing ended", "info");
  }, []);

  const destroy = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    displayStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    peerRef.current?.destroy();
  }, []);

  return {
    role: "host",
    peer: peerRef.current,
    state,
    viewerCount,
    isSharing,
    error,
    canShareScreen,
    startSharing,
    stopSharing: stopSharingInternal,
    callMode,
    localStream,
    remoteStream,
    incomingCall,
    acceptCall,
    rejectCall,
    startCall,
    endCall,
    destroy,
  };
}

export function useViewer(
  roomCode: string,
  onEvent?: (msg: string, kind?: "info" | "error" | "success") => void,
): ViewerState {
  const [state, setState] = useState<ConnState>("initializing");
  const [error, setError] = useState<string | undefined>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callMode, setCallMode] = useState<CallMode | null>(null);
  const [incomingCall, setIncomingCall] = useState<ViewerState["incomingCall"]>(null);
  const peerRef = useRef<Peer | null>(null);
  const dataConnRef = useRef<DataConnection | null>(null);
  const mediaCallRef = useRef<MediaConnection | null>(null);
  const eventRef = useRef(onEvent);
  eventRef.current = onEvent;

  useEffect(() => {
    let cancelled = false;
    const peer = new Peer({ debug: 1 });
    peerRef.current = peer;

    peer.on("open", () => {
      if (cancelled) return;
      const conn = peer.connect(roomToPeerId(roomCode), { reliable: true });
      dataConnRef.current = conn;
      setState("waiting");

      conn.on("open", () => {
        setState("connected");
        eventRef.current?.("Joined room", "success");
      });
      conn.on("close", () => {
        if (cancelled) return;
        setState("disconnected");
        setRemoteStream(null);
        eventRef.current?.("Host went off the air", "error");
      });
      conn.on("error", (err) => {
        console.error(err);
      });

      // Timeout for connect
      setTimeout(() => {
        if (cancelled) return;
        if (!conn.open) {
          setError("No active room found with this code.");
          setState("error");
        }
      }, 8000);
    });

    peer.on("call", (call) => {
      mediaCallRef.current = call;
      const mode = (call.metadata as { mode?: CallMode } | undefined)?.mode ?? "screen";
      if (mode !== "screen") {
        setIncomingCall({ caller: call.peer, mode, call });
        setState("connected");
        return;
      }
      call.answer();
      call.on("stream", (stream) => {
        setRemoteStream(stream);
        setCallMode(mode);
        setState("live");
        eventRef.current?.("Screen sharing started", "success");
      });
      call.on("close", () => {
        setRemoteStream(null);
        setState((s) => (s === "live" ? "connected" : s));
        eventRef.current?.("Screen sharing ended", "info");
      });
    });

    peer.on("error", (err) => {
      console.error("Peer error", err);
      if (err.type === "peer-unavailable") {
        setError("Room not found. Is the host online?");
      } else if (err.type === "network" || err.type === "server-error") {
        setError("Broker unreachable. Check your connection.");
      } else {
        setError(err.message || String(err));
      }
      setState("error");
    });

    return () => {
      cancelled = true;
      mediaCallRef.current?.close();
      dataConnRef.current?.close();
      peer.destroy();
    };
  }, [roomCode]);

  const acceptCall = useCallback(async () => {
    const pending = incomingCall;
    if (!pending) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: pending.mode === "video",
      });
      pending.call.answer(stream);
      setLocalStream(stream);
      setCallMode(pending.mode);
      setIncomingCall(null);
      pending.call.on("stream", (stream) => {
        setRemoteStream(stream);
        setState("live");
        eventRef.current?.("Call connected", "success");
      });
      pending.call.on("close", () => {
        stream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
        setRemoteStream(null);
        setCallMode(null);
        setState("connected");
        eventRef.current?.("Call ended", "info");
      });
    } catch (err: unknown) {
      const message = isPermissionError(err)
        ? `Allow ${pending.mode === "video" ? "camera and microphone" : "microphone"} access to accept the call.`
        : mediaError(err, "Could not access your microphone.");
      setError(message);
      eventRef.current?.(message, "error");
    }
  }, [incomingCall]);

  const rejectCall = useCallback(() => {
    incomingCall?.call.close();
    setIncomingCall(null);
    setState("connected");
    eventRef.current?.("Call declined", "info");
  }, [incomingCall]);

  const endCall = useCallback(() => {
    localStream?.getTracks().forEach((track) => track.stop());
    mediaCallRef.current?.close();
    setLocalStream(null);
    setRemoteStream(null);
    setCallMode(null);
    setState(dataConnRef.current?.open ? "connected" : "disconnected");
    eventRef.current?.("Call ended", "info");
  }, [localStream]);

  const startCall = useCallback(
    async (mode: "voice" | "video") => {
      const peer = peerRef.current;
      const connection = dataConnRef.current;
      if (!peer || !connection?.open) {
        eventRef.current?.("Connect to a room before starting a call.", "error");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: mode === "video",
        });
        const call = peer.call(roomToPeerId(roomCode), stream, { metadata: { mode } });
        if (!call) return;
        mediaCallRef.current = call;
        setLocalStream(stream);
        setCallMode(mode);
        setState("live");
        call.on("stream", (stream) => setRemoteStream(stream));
        call.on("close", endCall);
        eventRef.current?.(`${mode === "video" ? "Video" : "Voice"} call started`, "success");
      } catch (err: unknown) {
        const message = isPermissionError(err)
          ? `Allow ${mode === "video" ? "camera and microphone" : "microphone"} access to start the call.`
          : mediaError(err, "Could not access your microphone.");
        setError(message);
        eventRef.current?.(message, "error");
      }
    },
    [endCall, roomCode],
  );

  const destroy = useCallback(() => {
    mediaCallRef.current?.close();
    dataConnRef.current?.close();
    peerRef.current?.destroy();
  }, []);

  return {
    role: "viewer",
    peer: peerRef.current,
    state,
    error,
    remoteStream,
    localStream,
    callMode,
    incomingCall,
    acceptCall,
    rejectCall,
    startCall,
    endCall,
    destroy,
  };
}
