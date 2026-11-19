import type { PlaygroundFile } from "./protocol";

/** What the blank /playground starts with: the imports are already there, you just write JSX. */
export const STARTER_FILES: PlaygroundFile[] = [
  {
    name: "index.tsx",
    code: `import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

export default function App() {
  const boxRef = useRef<HTMLDivElement>(null);

  // GSAP: spin the box forever
  useEffect(() => {
    const spin = gsap.to(boxRef.current, {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: "none",
    });
    return () => {
      spin.kill();
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <div
        ref={boxRef}
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: "linear-gradient(135deg, #E8534A, #F5A67A)",
        }}
      />

      {/* Framer Motion: bounce the box up and down */}
      <motion.div
        animate={{ y: [0, -24, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: "linear-gradient(135deg, #F5A67A, #E8534A)",
        }}
      />
    </div>
  );
}
`,
  },
];

export const STARTER_DEPENDENCIES = ["gsap", "framer-motion"];
