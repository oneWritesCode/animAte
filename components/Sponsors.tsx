"use client";

import { motion, MotionConfig } from "framer-motion";

// Point this at wherever you collect sponsorships (GitHub Sponsors, Open Collective, Ko-fi, Stripe link…).
const SPONSOR_URL = "https://github.com/sponsors/onewritescode";

interface Tier {
  name: string;
  price: string;
  description: string;
  perks: string[];
  highlighted?: boolean;
}

// Placeholder tiers and prices: change them to whatever you actually want to offer.
const TIERS: Tier[] = [
  {
    name: "Supporter",
    price: "$5",
    description: "A coffee a month keeps the servers on.",
    perks: ["Your name on the sponsors wall", "Early access to new animations"],
  },
  {
    name: "Builder",
    price: "$15",
    description: "For developers who use animAte every week.",
    perks: [
      "Everything in Supporter",
      "Vote on what gets built next",
      "Sponsor badge on GitHub",
    ],
    highlighted: true,
  },
  {
    name: "Studio",
    price: "$50",
    description: "For teams and companies shipping with animAte.",
    perks: [
      "Everything in Builder",
      "Your logo on the landing page",
      "Priority animation requests",
    ],
  },
];

const FUNDS = [
  {
    title: "New animations",
    text: "More time to design, build and polish them every week.",
  },
  {
    title: "Hosting & tooling",
    text: "Keeping the library and the playground fast and online.",
  },
  {
    title: "Staying free",
    text: "The core library stays free and open source for everyone.",
  },
];

const WALL_SLOTS = SPONSOR_URL.length ? 1 : 0;

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 21s-7.5-4.6-9.6-9.3C1 8.3 2.8 5 6 5c2 0 3.2 1 4 2.2h4C14.8 6 16 5 18 5c3.2 0 5 3.3 3.6 6.7C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

export default function Sponsors() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="sponsors" className="relative mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {/* <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)] capitalize">
            Sponsors
          </span> */}
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Help animAte growing
          </h2>
          {/* <p className="mt-4 text-lg text-zinc-500">
            animAte is built and maintained by one person. Sponsors make it possible to keep shipping and keep it free.
          </p> */}
        </div>

        {/* <div className="mb-12 grid gap-4 md:grid-cols-3">
          {FUNDS.map((fund) => (
            <div key={fund.title} className="rounded-2xl border border-[var(--color-border)] bg-white/60 p-5">
              <p className="font-semibold text-zinc-900">{fund.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">{fund.text}</p>
            </div>
          ))}
        </div> */}

        {/* <div className="grid items-stretch gap-6 md:grid-cols-3">
          {TIERS.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
              className={`relative flex flex-col rounded-[28px] p-7 ${
                tier.highlighted
                  ? "bg-[var(--foreground)] text-white shadow-2xl shadow-[var(--color-primary)]/20 md:-translate-y-3"
                  : "border border-[var(--color-border)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute right-6 top-6 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-semibold text-white">
                  Most popular
                </span>
              )}
              <p className={`text-sm font-semibold ${tier.highlighted ? "text-[var(--color-secondary)]" : "text-[var(--color-primary)]"}`}>
                {tier.name}
              </p>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">{tier.price}</span>
                <span className={tier.highlighted ? "text-white/60" : "text-zinc-400"}>/ month</span>
              </p>
              <p className={`mt-3 text-sm ${tier.highlighted ? "text-white/70" : "text-zinc-500"}`}>{tier.description}</p>

              <ul className="my-6 flex-1 space-y-2.5">
                {tier.perks.map((perk) => (
                  <li key={perk} className={`flex items-start gap-2.5 text-sm ${tier.highlighted ? "text-white/85" : "text-zinc-600"}`}>
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                    {perk}
                  </li>
                ))}
              </ul>

              <a
                href={SPONSOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-2xl px-5 py-3 text-center text-sm font-semibold transition hover:-translate-y-0.5 ${
                  tier.highlighted
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                    : "bg-[var(--color-surface-alt)] text-[var(--color-primary)] hover:bg-[var(--color-border)]"
                }`}
              >
                Become a {tier.name.toLowerCase()}
              </a>
            </motion.div>
          ))}
        </div> */}

        {/* Sponsors wall: empty slots until you have real sponsors. Replace a slot with a logo <img>. */}
        <div className="mt-8 text-center">
          {/* <p className="text-sm font-medium text-zinc-500">Our sponsors</p> */}
          <div className="mx-auto max-w-3xl flex gap-4 items-center justify-center flex-wrap">
            {Array.from({ length: WALL_SLOTS }, (_, slot) => (
              <a
                key={slot}
                href={SPONSOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-40 aspect-square items-center justify-center rounded-2xl border border-dashed border-black/50 text-xs hover:border-2 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-800"
              >
                {slot === 0 ? "Your logo here" : "+"}
              </a>
            ))}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-40 aspect-square items-center justify-center rounded-2xl border border-dashed border-black/50 text-xs hover:border-2 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-800"
            >
              {"+"}
            </a>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
