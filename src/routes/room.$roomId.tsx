import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { normalizeRoomCode } from "@/lib/roomCode";
import { useHost, useViewer } from "@/hooks/usePeerConnection";
import { StatusBar } from "@/components/StatusBar";
import { HostDashboard } from "@/components/HostDashboard";
import { ViewerDashboard } from "@/components/ViewerDashboard";

const searchSchema = z.object({
  role: z.enum(["host", "viewer"]).optional(),
});

export const Route = createFileRoute("/room/$roomId")({
  validateSearch: searchSchema,
  head: ({ params }) => ({
    meta: [
      { title: `Frequency ${params.roomId} — Viorax` },
      {
        name: "description",
        content: `Tune in on frequency ${params.roomId} to receive a live screen broadcast.`,
      },
      { property: "og:title", content: `Frequency ${params.roomId}` },
      { property: "og:description", content: "Live screen broadcast via Viorax." },
      { property: "og:image", content: "https://Viorax.vercel.app/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://Viorax.vercel.app/og-image.jpg" },
      { name: "twitter:image:alt", content: "Viorax logo and screen sharing preview" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RoomPage,
});

function RoomPage() {
  const { roomId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  const code = useMemo(() => normalizeRoomCode(roomId), [roomId]);
  const isHost = search.role === "host";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (code.length !== 6) {
      toast.error("Invalid frequency code.");
      navigate({ to: "/" });
    }
  }, [code, navigate]);

  if (!mounted || code.length !== 6) {
    return <div className="min-h-screen bg-ink" />;
  }

  return isHost ? <HostRoom code={code} /> : <ViewerRoom code={code} />;
}

function toastEvent(msg: string, kind?: "info" | "error" | "success") {
  if (kind === "error") toast.error(msg);
  else if (kind === "success") toast.success(msg);
  else toast(msg);
}

function HostRoom({ code }: { code: string }) {
  const navigate = useNavigate();
  const host = useHost(code, toastEvent);
  const joinUrl =
    typeof window !== "undefined" ? `${window.location.origin}/room/${code}` : `/room/${code}`;

  const statusLabel =
    host.state === "initializing"
      ? "Opening"
      : host.state === "waiting"
        ? "Standby"
        : host.state === "connected"
          ? "Linked"
          : host.state === "live"
            ? "Live"
            : host.state === "error"
              ? "Error"
              : "—";

  const barState =
    host.state === "live"
      ? "live"
      : host.state === "connected"
        ? "connected"
        : host.state === "error"
          ? "error"
          : "idle";

  return (
    <main className="min-h-screen bg-ink">
      <StatusBar
        roomCode={code}
        role="Host"
        status={barState}
        statusLabel={statusLabel}
        onDisconnect={() => {
          host.destroy();
          navigate({ to: "/" });
        }}
      />
      {host.state === "error" ? (
        <div className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-destructive">
            Frequency error
          </p>
          <p className="mt-4 text-sm text-text-muted">{host.error}</p>
        </div>
      ) : (
        <HostDashboard roomCode={code} host={host} joinUrl={joinUrl} />
      )}
    </main>
  );
}

function ViewerRoom({ code }: { code: string }) {
  const navigate = useNavigate();
  const viewer = useViewer(code, toastEvent);

  const statusLabel =
    viewer.state === "initializing"
      ? "Tuning"
      : viewer.state === "waiting"
        ? "Reaching"
        : viewer.state === "connected"
          ? "Linked"
          : viewer.state === "live"
            ? "Receiving"
            : viewer.state === "disconnected"
              ? "Off-air"
              : viewer.state === "error"
                ? "Error"
                : "—";

  const barState =
    viewer.state === "live"
      ? "live"
      : viewer.state === "connected"
        ? "connected"
        : viewer.state === "error"
          ? "error"
          : "idle";

  return (
    <main className="min-h-screen bg-ink">
      <StatusBar
        roomCode={code}
        role="Viewer"
        status={barState}
        statusLabel={statusLabel}
        onDisconnect={() => {
          viewer.destroy();
          navigate({ to: "/" });
        }}
      />
      <ViewerDashboard viewer={viewer} roomCode={code} />
    </main>
  );
}
