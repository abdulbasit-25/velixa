import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Room code copied");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Clipboard unavailable");
    }
  };
  return (
    <button
      onClick={doCopy}
      className="inline-flex items-center gap-2 border border-panel-line bg-panel px-3 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-muted transition-colors hover:text-text-primary hover:border-link-cyan/60"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-link-cyan" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "copied" : label}
    </button>
  );
}
