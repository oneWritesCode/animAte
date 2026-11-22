"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const ORBITS = [
  { size: 64, seconds: 2.2, color: "#E8534A" },
  { size: 104, seconds: 3.4, color: "#F5A67A" },
  { size: 144, seconds: 5, color: "#FFD166" },
];

export default function OrbitLoader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".orbit-ring").forEach((ring, index) => {
        gsap.to(ring, {
          rotation: index % 2 === 0 ? 360 : -360,
          duration: ORBITS[index].seconds,
          repeat: -1,
          ease: "none",
        });
      });

      gsap.utils.toArray<HTMLElement>(".orbit-planet").forEach((planet, index) => {
        gsap.to(planet, { scale: 1.5, duration: 0.5 + index * 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      gsap.to(".orbit-core", { scale: 1.3, duration: 0.8, yoyo: true, repeat: -1, ease: "power2.inOut" });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative w-[150px] h-[150px]">
      {/* Core */}
      <div
        className="orbit-core absolute inset-0 m-auto w-[22px] h-[22px] rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 35%, #fff, #E8534A)",
          boxShadow: "0 0 24px 6px rgba(232, 83, 74, 0.5)",
        }}
      />

      {ORBITS.map(({ size, color }) => (
        <div
          key={size}
          className="orbit-ring absolute inset-0 m-auto rounded-full"
          style={{
            width: size,
            height: size,
            border: "1px dashed rgba(45, 24, 16, 0.18)",
          }}
        >
          <span
            className="orbit-planet absolute rounded-full"
            style={{
              top: -5,
              left: "50%",
              width: 10,
              height: 10,
              marginLeft: -5,
              background: color,
              boxShadow: `0 0 12px 2px ${color}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
