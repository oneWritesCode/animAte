"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/lib/animations/css/animations";
import { allAnimations } from "@/lib/animations";
import type { AnimationCategory, CssAnimationItem } from "@/lib/types";
import { AnimationCard } from "./AnimationCard";
import { CodeModal } from "./CodeModal";
import { SearchIcon } from "./icons";
import Link from "next/link";

const STORAGE_KEY = "ilove-animations-favourites";

export function Library() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<(typeof categories)[number]["id"]>("all");
  const [favourites, setFavourites] = useState<string[]>([]);
  const [active, setActive] = useState<CssAnimationItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavourites(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites, hydrated]);

  // Only CSS items contribute to the global stylesheet; component items bring their own styles.
  const cssBundle = useMemo(
    () =>
      allAnimations
        .flatMap((item) => (item.source === "css" ? [item.css] : []))
        .join("\n\n"),
    [],
  );

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allAnimations.filter((item) => {
      const matchesTab =
        tab === "all"
          ? true
          : tab === "favourites"
            ? favourites.includes(item.id)
            : item.category === (tab as AnimationCategory);
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.includes(q) ||
        item.id.includes(q) ||
        (item.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchesTab && matchesQuery;
    });
  }, [query, tab, favourites]);

  function toggleFavourite(id: string) {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function copied(message = "Copied to clipboard") {
    setToast(message);
    window.setTimeout(() => setToast(null), 1600);
  }

  return (
    <section
      id="library"
      className="relative mx-auto overflow-hidden w-full max-w-6xl pt-4"
    >
      <style>{`${cssBundle}
.anim-preview-loop [class^="anim-"],
.anim-preview-loop[class^="anim-"] {
  animation-iteration-count: infinite;
}`}</style>

      <div className="relative flex item-center justify-between z-10 mb-t mt-8 ml-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight leading-[0.8]">
            Animation Library
          </h2>
          <p className="mb-2 ">Hover to see options</p>
        </div>
        <div>
          <div className="flex items-center justify-center text-sm rounded-[0.75rem] border-2 border-gray-200 shadow-md px-2 py-2 bg-white">
            <Link
              href="https://github.com/onewritescode/animate"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex gap-2 capitalize "
            >
              <svg
                className="w-4 aspect-square transition"
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
              <span>contribute</span>

            </Link>
          </div>
        </div>
      </div>

      <label className="relative z-10 mb-6 block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ">
          <SearchIcon />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="max-w-2xl min-w-xl rounded-full bg-white py-3 pr-4 pl-11 text-sm  outline-none"
        />
      </label>
      <div className="mb-4 inline-flex overflow-x-auto rounded-full border border-black/10 bg-zinc-50 p-1">
        <div className="flex min-w-max">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setTab(c.id)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition ${
                tab === c.id ? "bg-white  shadow-sm" : " hover:"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="relative z-10 mb-4 text-sm ">{items.length}+ animations</p>

      {items.length === 0 ? (
        <div className="relative z-10 rounded-3xl border border-dashed border-zinc-200 py-16 text-center ">
          No animations match that filter yet.
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <AnimationCard
              key={item.id}
              item={item}
              // favourite={favourites.includes(item.id)}
              // onToggleFavourite={() => toggleFavourite(item.id)}
              onOpen={() => item.source === "css" && setActive(item)}
              onCopied={copied}
            />
          ))}
        </div>
      )}

      {active ? (
        <CodeModal item={active} onClose={() => setActive(null)} />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
