"use client";

import { useAnimationControls, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Tweak these

const DEMO_PASSWORD = "91u2dhjk"; // what the field starts with, so the preview isn't empty
const AUTOPLAY_MS = 5000; // the eye flips by itself until somebody touches the field

const FIELD_WIDTH = 248;
const FIELD_HEIGHT = 46;
const KNOB_SIZE = FIELD_HEIGHT - 6; // the round button: 5px gap on every side
const SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;
const INK = "#4b4f9a"; // colour of the eye and the revealed text
const DOTS = "#818cf8"; // colour of the hidden dots
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

// Icons

function LockIcon({ color }: { color: string }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      animate={{ color }}
      transition={{ duration: 0.25 }}
    >
      <path d="M17 9V7a5 5 0 0 0-10 0v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3Zm-8-2a3 3 0 0 1 6 0v2H9V7Z" />
    </motion.svg>
  );
}

// One eye that opens and closes. Both lid paths have the same shape of commands,
// so framer-motion can morph from one to the other.
const EYE_OPEN = "M2 12C5 6 19 6 22 12C19 18 5 18 2 12Z";
const EYE_CLOSED = "M2 12C5 12.5 19 12.5 22 12C19 13 5 13 2 12Z";

function Eye({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={INK}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        initial={false}
        animate={{ d: isOpen ? EYE_OPEN : EYE_CLOSED }}
        transition={SPRING}
      />
      {/* the pupil shows up when the eye opens */}
      <motion.circle
        cx="12"
        cy="12"
        r="2.6"
        fill={INK}
        stroke="none"
        initial={false}
        animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
        style={{ originX: "12px", originY: "12px" }}
        transition={SPRING}
      />
      {/* little lashes when it is closed */}
      <motion.g
        initial={false}
        animate={{ opacity: isOpen ? 0 : 1, y: isOpen ? -2 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path d="M6 15.5 4.6 17.5" />
        <path d="M12 16.2V18.6" />
        <path d="M18 15.5 19.4 17.5" />
      </motion.g>
    </svg>
  );
}

// The field

export default function PasswordReveal() {
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const hasBeenTouched = useRef(false); // once true, the demo autoplay stops for good
  const inputRef = useRef<HTMLInputElement>(null);
  const textControls = useAnimationControls();
  const isFirstRender = useRef(true);

  // Demo mode: until somebody touches the field, the eye flips by itself.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!hasBeenTouched.current) setIsVisible((current) => !current);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  // Whenever the field flips, the text slides in again (after the white pill has started moving).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    textControls.set({ opacity: 0, y: 6 });
    textControls.start({ opacity: 1, y: 0, transition: { ...SPRING, delay: 0.12 } });
  }, [isVisible, textControls]);

  return (
    // A real <form> keeps browsers (and password managers) happy about the password field.
    <form
      onSubmit={(event) => event.preventDefault()}
      style={{ display: "grid", placeItems: "center", width: 260, height: 150 }}
    >
      <style>{`
        .password-reveal-input::placeholder { color: var(--password-placeholder); }
        .password-reveal-input:focus { outline: none; }
      `}</style>

      <div
        style={{
          position: "relative",
          width: FIELD_WIDTH,
          height: FIELD_HEIGHT,
          borderRadius: 22,
          background: "#0f1424",
          boxShadow: isFocused
            ? "0 0 0 2px rgba(129, 140, 248, 0.7), 0 14px 28px -12px rgba(15, 20, 36, 0.6)"
            : "0 14px 28px -12px rgba(15, 20, 36, 0.6)",
          transition: "box-shadow 0.2s",
          overflow: "hidden",
        }}
      >
        {/* the lock stays put, and turns dark when the white pill covers it */}
        <div
          style={{
            position: "absolute",
            left: 14,
            top: 0,
            bottom: 0,
            display: "grid",
            placeItems: "center",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <LockIcon color={isVisible ? "#1f2340" : "#ffffff"} />
        </div>

        {/* the white pill that grows to the left, carrying the eye with it */}
        <motion.div
          initial={false}
          animate={{ width: isVisible ? FIELD_WIDTH - 4 : KNOB_SIZE }}
          transition={SPRING}
          style={{
            position: "absolute",
            right: 2,
            top: 3,
            height: KNOB_SIZE,
            borderRadius: 20,
            background: "#fff",
            overflow: "hidden",
            zIndex: 1,
          }}
        />

        {/* The real input, on top of everything. Hidden = dots, visible = the actual text. */}
        <motion.input
          ref={inputRef}
          animate={textControls}
          className="password-reveal-input"
          type={isVisible ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          aria-label="Password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onFocus={() => {
            hasBeenTouched.current = true;
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          style={
            {
              position: "absolute",
              inset: 0,
              zIndex: 2,
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              padding: `0 ${KNOB_SIZE + 14}px 0 40px`,
              border: 0,
              background: "transparent",
              fontFamily: MONO,
              fontSize: 14,
              letterSpacing: isVisible ? 0 : 2,
              color: isVisible ? INK : DOTS,
              caretColor: isVisible ? INK : "#ffffff",
              transition: "color 0.25s",
              "--password-placeholder": isVisible ? "rgba(31, 35, 64, 0.35)" : "rgba(255, 255, 255, 0.35)",
            } as React.CSSProperties
          }
        />

        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          // Keep the cursor in the input when the eye is clicked.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            hasBeenTouched.current = true;
            setIsVisible((current) => !current);
            inputRef.current?.focus();
          }}
          style={{
            position: "absolute",
            right: 2,
            top: 2,
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            display: "grid",
            placeItems: "center",
            border: 0,
            zIndex: 3,
          }}
          className="bg-transparent rounded-full cursor-pointer"
        >
          <Eye isOpen={isVisible} />
        </button>
      </div>
    </form>
  );
}