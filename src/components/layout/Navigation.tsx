"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/ui/Magnetic";
import { Logo } from "@/components/ui/Logo";

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 160 && y - lastY > 12);
      if (y <= 160) setHidden(false);
      lastY = y;

      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? y / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: hidden && !menuOpen ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[90] transition-colors duration-500",
          scrolled && !menuOpen
            ? "border-b border-line-soft bg-ink/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className="absolute inset-x-0 top-0 h-px origin-left bg-sage/70"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
        <nav
          className="container-x flex h-[76px] items-center justify-between"
          aria-label="Main navigation"
        >
          <Logo variant="color" size="header" />

          <ul className="hidden items-center gap-9 lg:flex">
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300",
                      active ? "text-sage" : "text-fog hover:text-bone",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-sage transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-6 lg:flex">
            <Magnetic strength={0.25}>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-sage hover:text-sage"
                data-cursor="hover"
              >
                Start a Project
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  →
                </span>
              </Link>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
              className="block h-px w-6 bg-bone"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
              className="block h-px w-6 bg-bone"
            />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[85] flex flex-col bg-ink lg:hidden"
          >
            <div className="flex flex-1 flex-col justify-center px-6">
              <nav aria-label="Mobile navigation">
                <ul className="space-y-2">
                  {siteConfig.nav.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "group flex items-baseline gap-4 py-2",
                          pathname.startsWith(item.href) ? "text-sage" : "text-bone",
                        )}
                      >
                        <span className="font-mono text-[11px] tracking-[0.2em] text-mist">
                          0{i + 1}
                        </span>
                        <span className="font-display text-5xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12"
              >
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-3 border border-sage px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-sage"
                >
                  Start a Project →
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="px-6 pb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-mist"
            >
              {siteConfig.email}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}