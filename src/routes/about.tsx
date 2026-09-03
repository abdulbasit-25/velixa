import { createFileRoute } from "@tanstack/react-router";
import { Globe, Github, Twitter } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Velixa" },
      { name: "description", content: "Learn about the creator and the Velixa project." },
    ],
  }),
  component: About,
});

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const ARCHER_URL = "https://abdulbasit-archer.vercel.app/";

// TODO: fill these in (or delete the ones you don't have) — placeholders so
// nothing fake ships to production.
const GITHUB_URL = ""; // e.g. "https://github.com/your-handle"
const TWITTER_URL = ""; // e.g. "https://x.com/your-handle"

const LINKS = [
  { href: ARCHER_URL, label: "Portfolio", icon: Globe },
  ...(GITHUB_URL ? [{ href: GITHUB_URL, label: "GitHub", icon: Github }] : []),
  ...(TWITTER_URL ? [{ href: TWITTER_URL, label: "Twitter", icon: Twitter }] : []),
];

const STACK = ["React", "TanStack Router", "WebRTC", "Tailwind CSS"];

function About() {
  return (
    // Rendered inside the root route's <main>, so this is a <div> —
    // a page should only ever have one <main> landmark.
    <div className="min-h-screen bg-ink px-4 py-12 text-text-primary sm:px-8 sm:py-16 lg:px-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src="/og-image.jpg"
              alt="Velixa logo"
              width={56}
              height={56}
              className="h-12 w-12 shrink-0 rounded border border-panel-line bg-panel object-cover sm:h-14 sm:w-14"
              onError={(e) => {
                // Hide gracefully if the image hasn't been added to /public yet,
                // instead of showing a broken-image icon.
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-signal">About</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Velixa
              </h1>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
            Velixa is a lightweight browser-based communication tool for quick voice calls, video
            calls, and screen sharing without accounts or downloads.
          </p>
        </div>

        <section className="space-y-4 rounded border border-panel-line bg-panel p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Creator</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Built by Abdul Basit, also known as Archer, this project is designed to make browser
            communication simple, direct, and easy to use.
          </p>
          <p className="text-sm leading-relaxed text-text-muted">
            If you want to learn more, visit{" "}
            <a
              href={ARCHER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-link-cyan underline underline-offset-2 hover:text-link-cyan/80 ${focusRing}`}
            >
              the creator's Portfolio
            </a>{" "}
            for additional projects and updates.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded border border-panel-line px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors hover:border-link-cyan hover:text-link-cyan ${focusRing}`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded border border-panel-line bg-panel p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Project</h2>
          <p className="text-sm leading-relaxed text-text-muted">
            Velixa uses peer-to-peer browser technology to connect participants for voice, video,
            and screen sharing. It focuses on direct connections, no sign-in required, and a calm,
            minimal interface.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted marker:text-signal">
            <li>No user accounts or registration</li>
            <li>Voice calls, video calls, and screen sharing</li>
            <li>Simple six-character room codes</li>
          </ul>

          <div className="flex flex-wrap gap-2 pt-2">
            {STACK.map((item) => (
              <span
                key={item}
                className="rounded-full border border-panel-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
