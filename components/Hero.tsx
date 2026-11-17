import { FloatingBlobs } from "./FloatingBlobs";
import { FloatingElements } from "./FloatingElements";
import { EyeIcon, SparkleIcon } from "./icons";

export function Hero() {
  return (
    <>
      <FloatingBlobs />
      <section className="min-h-[110vh] flex flex-col items-center relative overflow-hidden px-4 pb-8 pt-16 sm:pt-24 z-10">
        <FloatingElements />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <a
            href="#library"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 shadow-sm"
          >
            <span className="inline-flex items-center gap-1 font-medium text-zinc-800">
              <span className="h-1 w-1.5 rounded-full bg-emerald-500" />
              100+ Beautiful animations
            </span>
          </a>

          <h1 className="text-4xl font-semibold tracking-tight capitalize text-zinc-900 sm:text-6xl sm:leading-[1.05]">
            Add some motion in your website by using
            <span className="mt-1 block text-zinc-400">Animation Snippets</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500 sm:text-lg">
            A goated library of ready-to-use animations. Preview them live, peek at
            the code, and copy it into your project in one click.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/onewritecode"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.8 1.6 2.7 1.1.1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.8 5.5-5.4 5.8.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
              </svg>
              Contribute Here!
            </a>
            <a
              href="#library"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm"
            >
              <span className="font-mono text-xs">{"</>"}</span>
              Browse Animations
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 w-full backdrop-blur-xs h-[20vh] bg-linear-to-b from-transparent via-[var(--background)] to-[var(--background)]" />
      </section>
    </>
  );
}