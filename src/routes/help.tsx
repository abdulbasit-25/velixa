import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "How to Use — Viorax" },
      { name: "description", content: "Learn how to use Viorax for screen sharing." },
    ],
  }),
  component: Help,
});

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const HOST_STEPS = [
  "Open a frequency from the landing page on a desktop browser.",
  "Share the generated room code or link with viewers.",
  "Click Go Live and choose the screen, window, or tab to broadcast.",
  "Allow microphone access if you want audio to travel with the stream.",
];

const VIEWER_STEPS = [
  "Enter the 6-character room code on the landing page.",
  "Or tap the QR scan button on mobile to scan a shared code.",
  "Tune in and wait for the host to start broadcasting.",
  "If the broadcast ends, refresh or return to the landing page to reconnect.",
];

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={step} className="flex gap-4">
          <span className="shrink-0 font-mono text-xs tracking-[0.2em] text-signal">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-sm leading-relaxed text-text-muted">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Help() {
  return (
    // Rendered inside the root route's <main>, so this is a <div> —
    // a page should only ever have one <main> landmark.
    <div className="min-h-screen bg-ink px-4 py-12 text-text-primary sm:px-8 sm:py-16 lg:px-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">Help</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            How to use Viorax
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
            Follow these steps to broadcast or watch a live screen session.
          </p>
          <nav aria-label="Jump to section" className="flex gap-4 pt-2">
            <a
              href="#hosts"
              className={`font-mono text-xs uppercase tracking-[0.2em] text-link-cyan hover:text-link-cyan/80 ${focusRing}`}
            >
              For hosts
            </a>
            <a
              href="#viewers"
              className={`font-mono text-xs uppercase tracking-[0.2em] text-link-cyan hover:text-link-cyan/80 ${focusRing}`}
            >
              For viewers
            </a>
          </nav>
        </div>

        <section
          id="hosts"
          aria-labelledby="hosts-heading"
          className="space-y-4 rounded border border-panel-line bg-panel p-5 sm:p-6"
        >
          <h2 id="hosts-heading" className="text-xl font-semibold">
            For hosts
          </h2>
          <StepList steps={HOST_STEPS} />
        </section>

        <section
          id="viewers"
          aria-labelledby="viewers-heading"
          className="space-y-4 rounded border border-panel-line bg-panel p-5 sm:p-6"
        >
          <h2 id="viewers-heading" className="text-xl font-semibold">
            For viewers
          </h2>
          <StepList steps={VIEWER_STEPS} />
        </section>

        <div className="flex justify-center pt-2">
          <Link
            to="/"
            className={`group inline-flex items-center gap-2 rounded-md bg-signal px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-signal/90 ${focusRing}`}
          >
            Open a frequency
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
