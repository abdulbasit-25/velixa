import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const SITE_URL = "https://Velixa.vercel.app";
const SITE_NAME = "Velixa";
const DEFAULT_TITLE = "Velixa — Talk, share, connect";
const DEFAULT_DESCRIPTION =
  "Start a voice call, video call, or screen share with a simple room code.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_IMAGE_ALT = "Velixa logo and screen sharing preview";
const ARCHER_URL = "https://abdulbasit-archer.vercel.app/";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/help", label: "Help" },
] as const;

const navLinkClass =
  "font-mono text-sm uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const navLinkActiveProps = {
  className: "text-text-primary",
  "aria-current": "page" as const,
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">Signal lost</p>
        <h1 className="mt-4 font-mono text-6xl text-text-primary">404</h1>
        <p className="mt-2 text-sm text-text-muted">This room isn&apos;t active.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            Return to base
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4" role="alert">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          Transmission interrupted
        </h1>
        <p className="mt-2 text-sm text-text-muted">The signal cut out. Retry or return to base.</p>
        {import.meta.env.DEV && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-panel p-3 text-left text-xs text-text-muted">
            {error.message}
          </pre>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-signal px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-signal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-panel-line bg-panel px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: DEFAULT_TITLE },
      { name: "description", content: DEFAULT_DESCRIPTION },
      { name: "theme-color", content: "#0b0b0f" },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: DEFAULT_TITLE },
      { property: "og:description", content: DEFAULT_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: DEFAULT_IMAGE },
      { property: "og:image:secure_url", content: DEFAULT_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: DEFAULT_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: DEFAULT_TITLE },
      { name: "twitter:description", content: DEFAULT_DESCRIPTION },
      { name: "twitter:image", content: DEFAULT_IMAGE },
      { name: "twitter:image:alt", content: DEFAULT_IMAGE_ALT },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <div className="min-h-screen bg-ink text-text-primary">
        <header className="border-b border-panel-line px-6 py-4 lg:px-10">
          <div className="mx-auto flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="font-mono text-sm uppercase tracking-[0.3em] text-text-muted hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              Velixa
            </Link>

            <button
              type="button"
              className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted hover:text-text-primary lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>

            <nav
              id="primary-nav"
              aria-label="Primary"
              className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-3 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-6`}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={navLinkClass}
                  activeProps={navLinkActiveProps}
                  activeOptions={{ exact: link.to === "/" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <a
              href={ARCHER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm uppercase tracking-[0.3em] text-text-muted transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              Powered by Archer
            </a>
          </div>
        </header>

        <main id="main-content">
          <Outlet />
        </main>

        <footer className="border-t border-panel-line px-6 py-6 text-center text-xs text-text-muted">
          <a
            href={ARCHER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono uppercase tracking-[0.3em] text-text-muted hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            Powered by Archer
          </a>
        </footer>
      </div>
      <Toaster theme="dark" position="bottom-right" />
    </QueryClientProvider>
  );
}
