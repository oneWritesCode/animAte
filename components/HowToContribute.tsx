"use client";

import { motion, MotionConfig } from "framer-motion";

const REPO_URL = "https://github.com/onewritescode/animate";

const STEPS = [
  {
    title: "Fork & clone",
    text: "Fork the repo on GitHub, then clone it and run npm install.",
  },
  {
    title: "Add a folder",
    text: "Create snippets/<library>/<your-animation>/ with your component and a small meta file.",
  },
  {
    title: "Preview it",
    text: "Run npm run dev. The build validates your snippet and your animation appears in the library.",
  },
  {
    title: "Open a pull request",
    text: "Push your branch and open a PR. We'll review it and ship it.",
  },
];

const CHECKLIST = [
  "A unique, kebab-case id",
  "Every npm package listed under dependencies",
  "Looks good at card size (about 300px wide)",
  "Respects prefers-reduced-motion where it can",
];

/** A tiny file tree + meta file, the two things a contributor actually writes. */
function ContributionPreview() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Your folder</p>
        <pre className="font-mono text-[13px] leading-6 text-zinc-600">
          {"snippets/\n└─ gsap/\n   └─ "}
          <span className="font-semibold text-[var(--color-primary)]">my-animation/</span>
          {"\n      ├─ index.tsx   "}
          <span className="text-zinc-400">← the component</span>
          {"\n      ├─ meta.ts     "}
          <span className="text-zinc-400">← name, category…</span>
          {"\n      └─ styles.css  "}
          <span className="text-zinc-400">← optional</span>
        </pre>
      </div>

      <div className="overflow-hidden rounded-3xl bg-[#1c1411] shadow-xl">
        <p className="border-b border-white/10 px-5 py-3 font-mono text-xs text-white/60">meta.ts</p>
        <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-zinc-300">
          <span className="text-[#c792ea]">export default</span>
          {" {\n  "}
          <span className="text-[#ffcb6b]">id</span>
          {": "}
          <span className="text-[#c3e88d]">&quot;gsap-my-animation&quot;</span>
          {",\n  "}
          <span className="text-[#ffcb6b]">name</span>
          {": "}
          <span className="text-[#c3e88d]">&quot;My Animation&quot;</span>
          {",\n  "}
          <span className="text-[#ffcb6b]">category</span>
          {": "}
          <span className="text-[#c3e88d]">&quot;hover&quot;</span>
          {",\n  "}
          <span className="text-[#ffcb6b]">dependencies</span>
          {": ["}
          <span className="text-[#c3e88d]">&quot;gsap&quot;</span>
          {"],\n} "}
          <span className="text-[#c792ea]">satisfies</span>
          {" ComponentAnimationMeta;"}
        </pre>
      </div>
    </div>
  );
}

export default function HowToContribute() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="contribute" className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">Open source</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Built by the community, for the community
          </h2>
          <p className="mt-4 text-lg text-zinc-500">
            Got an animation you&apos;re proud of? Adding it takes one folder and one pull request.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <ol className="relative space-y-8">
              <span aria-hidden className="absolute bottom-3 left-[19px] top-3 w-px bg-[var(--color-border)]" />
              {STEPS.map((step, index) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                  className="relative flex gap-5"
                >
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-sm font-semibold text-[var(--color-primary)] shadow-sm">
                    {index + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-semibold text-zinc-900">{step.title}</h3>
                    <p className="mt-1 leading-relaxed text-zinc-500">{step.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <div className="mt-10 rounded-3xl bg-[var(--color-surface-alt)] p-6">
              <p className="mb-3 font-semibold text-zinc-900">Before you open the PR</p>
              <ul className="space-y-2">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-600">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                View on GitHub <span aria-hidden>↗</span>
              </a>
              <a
                href={`${REPO_URL}/blob/main/README.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-[var(--color-surface)]"
              >
                Read the guide
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <ContributionPreview />
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
