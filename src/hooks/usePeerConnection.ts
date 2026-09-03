import { useEffect, useRef, useState, useCallback } from "react";
import Peer, { type MediaConnection, type DataConnection } from "peerjs";
import { roomToPeerId } from "@/lib/roomCode";

export type PeerRole = "host" | "viewer";
export type ConnState =
  "initializing" | "waiting" | "connected" | "live" | "error" | "disconnected";

export interface HostState {
  role: "host";
  peer: Peer | null;
  state: ConnState;
  viewerCount: number;
  isSharing: boolean;
  canShareScreen: boolean;
  error?: string;
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
  destroy: () => void;
}

export function useHost(
  roomCode: string,
  onEvent?: (msg: string, kind?: "info" | "error" | "success") => void,
): HostState {
  const [state, setState] = useState<ConnState>("initializing");
  const [viewerCount, setViewerCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
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
        eventRef.current?.("Viewer tuned in", "success");
        // If already sharing, call this new viewer with the current stream
        if (streamRef.current) {
          const call = peer.call(conn.peer, streamRef.current);
          if (call) {
            mediaCallsRef.current.set(conn.peer, call);
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

    peer.on("error", (err) => {
      console.error("Peer error", err);
      if (err.type === "unavailable-id") {
        setError("This frequency is already in use.");
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
      } catch {}
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

  const startSharing = useCallback(async () => {
    const peer = peerRef.current;
    if (!peer) return;

    if (!canShareScreen) {
      const message =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
          ? "Screen sharing isn’t supported in mobile browsers. Open this app on a desktop browser to broadcast your screen."
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
      eventRef.current?.("Broadcast started", "success");

      sharingStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        // User stopped sharing via browser UI
        stopSharingInternal();
      });

      dataConnsRef.current.forEach((_, viewerId) => {
        const call = peer.call(viewerId, sharingStream);
        if (call) {
          mediaCallsRef.current.set(viewerId, call);
          call.on("close", () => mediaCallsRef.current.delete(viewerId));
        }
      });
    } catch (err: any) {
      if (err?.name === "NotAllowedError") {
        eventRef.current?.("Screen share was cancelled before it started.", "error");
      } else {
        eventRef.current?.(err?.message || "Could not access screen.", "error");
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
    eventRef.current?.("Broadcast ended", "info");
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
        eventRef.current?.("Locked onto frequency", "success");
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
          setError("No station broadcasting on this frequency.");
          setState("error");
        }
      }, 8000);
    });

    peer.on("call", (call) => {
      mediaCallRef.current = call;
      call.answer();
      call.on("stream", (stream) => {
        setRemoteStream(stream);
        setState("live");
        eventRef.current?.("Broadcast incoming", "success");
      });
      call.on("close", () => {
        setRemoteStream(null);
        setState((s) => (s === "live" ? "connected" : s));
        eventRef.current?.("Broadcast ended", "info");
      });
    });

    peer.on("error", (err) => {
      console.error("Peer error", err);
      if (err.type === "peer-unavailable") {
        setError("Frequency not found. Is the host online?");
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
    destroy,
  };
}
