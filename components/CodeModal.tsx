"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AnimationCategory, CssAnimationItem } from "@/lib/types";
import { CheckIcon, CloseIcon, CodeIcon, CopyIcon, PlayIcon } from "./icons";
import { AnimationPreview } from "./Preview";
import Image from "next/image";
import logo from "../public/images/logo.png";

/* -------------------------------------------------------------------------- */
/*  Small syntax highlighter (CSS + HTML), so we don't need a library          */
/* -------------------------------------------------------------------------- */

type Language = "css" | "html";

// First rule that matches at the current position wins, so order matters.
const TOKEN_RULES: Record<Language, { pattern: RegExp; color: string }[]> = {
  css: [
    { pattern: /\/\*.*?\*\//y, color: "text-zinc-500 italic" }, // /* comment */
    { pattern: /@[\w-]+/y, color: "text-pink-400" }, // @keyframes
    { pattern: /#[0-9a-fA-F]{3,8}\b/y, color: "text-pink-400" }, // #F05B54
    {
      pattern: /-?\d*\.?\d+(?:px|rem|em|vh|vw|ms|s|deg|%)?/y,
      color: "text-orange-400",
    }, // 72px, 1.2s
    { pattern: /[\w-]+(?=\s*:)/y, color: "text-cyan-300" }, // property:
    { pattern: /[.#]?[\w-]+(?=\s*\{)/y, color: "text-yellow-300" }, // .selector {
    { pattern: /[\w-]+(?=\()/y, color: "text-yellow-100" }, // linear-gradient(
    { pattern: /[{}();:,]/y, color: "text-zinc-500" }, // punctuation
  ],
  html: [
    { pattern: /<!--.*?-->/y, color: "text-zinc-500 italic" },
    { pattern: /<\/?[\w-]+/y, color: "text-pink-400" }, // <div  </div
    { pattern: /\/?>/y, color: "text-pink-400" },
    { pattern: /[\w-]+(?==)/y, color: "text-cyan-300" }, // class=
    { pattern: /"[^"]*"/y, color: "text-lime-300" }, // "pulse"
    { pattern: /=/y, color: "text-zinc-500" },
  ],
};

function highlightLine(line: string, language: Language): ReactNode[] {
  const rules = TOKEN_RULES[language];
  const parts: ReactNode[] = [];
  let plain = "";
  let position = 0;

  const flushPlain = () => {
    if (plain) parts.push(plain);
    plain = "";
  };

  while (position < line.length) {
    let matched = false;

    for (const { pattern, color } of rules) {
      pattern.lastIndex = position;
      const match = pattern.exec(line);
      if (match && match[0].length > 0) {
        flushPlain();
        parts.push(
          <span key={position} className={color}>
            {match[0]}
          </span>,
        );
        position += match[0].length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      plain += line[position];
      position += 1;
    }
  }

  flushPlain();
  return parts;
}

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                               */
/* -------------------------------------------------------------------------- */

const CATEGORY_LABEL: Record<AnimationCategory, string> = {
  entrance: "Entrance",
  attention: "Attention",
  hover: "Hover",
  loaders: "Loader",
  text: "Text",
  background: "Background",
};

// How tall the code area is before "View Full Code" is pressed.
const COLLAPSED_CODE_HEIGHT = "19rem";

/* -------------------------------------------------------------------------- */
/*  The modal                                                                  */
/* -------------------------------------------------------------------------- */

export function CodeModal({
  item,
  onClose,
}: {
  item: CssAnimationItem;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const copyTimerRef = useRef<number | undefined>(undefined);

  const [tab, setTab] = useState<Language>("css");
  const [copied, setCopied] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [isLooping, setIsLooping] = useState(Boolean(item.loopsInPreview));
  const [showFullCode, setShowFullCode] = useState(false);

  const code = tab === "css" ? item.css : item.html;
  const lines = useMemo(() => code.split("\n"), [code]);

  // The preview component reads `loopsInPreview`, so the switch just overrides it.
  const previewItem = useMemo(
    () => ({ ...item, loopsInPreview: isLooping }),
    [item, isLooping],
  );

  const isDarkPreview = item.id === "neon-text";
  const showsRings = item.kind !== "bg" && !isDarkPreview;

  // Escape closes, the page behind stops scrolling, and focus starts on the close button.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(copyTimerRef.current);
    };
  }, [onClose]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false); // clipboard blocked (e.g. insecure context): nothing to confirm
    }
  }

  function toggleLoop() {
    setIsLooping((current) => !current);
    setReplayKey((key) => key + 1); // restart so the change is visible at once
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl shadow-zinc-900/20 sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header: swatch, name, close */}
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <Image
              aria-hidden="true"
              className="size-8 rounded-xl"
              src={logo}
              alt="logo"
            />
            <div>
              <h2
                id={titleId}
                className="text-xl font-semibold leading-[0.8]"
              >
                {item.name}
              </h2>
              <p className="text-sm text-zinc-500">
                {CATEGORY_LABEL[item.category]} Animation
              </p>
            </div>
          </div>
        </div>

        {/* Body: live preview on the left, code on the right */}
        <div className="grid min-h-0 flex-1 gap-4 overflow-auto px-4 lg:grid-cols-2">
          <div
            className={`relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 ${
              isDarkPreview ? "bg-zinc-950" : "bg-zinc-50"
            }`}
          >
            {showsRings ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 grid place-items-center"
              >
                <div className="absolute h-56 w-56 rounded-full border border-[var(--color-primary)]/10" />
                <div className="absolute h-80 w-80 rounded-full border border-[var(--color-primary)]/[0.06]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_65%)]" />
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setReplayKey((key) => key + 1)}
              className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300"
            >
              <ReplayIcon />
              Replay
            </button>

            <AnimationPreview item={previewItem} replayKey={replayKey} />
          </div>

          <div className="flex min-h-[300px] min-w-0 flex-col overflow-hidden rounded-2xl bg-[#13151c]">
            <div className="flex items-center justify-between border-b border-white/10 px-4">
              <div role="tablist" className="flex gap-1">
                {(["css", "html"] as const).map((name) => (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={tab === name}
                    onClick={() => setTab(name)}
                    className={`relative px-3 py-4 text-sm font-medium uppercase transition-colors ${
                      tab === name
                        ? "text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {name}
                    {tab === name ? (
                      <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--color-primary)]" />
                    ) : null}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[var(--color-primary)]/30 transition hover:brightness-105 active:scale-95"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <pre
              className="flex-1 overflow-auto py-4 font-mono text-[13px] leading-6 text-zinc-200"
              style={{
                maxHeight: showFullCode ? "none" : COLLAPSED_CODE_HEIGHT,
              }}
            >
              <code className="block min-w-max">
                {lines.map((line, index) => (
                  <span key={index} className="flex">
                    <span className="w-12 shrink-0 select-none pr-4 text-right text-zinc-600">
                      {index + 1}
                    </span>
                    <span className="whitespace-pre pr-6">
                      {highlightLine(line, tab)}
                    </span>
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>

        {/* Footer: hint + expand */}
        <div className="flex items-center justify-between gap-4 px-6 py-3 max-sm:justify-end">
          <p className="flex items-center gap-2 text-sm text-zinc-500 max-sm:hidden">
            <InfoIcon />
            Click copy to use this animation in your project.
          </p>
          <button
            type="button"
            onClick={() => setShowFullCode((current) => !current)}
            aria-expanded={showFullCode}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300"
          >
            <CodeIcon />
            {showFullCode ? "Collapse Code" : "View Full Code"}
            <ChevronIcon isOpen={showFullCode} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Icons only this modal uses                                                 */
/* -------------------------------------------------------------------------- */

function ReplayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
