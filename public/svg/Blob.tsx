import type { SVGProps } from "react";

// Three organic outlines, so a page of blobs doesn't look copy-pasted.
const BLOB_PATHS = [
  "M41.6 17.4C70-4.6 120.6-6.4 154.2 12.2c33.6 18.6 50.4 52.4 43 91.4-7.4 39-35.8 76.4-77.6 86.8-41.8 10.4-90.6-6.6-110.4-44.4C-10 109.6 13.2 39.4 41.6 17.4Z",
  "M160.4 28.6c26.2 22.4 41 64.4 30.2 98.6-10.8 34.2-47.6 60.6-86.2 66.4-38.6 5.8-79-8.6-97.8-39.6C-12.2 123-7 76 17.6 44.2 42.2 12.4 86-3 119.2 1.4c15.6 2 28.6 12.6 41.2 27.2Z",
  "M30.8 52.2C46.6 18 90 4.4 126.4 12.6c36.4 8.2 66 40.6 69.6 76.6 3.6 36-19.2 75.6-55 94.4-35.8 18.8-84.6 16.8-112.2-8.6C-8.6 149.6 15 86.4 30.8 52.2Z",
];

interface BlobProps extends SVGProps<SVGSVGElement> {
  /** Which outline to use: 0, 1 or 2. */
  variant?: 0 | 1 | 2;
}

/**
 * A soft organic shape. Colour comes from `currentColor`, so give it a see-through colour:
 * color="rgba(139,124,246,0.25)" or className="text-violet-400/25".
 */
export default function Blob({ variant = 0, ...props }: BlobProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="currentColor" aria-hidden="true" {...props}>
      <path d={BLOB_PATHS[variant]} />
    </svg>
  );
}
