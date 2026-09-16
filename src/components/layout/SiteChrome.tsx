"use client";
import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { HomeFooter } from "@/components/home/HomeFooter";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { CustomCursor } from "@/components/ui/CustomCursor";
export function SiteHeader() {
  return <Navigation />;
}
// Pages redesigned in the new light Sage Six theme. Add a route here once
// it has been migrated off the legacy dark theme (see Footer/NoiseOverlay).
// Case-study routes are added per-slug as each one is redesigned (see
// LIGHT_THEME_PROJECTS in work/[slug]/page.tsx, which must stay in sync).
const LIGHT_THEME_ROUTES = new Set([
  "/",
  "/expertise",
  "/work",
  "/work/speezu",
  "/work/durafoam-3d-foam-configurator-shopify",
  "/work/leicester-medical-society",
  "/company",
  "/contact",
]);
// Whole route trees migrated to the light theme, including every dynamic
// child (e.g. every /insights/[slug] article) rather than one slug at a time.
const LIGHT_THEME_PREFIXES = ["/insights"];

function isLightThemeRoute(pathname: string): boolean {
  if (LIGHT_THEME_ROUTES.has(pathname)) return true;
  return LIGHT_THEME_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function SiteFooter() {
  return isLightThemeRoute(usePathname()) ? <HomeFooter /> : <Footer />;
}
export function LegacyEffects() {
  return isLightThemeRoute(usePathname()) ? null : (
    <>
      <NoiseOverlay />
      <CustomCursor />
    </>
  );
}
