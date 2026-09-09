"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Skip the wipe on the very first page load; only animate between navigations.
let initialLoadHandled = false;

export function RouteTransition() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!initialLoadHandled) {
        initialLoadHandled = true;
        return;
      }
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <motion.div
      key={pathname}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[110] bg-ink"
      initial={{ y: "100%" }}
      animate={{ y: ["100%", "0%", "-100%"] }}
      transition={{
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1],
        times: [0, 0.45, 1],
      }}
    />
  );
}