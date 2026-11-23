"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/logo.png";
import VisitorCount from "./VisitorsCount";

export function Navbar({ className = "" }: { className?: string }) {
  return (
    <header className={`w-full absolute top-0 flex justify-center z-11`}>
      <nav className="max-w-4xl w-full flex justify-between py-4">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5  transition-opacity hover:opacity-90"
        >
          {/* <PatternCraftIcon className="h-6 w-6" /> */}
          <Image src={logo} alt="animAte" className="h-6 w-6 aspect-square" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#F5A67A] to-[#ee4ca8] o-[#8B7CF6]/80 bg-clip-text text-transparent font-sans uppercase">
            animAte
          </span>
        </Link>
        <div className="flex items-center gap-4  capitalize text-sm">
          <div className="cursor-pointer hover:scale-105 hover:text-black hover:font-medium transition duration-300">
            <a href="/playground">playground</a>
          </div>
          <div className="cursor-pointer hover:scale-105 hover:text-black hover:font-medium transition duration-300">
            <a href="/library">library</a>
          </div>
          <div className="cursor-pointer hover:scale-105 hover:text-black hover:font-medium transition duration-300">
            <a
              href="https://github.com/onewritescode/animate"
              target="_blank"
              rel="noopener noreferrer"
            >
              contribution
            </a>
          </div>
        </div>
        {/* Social Icons */}
        <div className="flex items-center gap-4 ">
          <div className="text-sm rounded-[0.75rem] border-2 border-gray-200 shadow-md px-3 py-1.5 bg-white">
            <VisitorCount />
          </div>
          <div className="flex items-center justify-center text-sm rounded-[0.75rem] border-2 border-gray-200 shadow-md px-2 py-2 bg-white">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-4 aspect-square  transition hover:bg-zinc-100 hover:"
              aria-label="GitHub"
            >
              <svg
                className={className}
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.7503 39.5832C8.33366 42.7082 8.33366 34.3748 4.16699 33.3332M33.3337 45.8332V37.7707C33.4118 36.7773 33.2776 35.7786 32.9399 34.8411C32.6023 33.9035 32.0689 33.0486 31.3753 32.3332C37.917 31.604 44.792 29.1248 44.792 17.7498C44.7915 14.8411 43.6726 12.044 41.667 9.93733C42.6167 7.39255 42.5495 4.57972 41.4795 2.08316C41.4795 2.08316 39.0212 1.354 33.3337 5.1665C28.5587 3.87237 23.5253 3.87237 18.7503 5.1665C13.0628 1.354 10.6045 2.08316 10.6045 2.08316C9.53444 4.57972 9.46729 7.39255 10.417 9.93733C8.39642 12.0596 7.27641 14.882 7.29199 17.8123C7.29199 29.104 14.167 31.5832 20.7087 32.3957C20.0232 33.1039 19.4946 33.9486 19.1572 34.8747C18.8198 35.8007 18.6812 36.7875 18.7503 37.7707V45.8332"
                  stroke="currentColor"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
