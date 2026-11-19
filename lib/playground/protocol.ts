/**
 * The messages the playground page (host) and the preview iframe (frame) send each other.
 * Shared by components/playground/PreviewFrame.tsx and lib/playground/runtime-entry.ts.
 */
/**
 * The messages the playground page (host) and the preview iframe (frame) send each other.
 * Shared by components/playground/PreviewFrame.tsx and lib/playground/runtime-entry.ts.
 */

export const PLAYGROUND_MESSAGE_SOURCE = "animate-playground" as const;
export const PLAYGROUND_RUNTIME_URL = "/playground-runtime.js";
export const PLAYGROUND_TAILWIND_URL = "/playground-tailwind.js";

export interface PlaygroundFile {
  name: string; // flat file name, e.g. "index.tsx" or "magnetic-button.css"
  code: string;
}

/** host -> frame */
export interface RunMessage {
  source: typeof PLAYGROUND_MESSAGE_SOURCE;
  type: "run";
  files: PlaygroundFile[];
  entry: string; // the file whose default export is rendered
}

/** frame -> host */
export type FrameMessage =
  | { source: typeof PLAYGROUND_MESSAGE_SOURCE; type: "ready" }
  | { source: typeof PLAYGROUND_MESSAGE_SOURCE; type: "rendered" }
  | { source: typeof PLAYGROUND_MESSAGE_SOURCE; type: "error"; message: string };

function isPlaygroundMessage(data: unknown): data is { source: string; type: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { source?: unknown }).source === PLAYGROUND_MESSAGE_SOURCE
  );
}

export function isRunMessage(data: unknown): data is RunMessage {
  return isPlaygroundMessage(data) && data.type === "run";
}

export function isFrameMessage(data: unknown): data is FrameMessage {
  return (
    isPlaygroundMessage(data) &&
    (data.type === "ready" || data.type === "rendered" || data.type === "error")
  );
}
