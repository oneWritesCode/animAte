"use client";

import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { MagneticLetters, useMagneticField } from "./Magnetic";
import { useRef } from "react";
import { Moirai_One } from "next/font/google";

const FEATURES = [
  {
    title: "Live preview",
    text: "Your changes run in the preview as you type.",
  },
  {
    title: "Everything preloaded",
    text: "React, GSAP, Framer Motion and Tailwind work out of the box.",
  },
  {
    title: "Safe by design",
    text: "Code runs in a sandbox, so it can never touch the rest of the site.",
  },
  {
    title: "Your window, your size",
    text: "Drag the preview anywhere and resize it from any corner.",
  },
];

const STACK = ["React", "GSAP", "Framer Motion", "Tailwind"];

/** A pretend editor + floating preview, so the section shows the product instead of describing it. */
function PlaygroundMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent blur-2xl" />

      <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#1c1411] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 rounded-t-md bg-white/10 px-3 py-1 font-mono text-[11px] text-white/80">
            index.tsx
          </span>
        </div>
        <pre className="min-h-[300px] overflow-hidden p-5 pr-40 font-mono text-[12.5px] leading-6 text-zinc-300">
          <span className="text-[#c792ea]">import</span>
          {" { motion } "}
          <span className="text-[#c792ea]">from</span>
          <span className="text-[#c3e88d]">{' "framer-motion"'}</span>
          {";\n\n"}
          <span className="text-[#c792ea]">export default function</span>
          <span className="text-[#82aaff]">{" App"}</span>
          {"() {\n  "}
          <span className="text-[#c792ea]">return</span>
          {" (\n    <"}
          <span className="text-[#f07178]">motion.div</span>
          {"\n      "}
          <span className="text-[#ffcb6b]">animate</span>
          {"={{ y: [0, -24, 0] }}\n      "}
          <span className="text-[#ffcb6b]">className</span>
          {"="}
          <span className="text-[#c3e88d]">
            &quot;size-16 rounded-2xl bg-primary&quot;
          </span>
          {"\n    />\n  );\n}"}
        </pre>
      </div>

      {/* floating preview window */}
      <div className="absolute -bottom-6 right-2 w-44 overflow-hidden rounded-[1.2rem] bg-[#EDE9E9] p-0.5 shadow-xl sm:-right-6 sm:w-52">
        <p className="px-3 pb-1 pt-2 text-xs text-zinc-600">Animation</p>
        <div className="flex h-36 items-end justify-center rounded-b-[1.1rem] border border-black/10 bg-[var(--background)] pb-6">
          <motion.div
            className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"
            animate={{ y: [0, -44, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="absolute bottom-1 right-1 h-3 w-3 cursor-nwse-resize rounded-sm border-b-2 border-r-2 border-zinc-400" />
      </div>
    </div>
  );
}

export default function AboutPlayground() {
  const AboutPlaygroundRef = useRef<HTMLElement>(null);
  useMagneticField(AboutPlaygroundRef);
  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={AboutPlaygroundRef}
        id="playground"
        className="relative overflo mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-10"
      >
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-lg font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              <MagneticLetters text="The playground" />
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              {/* Don&apos;t just copy it. Understand it. */}
              <MagneticLetters text="Don't just copy it. Understand it." />
            </h2>
            <p className="mt-4 text-md text-zinc-500">
              <MagneticLetters text="Real animations can be long. Open any gsap or framer-motion animation in the playground, read how it works, tweak the values, and see the result immediately." />
            </p>
            {/* <p className="mt-4 text-md text-zinc-500">
              Real animations can be long. Open any gsap or framer-motion animation in the playground, read how it works,
              tweak the values, and see the result immediately.
            </p> */}

            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex gap-3">
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
                    <p className="font-medium text-zinc-900">
                      <MagneticLetters text={feature.title} />
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-zinc-500">
                      <MagneticLetters text={feature.text} />
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-2">
              {STACK.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs font-medium text-zinc-600"
                >
                  {/* {name} */}
                  <MagneticLetters text={name} />
                </span>
              ))}
            </div>

            <Link
              href="/playground"
              data-magnetic="block"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-lg"
            >
              <MagneticLetters text="Open the playground" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="pb-8"
          >
            <PlaygroundMock />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
