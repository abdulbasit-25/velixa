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
    <div className="min-h-screen bg-ink text-text-primary">
      <header className="flex items-center justify-between gap-3 border-b border-panel-line px-4 py-3.5 sm:px-6 sm:py-4 lg:px-10">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center border border-signal/60 text-signal">
            <Radio className="h-4 w-4" />
          </div>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="hidden truncate font-mono text-xs uppercase tracking-[0.3em] text-text-muted xs:block">
              Real-time communication
            </span>
            <span className="font-mono text-sm tracking-widest">Velixa</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
          <Waveform state="idle" bars={12} />
          <span className="hidden sm:inline">standby</span>
        </div>
      </header>

      <QrScanner open={scannerOpen} onClose={() => setScannerOpen(false)} />

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
        {/* Action panel */}
        <section className="flex flex-col justify-center gap-8 px-4 py-10 sm:gap-9 sm:px-8 sm:py-14 lg:px-12 lg:py-20 xl:px-16">
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">
              Real-time communication
            </p>
            <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-4xl sm:leading-[1.05] md:text-5xl">
              Talk. Share. Connect.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-text-muted">
              Start a voice call, video call, or screen share with a room code. No accounts, no
              downloads, and no recording.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <button
              onClick={host}
              className={`group flex min-h-[4.5rem] items-center justify-between border border-signal bg-signal px-5 py-4 text-left text-ink transition-colors hover:bg-signal/90 active:bg-signal/80 ${focusRing}`}
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
                  01 — Start here
                </div>
                <div className="mt-1 text-base font-semibold">Create room</div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </button>

            <form
              onSubmit={join}
              className="flex min-h-[4.5rem] flex-col justify-center gap-2 border border-panel-line bg-panel p-4 transition-colors focus-within:border-link-cyan/60"
            >
              <label
                htmlFor="room-code"
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted"
              >
                02 — Join a room
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

          <div className="grid grid-cols-3 gap-3 border-t border-panel-line pt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted xs:text-[10px] sm:gap-6 sm:tracking-[0.3em]">
            <div>
              <div className="flex items-center gap-1.5 text-text-primary sm:gap-2">
                <Mic className="h-3.5 w-3.5 shrink-0 text-signal" />
                <span>Voice</span>
              </div>
              <div className="mt-1">Clear audio</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-text-primary sm:gap-2">
                <Video className="h-3.5 w-3.5 shrink-0 text-signal" />
                <span>Video</span>
              </div>
              <div className="mt-1">Face to face</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-text-primary sm:gap-2">
                <MonitorUp className="h-3.5 w-3.5 shrink-0 text-signal" />
                <span>Share</span>
              </div>
              <div className="mt-1">Your screen</div>
            </div>
          </div>
        </section>

        {/* Schematic panel */}
        <section className="flex items-center justify-center border-t border-panel-line bg-ink px-4 py-10 sm:px-8 sm:py-14 lg:border-l lg:border-t-0 lg:px-10 lg:py-16">
          <div className="w-full max-w-md">
            <DeviceSchematic state="idle" label="STANDBY" />
          </div>
        </section>
      </div>
    </div>
  );
}
