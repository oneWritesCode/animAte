"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import CodeEditor from "./CodeEditor";
import PreviewFrame from "./PreviewFrame";
import type { PlaygroundFile } from "@/lib/playground/protocol";

/* -------------------------------------------------------------------------- */
/*  Floating preview window: drag it by its title bar, resize it by a corner  */
/* -------------------------------------------------------------------------- */

const MIN_SIZE = 50; // px, never smaller than a 50x50 square
const MAX_WIDTH_RATIO = 0.8; // never wider than 80vw
const MAX_HEIGHT_RATIO = 0.9; // never taller than 90vh
const INITIAL_SIZE = 400;

type Corner = "nw" | "ne" | "sw" | "se";
interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** One handle per corner; the classes put it on that corner with the matching resize cursor. */
const CORNER_HANDLES: { corner: Corner; className: string }[] = [
  { corner: "nw", className: "left-0 top-0 cursor-nwse-resize" },
  { corner: "ne", className: "right-0 top-0 cursor-nesw-resize" },
  { corner: "sw", className: "bottom-0 left-0 cursor-nesw-resize" },
  { corner: "se", className: "bottom-0 right-0 cursor-nwse-resize" },
];

function useFloatingWindow() {
  const windowRef = useRef<HTMLElement>(null);
  // null until the first drag/resize: until then the CSS (top-10 right-10, 400x400) places it.
  const [box, setBox] = useState<Box | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  /** The window's current box in screen pixels (read from the DOM, so it works before any state). */
  function readBox(): Box {
    const rect = windowRef.current!.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  }

  /**
   * Shared pointer logic. `update(startBox, dx, dy)` returns the new box for how far the pointer
   * moved since the press. Pointer capture keeps events coming even when the cursor leaves the handle.
   */
  function startInteraction(
    event: ReactPointerEvent<HTMLElement>,
    update: (start: Box, dx: number, dy: number) => Box,
  ) {
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);

    const start = readBox();
    const originX = event.clientX;
    const originY = event.clientY;
    setIsInteracting(true);
    setBox(start);

    function onMove(moveEvent: PointerEvent) {
      setBox(update(start, moveEvent.clientX - originX, moveEvent.clientY - originY));
    }
    function onEnd() {
      setIsInteracting(false);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onEnd);
      handle.removeEventListener("pointercancel", onEnd);
    }
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onEnd);
    handle.addEventListener("pointercancel", onEnd);
  }

  /** Keeps the window fully on screen. */
  function keepOnScreen(left: number, top: number, width: number, height: number): Box {
    return {
      width,
      height,
      left: clamp(left, 0, window.innerWidth - width),
      top: clamp(top, 0, window.innerHeight - height),
    };
  }

  function startDrag(event: ReactPointerEvent<HTMLElement>) {
    startInteraction(event, (start, dx, dy) =>
      keepOnScreen(start.left + dx, start.top + dy, start.width, start.height),
    );
  }

  function startResize(event: ReactPointerEvent<HTMLElement>, corner: Corner) {
    event.stopPropagation();
    startInteraction(event, (start, dx, dy) => {
      const maxWidth = window.innerWidth * MAX_WIDTH_RATIO;
      const maxHeight = window.innerHeight * MAX_HEIGHT_RATIO;
      const growsLeft = corner === "nw" || corner === "sw";
      const growsUp = corner === "nw" || corner === "ne";

      // Dragging a left/top corner outwards means moving the pointer in the negative direction.
      const width = clamp(start.width + (growsLeft ? -dx : dx), MIN_SIZE, maxWidth);
      const height = clamp(start.height + (growsUp ? -dy : dy), MIN_SIZE, maxHeight);

      // The edge opposite the corner stays where it was, so left/top move when growing left/up.
      const left = growsLeft ? start.left + (start.width - width) : start.left;
      const top = growsUp ? start.top + (start.height - height) : start.top;
      return keepOnScreen(left, top, width, height);
    });
  }

  return { windowRef, box, isInteracting, startDrag, startResize };
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

interface PlaygroundProps {
  title: string;
  initialFiles: PlaygroundFile[];
  /** The file that exports the component to render. Defaults to index.tsx. */
  entry?: string;
}

export default function Playground({
  title,
  initialFiles,
  entry = "index.tsx",
}: PlaygroundProps) {
  const [files, setFiles] = useState(initialFiles);
  const [activeFileName, setActiveFileName] = useState(entry);
  const [restartKey, setRestartKey] = useState(0);
  // Bumped on reset so the editor reloads the original text.
  const [editorVersion, setEditorVersion] = useState(0);
  const { windowRef, box, isInteracting, startDrag, startResize } = useFloatingWindow();

  const activeFile =
    files.find((file) => file.name === activeFileName) ?? files[0];

  function updateActiveFile(code: string) {
    setFiles((current) =>
      current.map((file) =>
        file.name === activeFile.name ? { ...file, code } : file,
      ),
    );
  }

  function resetCode() {
    setFiles(initialFiles);
    setEditorVersion((version) => version + 1);
    setRestartKey((key) => key + 1);
  }

  return (
    <div className="flex h-screen flex-col bg-[#1C1411] text-white">
      <header className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-white"
          >
            {"<-"}
          </Link>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setRestartKey((key) => key + 1)}
            className="rounded-md border border-white/15 px-3 py-1 transition hover:bg-black/10"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={resetCode}
              className="rounded-md border border-white/15 px-3 py-1 transition hover:bg-black/10"
            >
            Reset code
          </button>
        </div>
      </header>

      {/* The editor takes the whole width; the preview floats above it. */}
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="flex gap-1 px-2 pt-2" role="tablist">
          {files.map((file) => (
            <button
              key={file.name}
              type="button"
              role="tab"
              aria-selected={file.name === activeFile.name}
              onClick={() => setActiveFileName(file.name)}
              className={`rounded-t-md px-3 py-1.5 font-mono text-xs transition ${
                file.name === activeFile.name
                  ? "border border-white/10 bg-[--background] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>
        <div className="min-h-0 w-full flex-1">
          <CodeEditor
            key={`${activeFile.name}-${editorVersion}`}
            fileName={activeFile.name}
            initialCode={activeFile.code}
            onChange={updateActiveFile}
          />
        </div>
      </main>

      <section
        ref={windowRef}
        // Before the first drag, the classes place it at the top right. After that, `style` takes over.
        className={`fixed z-20 flex min-h-[50px] min-w-[50px] max-h-[90vh] max-w-[80vw] flex-col rounded-[1.2rem] bg-[#EDE9E9] p-0.5 shadow-xl ${
          box ? "" : "right-10 top-10"
        }`}
        style={
          box
            ? { left: box.left, top: box.top, width: box.width, height: box.height }
            : { width: INITIAL_SIZE, height: INITIAL_SIZE }
        }
      >
        {/* Title bar = drag handle */}
        <div
          onPointerDown={startDrag}
          className="flex shrink-0 cursor-grab touch-none select-none items-center overflow-hidden  active:cursor-grabbing"
        >
          <span className="whitespace-nowrap rounded-t-[1.1rem] border border-black/10 bg-background p-2 text-sm">
            Animation
          </span>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-[1.1rem] border border-black/10 bg-[var(--background)]">
          <PreviewFrame files={files} entry={entry} restartKey={restartKey} />
          {/* While dragging/resizing, the iframe would swallow pointer events: cover it. */}
          {isInteracting && <div className="absolute inset-0" />}
        </div>

        {CORNER_HANDLES.map(({ corner, className }) => (
          <div
            key={corner}
            onPointerDown={(event) => startResize(event, corner)}
            className={`absolute z-10 h-4 w-4 touch-none ${className}`}
            aria-label={`Resize from ${corner} corner`}
          />
        ))}
      </section>
    </div>
  );
}