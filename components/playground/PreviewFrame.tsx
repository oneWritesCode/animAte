"use client";

import { useEffect, useRef, useState } from "react";
import {
  PLAYGROUND_MESSAGE_SOURCE,
  PLAYGROUND_RUNTIME_URL,
  PLAYGROUND_TAILWIND_URL,
  isFrameMessage,
  type PlaygroundFile,
  type RunMessage,
} from "@/lib/playground/protocol";

type PreviewStatus = "loading" | "running" | "ready" | "error";

const STATUS_LABEL: Record<PreviewStatus, string> = {
  loading: "Loading preview…",
  running: "Running your code…",
  ready: "Running",
  error: "Error — check your code",
};

interface PreviewFrameProps {
  files: PlaygroundFile[];
  entry: string;
  /** Bump to throw the iframe away and start from a fresh page (the "Restart" button). */
  restartKey: number;
}

// The preview page: an empty #root and the runtime bundle. Everything else arrives by postMessage.
const FRAME_DOCUMENT = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; height: 100%; }
      body { display: flex; align-items: center; justify-content: center; background: #0f0a0a; color: #fff; font-family: system-ui, sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <!-- Tailwind watches the page, so classes the user types get styles instantly -->
    <style type="text/tailwindcss">
      @theme {
        --color-primary: #E8534A;
        --color-primary-hover: #D94040;
        --color-secondary: #F5A67A;
        --color-accent: #E8A09A;
        --color-surface: #FFF5F3;
      }
    </style>
    <script src="${PLAYGROUND_TAILWIND_URL}"></script>
    <script src="${PLAYGROUND_RUNTIME_URL}"></script>
  </body>
</html>`;

export default function PreviewFrame({ files, entry, restartKey }: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const latestRun = useRef<RunMessage>({ source: PLAYGROUND_MESSAGE_SOURCE, type: "run", files, entry });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<PreviewStatus>("loading");

  // Listen to the iframe. `event.source` check means no other window can talk to us.
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.source !== frameRef.current?.contentWindow || !isFrameMessage(event.data)) return;
      if (event.data.type === "ready") {
        event.source?.postMessage(latestRun.current, { targetOrigin: "*" });
        setStatus("running");
      }
      if (event.data.type === "rendered") {
        setErrorMessage(null);
        setStatus("ready");
      }
      if (event.data.type === "error") {
        setErrorMessage(event.data.message);
        setStatus("error");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Edits are sent after a short pause. A fresh iframe (first load, Restart) asks for the
  // current code itself by sending "ready", which is handled above.
  useEffect(() => {
    latestRun.current = { source: PLAYGROUND_MESSAGE_SOURCE, type: "run", files, entry };
    // "pending" immediately, so the bar reacts as soon as the user types
    const timer = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? current : "running"));
      frameRef.current?.contentWindow?.postMessage(latestRun.current, "*");
    }, 400);
    return () => window.clearTimeout(timer);
  }, [files, entry]);

  return (
    <div className="relative h-full w-full bg-backg">
      <StatusBar status={status} />
      <iframe
        key={restartKey}
        onLoad={() => setErrorMessage(null)}
        ref={frameRef}
        title="Animation preview"
        sandbox="allow-scripts"
        srcDoc={FRAME_DOCUMENT}
        className="h-full w-full border-0"
      />
      {errorMessage && (
        <pre className="absolute inset-x-0 bottom-0 max-h-[40%] overflow-auto whitespace-pre-wrap border-t border-red-500/40 bg-red-950/90 p-3 font-mono text-xs text-red-200">
          {errorMessage}
        </pre>
      )}
    </div>
  );
}

/** Thin bar on top of the preview: moving while loading/running, green when it works, red on error. */
function StatusBar({ status }: { status: PreviewStatus }) {
  const isBusy = status === "loading" || status === "running";
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10" role="status" aria-live="polite">
      <div className="w-full overflow-hidden bg-background">
        {isBusy ? (
          <div className="playground-bar h-full w-1/3 rounded-full bg-background" />
        ) : (
          <div className={`h-full w-full ${status === "error" ? "bg-red-500" : "bg-emerald-400"}`} />
        )}
      </div>
      <span
        className={`absolute right-3 top-2 rounded-full px-2.5 py-0.5 text-[11px] font-medium backdrop-blur ${
          status === "error"
            ? "bg-red-500/20 text-red-200"
            : status === "ready"
              ? "bg-emerald-400/15 text-emerald-200"
              : "bg-white/10 text-white/70"
        }`}
      >
        {STATUS_LABEL[status]}
      </span>
      <style>{`
        @keyframes playground-bar { from { transform: translateX(-100%); } to { transform: translateX(300%); } }
        .playground-bar { animation: playground-bar 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
