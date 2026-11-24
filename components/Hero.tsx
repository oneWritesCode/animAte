"use client";

import { useRef } from "react";
import Link from "next/link";
import { FloatingBlobs } from "./FloatingBlobs";
import { MagneticLetters, MagneticWords, useMagneticField } from "./Magnetic";
import SmoothUnderline from "@/public/svg/SmoothUnderline";
import MotionRays from "@/public/svg/MotionRays";

// One gradient, painted across all the letters of the second line.
// const HEADING_GRADIENT = "linear-gradient(90deg, #8B7CF6, #E8534A, #F5A67A)";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  useMagneticField(heroRef);

  return (
    <>
      <FloatingBlobs />

      <section
        ref={heroRef}
        className="min-h-[100vh] flex flex-col items-center relative overflow-hidden z-10"
      >
        <div className="relative mx-auto min-h-screen flex max-w-3xl flex-col items-center justify-center text-center z-10">
          <Link
            href="#library"
            data-magnetic="block"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm shadow-md"
          >
            <span className="inline-flex items-center gap-1 font-medium ">
              <span className="h-1 w-1.5 rounded-full bg-emerald-500" />
              <MagneticLetters text="100+ Beautiful animations" />
            </span>
          </Link>

          {/* Typed in Title Case by hand: CSS `capitalize` would capitalise every separate letter. */}
          <h1 className="text-4xl font-semibold tracking-tight  sm:text-6xl sm:leading-[1.05]">
            <MagneticLetters text="Make Your Components Lively By Using" />
            <span className="mt-1 block">
              <MagneticLetters
                text="Animation Snippets"
                gradient="linear-gradient(90deg, #F5A67A, #ee4ca8)"
              />
              {/* <SmoothUnderline />{" "} */}
              <SmoothUnderline
                data-magnetic="block"
                className="h-3 w-full"
                color="#E8534A"
              />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7  sm:text-lg">
            <MagneticLetters text="A goated library of ready-to-use animations. Preview them live, peek at the code, and copy it into your project in one click." />
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/playground"
              data-magnetic="block"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-md"
            >
              <MagneticLetters text="Visit Playground" />
            </Link>

            <Link
              href="/library"
              data-magnetic="block"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold txt-[#8B7CF6] shadow-md"
            >
              <span className="font-mono text-xs">{"</>"}</span>
              <MagneticLetters text="Browse Animations" />
            
            {/* <MotionRays
              className="absolute -right-4 -top-4 w-6 -scale-x-100 rotate-90"
              color="#8B7CF6"
            /> */}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 w-full backdrop-blur-xs h-[20vh] bg-linear-to-b from-transparent via-[var(--background)] to-[var(--background)] z-2" />
      </section>
    </>
  );
}
