"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const PARTICLE_COUNT = 28;
const COLORS = ["#E8534A", "#F5A67A", "#FFD166", "#06D6A0", "#4D96FF"];

export default function ParticleBurst() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function burst() {
    const field = fieldRef.current;
    const button = buttonRef.current;
    if (!field || !button) return;

    gsap.fromTo(button, { scale: 0.88 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });

    gsap.utils.toArray<HTMLElement>(".burst-particle", field).forEach((particle) => {
      const angle = gsap.utils.random(0, Math.PI * 2);
      const distance = gsap.utils.random(45, 105);

      const flight = gsap.timeline();
      flight
        .fromTo(
          particle,
          { x: 0, y: 0, opacity: 1, scale: gsap.utils.random(0.7, 1.3), rotation: 0 },
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            rotation: gsap.utils.random(-360, 360),
            duration: 0.55,
            ease: "power3.out",
          },
        )
        .to(particle, { y: "+=55", opacity: 0, scale: 0, duration: 0.6, ease: "power1.in" });
    });
  }

  useEffect(() => {
    const field = fieldRef.current;
    const timer = window.setTimeout(burst, 350);
    return () => {
      window.clearTimeout(timer);
      if (field) gsap.killTweensOf(field.querySelectorAll(".burst-particle"));
    };
  }, []);

  return (
    <div ref={fieldRef} className="relative grid place-items-center w-[260px] h-[170px]">
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <span
          key={index}
          className="burst-particle absolute opacity-0 pointer-events-none"
          style={{
            width: index % 3 === 0 ? 6 : 9,
            height: index % 3 === 1 ? 4 : 9,
            borderRadius: index % 2 === 0 ? "50%" : 2,
            background: COLORS[index % COLORS.length],
          }}
        />
      ))}

      <button
        ref={buttonRef}
        type="button"
        onClick={burst}
        className="relative rounded-full px-7 py-3.5 border-0 text-white text-sm font-bold cursor-pointer bg-[#2D1810]"
        style={{
          // background: "linear-gradient(135deg, #E8534A, #E8534A)",
          boxShadow: "4px 4px 20px #4e4e4e5f",
        }}
      >
        Click for confetti
      </button>
    </div>
  );
}
