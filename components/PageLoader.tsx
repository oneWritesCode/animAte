"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import logo from "../public/images/logo.png";

// Tweak these
const MIN_VISIBLE_MS = 1000; // never flash: even a fast load shows the loader this long
const MAX_WAIT_MS = 6000; // never trap people: hide anyway after this long
const FINISH_MS = 500; // the bar snaps to 100% for this long, then the curtain lifts
const BRAND = "animAte";

// Runs even if JavaScript never loads, so the loader can't cover the page forever.
const FAILSAFE_CSS = `
  @keyframes page-loader-failsafe { to { opacity: 0; visibility: hidden; pointer-events: none; } }
  .page-loader-root { animation: page-loader-failsafe 0.01s linear ${MAX_WAIT_MS + 2000}ms forwards; }
`;

type Phase = "loading" | "finishing" | "done";

export default function PageLoader() {
  const [phase, setPhase] = useState<Phase>("loading");
  const prefersReducedMotion = useReducedMotion();

  // Wait for the page (images, fonts, scripts) to finish loading, but at least MIN_VISIBLE_MS.
  useEffect(() => {
    const startedAt = performance.now();
    const timers: number[] = [];

    const finish = () => {
      const remaining = Math.max(
        0,
        MIN_VISIBLE_MS - (performance.now() - startedAt),
      );
      timers.push(
        window.setTimeout(() => {
          setPhase("finishing");
          timers.push(window.setTimeout(() => setPhase("done"), FINISH_MS));
        }, remaining),
      );
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });

    timers.push(window.setTimeout(() => setPhase("done"), MAX_WAIT_MS));

    return () => {
      window.removeEventListener("load", finish);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  // The page behind must not scroll while the loader is up.
  useEffect(() => {
    if (phase === "done") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="page-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading animAte"
          className="page-loader-root fixed inset-0 z-[100] flex flex-col items-center justify-center gap-2 bg-[var(--background)]"
          // The whole screen lifts away like a curtain.
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <style>{FAILSAFE_CSS}</style>

          {/* Soft glow behind the logo */}
          <div
            aria-hidden="true"
            className="absolute h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(238,76,168,0.18),transparent_70%)] blur-2xl"
          />

          {/* <motion.div
            className="relative"
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={logo} alt="" priority className="h-14 w-14" />
          </motion.div> */}

          {/* The name: every letter hops in a wave */}
          <div
            aria-hidden="true"
            className="relative flex text-3xl font-bold uppercase tracking-tight bg-gradient-to-r from-[#F5A67A] to-[#ee4ca8] bg-clip-text text-transparent"
          >
            {BRAND.split("").map((letter, index) => (
              <motion.span
                key={index}
                // className=""
                animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.09,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Progress: eases toward 90% while loading, snaps to 100% when the page is ready */}
          <div
            aria-hidden="true"
            className="relative h-1 w-48 overflow-hidden rounded-full bg-black/10"
          >
            <motion.div
              className="h-full origin-left rounded-full bg-gradient-to-r from-[#F5A67A] to-[#ee4ca8]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === "finishing" ? 1 : 0.9 }}
              transition={
                phase === "finishing"
                  ? { duration: FINISH_MS / 1000, ease: "easeOut" }
                  : { duration: 3, ease: [0.1, 0.7, 0.2, 1] }
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
