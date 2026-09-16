"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { homeNavigation, companyRecord } from "@/data/home";
import { siteConfig } from "@/lib/site";
import { Reveal, motionTokens, useHomeReducedMotion } from "@/components/home/motion";

// Cropped, low-opacity echo of the icon's hexagon silhouette — decoration
// only, kept well behind the brand copy and hidden from assistive tech.
function FooterHexBackdrop() {
  return (
    <svg
      className="s6-footer-backdrop"
      viewBox="0 0 340 340"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="170,10 308.56,90 308.56,250 170,330 31.44,250 31.44,90"
        fill="none"
        stroke="var(--s6-indigo)"
        strokeWidth="1"
      />
      <polygon
        points="170,52 258,101 258,239 170,288 82,239 82,101"
        fill="none"
        stroke="var(--s6-cyan)"
        strokeWidth="1"
      />
    </svg>
  );
}

// Renders a real <li> (Reveal wraps children in a <div> and would otherwise
// break the nav's list markup) with the same viewport-triggered fade-and-rise
// used for staggered lists elsewhere (see CaseStudyLight's StaggerItem).
function FooterNavItem({
  href,
  label,
  index,
}: {
  href: string;
  label: string;
  index: number;
}) {
  const reduce = useHomeReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: motionTokens.duration.normal,
        delay: reduce ? 0 : index * motionTokens.stagger.tight,
        ease: motionTokens.easing.standard,
      }}
    >
      <Link href={href} className="s6-footer-link">
        {label}
      </Link>
    </motion.li>
  );
}

export function HomeFooter() {
  const year = new Date().getFullYear();
  const genuineSocials = siteConfig.socials.filter((social) => !social.placeholder);

  return (
    <footer id="site-footer" className="s6 s6-footer" aria-label="Site footer">
      <FooterHexBackdrop />
      <div className="s6-container">
        <Reveal effect="line" className="s6-footer-divider">
          <span />
        </Reveal>

        <div className="s6-footer-grid">
          <div className="s6-footer-brand">
            <Reveal>
              <Link href="/" aria-label="Sage Six home" className="s6-footer-logo">
                <Image
                  src="/images/sagesix-logo.svg"
                  alt="Sage Six"
                  width={171}
                  height={70}
                />
              </Link>
            </Reveal>
            <Reveal delay={motionTokens.stagger.tight}>
              <p className="s6-footer-tagline">
                Clear thinking. Thoughtful design.
                <br />
                Software built to move you forward.
              </p>
            </Reveal>
          </div>

          <nav aria-label="Footer navigation" className="s6-footer-nav">
            <Reveal delay={motionTokens.stagger.normal}>
              <p className="s6-eyebrow">Navigate</p>
            </Reveal>
            <ul>
              {homeNavigation.map((item, i) => (
                <FooterNavItem key={item.href} href={item.href} label={item.label} index={i} />
              ))}
            </ul>
          </nav>

          <div className="s6-footer-contact">
            <Reveal delay={motionTokens.stagger.normal + motionTokens.stagger.tight}>
              <p className="s6-eyebrow">Let&rsquo;s talk</p>
            </Reveal>
            <Reveal delay={motionTokens.stagger.relaxed}>
              <a href={`mailto:${siteConfig.email}`} className="s6-footer-email">
                {siteConfig.email}
                <ArrowUpRight
                  className="s6-footer-email-arrow"
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </a>
            </Reveal>
            {genuineSocials.length > 0 && (
              <Reveal delay={motionTokens.stagger.relaxed + motionTokens.stagger.tight}>
                <ul className="s6-footer-socials">
                  {genuineSocials.map((social) => (
                    <li key={social.label}>
                      <a href={social.href} className="s6-footer-link">
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>

        <Reveal delay={motionTokens.stagger.relaxed} className="s6-footer-legal">
          <p>© {year} Sage Six. All rights reserved.</p>
          <a href={companyRecord.url}>
            {companyRecord.name} · Registered in England and Wales · Company No.{" "}
            {companyRecord.number}
          </a>
        </Reveal>
      </div>
    </footer>
  );
}
