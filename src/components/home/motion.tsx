"use client";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useAnimate, useInView } from "motion/react";
function subscribeReducedMotion(notify: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
export function useHomeReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
}
// Matches the nav's desktop breakpoint (Navigation.tsx). SSR/first paint
// assumes narrow so no server/client markup mismatch and no-JS clients get
// the simpler, always-usable scrollable layout.
function subscribeWideViewport(notify: () => void) {
  const media = window.matchMedia("(min-width: 1024px)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
export function useIsWideViewport() {
  return useSyncExternalStore(
    subscribeWideViewport,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}
export const motionTokens = {
  duration: { instant: 0.15, fast: 0.22, normal: 0.45, expressive: 0.7 },
  distance: { small: 8, normal: 20, large: 32 },
  stagger: { tight: 0.05, normal: 0.09, relaxed: 0.14 },
  easing: {
    standard: [0.22, 1, 0.36, 1] as const,
    gentle: [0.16, 1, 0.3, 1] as const,
  },
};
// Visible SSR content is also usable without JavaScript. No page-level loader.
export function Reveal({
  children,
  className,
  delay = 0,
  entrance = false,
  effect = "rise",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  entrance?: boolean;
  effect?: "rise" | "image" | "scale" | "line";
}) {
  const reduce = useHomeReducedMotion();
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, amount: 0.12 });
  const shouldReveal = entrance || inView;
  useEffect(() => {
    if (reduce || !shouldReveal) return;
    const element = scope.current;
    const smallScreen = window.matchMedia("(max-width: 767px)").matches;
    const frames =
      effect === "image"
        ? {
            opacity: [0, 1],
            scale: [1.025, 1],
            clipPath: ["inset(0 0 12% 0)", "inset(0 0 0% 0)"],
          }
        : effect === "line"
          ? { scaleX: [0, 1] }
          : effect === "scale"
            ? {
                opacity: [0, 1],
                y: [smallScreen ? 12 : 20, 0],
                scale: [0.96, 1],
              }
            : { opacity: [0, 1], y: [smallScreen ? 12 : 20, 0] };
    const controls = animate(element, frames, {
      duration: smallScreen
        ? motionTokens.duration.normal
        : motionTokens.duration.expressive,
      delay,
      ease: motionTokens.easing.standard,
    });
    return () => {
      controls.stop();
      if (element) {
        element.style.opacity = "1";
        element.style.transform = "none";
        element.style.clipPath = "none";
      }
    };
  }, [animate, delay, effect, shouldReveal, reduce, scope]);
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
