import { type Def, build } from "./types";
import type { AnimationItem } from "./types";

export const backgroundDefs: Def[] = [
  {
    id: "aurora",
    name: "Aurora",
    category: "background",
    tag: "new",
    infinite: true,
    duration: "8s",
    easing: "ease-in-out",
    keyframes: `  0%, 100% { background-position: 0% 50%; }\n  50% { background-position: 100% 50%; }`,
    classBody: `  width: 100%;\n  height: 100%;\n  min-height: 180px;\n  background: linear-gradient(120deg, #ede9fe, #fce7f3, #e0f2fe, #ede9fe);\n  background-size: 220% 220%;`,
  },
  // {
  //   id: "gradient-shift",
  //   name: "Gradient Shift",
  //   category: "background",
  //   infinite: true,
  //   duration: "5s",
  //   easing: "linear",
  //   keyframes: `  to { filter: hue-rotate(360deg); }`,
  //   classBody: `  width: 100%;\n  height: 100%;\n  min-height: 180px;\n  background: linear-gradient(135deg, #7c5cff, #22d3ee);`,
  // },
  // {
  //   id: "blob",
  //   name: "Soft Blob",
  //   category: "background",
  //   infinite: true,
  //   duration: "7s",
  //   easing: "ease-in-out",
  //   keyframes: `  0%, 100% { border-radius: 42% 58% 37% 63% / 40% 38% 62% 60%; transform: translate(0,0) rotate(0); }\n  50% { border-radius: 60% 40% 70% 30% / 30% 70% 30% 70%; transform: translate(8px, -10px) rotate(12deg); }`,
  //   classBody: `  width: 140px;\n  height: 140px;\n  background: linear-gradient(135deg, #c084fc, #818cf8);`,
  // },
  // {
  //   id: "mesh-move",
  //   name: "Mesh Move",
  //   category: "background",
  //   infinite: true,
  //   duration: "10s",
  //   easing: "ease-in-out",
  //   keyframes: `  0%, 100% { background-position: 0% 0%, 100% 100%, 50% 50%; }\n  50% { background-position: 100% 40%, 0% 80%, 30% 10%; }`,
  //   classBody: `  width: 100%;\n  height: 100%;\n  min-height: 180px;\n  background:
  //   radial-gradient(at 20% 20%, #ddd6fe 0px, transparent 50%),
  //   radial-gradient(at 80% 0%, #fbcfe8 0px, transparent 45%),
  //   radial-gradient(at 50% 80%, #bae6fd 0px, transparent 50%);
  // background-color: #f8fafc;`,
  // },
  // {
  //   id: "stripes",
  //   name: "Moving Stripes",
  //   category: "background",
  //   infinite: true,
  //   duration: "2s",
  //   easing: "linear",
  //   keyframes: `  to { background-position: 40px 0; }`,
  //   classBody: `  width: 100%;\n  height: 100%;\n  min-height: 180px;\n  background-image: repeating-linear-gradient(-45deg, #f5f3ff, #f5f3ff 12px, #ede9fe 12px, #ede9fe 24px);\n  background-size: 40px 40px;`,
  // },
  // {
  //   id: "sparkle",
  //   name: "Sparkle Field",
  //   category: "background",
  //   infinite: true,
  //   duration: "2.4s",
  //   keyframes: `  0%, 100% { opacity: 0.7; filter: hue-rotate(0deg); }\n  50% { opacity: 1; filter: hue-rotate(40deg); }`,
  //   classBody: `  width: 100%;\n  height: 100%;\n  min-height: 180px;\n  background:
  //   radial-gradient(circle at 20% 30%, #c4b5fd 0 2px, transparent 3px),
  //   radial-gradient(circle at 70% 20%, #f0abfc 0 2px, transparent 3px),
  //   radial-gradient(circle at 40% 70%, #67e8f9 0 2px, transparent 3px),
  //   radial-gradient(circle at 80% 70%, #fda4af 0 2px, transparent 3px),
  //   linear-gradient(180deg, #faf5ff, #eef2ff);`,
  // },
  // {
  //   id: "orbs",
  //   name: "Floating Orbs",
  //   category: "background",
  //   infinite: true,
  //   duration: "8s",
  //   easing: "ease-in-out",
  //   keyframes: `  0%, 100% { background-position: 10% 20%, 80% 70%, 40% 80%; }\n  50% { background-position: 30% 60%, 60% 20%, 70% 50%; }`,
  //   classBody: `  width: 100%;\n  height: 100%;\n  min-height: 180px;\n  background:
  //   radial-gradient(circle at 20% 20%, rgba(167,139,250,.7) 0 80px, transparent 81px),
  //   radial-gradient(circle at 80% 70%, rgba(244,114,182,.55) 0 90px, transparent 91px),
  //   radial-gradient(circle at 50% 80%, rgba(103,232,249,.45) 0 70px, transparent 71px);
  // background-color: #f8fafc;
  // background-repeat: no-repeat;`,
  // },
  // {
  //   id: "shimmer-bg",
  //   name: "Shimmer Wash",
  //   category: "background",
  //   infinite: true,
  //   duration: "2.8s",
  //   easing: "linear",
  //   keyframes: `  0% { background-position: 0% 50%; }\n  100% { background-position: 100% 50%; }`,
  //   classBody: `  width: 100%;\n  height: 100%;\n  min-height: 180px;\n  background: linear-gradient(110deg, #f5f3ff 30%, #ffffff 50%, #f5f3ff 70%);\n  background-size: 200% 100%;`,
  // },
];

export const backgroundAnimations: AnimationItem[] = backgroundDefs.map(build);
export default backgroundAnimations;
