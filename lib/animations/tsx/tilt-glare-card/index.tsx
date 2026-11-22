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

const MAX_TILT = 16;

export default function TiltGlareCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const idleControls = useRef<AnimationPlaybackControls[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-MAX_TILT, MAX_TILT]), { stiffness: 160, damping: 16 });
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [MAX_TILT, -MAX_TILT]), { stiffness: 160, damping: 16 });

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
        className="relative overflow-hidden rounded-[20px] text-white"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          width: 220,
          height: 140,
          background: "linear-gradient(135deg, #2D1810, #6b2a22 55%, #E8534A)",
          boxShadow: "0 24px 40px -12px rgba(45, 24, 16, 0.5)",
        }}
      >
        <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: sheen }} />
        <motion.div className="absolute inset-0 mix-blend-overlay" style={{ background: glare }} />

        {/* Pushed forward in 3D */}
        <div className="absolute left-[18px] top-4" style={{ transform: "translateZ(40px)" }}>
          <p className="m-0 text-[11px] tracking-[0.18em] opacity-70">MEMBER</p>
          <p className="m-0 mt-1 text-[22px] font-bold">animAte</p>
        </div>

        <div
          className="absolute right-[18px] bottom-4 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{ transform: "translateZ(60px)", background: "rgba(255,255,255,0.18)" }}
        >
          ✦ PRO
        </div>
      </motion.div>
    </div>
  );
}
