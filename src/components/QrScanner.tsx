import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { normalizeRoomCode } from "@/lib/roomCode";

interface QrScannerProps {
  open: boolean;
  onClose: () => void;
}

function parseRoomCodeFromValue(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const roomFromPath = url.pathname.match(/\/room\/([A-Z0-9]{6})/i);
    if (roomFromPath?.[1]) return normalizeRoomCode(roomFromPath[1]);

    const roomFromQuery = url.searchParams.get("room");
    if (roomFromQuery) return normalizeRoomCode(roomFromQuery);
  } catch {
    // fall back to plain room-code parsing below
  }

  const normalized = normalizeRoomCode(trimmed);
  return normalized.length === 6 ? normalized : null;
}

export function QrScanner({ open, onClose }: QrScannerProps) {
  const navigate = useNavigate();
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    let scannerInstance: {
      render: (
        onScan: (decodedText: string) => void,
        onError: (errorMessage: string) => void,
      ) => void | Promise<void>;
      clear: () => Promise<void>;
    } | null = null;

    const startScanner = async () => {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) setError("Camera access is not available on this device.");
        return;
      }

      try {
        const { Html5QrcodeScanner } = await import("html5-qrcode");
        if (cancelled || !scannerRef.current) return;

        scannerInstance = new Html5QrcodeScanner(
          scannerRef.current.id,
          {
            fps: 10,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0,
            disableFlip: false,
          },
          false,
        );

        await scannerInstance.render(
          (decodedText: string) => {
            const roomCode = parseRoomCodeFromValue(decodedText);
            if (!roomCode) {
              toast.error("This QR code does not contain a valid room link.");
              return;
            }

            scannerInstance?.clear?.().catch(() => undefined);
            onClose();
            navigate({ to: "/room/$roomId", params: { roomId: roomCode }, search: {} });
          },
          () => undefined,
        );

        if (!cancelled) setIsReady(true);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Unable to start the camera scanner. Please allow camera access and try again.");
        }
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      scannerInstance?.clear?.().catch(() => undefined);
      setIsReady(false);
      setError(null);
    };
  }, [navigate, onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 px-4 py-6">
      <div className="w-full max-w-md rounded border border-panel-line bg-panel p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
              Scan QR
            </p>
            <h3 className="mt-1 text-lg font-semibold text-text-primary">Join a room</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center border border-panel-line text-text-muted transition-colors hover:bg-white/5"
            aria-label="Close scanner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded border border-panel-line bg-ink/70 p-3">
          <div id="qr-scanner-root" ref={scannerRef} className="min-h-[280px]" />
        </div>

        {!isReady && !error && (
          <p className="mt-3 text-center text-sm text-text-muted">
            Allow camera access to scan a QR code.
          </p>
        )}

        {error ? (
          <div className="mt-3 flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <Camera className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
