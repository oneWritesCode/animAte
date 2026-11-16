import type {
  AnimationCategory,
  AnimationItem,
  PreviewKind,
} from "@/lib/types";

export type Def = {
  id: string;
  name: string;
  category: AnimationCategory;
  isNew?: boolean;
  kind?: PreviewKind;
  keyframes?: string;
  duration?: string;
  easing?: string;
  infinite?: boolean;
  classBody?: string;
  hoverBody?: string;
  extraCss?: string;
  html?: string;
  previewText?: string;
};

export const box = `  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: linear-gradient(135deg, #E8534A, #F5A67A);`;

export function build(def: Def): AnimationItem {
  const className = `anim-${def.id}`;
  const kind =
    def.kind ??
    (def.category === "loaders"
      ? "loader"
      : def.category === "text"
        ? "text"
        : def.category === "background"
          ? "bg"
          : "box");
  const duration = def.duration ?? "0.9s";
  const easing = def.easing ?? "ease";
  const iteration = def.infinite ? "infinite" : "both";

  const lines: string[] = [`/* ${def.name} */`];
  if (def.keyframes) {
    lines.push(`@keyframes ${className} {`, def.keyframes, `}`);
  }
  lines.push(`.${className} {`);
  if (def.keyframes) {
    lines.push(`  animation: ${className} ${duration} ${easing} ${iteration};`);
  }
  if (def.classBody) lines.push(def.classBody);
  lines.push(`}`);
  if (def.hoverBody) {
    lines.push(`.${className}:hover {`, def.hoverBody, `}`);
  }
  if (def.extraCss) lines.push(def.extraCss);

  const defaultHtml =
    kind === "text"
      ? `<p class="${className}">Motion</p>`
      : kind === "bg"
        ? `<div class="${className}"></div>`
        : `<div class="${className}"></div>`;

  return {
    id: def.id,
    name: def.name,
    category: def.category,
    isNew: def.isNew,
    kind,
    className,
    css: lines.join("\n"),
    html: def.html ?? defaultHtml,
    previewText: def.previewText,
    loopsInPreview:
      !def.infinite && !!def.keyframes && def.category !== "hover",
  };
}
