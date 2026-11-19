"use client";

import { useState } from "react";
import Link from "next/link";
import CodeEditor from "./CodeEditor";
import PreviewFrame from "./PreviewFrame";
import type { PlaygroundFile } from "@/lib/playground/protocol";

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
    <div className="flex h-screen flex-col bg-[--background]">
      <header className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-black/60 transition hover:text-black"
          >
            {"<-"}
          </Link>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setRestartKey((key) => key + 1)}
            className="rounded-md border border-black/15 px-3 py-1 transition hover:bg-black/10"
          >
            Restart
          </button>
          <button
            type="button"
            onClick={resetCode}
            className="rounded-md border border-black/15 px-3 py-1 transition hover:bg-black/10"
          >
            Reset code
          </button>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
        <section className="flex min-h-0 flex-col">
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
                    ? "border border-black/10 bg-[--background] text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>
          <div className="w-full min-h-0 flex-1">
            <CodeEditor
              key={`${activeFile.name}-${editorVersion}`}
              fileName={activeFile.name}
              initialCode={activeFile.code}
              onChange={updateActiveFile}
            />
          </div>
        </section>

        <section className="min-h-0 p-0.5 borderborder-black md:border-t-0 rounded-[1.2rem] absolute top-10 right-10 flex flex-col item-center justify-center bg-[#EDE9E9]">
          <div className="pt-2">
            <span className="rounded-t-[1.1rem] p-2 bg-background border-black/10 border">
              Animation
            </span>
          </div>
          <div className=" bg-[var(--background)] rounded-b-[1.1rem] border border-black/10 w-full h-full">
            <PreviewFrame files={files} entry={entry} restartKey={restartKey} />
          </div>
        </section>
      </main>
    </div>
  );
}
