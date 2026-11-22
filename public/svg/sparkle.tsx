import type { SVGProps } from "react";

/** A four-pointed star. Colour comes from `currentColor`: className="text-primary" or color="#E8534A". */
export default function Sparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0c.9 7.1 4.9 11.1 12 12-7.1.9-11.1 4.9-12 12-.9-7.1-4.9-11.1-12-12C7.1 11.1 11.1 7.1 12 0Z" />
    </svg>
  );
}
