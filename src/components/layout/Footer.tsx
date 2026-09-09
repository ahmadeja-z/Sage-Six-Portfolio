import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="hairline-t relative z-10 bg-ink-2">
      <div className="container-x">
        <div className="flex flex-col gap-14 py-16 md:py-24 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo variant="color" size="footer" />
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-sage">
              {siteConfig.tagline}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-fog">
              We build digital products that move businesses forward — from idea to
              launch, and beyond.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="eyebrow">Navigation</p>
            <ul className="mt-5 space-y-2.5">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fog transition-colors hover:text-sage"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Contact</p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-5 inline-block text-sm text-fog transition-colors hover:text-sage"
            >
              {siteConfig.email}
            </a>
            <ul className="mt-5 space-y-2.5">
              {siteConfig.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-fog transition-colors hover:text-sage"
                    aria-label={`${social.label} (placeholder)`}
                  >
                    {social.label}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.75}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline-t flex flex-col gap-3 py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-mist md:flex-row md:items-center md:justify-between">
          <p>© 2026 SageSix. All rights reserved.</p>
          <p>Think. Build. Scale.</p>
        </div>
      </div>
    </footer>
  );
}