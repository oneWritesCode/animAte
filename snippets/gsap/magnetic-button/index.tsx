"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import "./magnetic-button.css";

const BUTTON_PULL = 0.35; // how far the button follows the pointer (0 to 1)
const LABEL_PULL = 0.2; // the label moves less, which fakes depth

export default function MagneticButton() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    const button = buttonRef.current;
    const label = labelRef.current;
    if (!field || !button || !label) return;

    // gsap.context tracks everything created inside it, so one revert() cleans up all of it.
    const context = gsap.context(() => {
      const springOptions = { duration: 0.8, ease: "elastic.out(1, 0.45)" };
      const followOptions = { duration: 0.4, ease: "power3.out" };

      // quickTo reuses a single tween, so it stays smooth on every pointermove.
      const moveButtonX = gsap.quickTo(button, "x", springOptions);
      const moveButtonY = gsap.quickTo(button, "y", springOptions);
      const moveLabelX = gsap.quickTo(label, "x", followOptions);
      const moveLabelY = gsap.quickTo(label, "y", followOptions);

      const handlePointerMove = (event: PointerEvent) => {
        const bounds = button.getBoundingClientRect();
        const offsetX = event.clientX - (bounds.left + bounds.width / 2);
        const offsetY = event.clientY - (bounds.top + bounds.height / 2);

        moveButtonX(offsetX * BUTTON_PULL);
        moveButtonY(offsetY * BUTTON_PULL);
        moveLabelX(offsetX * LABEL_PULL);
        moveLabelY(offsetY * LABEL_PULL);
      };

      const handlePointerLeave = () => {
        moveButtonX(0);
        moveButtonY(0);
        moveLabelX(0);
        moveLabelY(0);
      };

      field.addEventListener("pointermove", handlePointerMove);
      field.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        field.removeEventListener("pointermove", handlePointerMove);
        field.removeEventListener("pointerleave", handlePointerLeave);
      };
    }, field);

    return () => context.revert();
  }, []);

  return (
    // The field is the invisible "magnetic area" around the button.
    <div ref={fieldRef} className="magnetic-field">
      <button ref={buttonRef} type="button" className="magnetic-button">
        <span ref={labelRef} className="magnetic-label">
          Hover me
        </span>
      </button>
    </div>
  );
}
