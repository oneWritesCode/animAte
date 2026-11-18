"use client";

import { motion, type Variants } from "framer-motion";

const ITEMS = ["Design", "Develop", "Animate", "Ship"];

// The parent only orchestrates: it delays each child by 120ms.
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export default function StaggeredFadeUp() {
  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="show"
      style={{ display: "grid", gap: 10, margin: 0, padding: 0, listStyle: "none" }}
    >
      {ITEMS.map((label) => (
        <motion.li
          key={label}
          variants={itemVariants}
          style={{
            padding: "10px 22px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #E8534A, #F5A67A)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {label}
        </motion.li>
      ))}
    </motion.ul>
  );
}
