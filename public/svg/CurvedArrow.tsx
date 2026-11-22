import type { SVGProps } from "react";

/**
 * A hand-drawn arrow that curves from left to right.
 * Colour: it uses `currentColor`, so pass `className="text-primary"` or `color="#E8534A"`.
 * Size: pass a width through className (the height follows the viewBox).
 */
export default function CurvedArrow({ strokeWidth = 5, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 64" fill="none" aria-hidden="true" {...props}>
      <path d="M5 24C31 8 57 12 82 25c10 5 18 10 26 17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="m91 15 18 27-29-1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
