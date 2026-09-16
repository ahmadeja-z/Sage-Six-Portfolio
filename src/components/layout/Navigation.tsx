"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, LayoutGroup, motion, stagger, useAnimate } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { homeNavigation } from "@/data/home";
import { useHomeReducedMotion } from "@/components/home/motion";
import styles from "./Navigation.module.css";

const timing = { hover: 0.18, entrance: 0.32, indicator: 0.34, panel: 0.36, exit: 0.18, stagger: 0.045 };
const ease = [0.22, 1, 0.36, 1] as const;
const MotionLink = motion.create(Link);
const isActive = (pathname: string, href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

function MenuIcon({ open, reduce }: { open: boolean; reduce: boolean }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <motion.path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      initial={false} animate={{ d: open ? "M6 6L18 18" : "M4 8L20 8" }} transition={{ duration: reduce ? 0 : timing.hover, ease }} />
    <motion.path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      initial={false} animate={{ d: open ? "M6 18L18 6" : "M4 16L20 16" }} transition={{ duration: reduce ? 0 : timing.hover, ease }} />
  </svg>;
}

export function Navigation() {
  const pathname = usePathname();
  const reduce = useHomeReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const [scope, animateEntrance] = useAnimate();

  // The shared layout stays mounted across navigation. Keep SSR content visible.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animateEntrance("[data-nav-entrance]", { opacity: [0.65, 1], y: [-5, 0] },
      { duration: timing.entrance, delay: stagger(timing.stagger), ease });
    return () => controls.complete();
  }, [animateEntrance]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const wide = window.matchMedia("(min-width: 1024px)");
    const resize = () => { if (wide.matches) dialog.current?.close(); };
    wide.addEventListener("change", resize);
    return () => { document.body.style.overflow = previous; wide.removeEventListener("change", resize); };
  }, [open]);

  const close = async (selection = false) => {
    if (closingRef.current || !dialog.current?.open) return;
    closingRef.current = true;
    setClosing(true);
    if (!reduce) await animate(dialog.current, { opacity: 0, x: 24 }, { duration: timing.exit, ease });
    dialog.current?.close();
    closingRef.current = false;
    setClosing(false);
    setOpen(false);
    if (selection) document.getElementById("main")?.focus({ preventScroll: true });
    else trigger.current?.focus({ preventScroll: true });
  };
  const indicator = (href: string) => isActive(pathname, href) ?
    <motion.span key="nav-indicator" aria-hidden="true" className={styles.indicator} layoutId="active-page" initial={false}
      transition={{ duration: reduce ? 0 : timing.indicator, ease }} /> : null;
  const interaction = {
    whileHover: { y: reduce ? 0 : -2 }, whileFocus: { y: reduce ? 0 : -2 },
    whileTap: { y: 0 }, transition: { duration: reduce ? 0 : timing.hover, ease },
  };
  const current = (href: string) => isActive(pathname, href) ? "page" as const : undefined;
  return <>
    <header ref={scope} className={`s6 s6-header ${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <a href="#main" className="s6-skip">Skip to content</a>
      <LayoutGroup id="site-navigation">
        <nav className="s6-container s6-nav" aria-label="Main navigation">
          <MotionLink {...interaction} data-nav-entrance href="/" aria-label="Sage Six home" aria-current={current("/")} className={`s6-logo ${styles.logo}`}>
            <Image src="/images/sagesix-logo.svg" alt="Sage Six" width={171} height={70} preload />
            {indicator("/")}
          </MotionLink>
          <div className="s6-desktop-links">
            {homeNavigation.map(item => <MotionLink {...interaction} data-nav-entrance key={item.href} href={item.href} aria-current={current(item.href)} className={styles.link}>
              {item.label}{indicator(item.href)}
            </MotionLink>)}
          </div>
          <MotionLink {...interaction} data-nav-entrance href="/contact" className={`s6-button s6-nav-cta ${styles.cta}`}>
            Discuss your project <ArrowUpRight size={17} aria-hidden="true" />
          </MotionLink>
          <button ref={trigger} className="s6-menu-toggle" type="button" aria-label="Open menu" aria-controls="site-menu" aria-expanded={open} aria-haspopup="dialog"
            onClick={() => {
              if (!dialog.current || closingRef.current) return;
              dialog.current.style.opacity = "1";
              dialog.current.style.transform = "none";
              dialog.current.showModal();
              setOpen(true);
              if (!reduce) void animate(dialog.current, { opacity: [0.7, 1], x: [40, 0] }, { duration: timing.panel, ease });
            }}><MenuIcon open={open} reduce={reduce} /></button>
        </nav>
      </LayoutGroup>
    </header>
    <dialog ref={dialog} id="site-menu" className={`s6 s6-menu ${styles.menu}`} aria-label="Main menu" data-lenis-prevent
      onWheel={e => e.stopPropagation()} onTouchMove={e => e.stopPropagation()}
      onKeyDown={e => {
        if (e.key !== "Tab") return;
        const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === e.currentTarget)) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first?.focus();
        }
      }}
      onCancel={e => { e.preventDefault(); void close(); }} onClose={() => setOpen(false)}>
      {open && <div>
        <div className="s6-menu-top">
          <Link href="/" aria-label="Sage Six home" aria-current={current("/")} onNavigate={() => void close(true)}>
            <Image src="/images/sagesix-logo.svg" alt="Sage Six" width={171} height={70} />
          </Link>
          <button type="button" autoFocus className="s6-menu-close" aria-label="Close menu" onClick={() => void close()}><MenuIcon open={!closing} reduce={reduce} /></button>
        </div>
        <nav aria-label="Mobile navigation">
          {[{ label: "Home", href: "/" }, ...homeNavigation].map((item, i) => <motion.div key={item.href}
            initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : 14 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduce ? 0 : timing.panel, delay: reduce ? 0 : i * timing.stagger, ease }}>
            <Link href={item.href} aria-current={current(item.href)} onNavigate={() => void close(true)}>
              <span>0{i + 1}</span>{item.label}<ArrowUpRight aria-hidden="true" />
            </Link>
          </motion.div>)}
        </nav>
        <MotionLink {...interaction} className={`s6-button ${styles.cta}`} href="/contact" onNavigate={() => void close(true)}>
          Discuss your project <ArrowUpRight size={18} aria-hidden="true" />
        </MotionLink>
        <a className="s6-menu-email" href="mailto:hello@sagesix.co.uk">hello@sagesix.co.uk</a>
      </div>}
    </dialog>
  </>;
}
