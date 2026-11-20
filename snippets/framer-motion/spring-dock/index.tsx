"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";

const ICONS = [
  { glyph: "✦", from: "#E8534A", to: "#F5A67A" },
  { glyph: "♥", from: "#FF6B9D", to: "#FFB5A7" },
  { glyph: "☀", from: "#FFB703", to: "#FFD166" },
  { glyph: "♫", from: "#4D96FF", to: "#6BCBFF" },
  { glyph: "⚑", from: "#06D6A0", to: "#7AE7C7" },
];

const BASE_SIZE = 32; // px, resting size
const PEAK_SIZE = 54; // px, size right under the pointer
const REACH = 100; // px, how far the pointer's influence stretches

function DockIcon({
  pointerX,
  dockRef,
  icon,
}: {
  pointerX: MotionValue<number>;
  dockRef: RefObject<HTMLDivElement | null>;
  icon: (typeof ICONS)[number];
}) {
  const iconRef = useRef<HTMLDivElement>(null);

  // Distance (px) between the pointer and the centre of this icon.
  const distance = useTransform(pointerX, (x) => {
    const iconBox = iconRef.current?.getBoundingClientRect();
    const dockLeft = dockRef.current?.getBoundingClientRect().left ?? 0;
    if (!iconBox) return REACH;
    return x - (iconBox.left - dockLeft + iconBox.width / 2);
  });

  // Close to the pointer = big, far away = small. A spring makes it feel physical.
  const targetSize = useTransform(distance, [-REACH, 0, REACH], [BASE_SIZE, PEAK_SIZE, BASE_SIZE]);
  const size = useSpring(targetSize, { mass: 0.1, stiffness: 180, damping: 13 });

  return (
    <motion.div
      ref={iconRef}
      style={{
        width: size,
        aspectRatio: "1",
        display: "grid",
        placeItems: "center",
        borderRadius: 14,
        color: "#fff",
        fontSize: 18,
        background: `linear-gradient(135deg, ${icon.from}, ${icon.to})`,
        boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
      }}
    >
      {icon.glyph}
    </motion.div>
  );
}

export default function SpringDock() {
  const dockRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(-1000); // far away = nothing is magnified
  const idleSweep = useRef<AnimationPlaybackControls | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // While nobody hovers, a fake pointer glides along the dock so the animation is visible.
  function startIdleSweep() {
    const width = dockRef.current?.offsetWidth ?? 240;
    idleSweep.current = animate(pointerX, [-20, width + 20], {
      duration: 2.6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    });
  }

  function stopIdleSweep() {
    idleSweep.current?.stop();
  }

  useEffect(() => {
    if (!prefersReducedMotion) startIdleSweep();
    return stopIdleSweep;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <div
      ref={dockRef}
      onPointerEnter={stopIdleSweep}
      onPointerMove={(event) => pointerX.set(event.clientX - dockRef.current!.getBoundingClientRect().left)}
      onPointerLeave={() => {
        pointerX.set(-1000);
        if (!prefersReducedMotion) startIdleSweep();
      }}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height: 72,
        padding: "8px 10px",
        borderRadius: 24,
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      {ICONS.map((icon) => (
        <DockIcon key={icon.glyph} pointerX={pointerX} dockRef={dockRef} icon={icon} />
      ))}
    </div>
  );
}
