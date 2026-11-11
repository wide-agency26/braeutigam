"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { EXPERTS } from "@/lib/data/experts";
import ExpertSlot from "./ExpertSlot";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";

import type { Locale } from "@/lib/i18n";

export default function TeamPage({ locale = "de" }: { locale?: Locale }) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteChrome />
        <main id="main-content" lang={locale}>
          <section className="experts-figma relative overflow-hidden pb-24 pt-40 md:pb-32 md:pt-48">
            <div className="site-container relative z-10">
              <div className="experts-figma__header">
                <p className="mb-4 copy-tiny text-zinc-600 dark:text-zinc-400">
                  {"// TEAM DIRECTORY"}
                </p>
                <h1 className="experts-figma__title heading-secondary">
                  <span className="experts-figma__meet">MEET</span>
                  <span className="experts-figma__experts">THE EXPERTS</span>
                </h1>
                <div className="experts-figma__hud">
                  <p className="experts-figma__hud-kicker copy-tiny">** END 2 END EXPERTS **</p>
                  <p>
                    <span>HEADCOUNT:</span>
                    <span className="experts-figma__hud-val">80+</span>
                  </p>
                  <p>
                    <span>DIVISIONS:</span>
                    <span className="experts-figma__hud-val">9</span>
                  </p>
                </div>
              </div>

              <div className="experts-figma__grid" aria-label="Bräutigam Team">
                {EXPERTS.map((expert) => (
                  <ExpertSlot key={expert.email} expert={expert} headingLevel={2} />
                ))}
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
