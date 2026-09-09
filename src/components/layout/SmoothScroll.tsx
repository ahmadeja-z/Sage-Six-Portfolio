"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      anchors: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to the top on every route change. Without this, Lenis's
  // RAF loop re-applies the previous page's scroll position after Next.js
  // resets the window — so the destination opens mid-page. Hash/anchor
  // navigation is left untouched so `/contact#form`-style links still land
  // on their target element.
  useLayoutEffect(() => {
    if (window.location.hash) return;

    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const main = document.querySelector("main");
    if (main instanceof HTMLElement) {
      main.focus({ preventScroll: true });
    }
  }, [pathname]);

  return null;
}