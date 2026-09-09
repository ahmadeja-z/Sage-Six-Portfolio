"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

const LINK_DIST = 140;
const NODE_COUNT = 42;

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas!.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let nodes: Node[] = [];
    let rafId = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 768 ? 24 : NODE_COUNT;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1.6,
      }));
    }

    function step() {
      ctx!.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.22;
            ctx!.strokeStyle = `rgba(163, 184, 138, ${alpha.toFixed(3)})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx!.fillStyle = "rgba(199, 214, 178, 0.55)";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafId = requestAnimationFrame(step);
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.18;
            ctx!.strokeStyle = `rgba(163, 184, 138, ${alpha.toFixed(3)})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx!.fillStyle = "rgba(199, 214, 178, 0.5)";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    resize();
    if (reduced) {
      drawStatic();
    } else {
      rafId = requestAnimationFrame(step);
    }

    const onResize = () => {
      resize();
      if (reduced) drawStatic();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-sage/[0.05] blur-[120px]" />
      <div className="absolute bottom-[-30%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-sage/[0.03] blur-[100px]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-60"
      />
    </div>
  );
}