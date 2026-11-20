"use client";

import { useRef } from "react";
import Link from "next/link";
import { FloatingBlobs } from "./FloatingBlobs";
import { MagneticLetters, MagneticWords, useMagneticField } from "./Magnetic";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  useMagneticField(heroRef);

  return (
    <>
      <FloatingBlobs />

      <section ref={heroRef} className="min-h-[110vh] flex flex-col items-center relative overflow-hidden z-10">
        <div className="relative mx-auto min-h-screen flex max-w-3xl flex-col items-center justify-center text-center z-10">
          <a
            href="#library"
            data-magnetic="block"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 shadow-md"
          >
            <span className="inline-flex items-center gap-1 font-medium text-zinc-800">
              <span className="h-1 w-1.5 rounded-full bg-emerald-500" />
              <MagneticLetters text="100+ Beautiful animations" />
            </span>
          </a>

          {/* Typed in Title Case by hand: CSS `capitalize` would capitalise every separate letter. */}
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl sm:leading-[1.05]">
            <MagneticLetters text="Make Your Components Lively By Using" />
            <span className="mt-1 block text-zinc-400">
              <MagneticLetters text="Animation Snippets" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500 sm:text-lg">
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
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-md"
            >
              <span className="font-mono text-xs">{"</>"}</span>
              <MagneticLetters text="Browse Animations" />
            </Link>
          </div>

          {/* <div className="absolute bottom-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/onewritescode/animate"
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic="block"
              className="flex gap-2 py-3 text-xs underline"
            >
              <MagneticLetters text="Contribute Here! ->" />
            </a>
          </div> */}
        </div>
        <div className="absolute bottom-0 w-full backdrop-blur-xs h-[20vh] bg-linear-to-b from-transparent via-[var(--background)] to-[var(--background)] z-2" />
      </section>
    </>
  );
}
