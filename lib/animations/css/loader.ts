import { type Def, box, build } from "./types";
import type { AnimationItem } from "./types";

export const loaderDefs: Def[] = [
  // {
  //   id: "spinner",
  //   name: "Spinner",
  //   category: "loaders",
  //   tag: "new",
  //   infinite: true,
  //   duration: "0.8s",
  //   easing: "linear",
  //   keyframes: `  to { transform: rotate(360deg); }`,
  //   classBody: `  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  border: 4px solid #FDE8E4;\n  border-top-color: #E8534A;`,
  // },
//   {
//     id: "dual-ring",
//     name: "Dual Ring",
//     category: "loaders",
//     infinite: true,
//     duration: "1s",
//     easing: "linear",
//     keyframes: `  to { transform: rotate(360deg); }`,
//     classBody: `  width: 46px;\n  height: 46px;\n  border-radius: 50%;\n  border: 4px solid transparent;\n  border-top-color: #E8534A;\n  border-bottom-color: #F5A67A;`,
//   },
//   {
//     id: "dots",
//     name: "Dot Pulse",
//     category: "loaders",
//     infinite: true,
//     duration: "1s",
//     keyframes: `  0%, 80%, 100% { box-shadow: -24px 0 #E8534A, 0 0 #E8534A, 24px 0 #E8534A; opacity: .35; }\n  40% { box-shadow: -24px 0 #E8534A, 0 0 #E8534A, 24px 0 #E8534A; opacity: 1; }`,
//     classBody: `  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  background: #E8534A;\n  color: #E8534A;`,
//   },
//   {
//     id: "bouncing-dots",
//     name: "Bouncing Dots",
//     category: "loaders",
//     infinite: true,
//     duration: "0.6s",
//     keyframes: `  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-14px); }`,
//     classBody: `  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background: #E8534A;\n  box-shadow: -22px 0 #F5A67A, 22px 0 #F47B7B;`,
//   },
//   {
//     id: "bars",
//     name: "Bars",
//     category: "loaders",
//     infinite: true,
//     duration: "1s",
//     keyframes: `  0%, 100% { transform: scaleY(0.4); }\n  50% { transform: scaleY(1); }`,
//     classBody: `  width: 8px;\n  height: 36px;\n  background: #E8534A;\n  border-radius: 4px;\n  box-shadow: -14px 0 #F5A67A, 14px 0 #F47B7B;`,
//   },
//   {
//     id: "eq-bars",
//     name: "EQ Bars",
//     category: "loaders",
//     infinite: true,
//     duration: "0.7s",
//     keyframes: `  0%, 100% { height: 12px; }\n  50% { height: 36px; }`,
//     classBody: `  width: 8px;\n  height: 36px;\n  background: #E8534A;\n  border-radius: 99px;\n  box-shadow: -14px 0 #E8A09A, 14px 0 #F0C097;`,
//   },
//   {
//     id: "pulse-ring",
//     name: "Pulse Ring",
//     category: "loaders",
//     infinite: true,
//     duration: "1.4s",
//     keyframes: `  0% { transform: scale(0.5); opacity: 1; }\n  100% { transform: scale(1.4); opacity: 0; }`,
//     classBody: `  width: 48px;\n  height: 48px;\n  border: 3px solid #E8534A;\n  border-radius: 50%;`,
//   },
//   {
//     id: "orbit",
//     name: "Orbit",
//     category: "loaders",
//     infinite: true,
//     duration: "1.1s",
//     easing: "linear",
//     keyframes: `  to { transform: rotate(360deg); }`,
//     classBody: `  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  border: 2px dashed #E8A09A;\n  position: relative;`,
//     extraCss: `.anim-orbit::before {
//   content: "";
//   position: absolute;
//   top: -6px;
//   left: 18px;
//   width: 12px;
//   height: 12px;
//   border-radius: 50%;
//   background: #E8534A;
// }`,
//   },
//   {
//     id: "wave",
//     name: "Wave Loader",
//     category: "loaders",
//     infinite: true,
//     duration: "1.2s",
//     keyframes: `  0%, 100% { clip-path: inset(40% 0 40% 0); }\n  50% { clip-path: inset(10% 0 10% 0); }`,
//     classBody: `  width: 72px;\n  height: 36px;\n  background: linear-gradient(90deg, #E8534A, #F0C097);\n  border-radius: 999px;`,
//   },
  //   {
  //     id: "ripple",
  //     name: "Ripple",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1.2s",
  //     keyframes: `  0% { transform: scale(0.2); opacity: 0.8; }\n  100% { transform: scale(1); opacity: 0; }`,
  //     classBody: `  width: 52px;\n  height: 52px;\n  border: 4px solid #E8A09A;\n  border-radius: 50%;`,
  //   },
  //   {
  //     id: "cube-flip",
  //     name: "Cube Flip",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1s",
  //     keyframes: `  0% { transform: perspective(120px) rotateX(0) rotateY(0); }\n  50% { transform: perspective(120px) rotateX(180deg) rotateY(0); }\n  100% { transform: perspective(120px) rotateX(180deg) rotateY(180deg); }`,
  //     classBody: box,
  //   },
  //   {
  //     id: "hourglass",
  //     name: "Hourglass",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1.2s",
  //     keyframes: `  0% { transform: rotate(0); border-radius: 18px; }\n  50% { transform: rotate(180deg); border-radius: 50%; }\n  100% { transform: rotate(360deg); border-radius: 18px; }`,
  //     classBody: box,
  //   },
  //   {
  //     id: "infinity",
  //     name: "Infinity",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1.4s",
  //     easing: "linear",
  //     keyframes: `  0% { transform: rotate(0) scale(1); }\n  50% { transform: rotate(180deg) scale(0.7); }\n  100% { transform: rotate(360deg) scale(1); }`,
  //     classBody: `  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: #E8534A;\n  box-shadow: 28px 0 #F0C097;`,
  //   },
  //   {
  //     id: "shimmer",
  //     name: "Shimmer",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1.4s",
  //     easing: "linear",
  //     keyframes: `  0% { background-position: -120px 0; }\n  100% { background-position: 120px 0; }`,
  //     classBody: `  width: 120px;\n  height: 16px;\n  border-radius: 999px;\n  background: linear-gradient(90deg, #FDE8E4 0%, #F0D5D0 40%, #FDE8E4 80%);\n  background-size: 200% 100%;`,
  //   },
  //   {
  //     id: "progress",
  //     name: "Indeterminate Bar",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1.4s",
  //     easing: "ease-in-out",
  //     keyframes: `  0% { transform: translateX(-120%); }\n  100% { transform: translateX(220%); }`,
  //     classBody: `  width: 40%;\n  height: 8px;\n  border-radius: 99px;\n  background: #E8534A;`,
  //     extraCss: `.anim-progress-track {
  //   width: 140px;
  //   height: 8px;
  //   background: #FDE8E4;
  //   border-radius: 99px;
  //   overflow: hidden;
  // }`,
  //     html: `<div class="anim-progress-track"><div class="anim-progress"></div></div>`,
  //   },
  //   {
  //     id: "squares",
  //     name: "Squares",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "0.9s",
  //     keyframes: `  0%, 100% { transform: rotate(0) scale(1); }\n  50% { transform: rotate(45deg) scale(0.7); }`,
  //     classBody: `  width: 22px;\n  height: 22px;\n  background: #E8534A;\n  box-shadow: 28px 0 #F5A67A, 0 28px #F47B7B, 28px 28px #F0C097;`,
  //   },
  //   {
  //     id: "spiral",
  //     name: "Spiral",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1s",
  //     easing: "linear",
  //     keyframes: `  to { transform: rotate(360deg); }`,
  //     classBody: `  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  border: 4px solid #FDE8E4;\n  border-right-color: #E8534A;\n  border-bottom-color: #F0C097;`,
  //   },
  //   {
  //     id: "dna",
  //     name: "DNA Twist",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1.2s",
  //     keyframes: `  0%, 100% { transform: scaleY(1); }\n  50% { transform: scaleY(0.4); }`,
  //     classBody: `  width: 10px;\n  height: 40px;\n  border-radius: 99px;\n  background: linear-gradient(#E8534A, #F0C097);\n  box-shadow: 18px 0 #F0C097;`,
  //   },
  //   {
  //     id: "typing-dots",
  //     name: "Typing Dots",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "1.2s",
  //     keyframes: `  0%, 100% { opacity: 0.2; transform: translateY(0); }\n  50% { opacity: 1; transform: translateY(-6px); }`,
  //     classBody: `  width: 10px;\n  height: 10px;\n  background: #E8534A;\n  border-radius: 50%;\n  box-shadow: 16px 0 #E8534A, 32px 0 #E8534A;`,
  //   },
  //   {
  //     id: "pacman",
  //     name: "Pacman",
  //     category: "loaders",
  //     infinite: true,
  //     duration: "0.45s",
  //     keyframes: `  0%, 100% { clip-path: polygon(0 0, 100% 40%, 100% 60%, 0 100%); }\n  50% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }`,
  //     classBody: `  width: 48px;\n  height: 48px;\n  background: #facc15;\n  border-radius: 50%;`,
  //   },
];

export const loaderAnimations: AnimationItem[] = loaderDefs.map(build);
export default loaderAnimations;
