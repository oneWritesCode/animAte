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

const BASE_SIZE = 32;
const PEAK_SIZE = 54;
const REACH = 100;

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

  const distance = useTransform(pointerX, (x) => {
    const iconBox = iconRef.current?.getBoundingClientRect();
    const dockLeft = dockRef.current?.getBoundingClientRect().left ?? 0;
    if (!iconBox) return REACH;
    return x - (iconBox.left - dockLeft + iconBox.width / 2);
  });

  const targetSize = useTransform(distance, [-REACH, 0, REACH], [BASE_SIZE, PEAK_SIZE, BASE_SIZE]);
  const size = useSpring(targetSize, { mass: 0.1, stiffness: 180, damping: 13 });

  return (
    <motion.div
      ref={iconRef}
      className="grid place-items-center rounded-[10px] text-white text-lg"
      style={{
        width: size,
        aspectRatio: "1",
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
  const pointerX = useMotionValue(-1000);
  const idleSweep = useRef<AnimationPlaybackControls | null>(null);
  const prefersReducedMotion = useReducedMotion();

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
      onPointerMove={(event) =>
        pointerX.set(event.clientX - dockRef.current!.getBoundingClientRect().left)
      }
      onPointerLeave={() => {
        pointerX.set(-1000);
        if (!prefersReducedMotion) startIdleSweep();
      }}
      className="flex items-end gap-1.5 h-[72px] px-2.5 py-2 rounded-xl border border-black/[0.08] backdrop-blur-[10px]"
      style={{ background: "rgba(255,255,255,0.7)" }}
    >
      {ICONS.map((icon) => (
        <DockIcon key={icon.glyph} pointerX={pointerX} dockRef={dockRef} icon={icon} />
      ))}
    </div>
  );
}
