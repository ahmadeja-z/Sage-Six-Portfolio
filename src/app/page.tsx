import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { AISection } from "@/components/sections/AISection";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Technology } from "@/components/sections/Technology";
import { Insights } from "@/components/sections/Insights";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Sage Six | Mobile App & Website Development" },
  description:
    "Sage Six provides mobile app development, website development, custom software and ongoing technical support. Explore our work and discuss your project.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sage Six | Mobile App & Website Development",
    description:
      "Sage Six provides mobile app development, website development, custom software and ongoing technical support.",
    url: siteConfig.url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sage Six | Mobile App & Website Development",
    description:
      "Sage Six provides mobile app development, website development, custom software and ongoing technical support.",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Services />
      <AISection />
      <Process />
      <About />
      <Technology />
      <Insights />
      <FinalCTA />
    </>
  );
}