/**
 * FloatingBlobs — warm-themed animated gradient blobs that float around
 * the border edges of whatever container they're placed in.
 *
 * Usage:  wrap your section in `relative overflow-hidden` and drop
 *         <FloatingBlobs /> as the first child (z-0, behind content).
 */
export function FloatingBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-60">
      {/* ── TOP-LEFT corner blob — coral red ── */}
      <div
        className="blob blob-1"
        style={{
          width: 420,
          height: 420,
          top: "-120px",
          left: "-80px",
          background:
            "radial-gradient(circle, var(--color-primary-light) 0%, var(--color-primary) 55%, transparent 80%)",
          opacity: 0.38,
        }}
      />

      {/* ── TOP-RIGHT corner blob — warm peach ── */}
      <div
        className="blob blob-2"
        style={{
          width: 360,
          height: 360,
          top: "-100px",
          right: "-100px",
          background:
            "radial-gradient(circle, var(--color-secondary-light) 0%, var(--color-secondary) 55%, transparent 80%)",
          opacity: 0.4,
        }}
      />

      {/* ── BOTTOM-LEFT corner blob — soft rose ── */}
      <div
        className="blob blob-3"
        style={{
          width: 380,
          height: 380,
          bottom: "-110px",
          left: "-90px",
          background:
            "radial-gradient(circle, var(--color-accent) 0%, var(--color-primary-light) 55%, transparent 80%)",
          opacity: 0.35,
        }}
      />

      {/* ── BOTTOM-RIGHT corner blob — warm orange cream ── */}
      <div
        className="blob blob-4"
        style={{
          width: 340,
          height: 340,
          bottom: "-90px",
          right: "-80px",
          background:
            "radial-gradient(circle, var(--color-secondary-light) 0%, var(--color-accent) 55%, transparent 80%)",
          opacity: 0.38,
        }}
      />

      {/* ── CENTER-LEFT mid blob — deep coral, slow drift ── */}
      <div
        className="blob blob-2"
        style={{
          width: 280,
          height: 280,
          top: "40%",
          left: "-80px",
          background:
            "radial-gradient(circle, var(--color-primary) 0%, var(--color-primary-hover) 60%, transparent 80%)",
          opacity: 0.22,
          animationDelay: "3s",
        }}
      />

      {/* ── CENTER-RIGHT mid blob — peach, offset timing ── */}
      <div
        className="blob blob-1"
        style={{
          width: 260,
          height: 260,
          top: "35%",
          right: "-70px",
          background:
            "radial-gradient(circle, var(--color-secondary) 0%, var(--color-secondary-light) 60%, transparent 80%)",
          opacity: 0.24,
          animationDelay: "5s",
        }}
      />
    </div>
  );
}
