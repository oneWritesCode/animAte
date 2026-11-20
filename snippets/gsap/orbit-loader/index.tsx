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
      // Each ring spins at its own speed; neighbouring rings go in opposite directions.
      gsap.utils.toArray<HTMLElement>(".orbit-ring").forEach((ring, index) => {
        gsap.to(ring, {
          rotation: index % 2 === 0 ? 360 : -360,
          duration: ORBITS[index].seconds,
          repeat: -1,
          ease: "none",
        });
      });

      // The planets breathe...
      gsap.utils.toArray<HTMLElement>(".orbit-planet").forEach((planet, index) => {
        gsap.to(planet, { scale: 1.5, duration: 0.5 + index * 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });

      // ...and the core pulses like a heartbeat.
      gsap.to(".orbit-core", { scale: 1.3, duration: 0.8, yoyo: true, repeat: -1, ease: "power2.inOut" });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} style={{ position: "relative", width: 150, height: 150 }}>
      <div
        className="orbit-core"
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #fff, #E8534A)",
          boxShadow: "0 0 24px 6px rgba(232, 83, 74, 0.5)",
        }}
      />

      {ORBITS.map(({ size, color }) => (
        <div
          key={size}
          className="orbit-ring"
          style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: size,
            height: size,
            borderRadius: "50%",
            border: "1px dashed rgba(45, 24, 16, 0.18)",
          }}
        >
          <span
            className="orbit-planet"
            style={{
              position: "absolute",
              top: -5,
              left: "50%",
              width: 10,
              height: 10,
              marginLeft: -5,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 12px 2px ${color}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
