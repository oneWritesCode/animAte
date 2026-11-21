"use client";

import { useEffect, useRef } from "react";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import {
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
} from "@codemirror/language";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { autoCloseTags, javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { materialDark, materialLight } from "@uiw/codemirror-theme-material";

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

interface CodeEditorProps {
  /** Changing `fileName` loads a different document; typing only reports through onChange. */
  fileName: string;
  initialCode: string;
  onChange: (code: string) => void;
  theme?: "light" | "dark";
}

/* -------------------------------------------------------------------------- */
/*  Look and feel                                                              */
/* -------------------------------------------------------------------------- */

// Size and font of the text. Same for light and dark.
const baseLook = EditorView.theme({
  "&": { height: "100%", fontSize: "13px" },
  ".cm-scroller": {
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
    lineHeight: "1.6",
  },
});

// "Material Darker" is Material Dark on a neutral grey instead of blue-grey.
// It is listed after materialDark, so these colours win.
const materialDarkerOverrides = EditorView.theme(
  {
    "&": { backgroundColor: "#1C1411", color: "#EEFFFF" },
    ".cm-gutters": {
      backgroundColor: "#1C1411",
      color: "#999999",
      border: "none",
    },
    ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "#1C1411" },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
      backgroundColor: "#404040 !important",
    },
    ".cm-cursor": { borderLeftColor: "#FFCC00" },
  },
  { dark: true },
);


// function themeExtensions(theme: "light" | "dark"): Extension {
//   return theme === "dark"
//     ? [materialDark, materialDarkerOverrides]
//     : materialLight;
// }

/* -------------------------------------------------------------------------- */
/*  Behaviour                                                                  */
/* -------------------------------------------------------------------------- */

/** Everything that makes typing feel like VS Code. `language` decides the extras. */
function editingFeatures(isCss: boolean): Extension[] {
  return [
    lineNumbers(),
    foldGutter(), // little arrows in the gutter to collapse a function or block
    highlightActiveLine(),
    history(), // undo / redo
    EditorView.lineWrapping, // long lines wrap instead of scrolling sideways
    indentOnInput(), // typing a closing } moves it back to the right indent
    bracketMatching(), // highlights the partner of the bracket next to the cursor
    closeBrackets(), // typing ( [ { " ' ` also types the closing one
    autocompletion(), // suggestions while you type; Enter or Tab accepts
    ...(isCss
      ? [css()]
      : [javascript({ jsx: true, typescript: true }), autoCloseTags]), // autoCloseTags: <div> adds </div>
    keymap.of([
      ...closeBracketsKeymap, // Backspace deletes both brackets of an empty pair
      ...defaultKeymap, // includes Enter, which indents between { and }
      ...historyKeymap,
      ...foldKeymap, // Ctrl-Shift-[ folds, Ctrl-Shift-] unfolds
      indentWithTab,
    ]),
  ];
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function CodeEditor({
  fileName,
  initialCode,
  onChange,
//   theme = "light",
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  // A compartment lets us swap the theme later without rebuilding the editor (cursor and undo stay).
//   const themeCompartment = useRef(new Compartment());
  // Always holds the latest theme, so the editor below starts with the right one.
//   const themeRef = useRef(theme);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Build one editor per file. Each file keeps its own undo history.
  useEffect(() => {
    if (!containerRef.current) return;

    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: initialCode,
        extensions: [
          ...editingFeatures(fileName.endsWith(".css")),
          materialDarkerOverrides,
          materialDark,
        //   themeCompartment.current.of(themeExtensions(themeRef.current)),
          baseLook,
          // Tell the page about every edit.
          EditorView.updateListener.of((update) => {
            if (update.docChanged)
              onChangeRef.current(update.state.doc.toString());
          }),
        ],
      }),
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // initialCode is only the starting text; later edits live inside the editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]);

  // Light <-> dark: swap only the theme part of the editor.
//   useEffect(() => {
//     themeRef.current = theme;
//     viewRef.current?.dispatch({
//       effects: themeCompartment.current.reconfigure(themeExtensions(theme)),
//     });
//   }, [theme]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-hidden [&_.cm-editor]:h-full"
    />
  );
}
