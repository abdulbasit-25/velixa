import { cn } from "@/lib/utils";

type State = "idle" | "connected" | "live";

export function Waveform({ state, bars = 32 }: { state: State; bars?: number }) {
  const color =
    state === "live"
      ? "bg-signal"
      : state === "connected"
        ? "bg-link-cyan"
        : "bg-panel-line";

  return (
    <div className="flex h-10 items-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const seed = (i * 37) % 100;
        const baseHeight = state === "idle" ? 20 + (seed % 10) : 30 + (seed % 60);
        const delay = `${(i * 60) % 900}ms`;
        const duration = state === "live" ? "700ms" : state === "connected" ? "1200ms" : "2400ms";
        const anim = state === "idle" ? "signal-idle" : "signal-pulse";
        return (
          <span
            key={i}
            className={cn("w-[3px] rounded-full origin-center", color)}
            style={{
              height: `${baseHeight}%`,
              animation: `${anim} ${duration} ease-in-out infinite`,
              animationDelay: delay,
            }}
          />
        );
      })}
    </div>
  );
}
