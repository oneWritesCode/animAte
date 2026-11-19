/**
 * Runs INSIDE the sandboxed preview iframe.
 * scripts/build-playground-runtime.ts bundles this file (with its own copy of React, GSAP,
 * framer-motion and Sucrase) into public/playground-runtime.js.
 *
 * Why an iframe with its own copy of everything: the user's code then behaves exactly as it
 * would in a standalone project. `gsap.to(".box")` finds elements in this document, `window`
 * listeners hear events over the preview, and their CSS can't leak into your site.
 *
 * What it does for every "run" message from the page:
 *   1. compile each file with Sucrase (TypeScript + JSX -> CommonJS),
 *   2. execute the entry file with a tiny `require` (npm packages come from the table below,
 *      relative imports come from the playground's own files, .css files become <style> tags),
 *   3. render the entry's default export with React.
 */

import * as React from "react";
import * as ReactJsxRuntime from "react/jsx-runtime";
import * as ReactDom from "react-dom";
import * as ReactDomClient from "react-dom/client";
import gsap from "gsap";
import * as GsapModule from "gsap";
import * as CustomEaseModule from "gsap/CustomEase";
import * as DraggableModule from "gsap/Draggable";
import * as DrawSvgModule from "gsap/DrawSVGPlugin";
import * as FlipModule from "gsap/Flip";
import * as MotionPathModule from "gsap/MotionPathPlugin";
import * as ObserverModule from "gsap/Observer";
import * as ScrambleTextModule from "gsap/ScrambleTextPlugin";
import * as ScrollToModule from "gsap/ScrollToPlugin";
import * as ScrollTriggerModule from "gsap/ScrollTrigger";
import * as SplitTextModule from "gsap/SplitText";
import * as TextPluginModule from "gsap/TextPlugin";
import * as FramerMotionModule from "framer-motion";
import { transform } from "sucrase";
import {
  PLAYGROUND_MESSAGE_SOURCE,
  isRunMessage,
  type FrameMessage,
  type PlaygroundFile,
} from "./protocol";

/* -------------------------------------------------------------------------- */
/*  The npm packages the user's code may import                                */
/* -------------------------------------------------------------------------- */

type ModuleExports = Record<string, unknown>;

/** Makes a namespace importable the way bundlers do: `import x from` and `import { y } from`. */
function asModule(namespace: object, defaultExport?: unknown): ModuleExports {
  return {
    __esModule: true,
    ...namespace,
    ...(defaultExport === undefined ? {} : { default: defaultExport }),
  };
}

// To support another package, import it above and add one line here.
const EXTERNAL_MODULES: Record<string, ModuleExports> = {
  react: asModule(React, React),
  "react/jsx-runtime": asModule(ReactJsxRuntime),
  "react-dom": asModule(ReactDom, ReactDom),
  "react-dom/client": asModule(ReactDomClient),
  gsap: asModule(GsapModule, gsap),
  "gsap/CustomEase": asModule(CustomEaseModule),
  "gsap/Draggable": asModule(DraggableModule),
  "gsap/DrawSVGPlugin": asModule(DrawSvgModule),
  "gsap/Flip": asModule(FlipModule),
  "gsap/MotionPathPlugin": asModule(MotionPathModule),
  "gsap/Observer": asModule(ObserverModule),
  "gsap/ScrambleTextPlugin": asModule(ScrambleTextModule),
  "gsap/ScrollToPlugin": asModule(ScrollToModule),
  "gsap/ScrollTrigger": asModule(ScrollTriggerModule),
  "gsap/SplitText": asModule(SplitTextModule),
  "gsap/TextPlugin": asModule(TextPluginModule),
  // framer-motion has no default export, so neither do we: `import fm from "framer-motion"`
  // would break in the user's real project too.
  "framer-motion": asModule(FramerMotionModule),
};

/* -------------------------------------------------------------------------- */
/*  Talking to the page                                                        */
/* -------------------------------------------------------------------------- */

function postToHost(message: DistributiveOmit<FrameMessage, "source">) {
  window.parent.postMessage({ source: PLAYGROUND_MESSAGE_SOURCE, ...message }, "*");
}
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/* -------------------------------------------------------------------------- */
/*  A tiny CommonJS loader over the playground's files                         */
/* -------------------------------------------------------------------------- */

const SCRIPT_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];
const RESOLVABLE_EXTENSIONS = [...SCRIPT_EXTENSIONS, ".css"];

function normalizePath(path: string): string {
  const segments: string[] = [];
  for (const segment of path.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") segments.pop();
    else segments.push(segment);
  }
  return segments.join("/");
}

function resolveLocalFile(importer: string, specifier: string, fileNames: Set<string>): string | null {
  const importerDirectory = importer.includes("/") ? importer.slice(0, importer.lastIndexOf("/")) : "";
  const target = normalizePath(`${importerDirectory}/${specifier}`);
  const candidates = [
    target,
    ...RESOLVABLE_EXTENSIONS.map((extension) => `${target}${extension}`),
    ...SCRIPT_EXTENSIONS.map((extension) => `${target}/index${extension}`),
  ];
  return candidates.find((candidate) => fileNames.has(candidate)) ?? null;
}

function compile(file: PlaygroundFile): string {
  const isTypeScript = /\.tsx?$/.test(file.name);
  const hasJsx = /\.(tsx|jsx|js)$/.test(file.name);
  return transform(file.code, {
    transforms: [...(isTypeScript ? (["typescript"] as const) : []), ...(hasJsx ? (["jsx"] as const) : []), "imports"],
    jsxRuntime: "automatic",
    production: true,
    filePath: file.name,
  }).code;
}

interface RunResult {
  exports: ModuleExports;
  styleElements: HTMLStyleElement[];
}

function runFiles(files: PlaygroundFile[], entry: string): RunResult {
  const sources = new Map(files.map((file) => [file.name, file]));
  const fileNames = new Set(sources.keys());
  const moduleCache = new Map<string, { exports: ModuleExports }>();
  const styleElements: HTMLStyleElement[] = [];

  function requireFrom(importer: string) {
    return (specifier: string): unknown => {
      if (specifier.startsWith(".")) {
        const resolved = resolveLocalFile(importer, specifier, fileNames);
        if (!resolved) throw new Error(`Cannot find "${specifier}" imported from ${importer}`);
        return load(resolved);
      }

      const external = EXTERNAL_MODULES[specifier];
      if (!external) {
        const available = Object.keys(EXTERNAL_MODULES).join(", ");
        throw new Error(`"${specifier}" isn't available in the playground. Available packages: ${available}`);
      }
      return external;
    };
  }

  function load(fileName: string): ModuleExports {
    const cached = moduleCache.get(fileName);
    if (cached) return cached.exports;

    const file = sources.get(fileName)!;
    const moduleRecord = { exports: {} as ModuleExports };
    moduleCache.set(fileName, moduleRecord); // cached before running, so circular imports resolve

    if (fileName.endsWith(".css")) {
      const style = document.createElement("style");
      style.dataset.playgroundFile = fileName;
      style.textContent = file.code;
      document.head.append(style);
      styleElements.push(style);
      return moduleRecord.exports;
    }

    try {
      const run = new Function("require", "module", "exports", compile(file));
      run(requireFrom(fileName), moduleRecord, moduleRecord.exports);
    } catch (error) {
      throw new Error(`${fileName}: ${describeError(error)}`);
    }
    return moduleRecord.exports;
  }

  if (!sources.has(entry)) throw new Error(`Missing entry file "${entry}"`);
  return { exports: load(entry), styleElements };
}

/* -------------------------------------------------------------------------- */
/*  Rendering                                                                  */
/* -------------------------------------------------------------------------- */

class RunBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    postToHost({ type: "error", message: describeError(error) });
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Only mounts when the user's component rendered without throwing. */
function MountSignal() {
  React.useEffect(() => postToHost({ type: "rendered" }), []);
  return null;
}

const rootElement = document.getElementById("root")!;
let activeRoot: ReturnType<typeof ReactDomClient.createRoot> | null = null;
let activeStyles: HTMLStyleElement[] = [];

/** Gives the next run a clean slate (anything the user's code started is stopped). */
function teardown() {
  activeRoot?.unmount();
  activeRoot = null;
  activeStyles.forEach((style) => style.remove());
  activeStyles = [];
  gsap.globalTimeline.clear();
  ScrollTriggerModule.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.kill());
}

function run(files: PlaygroundFile[], entry: string) {
  teardown();

  try {
    const { exports, styleElements } = runFiles(files, entry);
    activeStyles = styleElements;

    const UserComponent = exports.default as React.ComponentType | undefined;
    if (UserComponent == null) throw new Error(`${entry} needs a default export (a React component)`);

    activeRoot = ReactDomClient.createRoot(rootElement);
    activeRoot.render(
      React.createElement(
        RunBoundary,
        null,
        React.createElement(UserComponent),
        React.createElement(MountSignal),
      ),
    );
  } catch (error) {
    postToHost({ type: "error", message: describeError(error) });
  }
}

/* -------------------------------------------------------------------------- */
/*  Start                                                                      */
/* -------------------------------------------------------------------------- */

window.addEventListener("message", (event) => {
  if (event.source !== window.parent || !isRunMessage(event.data)) return;
  run(event.data.files, event.data.entry);
});

// Errors thrown later (event handlers, timers, promises) never reach the React boundary.
window.addEventListener("error", (event) => {
  if (event.message?.startsWith("ResizeObserver loop")) return;
  postToHost({ type: "error", message: event.message || "Unknown error" });
});
window.addEventListener("unhandledrejection", (event) => {
  postToHost({ type: "error", message: describeError(event.reason) });
});

postToHost({ type: "ready" });
