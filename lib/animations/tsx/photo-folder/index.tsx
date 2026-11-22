"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Tweak these                                                                */
/* -------------------------------------------------------------------------- */

const TITLE = "Summer 2026";
const PHOTO_COUNT = 83;
const AUTOPLAY_MS = 5000; // the folder opens by itself until somebody hovers it

// Where each photo rests when the folder is closed and when it is open.
const PHOTOS = [
  { closed: { x: -28, y: -36, rotate: -9 }, open: { x: -56, y: -38, rotate: -16 }, depth: 0.6, art: <SunsetArt /> },
  { closed: { x: 28, y: -36, rotate: 8 }, open: { x: 56, y: -38, rotate: 14 }, depth: 0.8, art: <FireworksArt /> },
  { closed: { x: 0, y: -32, rotate: -1 }, open: { x: 0, y: -50, rotate: 3 }, depth: 1.2, art: <LanternsArt /> },
];

// Photos leave one after another (middle one first), and tuck back in together.
const PHOTO_DELAYS = [0.05, 0.1, 0];

const SPRING = { type: "spring", stiffness: 260, damping: 17 } as const;

/* -------------------------------------------------------------------------- */
/*  The three little "photographs", drawn with plain divs and gradients        */
/* -------------------------------------------------------------------------- */

function SunsetArt() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#FFB36B, #E8534A 70%)" }}>
      <div style={{ position: "absolute", left: "50%", top: "30%", width: 22, height: 22, marginLeft: -11, borderRadius: "50%", background: "#FFF1C9", boxShadow: "0 0 18px 6px rgba(255,241,201,0.7)" }} />
      <div style={{ position: "absolute", inset: "auto 0 0 0", height: "42%", background: "#3a1c2b", clipPath: "polygon(0 60%, 25% 20%, 45% 55%, 70% 10%, 100% 50%, 100% 100%, 0 100%)" }} />
    </div>
  );
}

function FireworksArt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 30% 35%, #ffd6ff 0 2px, transparent 3px), radial-gradient(circle at 70% 28%, #b9fbc0 0 2px, transparent 3px), radial-gradient(circle at 55% 60%, #ffe066 0 2px, transparent 3px), radial-gradient(circle at 30% 35%, rgba(255,120,200,0.55), transparent 32%), radial-gradient(circle at 70% 28%, rgba(90,220,255,0.5), transparent 30%), radial-gradient(circle at 55% 60%, rgba(255,210,80,0.45), transparent 28%), linear-gradient(#1b1340, #3b1d6b)",
      }}
    />
  );
}

function LanternsArt() {
  const lanterns = [
    { left: "18%", top: "22%" },
    { left: "50%", top: "14%" },
    { left: "78%", top: "28%" },
    { left: "34%", top: "52%" },
    { left: "66%", top: "58%" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#0f1b3d, #2b2f63)" }}>
      {lanterns.map((lantern, index) => (
        <span
          key={index}
          style={{ position: "absolute", ...lantern, width: 9, height: 12, borderRadius: 4, background: "#FFC857", boxShadow: "0 0 12px 4px rgba(255,200,87,0.65)" }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stickers                                                                   */
/* -------------------------------------------------------------------------- */

function Stamp() {
  return (
    <div style={{ width: 34, height: 40, padding: 4, borderRadius: 5, background: "#fff", boxShadow: "0 3px 8px rgba(0,0,0,0.18)" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 3, overflow: "hidden", background: "linear-gradient(#FFD6A5, #FF8E7A)" }}>
        <div style={{ position: "absolute", left: "50%", top: 6, width: 12, height: 12, marginLeft: -6, borderRadius: "50%", background: "#E8534A" }} />
        <div style={{ position: "absolute", inset: "auto 0 0 0", height: 10, background: "#4D96FF" }} />
      </div>
    </div>
  );
}

function PaperPlane() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" style={{ filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.22))" }}>
      {/* white sticker outline first, colour on top */}
      <path d="M6 22 42 6 32 42 22 28Z" fill="#fff" stroke="#fff" strokeWidth="8" strokeLinejoin="round" />
      <path d="M6 22 42 6 32 42 22 28Z" fill="#E8534A" />
      <path d="M42 6 22 28 24 38 28 31Z" fill="#C93E36" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  The folder                                                                 */
/* -------------------------------------------------------------------------- */

const photoVariants: Variants = {
  closed: (index: number) => ({ ...PHOTOS[index].closed, scale: 1, transition: SPRING }),
  open: (index: number) => ({
    ...PHOTOS[index].open,
    scale: 1.08,
    transition: { ...SPRING, delay: PHOTO_DELAYS[index] },
  }),
};

const frontVariants: Variants = {
  closed: { rotateX: 0, y: 0, transition: SPRING },
  open: { rotateX: 14, y: 3, transition: SPRING },
};

function Photo({
  index,
  depth,
  shiftX,
  shiftY,
  children,
}: {
  index: number;
  depth: number; // bigger = moves more with the pointer, so it looks closer
  shiftX: MotionValue<number>;
  shiftY: MotionValue<number>;
  children: ReactNode;
}) {
  const parallaxX = useTransform(shiftX, (value) => value * 7 * depth);
  const parallaxY = useTransform(shiftY, (value) => value * 5 * depth);

  return (
    <motion.div
      custom={index}
      variants={photoVariants}
      style={{ position: "absolute", left: "50%", bottom: 12, width: 60, height: 76, marginLeft: -30, zIndex: 1, transformOrigin: "50% 100%" }}
    >
      {/* inner layer: the depth shift that follows the pointer */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY, width: "100%", height: "100%", padding: 4, borderRadius: 10, background: "#fff", boxShadow: "0 8px 16px rgba(30,20,50,0.3)" }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 6, overflow: "hidden" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Sticker({ children, closed, open, style }: { children: ReactNode; closed: object; open: object; style: object }) {
  return (
    <motion.div variants={{ closed: { ...closed, transition: SPRING }, open: { ...open, transition: { ...SPRING, delay: 0.12 } } }} style={{ position: "absolute", ...style }}>
      {children}
    </motion.div>
  );
}

export default function PhotoFolder() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const isHoveredRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const isOpen = isHovered || isAutoOpen;

  // Pointer position inside the scene, from -1 to 1. It tilts the folder and shifts the photos for depth.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltY = useSpring(useTransform(pointerX, [-1, 1], [-10, 10]), { stiffness: 140, damping: 16 });
  const tiltX = useSpring(useTransform(pointerY, [-1, 1], [8, -8]), { stiffness: 140, damping: 16 });
  const shiftX = useSpring(pointerX, { stiffness: 120, damping: 14 });
  const shiftY = useSpring(pointerY, { stiffness: 120, damping: 14 });

  // Opens and closes by itself while nobody is hovering.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      if (!isHoveredRef.current) setIsAutoOpen((current) => !current);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  function handlePointerMove(event: React.PointerEvent) {
    const bounds = sceneRef.current!.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  }

  return (
    <div
      onPointerEnter={() => {
        isHoveredRef.current = true;
        setIsHovered(true);
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        isHoveredRef.current = false;
        setIsHovered(false);
        setIsAutoOpen(false);
        pointerX.set(0);
        pointerY.set(0);
      }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 240, padding: "24px 0 0", cursor: "pointer", userSelect: "none", transform: "scale(0.86)" }}
    >
      <motion.div
        ref={sceneRef}
        animate={isOpen ? "open" : "closed"}
        style={{ position: "relative", width: 184, height: 112, transformPerspective: 700, rotateX: tiltX, rotateY: tiltY }}
      >
        {/* soft glow behind the photos when open */}
        {/* <motion.div
          variants={{ closed: { opacity: 0, scale: 0.6 }, open: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.5 }}
          style={{ position: "absolute", left: "50%", top: -30, width: 190, height: 150, marginLeft: -95, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,122,0.55), transparent 65%)", filter: "blur(8px)" }}
        /> */}

        {/* floor shadow: smaller and softer when the photos fly up */}
        <motion.div
          variants={{ closed: { scaleX: 1, opacity: 0.35 }, open: { scaleX: 0.86, opacity: 0.2 } }}
          transition={SPRING}
          style={{ position: "absolute", left: 14, right: 14, bottom: -10, height: 14, borderRadius: "50%", background: "#2d1810", filter: "blur(8px)" }}
        />

        {/* back panel + tab */}
        <div style={{ position: "absolute", left: 14, bottom: 0, width: 156, height: 110, borderRadius: 14, background: "linear-gradient(#d9d9e2, #c3c3cf)" }} />
        <div style={{ position: "absolute", left: 14, bottom: 90, width: 68, height: 30, borderRadius: "10px 10px 0 0", background: "#d3d3dd" }} />

        {/* the photos */}
        {PHOTOS.map(({ art, depth }, index) => (
          <Photo key={index} index={index} depth={depth} shiftX={shiftX} shiftY={shiftY}>
            {art}
          </Photo>
        ))}

        {/* frosted front panel: leans back to let the photos out */}
        <motion.div
          variants={frontVariants}
          style={{
            transformOrigin: "50% 100%",
            transformPerspective: 600,
            borderRadius: 14,
            background: "linear-gradient(165deg, #ffffff, #e9e9f1)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 16px 28px -10px rgba(40,30,60,0.4), inset 0 1px 0 #fff",
          }}
          className="absolute left-[14px] bottom-0 w-[156px] h-[88px] bg-blue-800 backdrop-blur-xl opacity-70 z-2 "
          >
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 12, height: 1, background: "rgba(0,0,0,0.07)" }} />
          <div style={{ position: "absolute", left: 18, right: 38, bottom: 18, height: 1, background: "rgba(0,0,0,0.05)" }} />

          <Sticker closed={{ rotate: -8, y: 0 }} open={{ rotate: -15, y: -4, scale: 1.08 }} style={{ left: 14, top: 14 }}>
            <Stamp />
          </Sticker>
          <Sticker closed={{ rotate: 10, x: 0, y: 0 }} open={{ rotate: 24, x: 6, y: -8, scale: 1.12 }} style={{ right: 12, bottom: 14 }}>
            <PaperPlane />
          </Sticker>
        </motion.div>
      </motion.div>

      <p style={{ margin: "8px 0 0", fontSize: 16, fontWeight: 600, color: "#1f1f24" }}>{TITLE}</p>

      <div style={{ position: "relative", marginTop: 5, height: 20, minWidth: 92, borderRadius: 999, background: "rgba(0,0,0,0.07)", overflow: "hidden" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "open" : "closed"}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ display: "block", padding: "0 12px", lineHeight: "20px", fontSize: 12, fontWeight: 600, textAlign: "center", color: isOpen ? "#E8534A" : "#6b6b76" }}
          >
            {isOpen ? "Open album" : `${PHOTO_COUNT} photos`}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
