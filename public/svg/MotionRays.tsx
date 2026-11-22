import type { SVGProps } from "react";

/**
 * Three short lines that burst out of a corner, the "something just happened" mark.
 * Colour comes from `currentColor`. Flip it with className="-scale-x-100" to point the other way.
 */
export default function MotionRays({ strokeWidth = 4, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
      <path d="M12 20 8 7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="m23 24 11-11" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="m25 36 17-3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
