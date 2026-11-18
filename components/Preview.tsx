import type { CssAnimationItem } from "@/lib/types";

// Only change from your version: the item type is now CssAnimationItem.
export function AnimationPreview({
  item,
  replayKey = 0,
  className = "",
}: {
  item: CssAnimationItem;
  replayKey?: number;
  className?: string;
}) {
  const loopClass = item.loopsInPreview ? "anim-preview-loop" : "";

  if (item.kind === "bg") {
    return (
      <div key={replayKey} className={`absolute inset-0 ${loopClass} ${className}`}>
        <div className={`${item.className} h-full w-full`} />
      </div>
    );
  }

  if (item.id === "progress") {
    return (
      <div key={replayKey} className={loopClass}>
        <div className="anim-progress-track">
          <div className={item.className} />
        </div>
      </div>
    );
  }

  if (item.kind === "text") {
    return (
      <div key={replayKey} className={`${loopClass} ${className}`}>
        <p className={item.className}>{item.previewText ?? "Motion"}</p>
      </div>
    );
  }

  return (
    <div key={replayKey} className={`${loopClass} ${className}`}>
      <div className={item.className} />
    </div>
  );
}