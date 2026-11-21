"use client";

import { motion, MotionConfig } from "framer-motion";

/* ------------------------------ Mini illustrations ------------------------------ */

/** Step 1: a library card with its hover toolbar. */
function BrowseIllustration() {
  return (
    <div className="relative mx-auto h-full w-full max-w-[260px]">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-white to-[var(--color-surface)]">
          <motion.div
            className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"
            animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <div className="flex gap-1 rounded-full border border-zinc-200 bg-white/95 p-1 text-[11px] font-medium text-zinc-700 shadow-md">
            <span className="rounded-full px-2.5 py-1">Copy</span>
            <span className="rounded-full px-2.5 py-1">Code</span>
            <span className="rounded-full bg-[var(--color-surface-alt)] px-2.5 py-1 text-[var(--color-primary)]">Replay</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Step 2: the code, with a copy button. */
function CodeIllustration() {
  return (
    <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-[#1c1411] text-left shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <span className="rounded-md bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-medium text-white">Copy</span>
      </div>
      <pre className="overflow-hidden p-3 font-mono text-[11px] leading-5 text-zinc-300">
        <span className="text-[#c792ea]">.fade-up</span>
        {" {\n  "}
        <span className="text-[#f78c6c]">animation</span>
        {": "}
        <span className="text-[#c3e88d]">rise 0.6s ease</span>
        {";\n}\n\n"}
        <span className="text-[#c792ea]">@keyframes</span>
        {" rise {\n  "}
        <span className="text-[#f78c6c]">from</span>
        {" { opacity: 0 }\n}"}
      </pre>
    </div>
  );
}

/** Step 3: install + paste. */
function ShipIllustration() {
  return (
    <div className="mx-auto w-full max-w-[280px] space-y-2.5 text-left">
      <div className="rounded-2xl bg-[#1c1411] px-4 py-3 font-mono text-[11px] text-zinc-300 shadow-lg">
        <span className="text-[var(--color-secondary)]">$</span> npm install gsap
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 shadow-sm">
        <p className="font-mono text-[11px] text-zinc-500">components/Button.tsx</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <p className="text-xs font-medium text-zinc-700">Animation added</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------- Section ----------------------------------- */

const STEPS = [
  {
    title: "Find one you like",
    text: "Browse by category or search. Every card previews live, and Replay runs it again.",
    illustration: <BrowseIllustration />,
  },
  {
    title: "Grab the code",
    text: "CSS animations copy in one click. gsap and framer-motion ones open in the playground, so you see how they work before using them.",
    illustration: <CodeIllustration />,
  },
  {
    title: "Drop it in",
    text: "Install the package if it needs one, paste the file, done. No account and no setup.",
    illustration: <ShipIllustration />,
  },
];

export default function HowToUse() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="how-it-works" className="relative mx-auto w-full max-w-6xl px-4 py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          {/* <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">How it works</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            From idea to animated in three steps
          </h2> */}
          <p className="text-4xl font-bold tracking-tight text-primary capitalize">Copy, paste,<br /> and make your interface feel alive.</p>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
              className="group relative flex flex-col overflow-hidden"
            >
              <span className="absolute right-5 top-4 text-7xl font-semibold leading-none text-[var(--color-surface-alt)] transition-colors duration-300 group-hover:text-[var(--color-primary)] z-10">
                {index + 1}
              </span>

              <div className="relative mb-2 mx-6 p-8 flex h-52 items-center justify-center">
              {/* <div className="relative mb-2 mx-6 p-8 flex h-52 items-center justify-center rounded-2xl border border-black/7 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-alt)]"> */}
                {step.illustration}
              </div>

              <h3 className="relative text-xl text-center font-semibold text-zinc-900">{step.title}</h3>
              {/* <p className="relative mt-2 leading-relaxed text-zinc-500">{step.text}</p> */}
            </motion.li>
          ))}
        </ol>
      </section>
    </MotionConfig>
  );
}
