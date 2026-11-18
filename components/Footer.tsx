import React from "react";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: "PRODUCT",
    links: [
      { label: "Explore animations", href: "#animations" },
      { label: "Categories", href: "#categories" },
      { label: "How it works", href: "#how-it-works" },
      { label: "What's new", href: "#updates" },
    ],
  },
  {
    title: "CONTRIBUTE",
    links: [
      { label: "Submit an animation", href: "#submit" },
      { label: "Contribution guide", href: "#contribute" },
      { label: "Request an animation", href: "#request" },
      { label: "Report an issue", href: "#issues" },
    ],
  },
  {
    title: "CONNECT",
    links: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "X / Twitter", href: "https://x.com/" },
      { label: "LinkedIn", href: "https://linkedin.com/" },
      { label: "Email", href: "mailto:hello@animate.app" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
      { label: "License", href: "/license" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-24 min-h-[620px] overflow-hidden bg-gradient-to-b from-[var(--background)] via-[var(--color-primary)/80] to-[var(--color-primary)] text-[#20212a]">
      {/* Soft light near the top keeps the content area calm. */}
      <div
        aria-hidden="true"
        // className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_5%,rgba(255,226,218,0.48),transparent_48%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 pb-56 pt-24 lg:grid-cols-[1.55fr_repeat(4,minmax(0,1fr))] lg:gap-10 lg:pb-64 lg:pt-28">
        {/* Brand / short message */}
        <div className="flex flex-col items-start">
          <a
            href="/"
            aria-label="AnimAte home"
            className="text-4xl font-semibold leading-[1.08] tracking-[-0.055em] transition-opacity hover:opacity-75 sm:text-5xl"
          >
            Make it move.
            <br />
            Make it yours<span className="text-[#f47782]">.</span>
          </a>

          <div className="mt-12 space-y-1.5 text-xs leading-relaxed text-[#65748a]">
            <p>© {year} AnimAte. All rights reserved.</p>
            <p>
              Made with <span className="text-[#f47782]">♥</span> for the love of
              motion.
            </p>
          </div>
        </div>

        {/* Footer navigation */}
        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="mb-6 text-[10px] font-bold tracking-[0.2em] text-[#8793a5]">
              {column.title}
            </h2>
            <ul className="space-y-4">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-[#65748a] transition-colors duration-200 hover:text-[#20212a] sm:text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Oversized type is the decorative footer artwork—no images or stickers. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-0.12em] z-0 select-none overflow-hidden whitespace-nowrap text-center text-[27vw] font-black leading-[0.78] tracking-[-0.095em] text-white/95 drop-shadow-[0_8px_0_rgba(48,125,205,0.13)]"
      >
        animAte
      </div>
    </footer>
  );
}
