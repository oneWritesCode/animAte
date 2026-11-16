export type AnimationCategory =
  | "entrance"
  | "attention"
  | "hover"
  | "loaders"
  | "text"
  | "background";

export type PreviewKind = "box" | "text" | "loader" | "bg";

export type AnimationItem = {
  id: string;
  name: string;
  category: AnimationCategory;
  isNew?: boolean;
  kind: PreviewKind;
  className: string;
  css: string;
  html: string;
  previewText?: string;
  loopsInPreview?: boolean;
};
