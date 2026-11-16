"use client";

import React, { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Caveat_Brush } from "next/font/google";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { GithubIcon, PatternCraftIcon, TwitterIcon } from "./icons";

const handwrittenFont = Caveat_Brush({ weight: "400", subsets: ["latin"], display: "swap" });

/* -------------------------------------------------------------------------- */
/*  Palettes & Handcrafted Profiles for Curvy, Velvet-Textured Strips         */
/* -------------------------------------------------------------------------- */

interface StripPalette {
  leftEdge: string;
  leftTransition: string;
  highlight: string;
  body: string;
  rightTransition: string;
  rightEdge: string;
}

const STRIP_PALETTES: StripPalette[] = [
  // 0. Deep ruby red
  { leftEdge: "#6c0914", leftTransition: "#990e1c", highlight: "#ff3d47", body: "#d61322", rightTransition: "#a3101e", rightEdge: "#730a15" },
  // 1. Vibrant cherry (hovered strip in KitKat reference)
  { leftEdge: "#7d0b17", leftTransition: "#b31322", highlight: "#ff545d", body: "#ee1c2b", rightTransition: "#ba1423", rightEdge: "#850c18" },
  // 2. Rich dark crimson
  { leftEdge: "#520710", leftTransition: "#7d0a17", highlight: "#f02835", body: "#b8101e", rightTransition: "#8a0c18", rightEdge: "#5e0812" },
  // 3. Classic KitKat scarlet (center lowest strip)
  { leftEdge: "#8a0d1a", leftTransition: "#c51626", highlight: "#ff5e67", body: "#f62433", rightTransition: "#cc1828", rightEdge: "#940e1c" },
  // 4. Bright vermilion
  { leftEdge: "#700a15", leftTransition: "#a61120", highlight: "#ff4751", body: "#e21827", rightTransition: "#b01321", rightEdge: "#7c0b17" },
  // 5. Deep wine red (wide right peeled strip)
  { leftEdge: "#4a060e", leftTransition: "#720915", highlight: "#e5202e", body: "#ab0e1b", rightTransition: "#7a0a16", rightEdge: "#540710" },
  // 6. Saturated crimson (far right edge)
  { leftEdge: "#780b16", leftTransition: "#ad1221", highlight: "#ff4d56", body: "#e01928", rightTransition: "#b21423", rightEdge: "#800c17" },
];

interface StripProfile {
  bottomRatio: number; // Resting height percentage of viewport (0.76 - 0.94)
  bellyDepth: number; // Curvature depth of the bottom U-curve
  waistCurve: number; // Horizontal curve offset on the sides for organic wavy drape
  swayDegrees: number;
  swayDuration: number;
  swayDelay: number;
}

const STRIP_PROFILES: StripProfile[] = [
  { bottomRatio: 0.77, bellyDepth: 46, waistCurve: -10, swayDegrees: 0.75, swayDuration: 4.8, swayDelay: 0.1 },
  { bottomRatio: 0.83, bellyDepth: 52, waistCurve: 14, swayDegrees: 0.95, swayDuration: 5.4, swayDelay: 0.8 },
  { bottomRatio: 0.88, bellyDepth: 48, waistCurve: -8, swayDegrees: 0.7, swayDuration: 4.4, swayDelay: 1.5 },
  { bottomRatio: 0.94, bellyDepth: 56, waistCurve: 10, swayDegrees: 0.85, swayDuration: 6.0, swayDelay: 0.3 },
  { bottomRatio: 0.87, bellyDepth: 50, waistCurve: -12, swayDegrees: 0.8, swayDuration: 5.1, swayDelay: 1.1 },
  { bottomRatio: 0.95, bellyDepth: 60, waistCurve: 18, swayDegrees: 1.05, swayDuration: 6.3, swayDelay: 0.6 },
  { bottomRatio: 0.84, bellyDepth: 45, waistCurve: -7, swayDegrees: 0.7, swayDuration: 4.6, swayDelay: 1.9 },
];

/* -------------------------------------------------------------------------- */
/*  Curvy SVG Path Builder                                                    */
/* -------------------------------------------------------------------------- */

function buildCurvyPath(
  width: number,
  bottomY: number,
  belly: number,
  waist: number
): string {
  const topY = -60; // Extends well above viewport to hide top seam

  const leftMidX = waist;
  const leftMidY = (topY + bottomY) * 0.52;
  const leftBottomX = waist * 0.55;

  const rightBottomX = width + waist * 0.55;
  const rightMidX = width + waist;
  const rightMidY = (topY + bottomY) * 0.48;

  const controlY = bottomY + belly;

  // Curvy drape sides with smooth U-shaped rounded bottom
  return [
    `M 0 ${topY}`,
    `Q ${leftMidX.toFixed(1)} ${leftMidY.toFixed(1)} ${leftBottomX.toFixed(1)} ${bottomY.toFixed(1)}`,
    `C ${(leftBottomX + 4).toFixed(1)} ${controlY.toFixed(1)} ${(rightBottomX - 4).toFixed(1)} ${controlY.toFixed(1)} ${rightBottomX.toFixed(1)} ${bottomY.toFixed(1)}`,
    `Q ${rightMidX.toFixed(1)} ${rightMidY.toFixed(1)} ${width} ${topY}`,
    "Z",
  ].join(" ");
}

/* -------------------------------------------------------------------------- */
/*  PaperStrip Component                                                       */
/* -------------------------------------------------------------------------- */

interface PaperStripProps {
  index: number;
  width: number;
  height: number;
  lift: number;
  palette: StripPalette;
  profile: StripProfile;
  animated: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const PaperStrip = memo(function PaperStrip({
  index,
  width,
  height,
  lift,
  palette,
  profile,
  animated,
  onHoverStart,
  onHoverEnd,
}: PaperStripProps) {
  const idPrefix = useId().replace(/:/g, "");
  const { bottomRatio, bellyDepth, waistCurve, swayDegrees, swayDuration, swayDelay } = profile;

  // Smooth, natural spring physics for hover lift (no dark oval circles!)
  const springLift = useSpring(lift, {
    stiffness: 160,
    damping: 18,
    mass: 0.7,
  });

  const bodyPathRef = useRef<SVGPathElement>(null);
  const shadePathRef = useRef<SVGPathElement>(null);

  // Directly interpolate the SVG path on spring changes for 60fps buttery smoothness
  useEffect(() => {
    const unsubscribe = springLift.on("change", (latestLift) => {
      const clampedLift = Math.max(0, Math.min(1.2, latestLift));
      const restBottomY = height * bottomRatio;

      // When hovered, the strip lifts smoothly upward by ~80px
      const liftPx = clampedLift * 80;
      const curBottomY = restBottomY - liftPx;

      // Bottom curve and waist flex subtly with lift
      const dynamicBelly = bellyDepth * (1 - clampedLift * 0.12);
      const dynamicWaist = waistCurve * (1 + clampedLift * 0.18);

      const pathData = buildCurvyPath(width, curBottomY, dynamicBelly, dynamicWaist);
      bodyPathRef.current?.setAttribute("d", pathData);
      shadePathRef.current?.setAttribute("d", pathData);
    });

    return () => unsubscribe();
  }, [springLift, height, width, bottomRatio, bellyDepth, waistCurve]);

  // Sync external lift prop to spring
  useEffect(() => {
    springLift.set(lift);
  }, [lift, springLift]);

  const bodyGradientId = `${idPrefix}-body`;
  const hangShadeId = `${idPrefix}-hang`;

  const initialBottomY = height * bottomRatio;
  const initialPath = buildCurvyPath(width, initialBottomY, bellyDepth, waistCurve);

  return (
    <motion.div
      className="relative flex-shrink-0 cursor-pointer select-none"
      style={{
        width,
        height: "100%",
        transformOrigin: "50% 0%",
      }}
      initial={animated ? { y: -90, opacity: 0 } : false}
      animate={
        animated
          ? {
              y: 0,
              opacity: 1,
              rotate: [-swayDegrees, swayDegrees],
            }
          : false
      }
      transition={{
        y: { duration: 0.9, delay: 0.07 * index, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.6, delay: 0.07 * index },
        rotate: {
          duration: swayDuration,
          delay: swayDelay,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <svg
        width={width + 24}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute top-0 -left-2 overflow-visible"
        style={{
          // Deep drop shadow casting onto the strip to its left for realistic layering
          filter: "drop-shadow(-12px 14px 18px rgba(15, 0, 4, 0.6))",
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Silky 3D cylindrical horizontal gradient - saturated vibrant KitKat red */}
          <linearGradient id={bodyGradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette.leftEdge} />
            <stop offset="14%" stopColor={palette.leftTransition} />
            <stop offset="30%" stopColor={palette.highlight} />
            <stop offset="56%" stopColor={palette.body} />
            <stop offset="84%" stopColor={palette.rightTransition} />
            <stop offset="100%" stopColor={palette.rightEdge} />
          </linearGradient>

          {/* Top-to-bottom depth shading: soft ceiling shadow, clean velvet body */}
          <linearGradient id={hangShadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7d051bff" stopOpacity="0.4" />
            <stop offset="18%" stopColor="#900821ff" stopOpacity="0.08" />
            <stop offset="40%" stopColor="#ba0728ff" stopOpacity="0" />
            <stop offset="92%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#f00c0cff" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* 1. Main Curvy Ribbon Body */}
        <path
          ref={bodyPathRef}
          d={initialPath}
          fill={`url(#${bodyGradientId})`}
          stroke="rgba(255, 120, 130, 0.22)"
          strokeWidth="0.8"
        />

        {/* 2. Ambient Lighting Overlay (Shade & Rim Light) */}
        <path ref={shadePathRef} d={initialPath} fill={`url(#${hangShadeId})`} />
      </svg>
    </motion.div>
  );
});

/* -------------------------------------------------------------------------- */
/*  PaperCurtain Container Component                                          */
/* -------------------------------------------------------------------------- */

const STRIP_COUNT_DESKTOP = 7;
const STRIP_COUNT_TABLET = 5;
const STRIP_COUNT_MOBILE = 4;

function PaperCurtain({ animated }: { animated: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 1200, height: 800 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Measure container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const stripCount = dimensions.width >= 1024 ? STRIP_COUNT_DESKTOP : dimensions.width >= 640 ? STRIP_COUNT_TABLET : STRIP_COUNT_MOBILE;

  // Generous strip overlap to ensure rich 3D layering with no gaps
  const overlapPx = 22;
  const singleWidth = Math.ceil((dimensions.width + overlapPx * (stripCount - 1)) / stripCount);

  // Interactive mouse tracking across curtain
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const effectiveIndex = Math.floor((pointerX / dimensions.width) * stripCount);
      const clampedIndex = Math.max(0, Math.min(stripCount - 1, effectiveIndex));
      setHoveredIndex(clampedIndex);
    },
    [dimensions.width, stripCount]
  );

  const handlePointerLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0 z-[2] flex overflow-hidden pointer-events-auto"
      aria-hidden="true"
    >
      {Array.from({ length: stripCount }).map((_, index) => {
        // Strip lift: hovered strip gets 1.0, adjacent neighbor gets a soft 0.28 ripple
        let lift = 0;
        if (hoveredIndex !== null) {
          if (hoveredIndex === index) lift = 1.0;
          else if (Math.abs(hoveredIndex - index) === 1) lift = 0.28;
        }

        return (
          <div key={index} className={index > 0 ? "-ml-5" : ""}>
            <PaperStrip
              index={index}
              width={singleWidth}
              height={dimensions.height}
              lift={lift}
              palette={STRIP_PALETTES[index % STRIP_PALETTES.length]}
              profile={STRIP_PROFILES[index % STRIP_PROFILES.length]}
              animated={animated}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            />
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Central Hero Content with Playful KitKat Lettering                        */
/* -------------------------------------------------------------------------- */

const TITLE_TILTS = [-4, 3, -2, 4];

function HeroContent({ title, animated }: { title: string; animated: boolean }) {
  const characters = Array.from(title);

  return (
    <section className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center px-4">
      <div className="relative flex flex-col items-center select-none -translate-y-4 sm:-translate-y-6">
        {/* Golden Sparkle Star on Left */}
        <motion.div
          className="absolute -left-7 sm:-left-12 -top-1 sm:-top-3 w-8 sm:w-12 h-8 sm:h-12 drop-shadow-[0_0_14px_rgba(255,185,56,0.65)]"
          initial={animated ? { opacity: 0, scale: 0, rotate: -45 } : false}
          animate={{ opacity: 1, scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{
            opacity: { delay: 1.1, duration: 0.5 },
            scale: { delay: 1.4, duration: 2.8, repeat: Infinity, ease: "easeInOut" },
            rotate: { delay: 1.4, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full fill-[#FFB938]">
            <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" />
          </svg>
        </motion.div>

        {/* Dynamic Action Burst Markings above right of Title */}
        <motion.div
          className="absolute -right-6 sm:-right-10 -top-4 sm:-top-8 w-10 sm:w-14 h-10 sm:h-14 drop-shadow-[0_4px_8px_rgba(20,0,5,0.4)]"
          initial={animated ? { opacity: 0, scale: 0.5 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, ease: "backOut" }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 40 40" className="w-full h-full stroke-[#FFF5E9] stroke-[4] stroke-linecap-round fill-none">
            <line x1="8" y1="28" x2="2" y2="36" />
            <line x1="16" y1="16" x2="28" y2="6" strokeWidth="4.5" />
            <line x1="28" y1="26" x2="38" y2="24" strokeWidth="4" />
          </svg>
        </motion.div>

        {/* Handwritten Main Title */}
        <h1
          className={`m-0 flex items-center leading-none text-[#FFF5E9] drop-shadow-[0_18px_36px_rgba(25,0,6,0.65)] text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] ${handwrittenFont.className}`}
          aria-label={title}
        >
          {characters.map((char, index) => {
            const tilt = TITLE_TILTS[index % TITLE_TILTS.length];
            return (
              <motion.span
                key={index}
                className="inline-block"
                initial={animated ? { opacity: 0, y: 50, rotate: 0 } : false}
                animate={{ opacity: 1, y: 0, rotate: tilt }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.08,
                  type: "spring",
                  stiffness: 240,
                  damping: 14,
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </h1>

        {/* Cute Wavy Hand-Drawn Underline */}
        <svg
          className="w-44 sm:w-64 md:w-80 h-8 sm:h-12 -mt-2 sm:-mt-4 overflow-visible drop-shadow-[0_8px_16px_rgba(25,0,6,0.5)]"
          viewBox="0 0 170 34"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M6 22C28 4 48 34 76 16S124 28 164 10"
            stroke="#FFF5E9"
            strokeWidth="7"
            strokeLinecap="round"
            initial={animated ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.0, duration: 1.1, ease: [0.6, 0.1, 0.2, 1] }}
          />
        </svg>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  PatternCraft Centered Navbar with Tailwind CSS                             */
/* -------------------------------------------------------------------------- */

function Navbar({ animated }: { animated: boolean }) {
  return (
    <motion.header
      className="absolute top-0 left-0 right-0 z-30 flex justify-center px-4 py-4 sm:py-5 pointer-events-none"
      initial={animated ? { opacity: 0, y: -20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
    >
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-md rounded-full border border-zinc-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_2px_6px_-1px_rgba(0,0,0,0.06)] pointer-events-auto">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-85">
          <PatternCraftIcon className="h-6 w-6 flex-shrink-0" />
          <span className="text-xl font-bold tracking-tight text-zinc-900 font-sans">PatternCraft</span>
        </Link>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-zinc-800">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-1.5 text-zinc-800 transition hover:text-zinc-950 hover:scale-110"
            aria-label="Twitter"
          >
            <TwitterIcon className="h-5 w-5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-1.5 text-zinc-800 transition hover:text-zinc-950 hover:scale-110"
            aria-label="GitHub"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main NewHero Component                                                     */
/* -------------------------------------------------------------------------- */

export default function NewHero({ title = "Text" }: { title?: string }) {
  const prefersReducedMotion = !!useReducedMotion();
  const animated = !prefersReducedMotion;

  return (
    <div className="relative w-full min-h-screen min-h-[100svh] overflow-hidden isolate bg-[radial-gradient(ellipse_90%_75%_at_50%_42%,#5a0914_0%,#340409_52%,#140103_100%)] text-[#FFF5E9] select-none touch-pan-y">
      {/* 1. Behind Watermark Typography (Strictly behind the strips) */}
      <div
        className={`pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden select-none ${handwrittenFont.className}`}
        aria-hidden="true"
      >
        <span className="text-[14rem] sm:text-[22rem] md:text-[30rem] lg:text-[36rem] leading-[0.8] text-[#2e0307] opacity-65 -rotate-2 -translate-x-8 -translate-y-4 whitespace-nowrap">
          {title}
        </span>
      </div>

      {/* 2. Hanging Animated Curvy Paper Strips (Clean, vibrant KitKat red) */}
      <PaperCurtain animated={animated} />

      {/* 3. Subtle ambient dark floor gradient at the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 z-[3] bg-gradient-to-t from-[#140103] via-[#140103]/60 to-transparent"
        aria-hidden="true"
      />

      {/* 4. Centered Title & Playful Accents */}
      <HeroContent title={title} animated={animated} />

      {/* 5. Centered PatternCraft Navbar */}
      <Navbar animated={animated} />
    </div>
  );
}

export { NewHero as HeroSection, Navbar };
