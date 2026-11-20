"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, motionValue, useTransform, type MotionValue } from "framer-motion";

const CARDS = [
  { title: "Swipe me", note: "drag left or right", from: "#E8534A", to: "#F5A67A" },
  { title: "Again!", note: "they keep coming", from: "#4D96FF", to: "#6BCBFF" },
  { title: "Smooth", note: "powered by springs", from: "#06D6A0", to: "#7AE7C7" },
  { title: "Nice one", note: "never runs out", from: "#B14DFF", to: "#E0A4FF" },
];

const SWIPE_DISTANCE = 90; // px you have to drag before a swipe counts
const FLY_OFF = 320; // px the card flies away
const AUTOPLAY_MS = 2400;

function Card({
  card,
  x,
  position,
  onSwipe,
  onDragStateChange,
}: {
  card: (typeof CARDS)[number];
  x: MotionValue<number>;
  position: number; // 0 = on top
  onSwipe: (direction: 1 | -1) => void;
  onDragStateChange: (isDragging: boolean) => void;
}) {
  const isTop = position === 0;
  const rotate = useTransform(x, [-150, 0, 150], [-14, 0, 14]);
  const opacity = useTransform(x, [-FLY_OFF, -150, 0, 150, FLY_OFF], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragStart={() => onDragStateChange(true)}
      onDragEnd={(_, info) => {
        onDragStateChange(false);
        if (Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > 500) {
          onSwipe(info.offset.x > 0 ? 1 : -1);
        }
      }}
      // Cards further back are smaller and sit lower, so they look stacked.
      animate={{ scale: 1 - position * 0.07, y: position * 14 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      style={{
        x,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex: CARDS.length - position,
        position: "absolute",
        width: 190,
        height: 112,
        borderRadius: 20,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        color: "#fff",
        cursor: isTop ? "grab" : "default",
        touchAction: "pan-y",
        background: `linear-gradient(135deg, ${card.from}, ${card.to})`,
        boxShadow: "0 14px 26px -10px rgba(0,0,0,0.35)",
      }}
      whileTap={isTop ? { cursor: "grabbing" } : undefined}
    >
      <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{card.title}</p>
      <p style={{ margin: "2px 0 0", fontSize: 12, opacity: 0.85 }}>{card.note}</p>
    </motion.div>
  );
}

export default function SwipeCardStack() {
  // order[0] is the card on top.
  const [order, setOrder] = useState(() => CARDS.map((_, index) => index));
  const [offsets] = useState(() => CARDS.map(() => motionValue(0)));
  const isDragging = useRef(false);
  const orderRef = useRef(order);
  const nextDirection = useRef<1 | -1>(1);

  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  function swipeTop(direction: 1 | -1) {
    const topIndex = orderRef.current[0];
    const offset = offsets[topIndex];

    animate(offset, direction * FLY_OFF, {
      duration: 0.28,
      ease: "easeIn",
      onComplete: () => {
        // Send the card to the back and put it in place, ready for its next turn.
        offset.set(0);
        setOrder((current) => [...current.slice(1), current[0]]);
      },
    });
  }

  // Swipes by itself until somebody touches it, so the card always looks alive.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (isDragging.current) return;
      swipeTop(nextDirection.current);
      nextDirection.current = nextDirection.current === 1 ? -1 : 1;
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative", display: "grid", placeItems: "center", width: 240, height: 150 }}>
      {order.map((cardIndex, position) => (
        <Card
          key={cardIndex}
          card={CARDS[cardIndex]}
          x={offsets[cardIndex]}
          position={position}
          onSwipe={swipeTop}
          onDragStateChange={(dragging) => {
            isDragging.current = dragging;
          }}
        />
      ))}
    </div>
  );
}
