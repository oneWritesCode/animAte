"use client";

import { useEffect, useState } from "react";
import type { CssAnimationItem } from "@/lib/types";
import { CheckIcon, CloseIcon, CopyIcon } from "./icons";
import { AnimationPreview } from "./Preview";

export function CodeModal({
  item,
  onClose,
}: {
  item: CssAnimationItem;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"css" | "html">("css");
  const [copied, setCopied] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const code = tab === "css" ? item.css : item.html;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/40 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <p className="text-lg font-semibold ">{item.name}</p>
            <p className="text-sm capitalize ">{item.category} animation</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2  hover:bg-zinc-100"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 overflow-auto lg:grid-cols-2">
          <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden bg-zinc-50 p-8">
            {item.kind !== "bg" && item.id !== "neon-text" ? (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fff,_#f4f4f5)]" />
            ) : null}
            {item.id === "neon-text" ? <div className="absolute inset-0 bg-zinc-950" /> : null}
            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              className="absolute right-4 top-4 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium"
            >
              Replay
            </button>
            <AnimationPreview item={item} replayKey={replayKey} />
          </div>

          <div className="flex min-h-[280px] flex-col bg-zinc-950 p-4 ">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex rounded-lg bg-zinc-900 p-1 text-sm">
                {(["css", "html"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-md px-3 py-1.5 uppercase ${tab === t ? "bg-zinc-800 text-white" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-medium text-white"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="flex-1 overflow-auto rounded-xl bg-zinc-900 p-4 text-[13px] leading-6">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
