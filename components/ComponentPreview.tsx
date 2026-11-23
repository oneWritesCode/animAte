"use client";

import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { componentLoaders } from "@/lib/animations/registry.generated";
import type { ComponentAnimationItem } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/*  Lazy component per animation (created once, never per render)             */
/* -------------------------------------------------------------------------- */

const lazyComponentById = new Map<string, ComponentType>();

function getLazyComponent(id: string): ComponentType | null {
  const existing = lazyComponentById.get(id);
  if (existing) return existing;

  const loader = componentLoaders[id];
  if (!loader) return null;

  const created = lazy(loader);
  lazyComponentById.set(id, created);
  return created;
}

/* -------------------------------------------------------------------------- */
/*  Only run previews that are on (or near) the screen                         */
/* -------------------------------------------------------------------------- */

/**
 * With 1000+ cards, dozens of infinite GSAP / framer-motion loops would run at
 * once. Mounting only the cards near the viewport (and unmounting them when they
 * leave) keeps the page smooth and cleans up each animation's timers.
 */
function useIsNearViewport<T extends Element>(rootMargin = "150px") {
  const elementRef = useRef<T>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => setIsNear(entry.isIntersecting), { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { elementRef, isNear };
}

/* -------------------------------------------------------------------------- */
/*  One broken snippet must never take the whole page down                     */
/* -------------------------------------------------------------------------- */

class PreviewErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Animation preview crashed:", error, info.componentStack);
  }

  render() {
    return this.state.hasError ? (
      <p className="text-xs">Preview failed to load</p>
    ) : (
      this.props.children
    );
  }
}

/* -------------------------------------------------------------------------- */
/*  ComponentPreview                                                           */
/* -------------------------------------------------------------------------- */

/**
 * `replayKey` comes from the card's Replay button: changing it remounts the
 * snippet, which replays its mount animation (same idea as AnimationPreview).
 */
export function ComponentPreview({
  item,
  replayKey = 0,
}: {
  item: ComponentAnimationItem;
  replayKey?: number;
}) {
  const { elementRef, isNear } = useIsNearViewport<HTMLDivElement>();
  const Preview = getLazyComponent(item.id);

  return (
    <div ref={elementRef} className="flex h-full w-full items-center justify-center">
      {isNear && Preview && (
        <PreviewErrorBoundary key={replayKey}>
          <Suspense fallback={<div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200" />}>
            <Preview />
          </Suspense>
        </PreviewErrorBoundary>
      )}
    </div>
  );
}