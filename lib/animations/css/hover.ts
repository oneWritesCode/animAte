import { type Def, box, build } from "./types";
import type { AnimationItem } from "./types";

export const hoverDefs: Def[] = [
  {
    id: "lift",
    name: "Lift Hover",
    category: "hover",
    tags: [
      "css",
      "hover",
      "transform",
      "shadow",
      "interactive",
      "box",
      "btn",
      "card",
    ],
    classBody: `${box}\n  transition: transform 0.3s ease, box-shadow 0.3s ease;`,
    hoverBody: `  transform: translateY(-10px);\n  box-shadow: 0 18px 30px rgba(232, 83, 74, 0.28);`,
  },
  {
    id: "grow",
    name: "Grow Hover",
    category: "hover",
    classBody: `${box}\n  transition: transform 0.28s ease;`,
    hoverBody: `  transform: scale(1.12);`,
  },
  {
    id: "shine",
    name: "Shine Hover",
    category: "hover",
    classBody: `${box}\n  position: relative;\n  overflow: hidden;`,
    extraCss: `.anim-shine::after {
content: "";
position: absolute;
inset: 0;
background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.55) 50%, transparent 60%);
transform: translateX(-120%);
transition: transform 0.6s ease;
// }
// .anim-shine:hover::after {
transform: translateX(120%);
// }`,
  },
  {
    id: "tilt",
    name: "Tilt Hover",
    category: "hover",
    classBody: `${box}\n  transition: transform 0.3s ease;`,
    hoverBody: `  transform: rotate(-6deg) scale(1.05);`,
  },
  {
    id: "glow-border",
    name: "Glow Border",
    category: "hover",
    classBody: `${box}\n  box-shadow: 0 0 0 0 rgba(232, 83, 74, 0);\n  transition: box-shadow 0.3s ease, transform 0.3s ease;`,
    hoverBody: `  box-shadow: 0 0 0 6px rgba(232, 83, 74, 0.25), 0 10px 24px rgba(232, 83, 74, 0.3);\n  transform: translateY(-4px);`,
  },
  {
    id: "underline-slide",
    name: "Underline Slide",
    category: "hover",
    kind: "text",
    previewText: "Hover me",
    html: `<span class="anim-underline-slide">Hover me</span>`,
    classBody: `  display: inline-block;\n  font-weight: 700;\n  font-size: 22px;\n  background-image: linear-gradient(#E8534A, #E8534A);\n  background-size: 0% 3px;\n  background-repeat: no-repeat;\n  background-position: left bottom;\n  transition: background-size 0.3s ease;`,
    hoverBody: `  background-size: 100% 3px;`,
  },
  {
    id: "rotate-y",
    name: "Flip Y Hover",
    category: "hover",
    classBody: `${box}\n  transition: transform 0.5s ease;\n  transform-style: preserve-3d;`,
    hoverBody: `  transform: rotateY(180deg);`,
  },
  {
    id: "shadow-pop",
    name: "Shadow Pop",
    category: "hover",
    classBody: `${box}\n  transition: box-shadow 0.3s ease, transform 0.3s ease;`,
    hoverBody: `  transform: translate(-4px, -4px);\n  box-shadow: 8px 8px 0 #2D1810;`,
  },
  {
    id: "color-wash",
    name: "Color Wash",
    category: "hover",
    classBody: `${box}\n  background: linear-gradient(135deg, #E8534A, #E8534A);\n  transition: filter 0.35s ease;`,
    hoverBody: `  filter: hue-rotate(20deg) saturate(1.3);`,
  },
  {
    id: "jelly-hover",
    name: "Jelly Hover",
    category: "hover",
    classBody: `${box}\n  transition: transform 0.35s cubic-bezier(.34,1.56,.64,1);`,
    hoverBody: `  transform: scale(1.12, 0.92);`,
  },
  {
    id: "neon",
    name: "Neon Hover",
    category: "hover",
    classBody: `${box}\n  background: #1A0A08;\n  transition: box-shadow 0.3s ease, transform 0.3s ease;`,
    hoverBody: `  box-shadow: 0 0 8px #F47B7B, 0 0 24px #E8534A, 0 0 40px #F5A67A;\n  transform: scale(1.04);`,
  },
  {
    id: "press",
    name: "Press Hover",
    category: "hover",
    classBody: `${box}\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n  box-shadow: 0 8px 0 #D94040;`,
    hoverBody: `  transform: translateY(6px);\n  box-shadow: 0 2px 0 #D94040;`,
  },
  {
    id: "skew",
    name: "Skew Hover",
    category: "hover",
    classBody: `${box}\n  transition: transform 0.3s ease;`,
    hoverBody: `  transform: skewX(-8deg) scale(1.04);`,
  },
  {
    id: "outline-grow",
    name: "Outline Grow",
    category: "hover",
    classBody: `${box}\n  outline: 0px solid rgba(232,83,74,.35);\n  outline-offset: 0px;\n  transition: outline 0.25s ease, outline-offset 0.25s ease;`,
    hoverBody: `  outline: 4px solid rgba(232,83,74,.4);\n  outline-offset: 8px;`,
  },
  {
    id: "nudge",
    name: "Nudge Hover",
    category: "hover",
    classBody: `${box}\n  transition: transform 0.25s ease;`,
    hoverBody: `  transform: translateX(10px);`,
  },
  {
    id: "grayscale-color",
    name: "Color Reveal",
    category: "hover",
    classBody: `${box}\n  filter: grayscale(1);\n  transition: filter 0.4s ease, transform 0.4s ease;`,
    hoverBody: `  filter: grayscale(0);\n  transform: scale(1.06);`,
  },
];

export const hoverAnimations: AnimationItem[] = hoverDefs.map(build);
export default hoverAnimations;
