import Link from "next/link";

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
      { label: "Explore animations", href: "/library" },
      { label: "playground", href: "/playground" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    title: "CONTRIBUTE",
    links: [
      {
        label: "Contribution guide",
        href: "https://github.com/onewritescode/animAte",
      },
      {
        label: "Request an animation",
        href: "https://github.com/onewritescode/animAte/issues",
      },
      {
        label: "Report an issue",
        href: "https://github.com/onewritescode/animAte/issues",
      },
    ],
  },
  {
    title: "CONNECT",
    links: [
      { label: "GitHub", href: "https://github.com/onewritescode" },
      { label: "X / Twitter", href: "https://x.com/triordeep" },
      { label: "LinkedIn", href: "https://linkedin.com/in/" },
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
  // const year = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-24 min-h-[620px] overflow-hidden bg-gradient-to-b from-[var(--background)] via-[var(--color-secondary)]/10 to-[var(--color-secondary)] text-[#20212a]">
      {/* <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_5%,rgba(255,226,218,0.48),transparent_48%)]"
        /> */}

      <div className="relative mb-8 z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 pb-56 pt-24 lg:grid-cols-[1.55fr_repeat(4,minmax(0,1fr))] lg:gap-10 lg:pb-64 lg:pt-28">
        {/* Brand / short message */}
        <div className="flex flex-col items-start">
          <Link
            href="/"
            aria-label="AnimAte home"
            className="text-4xl font-semibold uppercase leading-[0.8] tracking-[-0.055em] transition-opacity hover:opacity-75"
          >
            Make it move.
            <br />
            Make it yours<span className="text-[var(--color-primary)]">.</span>
          </Link>

          <div className="mt-12 space-y-1.5 text-xs leading-relaxed text-[#65748a]">
            <p>© 2026 AnimAte. All rights reserved.</p>
            <p>
              Made with{" "}
              <span className="text-[var(--color-primary)]">{"♥"}</span> for the
              love of motion.
            </p>
          </div>
        </div>

        {/* Footer navigation */}
        {footerColumns.map((column) => (
          <nav
            key={column.title}
            aria-label={column.title}
            className="text-center"
          >
            <h2 className="mb-4 text-sm font-bold tracking-[0.1em] ">
              {column.title}
            </h2>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#65748a] transition-colors duration-200 hover:text-[#20212a]"
                  >
                    {link.label}
                  </Link>
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
