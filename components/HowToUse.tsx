"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import Blob from "@/public/svg/Blob";
import CurvedArrow from "@/public/svg/CurvedArrow";
import MotionRays from "@/public/svg/MotionRays";
import SmoothUnderline from "@/public/svg/SmoothUnderline";
import Sparkle from "@/public/svg/sparkle";
import { MagneticLetters, useMagneticField } from "./Magnetic";

/* -------------------------------------------------------------------------- */
/*  The three steps (change colours and words here)                            */
/* -------------------------------------------------------------------------- */

// Each step has one colour. The number badge, blob, stars, rays and arrow all use it.
const STEP_ACCENTS = ["#E8534A", "#8B7CF6", "#F59E0B"] as const;

const STEPS = [
  {
    title: "Explore",
    text: "Browse a curated collection of beautiful animations.",
  },
  {
    title: "Preview",
    text: "See the animation in action with a smooth live preview.",
  },
  {
    title: "Copy & use",
    text: "Get the code with one click and bring your ideas to life.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                               */
/* -------------------------------------------------------------------------- */

function WindowDots() {
  return (
    <div className="flex gap-1.5">
      <span className="size-2 rounded-full bg-[#ff5f57]" />
      <span className="size-2 rounded-full bg-[#febc2e]" />
      <span className="size-2 rounded-full bg-[#28c840]" />
    </div>
  );
}

function CursorIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="drop-shadow-md"
    >
      <path
        d="M5 3 19 11.5 12.2 13.2 9.2 20 5 3Z"
        fill="#1f1d2b"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Wraps an illustration: tilted in 3D, straightens on hover, with a floating blob behind it. */
function IllustrationCard({
  accent,
  blobVariant,
  tilt,
  children,
}: {
  accent: string;
  blobVariant: 0 | 1 | 2;
  tilt?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto mt-4 w-full max-w-[320px]">
      {/* <motion.div
        aria-hidden="true"
        className="absolute -inset-x-6 -inset-y-8 -z-10 backdrop-blur-2xl"
        animate={{ rotate: [0, 8, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Blob
          variant={blobVariant}
          color={`${accent}2e`}
          className="size-full"
        />
      </motion.div> */}
      <div className={`transition-transform duration-500 ease-out ${tilt}`}>
        {children}
      </div>
    </div>
  );
}

/*  Illustration 1: a grid of animations, a cursor picks one after another     */

const TILE_GRADIENTS = [
  "from-[#F5784A] to-[#F5A67A]",
  "from-[#EBDDFF] to-[#F7F0FF]",
  "from-[#FFB1A0] to-[#FF7E6B]",
  "from-[#BFD9FF] to-[#8FB6FF]",
  "from-[#B5AEF7] to-[#8478EA]",
  "from-[#C5EFD1] to-[#8EDBA6]",
];
const PICK_ORDER = [2, 5, 0, 4, 1, 3];
const GRID_COLUMNS = 3;
const GRID_ROWS = 2;
const GRID_GAP = 8; // px

function ExploreIllustration({ accent }: { accent: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const picked = PICK_ORDER[step % PICK_ORDER.length];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(
      () => setStep((current) => current + 1),
      1700,
    );
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  // The ring and the cursor sit over the grid and slide (CSS transition) to the picked tile.
  const column = picked % GRID_COLUMNS;
  const row = Math.floor(picked / GRID_COLUMNS);
  const cellWidth = `((100% - ${GRID_GAP * (GRID_COLUMNS - 1)}px) / ${GRID_COLUMNS})`;
  const cellHeight = `((100% - ${GRID_GAP * (GRID_ROWS - 1)}px) / ${GRID_ROWS})`;
  const left = `calc(${column} * (${cellWidth} + ${GRID_GAP}px))`;
  const top = `calc(${row} * (${cellHeight} + ${GRID_GAP}px))`;

  return (
    <div className="relative rounded-3xl border border-white/80 bg-white/80 p-4 shadow-xl shadow-black/5 backdrop-blur">
      <WindowDots />
      <div className="relative mt-4 h-[132px]">
        <div
          className="grid h-full grid-cols-3 grid-rows-2"
          style={{ gap: GRID_GAP }}
        >
          {TILE_GRADIENTS.map((gradient, index) => (
            <div
              key={index}
              className={`rounded-xl bg-gradient-to-br ${gradient} shadow-sm transition-transform duration-500 ${index === picked ? "scale-95" : ""}`}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute rounded-2xl border-2 transition-[left,top] duration-500 ease-out"
          style={{
            left,
            top,
            width: `calc(${cellWidth})`,
            height: `calc(${cellHeight})`,
            borderColor: accent,
          }}
        />
        <div
          className="pointer-events-none absolute transition-[left,top] duration-500 ease-out"
          style={{
            left,
            top,
            width: `calc(${cellWidth})`,
            height: `calc(${cellHeight})`,
          }}
        >
          <span className="absolute -bottom-3 -right-2">
            <CursorIcon />
          </span>
        </div>
      </div>
      {/* <MotionRays
        className="absolute -right-5 -top-6 w-9 -rotate-6"
        color={accent}
      /> */}
    </div>
  );
}

/*  Illustration 2: a live preview with a progress bar                         */

function PreviewIllustration({ accent }: { accent: string }) {
  const loop = { duration: 5, repeat: Infinity, ease: "linear" } as const;

  return (
    <div className="relative rounded-3xl border border-white/80 bg-white/85 p-4 shadow-xl shadow-black/5 backdrop-blur">
      <div className="grid h-[104px] place-items-center rounded-2xl bg-gradient-to-b from-white to-[#faf6ff]">
        <motion.div
          className="size-14 rounded-2xl bg-gradient-to-br from-[#F5A67A] to-[#F5A67A] shadow-lg shadow-[#E8534A]/30"
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-full bg-black/[0.04] px-3 py-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          fill="#1f1d2b"
        >
          <path d="M2 1 11 6 2 11V1Z" />
        </svg>
        <div className="relative h-1 flex-1 rounded-full bg-black/10">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: accent }}
            animate={{ width: ["0%", "100%"] }}
            transition={loop}
          />
          <motion.span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
            style={{ background: accent }}
            animate={{ left: ["0%", "100%"] }}
            transition={loop}
          />
        </div>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          fill="none"
          stroke="#1f1d2b"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" />
        </svg>
      </div>
      {/* <Sparkle className="absolute -right-3 -top-4 w-6" color={accent} /> */}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Illustration 3: code with a Copy button                                    */
/* -------------------------------------------------------------------------- */

function CodeIllustration({ accent }: { accent: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = window.setInterval(
      () => setCopied((current) => !current),
      1800,
    );
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  return (
    <div className="relative rounded-3xl bg-[#1f1a1c] p-4 shadow-2xl shadow-black/25">
      <div className="flex items-center justify-between">
        <WindowDots />
        <motion.span
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white"
          animate={{
            backgroundColor: copied ? "#16a34a" : accent,
            scale: copied ? [1, 1.12, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {copied ? "Copied" : "Copy"}
        </motion.span>
      </div>
      <pre className="mt-4 overflow-hidden font-mono text-[12px] leading-6 ">
        <span className="text-[#f07178]">{"<div "}</span>
        <span className="text-[#ffcb6b]">class</span>
        {"="}
        <span className="text-[#c3e88d]">&quot;animate&quot;</span>
        <span className="text-[#f07178]">{">"}</span>
        {"\n  Hello World!\n"}
        <span className="text-[#f07178]">{"</div>"}</span>
      </pre>
      {/* <MotionRays
        className="absolute -right-5 -top-4 w-9 -scale-x-100 rotate-90"
        color={accent}
      /> */}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

export default function HowToUse() {
  const illustrations = [
    <IllustrationCard
      key="explore"
      accent={STEP_ACCENTS[0]}
      blobVariant={0}
      // tilt="[transform:perspective(900px)_rotateX(8deg)_rotateY(-10deg)_rotateZ(-3deg)] hover:[transform:perspective(900px)_rotateX(0)_rotateY(0)_rotateZ(0)]"
    >
      <ExploreIllustration accent={STEP_ACCENTS[0]} />
    </IllustrationCard>,
    <IllustrationCard
      key="preview"
      accent={STEP_ACCENTS[1]}
      blobVariant={1}
      // tilt="[transform:perspective(900px)_rotateX(6deg)_rotateY(0deg)_rotateZ(2deg)] hover:[transform:perspective(900px)_rotateX(0)_rotateY(0)_rotateZ(0)]"
    >
      <PreviewIllustration accent={STEP_ACCENTS[1]} />
    </IllustrationCard>,
    <IllustrationCard
      key="code"
      accent={STEP_ACCENTS[2]}
      blobVariant={2}
      // tilt="[transform:perspective(900px)_rotateX(8deg)_rotateY(10deg)_rotateZ(3deg)] hover:[transform:perspective(900px)_rotateX(0)_rotateY(0)_rotateZ(0)]"
    >
      <CodeIllustration accent={STEP_ACCENTS[2]} />
    </IllustrationCard>,
  ];
  const HowToUseRef = useRef<HTMLElement>(null);
  useMagneticField(HowToUseRef);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={HowToUseRef}
        id="how-it-works"
        className="relative mx-auto w-full max-w-6xl scroll-mt-24 overflow-x-clip px-4 pt-10 pb-24"
      >
        {/* Heading */}
        <div className="relative mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight  sm:text-6xl sm:leading-[1.05]">
            <MagneticLetters text="Simple steps." />
            <br />
            <MagneticLetters text="Endless" />
            {/* Endless{" "} */}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r frm-[#E8534A] from-[#F5A67A] to-[#ee4ca8] bg-clip-text text-transparent">
                <MagneticLetters
                  gradient="linear-gradient(90deg, #F5A67A, #ee4ca8)"
                  text=" animations"
                />
                {/* animations. */}
              </span>
              <SmoothUnderline
                className="absolute -bottom-2 left-0 h-3 w-full"
                color="#E8534A"
              data-magnetic="block"
              />
            </span>
          </h2>

          <p className="mt-4 text-lg ">
            <MagneticLetters text="Discover, preview and use animations in just a few clicks." />
          </p>
        </div>

        {/* Steps */}
        <ol className="relative flex items-center justify-around">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              className="relative"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-sm font-bold text-white shadow-md"
              data-magnetic="block"
                  style={{
                    background: `linear-gradient(135deg, var(--color-secondary) 10%, var(--color-secondary))`,
                    // background: `linear-gradient(135deg, ${STEP_ACCENTS[index]}, ${STEP_ACCENTS[index]}b3)`,
                    // boxShadow: `0 6px 14px -4px ${STEP_ACCENTS[index]}88`,
                  }}
                >
                  <MagneticLetters text={(index + 1).toString()} />
                </span>
                <div>
                  <h3 className="text-xl font-semibold ">
                    <MagneticLetters text={step.title} />
                  </h3>
                  <p className="mt-1 max-w-[230px] text-sm leading-relaxed ">
                    <MagneticLetters text={step.text} />
                  </p>
                </div>
              </div>

              {illustrations[index]}
            </motion.li>
          ))}

          {/* Arrows between the columns (desktop only) */}
          {/* <CurvedArrow
            className="pointer-events-none absolute left-[30%] top-[62%] hidden w-16 opacity-60 md:block"
            color={STEP_ACCENTS[0]}
          /> */}
          {/* <CurvedArrow
            className="pointer-events-none absolute left-[63%] top-[62%] hidden w-16 opacity-60 md:block"
            color={STEP_ACCENTS[1]}
          /> */}
        </ol>
      </section>
    </MotionConfig>
  );
}
