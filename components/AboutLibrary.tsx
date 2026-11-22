"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { allAnimations } from "@/lib/animations";
import { MagneticLetters, useMagneticField } from "./Magnetic";

gsap.registerPlugin(TextPlugin);

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    title: "Live previews",
    text: "Every card plays its animation, so you pick with your eyes.",
  },
  {
    title: "CSS, GSAP & Framer Motion",
    text: "Simple effects in pure CSS, bigger ones in your favourite library.",
  },
  {
    title: "Copy or tinker",
    text: "CSS copies in one click. JSX opens in the playground.",
  },
  {
    title: "Sorted by category",
    text: "Entrance, hover, loaders, text, backgrounds and more.",
  },
];

const STATS = [
  { value: allAnimations.length, label: "Animations" },
  { value: 6, label: "Categories" },
  { value: 3, label: "Flavours" },
];

const FLOATING_CHIPS = [
  { label: "GSAP", className: "left-0 top-6", depth: 14 },
  { label: "Framer Motion", className: "right-0 top-16", depth: 22 },
  { label: "CSS", className: "bottom-14 left-2", depth: 18 },
  { label: "Hover", className: "bottom-2 right-8", depth: 12 },
  { label: "Loaders", className: "left-0 top-[46%]", depth: 26 },
];

/* -------------------------------------------------------------------------- */
/*  Mini animations that live inside the tiles                                 */
/* -------------------------------------------------------------------------- */

const CORAL = "#E8534A";
const PEACH = "#E8534A";

/** GSAP: three rings, spinning against each other. */
function MiniOrbit() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".mini-ring").forEach((ring, index) => {
        gsap.to(ring, {
          rotation: index % 2 ? -360 : 360,
          duration: 2 + index * 1.4,
          repeat: -1,
          ease: "none",
        });
      });
    }, rootRef);
    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative size-14">
      {[24, 40, 56].map((size, index) => (
        <div
          key={size}
          className="mini-ring absolute inset-0 m-auto rounded-full border border-dashed border-black/20"
          style={{ width: size, height: size }}
        >
          <span
            className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full"
            style={{
              background: index === 1 ? PEACH : CORAL,
              boxShadow: `0 0 8px ${index === 1 ? PEACH : CORAL}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/** Framer Motion: three bouncing dots. */
function MiniDots() {
  return (
    <div className="flex items-end gap-1.5">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="size-3.5 rounded-full"
          style={{ background: `linear-gradient(135deg, ${CORAL}, ${PEACH})` }}
          animate={{ y: [0, -16, 0], scaleY: [1, 1.15, 0.8, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: dot * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Framer Motion: equaliser bars. */
function MiniBars() {
  return (
    <div className="flex h-10 items-center gap-1">
      {[0.4, 0.9, 0.6, 1, 0.5].map((peak, bar) => (
        <motion.span
          key={bar}
          className="h-full w-1.5 origin-center rounded-full bg-white"
          animate={{ scaleY: [0.25, peak, 0.25] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: bar * 0.12,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Framer Motion: ripples that spread out and fade. */
function MiniRipple() {
  return (
    <div className="relative grid size-14 place-items-center">
      {[0, 1, 2].map((ring) => (
        <motion.span
          key={ring}
          className="absolute size-6 rounded-full border-2"
          style={{ borderColor: CORAL }}
          animate={{ scale: [0.4, 2.2], opacity: [0.9, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: ring * 0.65,
            ease: "easeOut",
          }}
        />
      ))}
      <span className="size-3 rounded-full" style={{ background: CORAL }} />
    </div>
  );
}

/** Framer Motion: a switch that flips itself with a spring. */
function MiniToggle() {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(
      () => setIsOn((current) => !current),
      1400,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="flex h-8 w-14 items-center rounded-full p-1"
      animate={{ backgroundColor: isOn ? CORAL : "#d4d4d8" }}
    >
      <motion.span
        className="size-6 rounded-full bg-white shadow"
        animate={{ x: isOn ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </motion.div>
  );
}

/** GSAP TextPlugin: types a word, deletes it, types again. */
function MiniTypewriter() {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const context = gsap.context(() => {
      gsap.to(element, {
        duration: 1.4,
        text: "animate",
        ease: "none",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.7,
      });
    });
    return () => context.revert();
  }, []);

  return (
    <span className="font-mono text-sm font-semibold text-zinc-800">
      <span ref={textRef}>animate</span>
      <motion.span
        className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-[#E8534A]"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
    </span>
  );
}

/** Framer Motion: a heartbeat with tiny hearts floating away. */
function MiniHeart() {
  return (
    <div className="relative grid size-14 place-items-center">
      {[-1, 1].map((side) => (
        <motion.span
          key={side}
          className="absolute text-xs"
          style={{ color: PEACH }}
          animate={{
            y: [0, -26],
            x: [0, side * 12],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.6],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: side === 1 ? 0.5 : 0,
            ease: "easeOut",
          }}
        >
          ♥
        </motion.span>
      ))}
      <motion.span
        className="text-3xl"
        style={{ color: CORAL }}
        animate={{ scale: [1, 1.28, 1, 1.18, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        ♥
      </motion.span>
    </div>
  );
}

/** Framer Motion: a progress ring that fills up, again and again. */
function MiniProgress() {
  return (
    <svg viewBox="0 0 48 48" className="size-14 -rotate-90">
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="5"
      />
      <motion.circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke={CORAL}
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.75, 1],
        }}
      />
    </svg>
  );
}

/** The middle tile: a spinning gradient border around a counter that counts up. */
function CounterTile() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => Math.round(value));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, allAnimations.length, {
      duration: 1.8,
      ease: "easeOut",
    });
    return controls.stop;
  }, [isInView, count]);

  return (
    <div ref={ref} className="relative size-full">
      <motion.div
        className="absolute -inset-0.5 rounded-[24px]"
        style={{
          background: `conic-gradient(from 0deg, ${CORAL}, ${PEACH}, #FFD166, ${CORAL})`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative grid size-full place-items-center rounded-[22px] bg-[#1c1411]">
        <div className="text-center">
          <motion.span className="block text-3xl font-semibold leading-none text-white">
            {rounded}
          </motion.span>
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-widest text-white/60">
            animations
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  The stage                                                                  */
/* -------------------------------------------------------------------------- */

type Tone = "light" | "coral" | "none";

const TILES: { tone: Tone; content: ReactNode }[] = [
  { tone: "light", content: <MiniOrbit /> },
  { tone: "coral", content: <MiniBars /> },
  { tone: "light", content: <MiniToggle /> },
  { tone: "light", content: <MiniDots /> },
  { tone: "none", content: <CounterTile /> },
  { tone: "light", content: <MiniRipple /> },
  { tone: "light", content: <MiniProgress /> },
  { tone: "coral", content: <MiniHeart /> },
  { tone: "light", content: <MiniTypewriter /> },
];

const TONE_CLASSES: Record<Tone, string> = {
  light:
    "bg-white border border-black/20 shadow-[0_18px_30px_-12px_rgba(45,24,16,0.3)]",
  coral:
    "bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)] shadow-[0_18px_30px_-12px_var(--color-primary-light)]",
  none: "shadow-[0_18px_34px_-12px_var(--color-primary-light)]",
};

function Tile({
  index,
  tone,
  children,
}: {
  index: number;
  tone: Tone;
  children: ReactNode;
}) {
  return (
    <motion.div
      data-tile
      // Every tile floats up and down on its own rhythm; hovering one lifts it right off the board.
      animate={{ z: [0, 16, 0] }}
      // whileHover={{
      //   z: 60,
      //   scale: 1.06,
      //   transition: { type: "spring", stiffness: 260, damping: 18 },
      // }}
      transition={{
        duration: 3 + (index % 3) * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2,
      }}
      className={`grid aspect-square place-items-center rounded-3xl ${TONE_CLASSES[tone]}`}
    >
      {children}
    </motion.div>
  );
}

/** A label floating above the board; it drifts the opposite way to the tilt, which adds depth. */
function FloatingChip({
  label,
  className,
  depth,
  pointerX,
  pointerY,
}: {
  label: string;
  className: string;
  depth: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const x = useTransform(pointerX, (value) => value * depth);
  const y = useTransform(pointerY, (value) => value * depth);

  return (
    <motion.span
      style={{ x, y }}
      className={`pointer-events-none absolute ${className}`}
    >
      <motion.span
        className="block rounded-full border border-black/5 bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-lg backdrop-blur"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3 + depth / 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {label}
      </motion.span>
    </motion.span>
  );
}

function LibraryStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Pointer position over the stage, -1 to 1.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 16 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 16 });

  // The classic isometric board, plus a little extra tilt from the pointer.
  const rotateX = useTransform(smoothY, [-1, 1], [62, 50]);
  const rotateZ = useTransform(smoothX, [-1, 1], [-48, -32]);

  // A glowing outline runs over the tiles one by one, like a scanner.
  useEffect(() => {
    const board = boardRef.current;
    if (!board || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const context = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", board);
      const scan = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
      tiles.forEach((tile, index) => {
        scan.fromTo(
          tile,
          { outline: "0px solid rgba(232,83,74,0)" },
          {
            outline: "3px solid rgba(232,83,74,0.9)",
            duration: 0.25,
            yoyo: true,
            repeat: 1,
            clearProps: "outline",
          },
          index * 0.22,
        );
      });
    }, board);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      onPointerMove={(event) => {
        const bounds = stageRef.current!.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
      className="relative mx-auto aspect-square w-full max-w-[480px] [perspective:1400px]"
    >
      {/* soft light that slowly breathes behind the board */}
      {/* <motion.div
        className="absolute inset-[8%] -z-10 rounded-full bg-gradient-to-br from-[var(--color-primary)]/0 to-transparent blur-3xl"
        animate={{ scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      /> */}

      <motion.div
        ref={boardRef}
        style={{ rotateX, rotateZ, transformStyle: "preserve-3d" }}
        className="absolute left-1/2 top-1/2 grid w-[70%] -translate-x-1/2 -translate-y-1/2 grid-cols-3 gap-3"
      >
        {TILES.map((tile, index) => (
          <Tile key={index} index={index} tone={tile.tone}>
            {tile.content}
          </Tile>
        ))}
      </motion.div>

      {FLOATING_CHIPS.map((chip) => (
        <FloatingChip
          key={chip.label}
          {...chip}
          pointerX={smoothX}
          pointerY={smoothY}
        />
      ))}
    </div>
  );
}

// section

export default function AboutLibrary() {
  const AboutLibraryRef = useRef<HTMLElement>(null);
  useMagneticField(AboutLibraryRef);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={AboutLibraryRef}
        id="about-library"
        className="relative mx-auto w-full max-w-6xl px-4 pt-10 pb-24"
      >
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="scale-110"
          >
            <LibraryStage />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-lg text-right font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              <MagneticLetters text="The library" />
            </p>
            <h2 className="text-4xl text-right font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              {/* Motion you can feel before you copy it. */}
              <MagneticLetters text=" Motion you can feel before you copy it." />
            </h2>
            <p className="mt-4 text-md text-zinc-500 text-right tracking-tighter">
              <MagneticLetters text=" A growing collection of hand-built animations for buttons, loaders, text, cards and backgrounds. Pick one, see it move, and take it home." />
            </p>

            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex flex-row-reverse gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </span>

                  <div>
                    <p className="font-medium text-zinc-900 text-right">
                      {/* {feature.title} */}
                      <MagneticLetters text={feature.title} />
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-zinc-500 text-right">
                      {/* {feature.text} */}
                      <MagneticLetters text={feature.text} />
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-8 flex gap-8 items-center justify-center">
              {STATS.map((stat) => (
                <div key={stat.label} className="">
                  {/* <dt className="sr-only">{stat.label}</dt> */}
                  <dd className="text-2xl font-semibold tracking-tight text-zinc-900">
                    {/* {stat.value} */}
                    <MagneticLetters text={stat.value.toString()} />
                  </dd>
                  <p className="text-xs leading-0 text-zinc-500">
                    {/* {stat.label} */}
                    <MagneticLetters text={stat.label} />
                  </p>
                </div>
              ))}
              <Link
                href="/library"
                data-magnetic="block"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg"
              >
                <MagneticLetters text="Browse the library" />
                <span aria-hidden>{"->"}</span>
              </Link>
            </dl>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
