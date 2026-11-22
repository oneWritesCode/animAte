"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [replayKey, setReplayKey] = useState(0);
  const darkPreview = item.id === "neon-text";

  // CSS animations are short, so they copy straight from the card or open the modal.
  // JSX animations (gsap / framer-motion) can be long: send the user to the playground
  // so they read and tweak the implementation instead of copying code blindly.
  const playgroundHref = `/playground/${item.id}`;

  async function copyCss() {
    if (item.source !== "css") return;
    await navigator.clipboard.writeText(item.css);
    onCopied("CSS copied to clipboard");
  }

  // function open() {
  //   if (item.source === "css") onOpen();
  //   else router.push(playgroundHref);
  // }

  return (
    <article
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      // onClick={open}
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
          {item.source === "css" ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyCss();
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
            </>
          ) : (
            <Link
              href={playgroundHref}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
            >
              <CodeIcon /> Playground
            </Link>
          )}
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