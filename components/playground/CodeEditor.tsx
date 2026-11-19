"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeEditorProps {
  /** Changing `fileName` loads a different document; typing only reports through onChange. */
  fileName: string;
  initialCode: string;
  onChange: (code: string) => void;
}

const editorTheme = EditorView.theme({
  "&": { height: "100%", fontSize: "13px" },
  ".cm-scroller": { fontFamily: "var(--font-geist-mono), ui-monospace, monospace", lineHeight: "1.6" },
});

export default function CodeEditor({ fileName, initialCode, onChange }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // One editor per file: re-created when the tab changes, so each file keeps its own undo history.
  useEffect(() => {
    if (!containerRef.current) return;

    const language = fileName.endsWith(".css") ? css() : javascript({ jsx: true, typescript: true });
    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: initialCode,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          language,
          oneDark,
          editorTheme,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current(update.state.doc.toString());
          }),
        ],
      }),
    });

    return () => view.destroy();
    // initialCode is only the starting text; later edits live inside the editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]);

  return <div ref={containerRef} className="bg-red-800 border-4 w-[100vw] h-full overflow-hidden [&_.cm-editor]:h-full" />;
}
