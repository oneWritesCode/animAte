"use client";

import { useState } from "react";
import { loadAnimationCode } from "@/lib/animations/code";
import type { AnimationItem } from "@/lib/types";
import { ComponentPreview } from "./ComponentPreview";
import { CodeIcon, CopyIcon, PlayIcon, SparkleIcon, StarIcon } from "./icons";
import { AnimationPreview } from "./Preview";

export function AnimationCard({
  item,
  favourite,
  onToggleFavourite,
  onOpen,
  onCopied,
}: {
  item: AnimationItem;
  favourite: boolean;
  onToggleFavourite: () => void;
  onOpen: () => void;
  onCopied: (message?: string) => void;
}) {
  const [replayKey, setReplayKey] = useState(0);
  const darkPreview = item.id === "neon-text";

  async function copy() {
    if (item.source === "css") {
      await navigator.clipboard.writeText(item.css);
      onCopied("CSS copied to clipboard");
      return;
    }

    try {
      const { files, dependencies } = await loadAnimationCode(item);
      if (files.length > 1) {
        // several files can't go on one clipboard: let the user copy each one in the modal
        onOpen();
        return;
      }
      await navigator.clipboard.writeText(files[0].code);
      onCopied(
        dependencies.length > 0
          ? `Copied. Install first: npm install ${dependencies.join(" ")}`
          : "Code copied to clipboard",
      );
    } catch {
      onOpen(); // code failed to load: the modal shows the error and a retry
    }
  }

  return (
    <article
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      onClick={onOpen}
    >
      <div className={`absolute inset-0 ${darkPreview ? "bg-zinc-950" : "bg-gradient-to-b from-white to-[var(--color-surface)]"}`}>
        <div className="flex h-full items-center justify-center">
          {item.source === "css" ? (
            <AnimationPreview item={item} replayKey={replayKey} />
          ) : (
            <ComponentPreview item={item} replayKey={replayKey} />
          )}
        </div>
      </div>

      {/* <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite();
        }}
        className={`absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 text-zinc-400 shadow-sm backdrop-blur ${favourite ? "border-[var(--color-border)] text-[var(--color-secondary)]" : "border-zinc-200"}`}
        aria-label={favourite ? "Remove favourite" : "Add favourite"}
      >
        <StarIcon filled={favourite} />
      </button> */}

      {item.tag ? (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[var(--color-primary)] shadow-sm backdrop-blur">
          <SparkleIcon className="h-3 w-3" />
          New
        </span>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center p-3 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 max-sm:pointer-events-auto max-sm:opacity-100">
        <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/95 p-1 shadow-lg backdrop-blur">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              copy();
            }}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <CopyIcon /> Copy
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <CodeIcon /> Code
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setReplayKey((k) => k + 1);
            }}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <PlayIcon /> Replay
          </button>
        </div>
      </div>
    </article>
  );
}