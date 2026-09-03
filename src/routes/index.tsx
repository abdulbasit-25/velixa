import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radio, LogIn, ArrowRight, Camera } from "lucide-react";
import { generateRoomCode, normalizeRoomCode } from "@/lib/roomCode";
import { DeviceSchematic } from "@/components/DeviceSchematic";
import { Waveform } from "@/components/Waveform";
import { QrScanner } from "@/components/QrScanner";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Viorax — Broadcast your screen to any device" },
      {
        name: "description",
        content:
          "Open a frequency, share the code, go live. Frontend-only WebRTC screen sharing with no accounts.",
      },
      { property: "og:title", content: "Viorax — Broadcast your screen to any device" },
      {
        property: "og:description",
        content: "Broadcast your screen to any device. No accounts, no downloads.",
      },
      { property: "og:image", content: "https://Viorax.vercel.app/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://Viorax.vercel.app/og-image.jpg" },
      { name: "twitter:image:alt", content: "Viorax logo and screen sharing preview" },
    ],
  }),
  component: Landing,
});

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

function Landing() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);

  // Default to "desktop-capable" so server and first client render match exactly
  // (no window/UA access during render, which would cause a hydration mismatch).
  // Real capability is detected after mount and only ever narrows the UI down.
  const [canShareScreen, setCanShareScreen] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setCanShareScreen(
      typeof navigator !== "undefined" &&
        typeof navigator.mediaDevices?.getDisplayMedia === "function",
    );
    setIsTouchDevice(
      typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    );
  }, []);

  const host = () => {
    const c = generateRoomCode();
    navigate({ to: "/room/$roomId", params: { roomId: c }, search: { role: "host" } });
  };

  const join = (e: React.FormEvent) => {
    e.preventDefault();
    const c = normalizeRoomCode(code);
    if (c.length !== 6) {
      toast.error("Frequency codes are 6 characters.");
      return;
    }
    navigate({ to: "/room/$roomId", params: { roomId: c }, search: {} });
  };

  return (
    // Note: this renders inside the root route's <main>, so this is a <div>
    // rather than another <main> — a page should only ever have one main landmark.
    <div className="min-h-screen bg-ink text-text-primary">
      <header className="flex items-center justify-between border-b border-panel-line px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center border border-signal/60 text-signal">
            <Radio className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-text-muted">
              Station
            </span>
            <span className="font-mono text-sm tracking-widest">Viorax</span>
          </div>
        </div>
        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted sm:flex">
          <Waveform state="idle" bars={12} />
          <span>standby</span>
        </div>
      </header>

      <QrScanner open={scannerOpen} onClose={() => setScannerOpen(false)} />

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Action panel */}
        <section className="flex flex-col justify-center gap-8 px-4 py-12 sm:gap-10 sm:px-8 sm:py-16 lg:px-16 lg:py-24">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">
              Open a channel
            </p>
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-4xl sm:leading-[1.05] md:text-5xl">
              Share your screen <br className="hidden sm:block" />
              on a frequency, <br className="hidden sm:block" />
              not an account.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-text-muted">
              Open a frequency and go live, or tune in to one someone shared with you. Peer-to-peer.
              Nothing recorded, nothing stored.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {canShareScreen && (
              <button
                onClick={host}
                className={`group flex items-center justify-between border border-signal bg-signal px-5 py-4 text-left text-ink transition-colors hover:bg-signal/90 ${focusRing}`}
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
                    01
                  </div>
                  <div className="mt-1 text-base font-semibold">Open a frequency</div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            )}

            <form
              onSubmit={join}
              className={`flex flex-col gap-2 border border-panel-line bg-panel p-4 ${
                canShareScreen ? "" : "sm:col-span-2"
              }`}
            >
              <label
                htmlFor="room-code"
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted"
              >
                {canShareScreen ? "02 — Tune in" : "Tune in"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="room-code"
                  value={code}
                  onChange={(e) => setCode(normalizeRoomCode(e.target.value))}
                  placeholder="ABC123"
                  maxLength={6}
                  autoCapitalize="characters"
                  autoComplete="off"
                  inputMode="text"
                  aria-label="Frequency code"
                  className={`w-full min-w-0 bg-transparent font-mono text-lg tracking-[0.35em] text-text-primary outline-none placeholder:text-text-muted/40 ${focusRing}`}
                />
                {isTouchDevice && (
                  <button
                    type="button"
                    onClick={() => setScannerOpen(true)}
                    aria-label="Scan QR code"
                    className={`grid h-9 w-9 shrink-0 place-items-center border border-link-cyan text-link-cyan transition-colors hover:bg-link-cyan/10 ${focusRing}`}
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Tune in"
                  className={`grid h-9 w-9 shrink-0 place-items-center border border-link-cyan text-link-cyan transition-colors hover:bg-link-cyan/10 ${focusRing}`}
                >
                  <LogIn className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-panel-line pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted sm:gap-6">
            <div>
              <div className="text-text-primary">P2P</div>
              <div className="mt-1">Direct link</div>
            </div>
            <div>
              <div className="text-text-primary">0 accounts</div>
              <div className="mt-1">No login</div>
            </div>
            <div>
              <div className="text-text-primary">1→N</div>
              <div className="mt-1">Multi-viewer</div>
            </div>
          </div>
        </section>

        {/* Schematic panel */}
        <section className="border-t border-panel-line bg-ink px-4 py-10 sm:px-8 lg:border-l lg:border-t-0 lg:px-10 lg:py-16">
          <DeviceSchematic state="idle" label="STANDBY" />
        </section>
      </div>
    </div>
  );
}
