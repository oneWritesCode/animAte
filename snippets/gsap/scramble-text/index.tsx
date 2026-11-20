"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

const PHRASES = ["MAKE IT MOVE", "FEEL THE MOTION", "SHIP THE MAGIC"];
const SCRAMBLE_CHARACTERS = "!<>-_\\/[]{}=+*^?#";

export default function ScrambleText() {
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const context = gsap.context(() => {
      // Each phrase scrambles in, holds for a moment, then the next one takes over. Forever.
      const timeline = gsap.timeline({ repeat: -1 });
      PHRASES.forEach((phrase) => {
        timeline.to(element, {
          duration: 1.3,
          ease: "none",
          scrambleText: { text: phrase, chars: SCRAMBLE_CHARACTERS, revealDelay: 0.25, speed: 0.6 },
        });
        timeline.to({}, { duration: 1.1 }); // the hold
      });
    });

    return () => context.revert();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        width: 260,
        height: 150,
        borderRadius: 20,
        background: "#18181b",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      <span
        ref={textRef}
        style={{
          color: "#F5A67A",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textShadow: "0 0 18px rgba(232, 83, 74, 0.55)",
        }}
      >
        {PHRASES[0]}
      </span>
    </div>
  );
}
