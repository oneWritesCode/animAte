"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const PIECE_COUNT = 38;
const COLORS = ["#E8534A", "#F5A67A", "#FFD166", "#06D6A0", "#4D96FF"];
const AUTOPLAY_MS = 10000;

function ArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8534A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v15M6 13l6 6 6-6" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7" strokeDasharray="20" />
    </svg>
  );
}

export default function SubmitConfetti() {
  const rootRef = useRef<HTMLDivElement>(null);
  const isRunning = useRef(false);
  const contextRef = useRef<gsap.Context | null>(null);
  const celebrateRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const context = gsap.context(() => {
      const pieces = gsap.utils.toArray<HTMLElement>(".confetti-piece");
      gsap.set(pieces, { opacity: 0 });
      gsap.set(".label-success", { opacity: 0, y: 12 });
      gsap.to(".label-arrow", { y: 2.5, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });

      celebrateRef.current = () => {
        if (isRunning.current) return;
        isRunning.current = true;

        const timeline = gsap.timeline({ onComplete: () => { isRunning.current = false; } });

        timeline
          .to(".submit-button", { scale: 0.92, duration: 0.1, ease: "power2.out" })
          .to(".submit-button", { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });

        timeline
          .to(".label-submit", { y: -12, opacity: 0, duration: 0.2, ease: "power2.in" }, 0.08)
          .to(".label-success", { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 0.22)
          .fromTo(".label-success path", { strokeDashoffset: 20 }, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, 0.3);

        if (!reducedMotion) {
          pieces.forEach((piece) => {
            const spread = gsap.utils.random(-110, 110);
            const rise = gsap.utils.random(40, 100);
            const fall = gsap.utils.random(70, 120);
            const spin = gsap.utils.random(360, 900) * (Math.random() > 0.5 ? 1 : -1);

            const flight = gsap.timeline();
            flight
              .set(piece, { x: gsap.utils.random(-50, 50), y: gsap.utils.random(-6, 6), scale: 0.3, opacity: 1, rotation: gsap.utils.random(0, 360) }, 0)
              .to(piece, { scale: 1, duration: 0.15 }, 0)
              .to(piece, { x: `+=${spread}`, duration: 2, ease: "power2.out" }, 0)
              .to(piece, { y: `-=${rise}`, duration: 0.5, ease: "power2.out" }, 0)
              .to(piece, { y: `+=${rise + fall}`, duration: 1.5, ease: "power1.in" }, 0.5)
              .to(piece, { rotation: `+=${spin}`, rotationX: gsap.utils.random(180, 540), duration: 2, ease: "none" }, 0)
              .to(piece, { opacity: 0, duration: 0.5 }, 1.6);
            timeline.add(flight, 0.12);
          });
        }

        timeline
          .to(".label-success", { y: -12, opacity: 0, duration: 0.25, ease: "power2.in" }, 3.1)
          .fromTo(".label-submit", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 3.15);
      };
    }, root);
    contextRef.current = context;

    const firstRun = window.setTimeout(() => celebrateRef.current(), 700);
    const loop = window.setInterval(() => celebrateRef.current(), AUTOPLAY_MS);

    return () => {
      window.clearTimeout(firstRun);
      window.clearInterval(loop);
      context.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative grid place-items-center w-[260px] h-[170px]">
      <button
        type="button"
        className="submit-button relative w-[140px] h-[42px] border-0 rounded-full bg-[#151a2e] text-white text-sm font-medium cursor-pointer"
        style={{ boxShadow: "0 12px 24px -10px rgba(21, 26, 46, 0.65)" }}
        onClick={() => celebrateRef.current()}
      >
        <span className="label-submit absolute inset-0 flex items-center justify-center gap-2">
          <span className="label-arrow flex">
            <ArrowDown />
          </span>
          Submit
        </span>
        <span className="label-success absolute inset-0 flex items-center justify-center gap-2">
          <Check />
          Success
        </span>
      </button>

      {Array.from({ length: PIECE_COUNT }, (_, index) => (
        <span
          key={index}
          className="confetti-piece absolute left-1/2 top-1/2 opacity-0 pointer-events-none rounded-[1.5px]"
          style={{
            width: gsap.utils.wrap([5, 8, 4, 7])(index),
            height: gsap.utils.wrap([9, 5, 7, 10])(index),
            marginLeft: -3,
            marginTop: -4,
            background: COLORS[index % COLORS.length],
          }}
        />
      ))}
    </div>
  );
}
