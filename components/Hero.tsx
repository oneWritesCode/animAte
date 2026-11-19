import { FloatingBlobs } from "./FloatingBlobs";
import { FloatingElements } from "./FloatingElements";
import { EyeIcon, SparkleIcon } from "./icons";

export function Hero() {
  return (
    <>
      <FloatingBlobs />

      <section className="min-h-[110vh] flex flex-col items-center relative overflow-hidden z-10">
        {/* <FloatingElements /> */}
        <div className="relative mx-auto min-h-screen flex max-w-3xl flex-col items-center justify-center text-center  z-10">
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
            make your components lively by using
            <span className="mt-1 block text-zinc-400">Animation Snippets</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500 sm:text-lg">
            A goated library of ready-to-use animations. Preview them live, peek
            at the code, and copy it into your project in one click.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/playground"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Visit Playground
            </a>

            <a
              href="/library"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm"
            >
              <span className="font-mono text-xs">{"</>"}</span>
              Browse Animations
            </a>
          </div>

          <div className="absolute bottom-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/onewritecode/animAte"
              className="flex gap-2 py-3 text-xs underline"
            >
              Contribute Here! {" ->"}
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 w-full backdrop-blur-xs h-[20vh] bg-linear-to-b from-transparent via-[var(--background)] to-[var(--background)] z-2" />
      </section>
    </>
  );
}
