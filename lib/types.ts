/**
 * Shared types for the whole library: the single source of truth.
 * (lib/animations/css/types.ts now imports from here instead of defining its own copies.)
 */

export type AnimationCategory =
  | "entrance"
  | "attention"
  | "hover"
  | "loaders"
  | "text"
  | "background";

export type PreviewKind = "box" | "text" | "loader" | "bg" | "custom";
/** CSS animations are rendered by AnimationPreview, which only knows these kinds. */
export type CssPreviewKind = Exclude<PreviewKind, "custom">;

/* -------------------------------------------------------------------------- */
/*  Code the user copies                                                       */
/* -------------------------------------------------------------------------- */

export type CodeLanguage = "tsx" | "ts" | "jsx" | "js" | "css" | "html";

export interface CodeFile {
  name: string; // e.g. "index.tsx", "magnetic-button.css"
  language: CodeLanguage;
  code: string;
}

/** Everything a user needs to copy one animation into their project. */
export interface AnimationCode {
  dependencies: string[]; // npm packages, e.g. ["gsap"]
  files: CodeFile[];
}

/* -------------------------------------------------------------------------- */
/*  Library items (what Library / AnimationCard render)                        */
/* -------------------------------------------------------------------------- */

interface AnimationItemBase {
  id: string;
  name: string;
  category: AnimationCategory;
  /** Your cards show a "New" badge when this is set. */
  tag?: string;
  kind: PreviewKind;
  /** npm packages the snippet needs. Empty for plain CSS. */
  dependencies: string[];
  previewText?: string;
  loopsInPreview?: boolean;
}

/** Your existing CSS animations (built by build() in lib/animations/css/types.ts). */
export interface CssAnimationItem extends AnimationItemBase {
  source: "css";
  kind: CssPreviewKind;
  className: string;
  css: string;
  html: string;
}

/**
 * A real React component (framer-motion, gsap, anything).
 * Its code is NOT stored here: it lives in public/r/<id>.json and is fetched
 * when the code is copied or the code modal opens, so the list stays small at 1000+ items.
 * Its live preview is lazy-loaded through componentLoaders in registry.generated.ts.
 */
export interface ComponentAnimationItem extends AnimationItemBase {
  source: "component";
}

export type AnimationItem = CssAnimationItem | ComponentAnimationItem;

/* -------------------------------------------------------------------------- */
/*  Authoring: what each animations/**\/meta.ts exports                        */
/* -------------------------------------------------------------------------- */

export interface ComponentAnimationMeta {
  id: string; // kebab-case, globally unique, e.g. "fm-staggered-fade-up"
  name: string;
  category: AnimationCategory;
  tag?: string; // set it only if the card should show the "New" badge
  kind?: PreviewKind; // defaults to "custom"
  dependencies: string[]; // every npm package the snippet imports (react is implied)
  previewText?: string;
}