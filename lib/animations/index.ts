// export * from "./css/animations";
// export { default } from "./css/animations";
import { animations as cssAnimations } from "@/lib/animations/css/animations";
import { componentAnimations } from "@/lib/animations/registry.generated";
import type { AnimationItem } from "@/lib/types";
export const allAnimations: AnimationItem[] = [...cssAnimations, ...componentAnimations];