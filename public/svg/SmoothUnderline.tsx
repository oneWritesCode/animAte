import type { SVGProps } from "react";

/**
 * A soft double-stroke underline that stretches to the width of whatever you put it under.
 * Colour comes from `currentColor`. Use className="w-full h-3".
 */
export default function SmoothUnderline({ strokeWidth = 5, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 24" fill="none" preserveAspectRatio="none" aria-hidden="true" {...props}>
      <path d="M6 16C50 6 110 4 160 8c28 2 52 5 74 2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M40 21c50-7 110-7 160-3" stroke="currentColor" strokeWidth={Number(strokeWidth) * 0.6} strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}
