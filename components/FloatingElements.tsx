// "use client";

// import {
//   motion,
//   useMotionValue,
//   useReducedMotion,
//   useSpring,
//   useTransform,
//   type MotionValue,
// } from "framer-motion";
// import { useEffect, type ReactNode } from "react";

// /* -------------------------------------------------------------------------- */
// /*  Mouse parallax                                                             */
// /* -------------------------------------------------------------------------- */

// const PARALLAX_SPRING = { stiffness: 60, damping: 20, mass: 0.6 };

// /** Pointer position normalised to -0.5..0.5, smoothed with a spring. */
// function useSmoothedPointer(enabled: boolean) {
//   const pointerX = useMotionValue(0);
//   const pointerY = useMotionValue(0);
//   const smoothX = useSpring(pointerX, PARALLAX_SPRING);
//   const smoothY = useSpring(pointerY, PARALLAX_SPRING);

//   useEffect(() => {
//     if (!enabled) return;

//     const handlePointerMove = (event: PointerEvent) => {
//       pointerX.set(event.clientX / window.innerWidth - 0.5);
//       pointerY.set(event.clientY / window.innerHeight - 0.5);
//     };

//     window.addEventListener("pointermove", handlePointerMove, { passive: true });
//     return () => window.removeEventListener("pointermove", handlePointerMove);
//   }, [enabled, pointerX, pointerY]);

//   return { smoothX, smoothY };
// }

// /* -------------------------------------------------------------------------- */
// /*  FloatingItem: parallax wrapper + endless float loop                        */
// /* -------------------------------------------------------------------------- */

// interface FloatingItemProps {
//   className: string;
//   children: ReactNode;
//   pointerX: MotionValue<number>;
//   pointerY: MotionValue<number>;
//   /** How far (px) the item drifts across the full width of the screen. Bigger = closer to the viewer. */
//   depth: number;
//   floatDistance?: number;
//   floatRotation?: number;
//   floatDuration?: number;
//   floatDelay?: number;
//   animated: boolean;
// }

// function FloatingItem({
//   className,
//   children,
//   pointerX,
//   pointerY,
//   depth,
//   floatDistance = 14,
//   floatRotation = 3,
//   floatDuration = 5,
//   floatDelay = 0,
//   animated,
// }: FloatingItemProps) {
//   const parallaxX = useTransform(pointerX, (value) => value * depth);
//   const parallaxY = useTransform(pointerY, (value) => value * depth);

//   return (
//     <motion.div className={`absolute ${className}`} style={animated ? { x: parallaxX, y: parallaxY } : undefined}>
//       <motion.div
//         animate={
//           animated
//             ? { y: [0, -floatDistance, 0], rotate: [-floatRotation, floatRotation, -floatRotation] }
//             : undefined
//         }
//         transition={{ duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: "easeInOut" }}
//       >
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  The three illustrations                                                    */
// /* -------------------------------------------------------------------------- */

// const CURSOR_ARROW_PATH = "M6 4 L6 31 L13.5 24 L18.5 35 L24 32.5 L19 21.5 L29.5 21.5 Z";

// const BURST_LINES = [
//   { d: "M44 14 L40 4", delay: 0 },
//   { d: "M52 22 L61 15", delay: 0.18 },
//   { d: "M54 33 L65 31", delay: 0.36 },
// ];

// function CursorWithBurst({ animated }: { animated: boolean }) {
//   return (
//     <svg
//       viewBox="0 0 72 52"
//       className="h-20 w-28 overflow-visible sm:h-28 sm:w-40"
//       style={{ filter: "drop-shadow(0 10px 14px rgba(124,58,237,0.35))" }}
//     >
//       {/* purple burst lines, pulsing outwards from the tip */}
//       {BURST_LINES.map((line) => (
//         <motion.path
//           key={line.d}
//           d={line.d}
//           stroke="#8b5cf6"
//           strokeWidth="3.5"
//           strokeLinecap="round"
//           fill="none"
//           animate={animated ? { opacity: [0.25, 1, 0.25] } : undefined}
//           transition={{ duration: 1.8, delay: line.delay, repeat: Infinity, ease: "easeInOut" }}
//         />
//       ))}

//       {/* cursor: offset dark copy gives the chunky 3D thickness, then the light face */}
//       <g transform="translate(-2 6)">
//         <path d={CURSOR_ARROW_PATH} transform="translate(2.5 3.5)" fill="#4c3a8a" stroke="#4c3a8a" strokeWidth="3" strokeLinejoin="round" />
//         <path d={CURSOR_ARROW_PATH} fill="#ffffff" stroke="#2a1f4d" strokeWidth="3" strokeLinejoin="round" />
//       </g>
//     </svg>
//   );
// }

// const FOUR_POINT_STAR_PATH = "M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z";

// function GoldSparkle({ animated }: { animated: boolean }) {
//   return (
//     <motion.svg
//       viewBox="0 0 24 24"
//       className="h-8 w-8 sm:h-11 sm:w-11"
//       style={{ filter: "drop-shadow(0 4px 8px rgba(245,158,11,0.45))" }}
//       animate={animated ? { scale: [1, 0.75, 1], rotate: [0, 18, 0] } : undefined}
//       transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
//     >
//       <defs>
//         <linearGradient id="floating-sparkle-gold" x1="0" y1="0" x2="1" y2="1">
//           <stop offset="0" stopColor="#fcd34d" />
//           <stop offset="1" stopColor="#f59e0b" />
//         </linearGradient>
//       </defs>
//       <path d={FOUR_POINT_STAR_PATH} fill="url(#floating-sparkle-gold)" />
//     </motion.svg>
//   );
// }

// function GlassCodeTile() {
//   return (
//     <div
//       className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/70 bg-gradient-to-br from-white/70 to-violet-100/40 backdrop-blur-md sm:h-24 sm:w-24"
//       style={{ boxShadow: "0 18px 40px -12px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.9)" }}
//     >
//       <svg viewBox="0 0 32 32" className="h-10 w-10 sm:h-12 sm:w-12" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
//         <path d="M10 10 L4 16 L10 22" />
//         <path d="M22 10 L28 16 L22 22" />
//         <path d="M18 8 L14 24" />
//       </svg>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  FloatingElements: drop inside a `relative` hero section                    */
// /* -------------------------------------------------------------------------- */

// export function FloatingElements() {
//   const prefersReducedMotion = useReducedMotion();
//   const animated = !prefersReducedMotion;
//   const { smoothX, smoothY } = useSmoothedPointer(animated);

//   const shared = { pointerX: smoothX, pointerY: smoothY, animated };

//   return (
//     <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
//       <FloatingItem className="right-[5%] top-[14%] sm:right-[8%] sm:top-[22%]" depth={46} floatDuration={5.5} {...shared}>
//         <CursorWithBurst animated={animated} />
//       </FloatingItem>

//       <FloatingItem className="left-[6%] top-[46%] sm:left-[10%]" depth={26} floatDistance={10} floatRotation={0} floatDuration={4} floatDelay={0.6} {...shared}>
//         <GoldSparkle animated={animated} />
//       </FloatingItem>

//       <FloatingItem className="bottom-[26%] right-[6%] sm:bottom-[22%] sm:right-[12%]" depth={64} floatDistance={18} floatRotation={4} floatDuration={6.5} floatDelay={1.1} {...shared}>
//         <GlassCodeTile />
//       </FloatingItem>
//     </div>
//   );
// }