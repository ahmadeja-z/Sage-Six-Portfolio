import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";

const socialBrandConfig: Record<
  string,
  {
    Icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
  }
> = {
  LinkedIn: {
    Icon: LinkedinIcon,
    colorClass:
      "text-[#0A66C2] bg-[#0A66C2]/10 border-[#0A66C2]/30 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:shadow-[0_4px_16px_rgba(10,102,194,0.4)]",
  },
  Facebook: {
    Icon: FacebookIcon,
    colorClass:
      "text-[#1877F2] bg-[#1877F2]/10 border-[#1877F2]/30 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_4px_16px_rgba(24,119,242,0.4)]",
  },
  Instagram: {
    Icon: InstagramIcon,
    colorClass:
      "text-[#E4405F] bg-[#E4405F]/10 border-[#E4405F]/30 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-[#dc2743] hover:shadow-[0_4px_16px_rgba(228,64,95,0.4)]",
  },
};

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
            <ul className="mt-5 flex flex-row items-center gap-3.5">
              {siteConfig.socials.map((social) => {
                const brand = socialBrandConfig[social.label] || {
                  Icon: ArrowUpRight,
                  colorClass: "text-slate-700 bg-slate-100 border-slate-200 hover:bg-slate-800 hover:text-white",
                };
                const Icon = brand.Icon;
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-110 active:scale-95 ${brand.colorClass}`}
                      aria-label={social.label}
                      title={social.label}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                );
              })}
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