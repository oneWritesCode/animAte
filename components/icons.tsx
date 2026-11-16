export function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3.2 14.6 8.7l6 .5-4.6 4 1.4 5.8L12 16.7 6.6 19l1.4-5.8-4.6-4 6-.5L12 3.2Z" />
    </svg>
  );
}

export function SparkleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.5 13.7 8l5.8 1.7-5.8 1.7L12 17.5 10.3 11.4 4.5 9.7 10.3 8 12 2.5Z" />
    </svg>
  );
}

export function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V6a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19.5 12.6 12 20l-7.5-7.4a4.5 4.5 0 0 1 6.4-6.3L12 7.2l1.1-.9a4.5 4.5 0 0 1 6.4 6.3Z" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 6.5v11l10-5.5L7 6.5Z" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function PatternCraftIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="#E8534A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4.5" y1="8" x2="11.5" y2="12" />
      <line x1="5.5" y1="17.5" x2="11.5" y2="12" />
      <line x1="4.5" y1="8" x2="5.5" y2="17.5" />
      <line x1="11.5" y1="12" x2="16.5" y2="6.5" />
      <line x1="11.5" y1="12" x2="19" y2="16.5" />
      <circle cx="4.5" cy="8" r="2.2" fill="white" stroke="#E8534A" strokeWidth="2.2" />
      <circle cx="5.5" cy="17.5" r="2.2" fill="white" stroke="#E8534A" strokeWidth="2.2" />
      <circle cx="11.5" cy="12" r="2.2" fill="white" stroke="#E8534A" strokeWidth="2.2" />
      <circle cx="16.5" cy="6.5" r="2.2" fill="white" stroke="#E8534A" strokeWidth="2.2" />
      <circle cx="19" cy="16.5" r="2.2" fill="white" stroke="#E8534A" strokeWidth="2.2" />
    </svg>
  );
}

export function TwitterIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

export function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

