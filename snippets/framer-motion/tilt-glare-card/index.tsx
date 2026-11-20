"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";

const MAX_TILT = 16; // degrees

export default function TiltGlareCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const idleControls = useRef<AnimationPlaybackControls[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Pointer position inside the card, from 0 (left / top) to 1 (right / bottom).
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  // Tilt towards the pointer, softened by springs.
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-MAX_TILT, MAX_TILT]), { stiffness: 160, damping: 16 });
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [MAX_TILT, -MAX_TILT]), { stiffness: 160, damping: 16 });

  // A soft light that follows the pointer, plus a rainbow sheen that slides with it.
  const glareX = useTransform(pointerX, [0, 1], [0, 100]);
  const glareY = useTransform(pointerY, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.65), transparent 55%)`;
  const sheenPosition = useTransform(pointerX, [0, 1], [0, 100]);
  const sheen = useMotionTemplate`linear-gradient(115deg, transparent 20%, rgba(255,120,200,0.28) ${sheenPosition}%, rgba(90,200,255,0.28) 80%, transparent)`;

  function startIdle() {
    idleControls.current = [
      animate(pointerX, [0.2, 0.8], { duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }),
      animate(pointerY, [0.25, 0.75], { duration: 3.1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }),
    ];
  }

  function stopIdle() {
    idleControls.current.forEach((controls) => controls.stop());
  }

  useEffect(() => {
    if (!prefersReducedMotion) startIdle();
    return stopIdle;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <div style={{ perspective: 800 }}>
      <motion.div
        ref={cardRef}
        onPointerEnter={stopIdle}
        onPointerMove={(event) => {
          const bounds = cardRef.current!.getBoundingClientRect();
          pointerX.set((event.clientX - bounds.left) / bounds.width);
          pointerY.set((event.clientY - bounds.top) / bounds.height);
        }}
        onPointerLeave={() => {
          pointerX.set(0.5);
          pointerY.set(0.5);
          if (!prefersReducedMotion) startIdle();
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          position: "relative",
          width: 220,
          height: 140,
          borderRadius: 20,
          background: "linear-gradient(135deg, #2D1810, #6b2a22 55%, #E8534A)",
          boxShadow: "0 24px 40px -12px rgba(45, 24, 16, 0.5)",
          overflow: "hidden",
          color: "#fff",
        }}
      >
        <motion.div style={{ position: "absolute", inset: 0, background: sheen, mixBlendMode: "screen" }} />
        <motion.div style={{ position: "absolute", inset: 0, background: glare, mixBlendMode: "overlay" }} />

        {/* Pushed forward in 3D, so it floats above the card */}
        <div style={{ position: "absolute", left: 18, top: 16, transform: "translateZ(40px)" }}>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", opacity: 0.7 }}>MEMBER</p>
          <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700 }}>animAte</p>
        </div>
        <div
          style={{
            position: "absolute",
            right: 18,
            bottom: 16,
            transform: "translateZ(60px)",
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          ✦ PRO
        </div>
      </motion.div>
    </div>
  );
}
