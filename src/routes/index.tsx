import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Radio, LogIn, ArrowRight, Camera, Mic, Video, MonitorUp } from "lucide-react";
import { generateRoomCode, normalizeRoomCode } from "@/lib/roomCode";
import { DeviceSchematic } from "@/components/DeviceSchematic";
import { Waveform } from "@/components/Waveform";
import { QrScanner } from "@/components/QrScanner";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velixa — Talk, share, connect" },
      {
        name: "description",
        content: "Start a voice call, video call, or screen share with a simple room code.",
      },
      { property: "og:title", content: "Velixa — Talk, share, connect" },
      {
        property: "og:description",
        content: "Talk, share, and connect directly in your browser. No accounts required.",
      },
      { property: "og:image", content: "https://Velixa.vercel.app/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://Velixa.vercel.app/og-image.jpg" },
      { name: "twitter:image:alt", content: "Velixa logo and screen sharing preview" },
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
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
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
      toast.error("Room codes are 6 characters.");
      return;
    }
    navigate({ to: "/room/$roomId", params: { roomId: c }, search: {} });
  };

  const codeIsInvalid = code.length > 0 && code.length !== 6;

  return (
    // Note: this renders inside the root route's <main>, so this is a <div>
    // rather than another <main> — a page should only ever have one main landmark.
    <div className="relative min-h-screen overflow-hidden bg-ink text-text-primary">
      {/* Ambient background grid + glow — this is what actually changes the "feel" */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-signal/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-15%] left-[-10%] h-[28rem] w-[28rem] rounded-full bg-link-cyan/10 blur-[120px]" />

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-8 w-8 shrink-0 place-items-center border border-signal/60 text-signal">
              <Radio className="h-4 w-4" />
            </div>
            <span className="font-mono text-sm tracking-widest">Velixa</span>
          </div>
          <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
            <Waveform state="idle" bars={12} />
            <span className="hidden sm:inline">standby</span>
          </div>
        </header>

        <QrScanner open={scannerOpen} onClose={() => setScannerOpen(false)} />

        {/* Main hero: centered, content-first, schematic as a floating badge rather than a full column */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
          <div className="w-full max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 border border-panel-line bg-panel px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              Real-time communication
            </div>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Talk. Share.
              <br />
              <span className="text-signal">Connect.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-text-muted sm:text-base">
              Start a voice call, video call, or screen share with a room code. No accounts, no
              downloads, and no recording.
            </p>

            {/* Floating device schematic, centered under the copy instead of a side column */}
            <div className="mx-auto mt-8 w-full max-w-xs sm:max-w-sm">
              <DeviceSchematic state="idle" label="STANDBY" />
            </div>

            {/* Actions: stacked full-width on mobile, side-by-side card group on larger screens */}
            <div className="mx-auto mt-10 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-4">
              <button
                onClick={host}
                className={`group col-span-1 flex min-h-[4.75rem] items-center justify-between border border-signal bg-signal px-5 py-4 text-left text-ink transition-colors hover:bg-signal/90 active:bg-signal/80 sm:col-span-2 ${focusRing}`}
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
                    01 — Start
                  </div>
                  <div className="mt-1 text-base font-semibold">Create room</div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>

              <form
                onSubmit={join}
                className="col-span-1 flex min-h-[4.75rem] flex-col justify-center gap-2 border border-panel-line bg-panel p-4 text-left transition-colors focus-within:border-link-cyan/60 sm:col-span-3"
              >
                <label
                  htmlFor="room-code"
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted"
                >
                  02 — Join with a code
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
                    aria-label="Room code"
                    aria-invalid={codeIsInvalid}
                    className={`w-full min-w-0 bg-transparent font-mono text-lg tracking-[0.35em] text-text-primary outline-none placeholder:text-text-muted/40 ${focusRing}`}
                  />
                  {isTouchDevice && (
                    <button
                      type="button"
                      onClick={() => setScannerOpen(true)}
                      aria-label="Scan QR code"
                      className={`grid h-11 w-11 shrink-0 place-items-center border border-link-cyan text-link-cyan transition-colors hover:bg-link-cyan/10 active:bg-link-cyan/20 ${focusRing}`}
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    aria-label="Join room"
                    className={`grid h-11 w-11 shrink-0 place-items-center border border-link-cyan text-link-cyan transition-colors hover:bg-link-cyan/10 active:bg-link-cyan/20 ${focusRing}`}
                  >
                    <LogIn className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* Feature strip pinned to the bottom as a distinct band, not stacked under the form */}
        <footer className="border-t border-panel-line px-4 py-5 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
            <div className="flex items-center gap-2">
              <Mic className="h-3.5 w-3.5 text-signal" />
              <span className="text-text-primary">Voice</span>
              <span className="hidden text-text-muted/60 sm:inline">— clear audio</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-3.5 w-3.5 text-signal" />
              <span className="text-text-primary">Video</span>
              <span className="hidden text-text-muted/60 sm:inline">— face to face</span>
            </div>
            <div className="flex items-center gap-2">
              <MonitorUp className="h-3.5 w-3.5 text-signal" />
              <span className="text-text-primary">Share</span>
              <span className="hidden text-text-muted/60 sm:inline">— your screen</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
