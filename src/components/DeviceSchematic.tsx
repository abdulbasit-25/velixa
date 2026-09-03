import { Monitor, Smartphone, Radio } from "lucide-react";
import { Waveform } from "./Waveform";

type State = "idle" | "connected" | "live";

export function DeviceSchematic({ state, label }: { state: State; label: string }) {
  const accent =
    state === "live" ? "text-signal" : state === "connected" ? "text-link-cyan" : "text-text-muted";

  return (
    <div className="relative flex h-full min-h-[320px] flex-col justify-between border border-panel-line bg-panel p-6 lg:p-10">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
        <span>CH-01 / uplink</span>
        <span className={accent}>{label}</span>
      </div>

      <div className="flex items-center justify-between gap-6 py-8">
        <DeviceGlyph icon={<Monitor className="h-8 w-8" />} name="HOST" active={state !== "idle"} />
        <div className="flex flex-1 flex-col items-center gap-2">
          <Waveform state={state} bars={28} />
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
            <Radio className={`h-3 w-3 ${accent}`} />
            <span>{state === "live" ? "TRANSMITTING" : state === "connected" ? "LINK OPEN" : "STANDBY"}</span>
          </div>
        </div>
        <DeviceGlyph icon={<Smartphone className="h-8 w-8" />} name="VIEWER" active={state === "live"} />
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-panel-line pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted">
        <Stat label="protocol" value="webrtc" />
        <Stat label="latency" value={state === "live" ? "~120ms" : "—"} />
        <Stat label="encoding" value={state === "live" ? "vp8" : "—"} />
      </div>
    </div>
  );
}

function DeviceGlyph({ icon, name, active }: { icon: React.ReactNode; name: string; active: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`grid h-16 w-16 place-items-center border ${
          active ? "border-signal/60 text-signal" : "border-panel-line text-text-muted"
        }`}
      >
        {icon}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">{name}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span>{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}
