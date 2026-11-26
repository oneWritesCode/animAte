"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/lib/animations/css/animations";
import { allAnimations } from "@/lib/animations";
import type { AnimationCategory, CssAnimationItem } from "@/lib/types";
import { AnimationCard } from "./AnimationCard";
import { CodeModal } from "./CodeModal";
import { SearchIcon } from "./icons";

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

      <div className="relative z-10 mb-t mt-8 ml-2">
        <h2 className="text-3xl font-semibold tracking-tight ">
          Animation Library
        </h2>
        <p className="my-2 ">Hover to see options</p>
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
      <div className="mb-6 overflow-x-auto rounded-full border border-zinc-200 bg-zinc-50 p-1">
        <div className="flex min-w-max">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setTab(c.id)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap transition ${tab === c.id ? "bg-white  shadow-sm" : " hover:"
                }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="relative z-10 mb-4 text-sm ">
        {items.length}+ animations
      </p>

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