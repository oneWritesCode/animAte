import type { AnimationCategory, AnimationItem } from "@/lib/types";
import { entranceAnimations, entranceDefs } from "./entrance";
import { attentionAnimations, attentionDefs } from "./attention";
import { hoverAnimations, hoverDefs } from "./hover";
import { loaderAnimations, loaderDefs } from "./loader";
import { textAnimations, textDefs } from "./text";
import { backgroundAnimations, backgroundDefs } from "./backgroundAnim";

export * from "./types";
export * from "./entrance";
export * from "./attention";
export * from "./hover";
export * from "./loader";
export * from "./text";
export * from "./backgroundAnim";

export const allDefs = [
  ...entranceDefs,
  ...attentionDefs,
  ...hoverDefs,
  ...loaderDefs,
  ...textDefs,
  ...backgroundDefs,
];

export const animations: AnimationItem[] = [
  ...entranceAnimations,
  ...attentionAnimations,
  ...hoverAnimations,
  ...loaderAnimations,
  ...textAnimations,
  ...backgroundAnimations,
];

export const categories: {
  id: "all" | "favourites" | AnimationCategory;
  label: string;
}[] = [
  { id: "all", label: "All Animations" },
  { id: "entrance", label: "Entrance" },
  { id: "attention", label: "Attention" },
  { id: "hover", label: "Hover" },
  { id: "loaders", label: "Loaders" },
  { id: "text", label: "Text" },
  { id: "background", label: "Background" },
  { id: "favourites", label: "Favourites" },
];

export default animations;
