"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface PixelCursorTrailProps {
  enabled?: boolean;
  maxParticles?: number;
  className?: string;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(pointer: fine) and (hover: hover)";
// Matches the nav's desktop breakpoint (Navigation.tsx / home/motion.tsx).
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeMedia(query: string) {
  return (notify: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", notify);
    return () => media.removeEventListener("change", notify);
  };
}

// SSR/first paint assumes the effect is unsupported so there is no
// server/client markup mismatch; useSyncExternalStore reconciles it
// against the real media query as soon as the client mounts.
function useMediaQuery(query: string, serverFallback: boolean) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

// Sampled Sage Six brand tokens (see the `.s6` scope in src/app/home.css).
// Navy, teal, cyan and blue appear most often; indigo less; purple least.
const PIXEL_COLORS = [
  "#17184a",
  "#17184a",
  "#17184a",
  "#14a89d",
  "#14a89d",
  "#14a89d",
  "#24aae3",
  "#24aae3",
  "#24aae3",
  "#0f75bd",
  "#0f75bd",
  "#0f75bd",
  "#273990",
  "#273990",
  "#662d90",
];

const HOVER_COLORS = ["#24aae3", "#0f75bd", "#24aae3", "#0f75bd", "#14a89d"];

const PARTICLE_SIZE_MIN = 4;
const PARTICLE_SIZE_MAX = 7;
const SPAWN_DISTANCE = 15;
const LIFETIME_MIN = 350;
const LIFETIME_MAX = 600;
const MAX_DEVICE_PIXEL_RATIO = 2;
const HEX_SHAPE_CHANCE = 0.18;

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  hex: boolean;
  bornAt: number;
  lifetime: number;
}

function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const r = size / 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const px = x + r * Math.cos(angle);
    const py = y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// A precise digital-engineering detail, not a gaming cursor effect: a short,
// restrained trail of fading pixels that never touches interaction or the
// native cursor. Canvas + refs keep pointer movement out of React state.
export function PixelCursorTrail({
  enabled = true,
  maxParticles = 22,
  className,
}: PixelCursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<{ x: number; y: number } | null>(null);
  const hoveringRef = useRef(false);

  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY, true);
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY, false);
  const isDesktopViewport = useMediaQuery(DESKTOP_QUERY, false);

  const active = enabled && !prefersReducedMotion && hasFinePointer && isDesktopViewport;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const stopLoop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const tick = () => {
      const particles = particlesRef.current;
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.bornAt;
        if (age >= p.lifetime) {
          particles.splice(i, 1);
          continue;
        }
        const t = age / p.lifetime;
        const size = p.size * (1 - t * 0.4);
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = p.color;
        if (p.hex) {
          drawHexagon(ctx, p.x, p.y, size);
        } else {
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = particles.length > 0 ? requestAnimationFrame(tick) : null;
    };

    const ensureLoopRunning = () => {
      if (rafRef.current === null && document.visibilityState === "visible") {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const isFormField = (target: EventTarget | null) =>
      !!(target as HTMLElement | null)?.closest?.(
        "input, textarea, select, [contenteditable='true']",
      );

    const spawn = (x: number, y: number) => {
      const particles = particlesRef.current;
      if (particles.length >= maxParticles) particles.shift();
      const palette = hoveringRef.current ? HOVER_COLORS : PIXEL_COLORS;
      particles.push({
        x: x + (Math.random() - 0.5) * 3,
        y: y + (Math.random() - 0.5) * 3,
        size: PARTICLE_SIZE_MIN + Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN),
        color: palette[Math.floor(Math.random() * palette.length)],
        hex: Math.random() < HEX_SHAPE_CHANCE,
        bornAt: performance.now(),
        lifetime: LIFETIME_MIN + Math.random() * (LIFETIME_MAX - LIFETIME_MIN),
      });
      ensureLoopRunning();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hoveringRef.current = !!(e.target as HTMLElement | null)?.closest?.(
        "a, button, [role='button'], [data-cursor]",
      );
      if (isFormField(e.target)) return;
      if (e.clientX < 0 || e.clientY < 0 || e.clientX > width || e.clientY > height) return;

      const last = lastSpawnRef.current;
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        if (dx * dx + dy * dy < SPAWN_DISTANCE * SPAWN_DISTANCE) return;
      }
      lastSpawnRef.current = { x: e.clientX, y: e.clientY };
      spawn(e.clientX, e.clientY);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") ensureLoopRunning();
      else stopLoop();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopLoop();
      particlesRef.current = [];
      lastSpawnRef.current = null;
    };
  }, [active, maxParticles]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-[60]", className)}
    />
  );
}
