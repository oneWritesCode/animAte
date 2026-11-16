"use client";

import Link from "next/link";
import { GithubIcon, PatternCraftIcon, TwitterIcon } from "./icons";
import Image from "next/image";
import logo from "../public/images/logo.png"

export function Navbar({ className = "" }: { className?: string }) {
  return (
    <header className={`w-full absolute top-0 flex justify-center`}>
      <nav className="max-w-4xl w-full flex justify-between py-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-zinc-900 transition-opacity hover:opacity-90"
        >
          {/* <PatternCraftIcon className="h-6 w-6" /> */}
          <Image src={logo} className="h-6 w-6 aspect-square"/>
          <span className="text-xl font-bold tracking-tight text-zinc-900 font-sans">
            animAte
          </span>
        </Link>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-zinc-800">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-1.5 text-zinc-800 transition hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="Twitter"
          >
            <TwitterIcon className="h-5 w-5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-1.5 text-zinc-800 transition hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="GitHub"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
