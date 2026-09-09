"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorMode = "default" | "hover" | "view";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 38, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 420, damping: 38, mass: 0.6 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const raf = requestAnimationFrame(() => setEnabled(true));
    document.documentElement.classList.add("cursor-fine");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      if (target) {
        const value = target.dataset.cursor;
        setMode(value === "view" ? "view" : "hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      if (!target) setMode("default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-fine");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] h-2 w-2 rounded-full bg-sage"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      />
      <motion.div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[119] flex items-center justify-center rounded-full border border-sage/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: mode === "view" ? 84 : mode === "hover" ? 56 : 32,
          height: mode === "view" ? 84 : mode === "hover" ? 56 : 32,
          opacity: visible ? (mode === "default" ? 0.4 : 1) : 0,
          backgroundColor:
            mode === "view" ? "rgba(163,184,138,0.9)" : "rgba(163,184,138,0)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        {mode === "view" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.18 }}
            className="font-mono text-[10px] font-medium tracking-[0.2em] text-ink"
          >
            VIEW
          </motion.span>
        )}
      </motion.div>
    </>
  );
}