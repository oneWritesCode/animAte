"use client";

import { useRef } from "react";
import { MotionConfig } from "framer-motion";
import { Mail } from "lucide-react";
import { MagneticLetters, useMagneticField } from "./Magnetic";

// Point this at wherever you collect sponsorships (GitHub Sponsors, Open Collective, Ko-fi, Stripe link…).
const SPONSOR_URL = "https://github.com/sponsors/onewritescode";
const X_URL = "https://x.com/triordeep";
const CONTACT_EMAIL = "hello@deepak.coding78@gmail.com";

// The first slot invites a sponsor; the rest are empty. Replace a slot's text with a logo <img> when you have one.
const WALL_SLOTS = 2;

const SLOT_CLASSES =
  "flex h-35 aspect-square items-center justify-center rounded-2xl border border-dashed border-black/50 text-xs transition-all duration-800 hover:border-2 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]";

const CONTACT_BUTTON_CLASSES =
  "mt-8 inline-flex items-center gap-3 rounded-xl px-6 py-2 text-sm font-semibold";

function XIcon() {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 aspect-square"
      aria-hidden="true"
    >
      <path
        d="M42.7042 0.5L25.3854 19.0729M2.04583 44.1L19.3521 25.5417M33.3542 44.1L0.5 0.5H11.3958L44.25 44.1H33.3542Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}

export default function Sponsors() {
  const sponsorsRef = useRef<HTMLElement>(null);
  useMagneticField(sponsorsRef);

  return (
    <MotionConfig reducedMotion="user">
      {/* The ref must be on the element, or the magnetic effect has nothing to work on. */}
      <section
        ref={sponsorsRef}
        id="sponsors"
        className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-4"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">
            <MagneticLetters text="Sponsors" />
          </h2>

          {/* Long text moves word by word; letter by letter is too busy for a paragraph. */}
          <p className="mt-4 text-base text-zinc-600">
            <MagneticLetters text="Get your lifetime access to the badge and perks by sponsoring me on GitHub. Your support keeps the library free and open source for everyone." />
            <br />
            <MagneticLetters text="Starts with only" />
            <span className="font-bold">
              <MagneticLetters
                text=" $9.99"
                gradient="linear-gradient(90deg, #ee4ca8, #ee4ca8)"
              />
            </span>
          </p>
        </div>

        <div className="mt-8 text-center">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4">
            {Array.from({ length: WALL_SLOTS }, (_, slot) => (
              <a
                key={slot}
                href={SPONSOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={SLOT_CLASSES}
              >
                {slot === 0 ? "Your logo here" : "+"}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-12 text-4xl font-semibold tracking-tight sm:text-6xl">
            <MagneticLetters text="Any Questions?" />
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {/* One link per button. The X icon is inside it, not a second link. */}
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic="block"
              className={`${CONTACT_BUTTON_CLASSES} bg-[var(--foreground)] text-white`}
            >
              <XIcon />
              <MagneticLetters text="Twitter / X" />
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              data-magnetic="block"
              className={`${CONTACT_BUTTON_CLASSES} border border-black/20`}
            >
              <Mail
                className="w-5 aspect-square"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <MagneticLetters text="Email" />
            </a>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
