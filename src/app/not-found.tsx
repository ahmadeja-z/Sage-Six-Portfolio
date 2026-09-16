import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80svh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="eyebrow mb-8">Error 404</p>
      <h1 className="display-2 max-w-3xl font-display text-bone">
        This page went
        <br />
        <span className="text-outline">off the map.</span>
      </h1>
      <p className="body-lg mt-8 max-w-md text-fog">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
        get you back somewhere useful.
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
        <Button href="/">Back home</Button>
        <Button href="/expertise" variant="outline">
          Explore our services
        </Button>
      </div>
      <Logo size="small" className="mt-16" />
    </div>
  );
}