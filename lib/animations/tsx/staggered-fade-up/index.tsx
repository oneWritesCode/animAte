"use client";

import { motion, type Variants } from "framer-motion";

const ITEMS = ["Design", "Develop", "Animate", "Ship"];

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
      className="grid gap-2.5 m-0 p-0 list-none"
    >
      {ITEMS.map((label) => (
        <motion.li
          key={label}
          variants={itemVariants}
          className="px-[22px] py-2.5 rounded-xl text-white font-semibold text-sm text-center"
          style={{ background: "linear-gradient(135deg, #E8534A, #E8534A)" }}
        >
          {label}
        </motion.li>
      ))}
    </motion.ul>
  );
}
