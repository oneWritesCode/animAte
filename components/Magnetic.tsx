"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

/* -------------------------------------------------------------------------- */
/*  Text helpers: split text into the pieces that get pulled by the cursor     */
/* -------------------------------------------------------------------------- */

/** Every letter is its own magnet. Words stay together so a line never breaks in the middle of a word. */
export function MagneticLetters({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} aria-hidden="true">
          {wordIndex > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {[...word].map((letter, letterIndex) => (
              <span key={letterIndex} data-magnetic="letter" className="inline-block will-change-transform">
                {letter}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Every word is a magnet (used for paragraphs and inside buttons). */
export function MagneticWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span aria-label={text}>
      {words.map((word, index) => (
        <span key={index} aria-hidden="true">
          {index > 0 && " "}
          <span data-magnetic="word" className="inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  The magnetic field                                                         */
/* -------------------------------------------------------------------------- */

interface MagnetProfile {
  /** How far (px) from an element the cursor starts to attract it. */
  radius: number;
  /** How much of the distance to the cursor the element moves (0 to 1). */
  strength: number;
  /** The most (px) the element may ever move. */
  maxPull: number;
}

// Mark any element with data-magnetic="letter" | "word" | "block" and it joins the field.
const PROFILES: Record<string, MagnetProfile> = {
  letter: { radius: 140, strength: 0.28, maxPull: 12 },
  word: { radius: 130, strength: 0.22, maxPull: 8 },
  block: { radius: 220, strength: 0.16, maxPull: 10 }, // whole buttons / badges: a gentler pull
};

interface Magnet {
  element: HTMLElement;
  profile: MagnetProfile;
  centerX: number;
  centerY: number;
  isPulled: boolean;
}

/**
 * Makes every [data-magnetic] element inside `rootRef` lean towards the mouse.
 * One listener drives all of them, so a hero with 100+ letters stays smooth.
 * Does nothing on touch screens or when the user prefers reduced motion.
 */
export function useMagneticField(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const wantsReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || wantsReducedMotion) return;

    const magnets: Magnet[] = Array.from(root.querySelectorAll<HTMLElement>("[data-magnetic]")).map((element) => ({
      element,
      profile: PROFILES[element.dataset.magnetic ?? "letter"] ?? PROFILES.letter,
      centerX: 0,
      centerY: 0,
      isPulled: false,
    }));

    /** Where each element sits on the page when nothing is pulling it. */
    function measure() {
      for (const magnet of magnets) {
        const rect = magnet.element.getBoundingClientRect();
        // Take away the offset we applied ourselves, so the centre is the resting one.
        let offsetX = Number(gsap.getProperty(magnet.element, "x")) || 0;
        let offsetY = Number(gsap.getProperty(magnet.element, "y")) || 0;
        const parent = magnet.element.parentElement?.closest<HTMLElement>("[data-magnetic]");
        if (parent) {
          offsetX += Number(gsap.getProperty(parent, "x")) || 0;
          offsetY += Number(gsap.getProperty(parent, "y")) || 0;
        }
        magnet.centerX = rect.left + window.scrollX + rect.width / 2 - offsetX;
        magnet.centerY = rect.top + window.scrollY + rect.height / 2 - offsetY;
      }
    }

    function release(magnet: Magnet) {
      magnet.isPulled = false;
      gsap.to(magnet.element, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
    }

    let needsMeasure = true;
    const markDirty = () => {
      needsMeasure = true;
    };

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      if (needsMeasure) {
        measure();
        needsMeasure = false;
      }

      for (const magnet of magnets) {
        const { profile } = magnet;
        const deltaX = event.pageX - magnet.centerX;
        const deltaY = event.pageY - magnet.centerY;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > profile.radius) {
          if (magnet.isPulled) release(magnet);
          continue;
        }

        // Stronger when closer, fading to nothing at the edge of the radius.
        const falloff = 1 - distance / profile.radius;
        let pullX = deltaX * profile.strength * falloff;
        let pullY = deltaY * profile.strength * falloff;
        const pull = Math.hypot(pullX, pullY);
        if (pull > profile.maxPull) {
          pullX *= profile.maxPull / pull;
          pullY *= profile.maxPull / pull;
        }

        magnet.isPulled = true;
        gsap.to(magnet.element, { x: pullX, y: pullY, duration: 0.45, ease: "power3.out", overwrite: "auto" });
      }
    }

    function releaseAll() {
      magnets.filter((magnet) => magnet.isPulled).forEach(release);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", markDirty);
    window.addEventListener("blur", releaseAll);
    document.documentElement.addEventListener("mouseleave", releaseAll);
    // Web fonts change letter widths after load, so measure again once they're ready.
    document.fonts?.ready.then(markDirty);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", markDirty);
      window.removeEventListener("blur", releaseAll);
      document.documentElement.removeEventListener("mouseleave", releaseAll);
      magnets.forEach((magnet) => {
        gsap.killTweensOf(magnet.element);
        gsap.set(magnet.element, { clearProps: "transform" });
      });
    };
  }, [rootRef]);
}
