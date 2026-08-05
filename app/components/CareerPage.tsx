"use client";

import React from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { Cpu, Play, TrendingUp, Trophy } from "lucide-react";
import Reveal from "./Reveal";
import SiteChrome from "./SiteChrome";
import SiteHero from "./SiteHero";
import "./CareerPage.css";

const APPLY_EMAIL = "info@braeutigam-gmbh.eu";
const JOB_LOCATION = "LOCATION: GERMANY [48.9° N, 9.2° E]";

const STATS = [
  { value: "81", label: "TEAM MEMBERS" },
  { value: "100%", label: "IN-HOUSE PRODUCTION" },
  { value: "15+", label: "RACING TEAMS SERVED" },
] as const;

const BENEFITS = [
  {
    index: "01 // TECHNOLOGY",
    title: "HANDWORK MEETS HIGH-TECH",
    body: "Precision engineering meets artisanal handwork. We combine the latest CNC and autoclave technology with the sensory human touch required for carbon fiber perfection.",
    Icon: Cpu,
  },
  {
    index: "02 // DEVELOPMENT",
    title: "OUR SKILLS, YOUR ASSET",
    body: "We run continuous internal academies. We invest heavily in your specialized laminating, engineering, and programming skillsets, steering you toward carbon dominance.",
    Icon: TrendingUp,
  },
  {
    index: "03 // LEGACY",
    title: "BUILT TO PERFORM",
    body: "We don't build generic parts; we construct structural racing components for hypersport programs and hypercars. Every micron of your work defines elite automotive history.",
    Icon: Trophy,
  },
] as const;

/* Tiles render as empty dark plates until the role films are supplied. */
const ROLE_FILMS = [
  {
    title: "KONSTRUKTEUR (CAD/CAM)",
    body: "Designing the millimetric fiber layouts in Catia to withstand extreme aerodynamic load.",
  },
  {
    title: "LAMINIERER (CARBON LAMINATOR)",
    body: "Placing resin-infused fiber orientations layer-by-layer with surgical German precision.",
  },
  {
    title: "CUTTER BEREICH",
    body: "Nesting and optimizing fiber templates for perfect cutting layouts.",
  },
  {
    title: "PRODUKTIONSPLANER & PM",
    body: "Coordinating autoclave schedules and managing client racing constraints.",
  },
  {
    title: "ASSEMBLY & SURFACE",
    body: "Assembling cured composite structures and polishing showroom finishes.",
  },
] as const;

const OPENINGS = [
  { title: "SENIOR CARBON FIBER LAMINATOR", department: "PRODUCTION" },
  { title: "CAD/CAM CATIA DESIGN ENGINEER", department: "ENGINEERING" },
  { title: "QUALITY INSPECTOR - NDT & METROLOGY", department: "QUALITY" },
  { title: "PROJECT LEAD - MOTORSPORT PROGRAMS", department: "MANAGEMENT" },
  { title: "CNC CUTTING & MATERIALS TECHNICIAN", department: "CUTTING" },
] as const;

const VALUES = [
  {
    title: "SURGICAL PRECISION",
    body: "We measure our success in single-digit microns. Every orientation, every fiber lay-up, and every autoclave cure cycle is executed with extreme, uncompromised precision.",
  },
  {
    title: "ABSOLUTE PRIDE",
    body: "We operate at the peak of the automotive craft. Every technician takes absolute ownership of their composite assemblies—ensuring extreme durability, zero voiding, and flawless cosmetics.",
  },
  {
    title: "PIONEERING PROGRESS",
    body: "We continuously push material science boundaries. Adapting high-modulus fibers, researching sustainable bio-resins, and refining curing patterns keep us and our partners winning.",
  },
] as const;

const APPLY_STEPS = [
  {
    index: "01 // IMPRESSION",
    title: "APPLY ONLINE",
    body: "Submit your credentials or racing portfolio. Show us your deep technical drive.",
  },
  {
    index: "02 // DIALOGUE",
    title: "TECHNICAL CHAT",
    body: "A conversation about manufacturing standards, fiber chemistry, and custom projects.",
  },
  {
    index: "03 // BENCH TEST",
    title: "THE TRIAL DAY",
    body: "Spend a highly practical day inside our cleanrooms or design bay testing your actual craft.",
  },
  {
    index: "04 // WELCOME",
    title: "JOIN THE CREW",
    body: "Secure your carbon workbench and build parts that set track records globally.",
  },
] as const;

/** Rounded card with the bottom-right step notch from the Figma careers page. */
function NotchCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`notch-card ${className}`.trim()}>
      <span className="notch-card__edge notch-card__edge--top" aria-hidden="true" />
      <span className="notch-card__edge notch-card__edge--left" aria-hidden="true" />
      <span className="notch-card__fill notch-card__fill--top" aria-hidden="true" />
      <span className="notch-card__fill notch-card__fill--left" aria-hidden="true" />
      <div className="notch-card__body">{children}</div>
    </div>
  );
}

function RoleTile({
  role,
  large,
}: {
  role: (typeof ROLE_FILMS)[number];
  large?: boolean;
}) {
  return (
    <figure className="m-0">
      <div className={`career-tile ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        <button type="button" className="career-tile__play" aria-label={`Play film: ${role.title}`}>
          <span>
            <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" strokeWidth={0} />
          </span>
        </button>
      </div>
      <figcaption className="pt-3">
        <h3 className="font-sans text-[13px] font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
          {role.title}
        </h3>
        <p className="mt-1 max-w-md font-sans text-[11px] leading-snug text-zinc-500 dark:text-zinc-500">
          {role.body}
        </p>
      </figcaption>
    </figure>
  );
}

export default function CareerPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="career relative min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-500">
        <div className="noise-overlay pointer-events-none" />

        <SiteChrome />
        <SiteHero scrollTarget="#careers-intro" priority={false} isPageHeading={false} />

        {/* ── Intro + stats ── */}
        <section id="careers-intro" className="relative overflow-hidden py-24 md:py-32">
          <div className="career-shell relative">
            <p
              className="career-watermark absolute -top-10 left-[8%] text-[clamp(3rem,11vw,10rem)] md:-top-4 md:left-[38%]"
              aria-hidden="true"
            >
              CAREERS
            </p>

            <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <Reveal className="max-w-xl pt-[clamp(3rem,9vw,7rem)]">
                <h1 className="career-heading text-zinc-950 dark:text-white">
                  <span className="block text-[var(--career-neon)]">Careers at</span>
                  Bräutigam
                </h1>
                <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Fünf Berufe. Fünf Geschichten. Finde deinen Platz in der Champions League der
                  Carbonfaser-Verarbeitung. Wir suchen Visionäre, Handwerker und Perfektionisten.
                </p>
              </Reveal>

              <div className="font-mono text-[9px] leading-relaxed tracking-[0.18em] text-zinc-500 lg:text-right dark:text-zinc-500">
                <div className="text-[var(--career-neon)]">{"// STATUS: ACTIVE"}</div>
                <div>CURRENT OFFERS: 5 OPENINGS // ESTABLISHED: 2016</div>
              </div>
            </div>

            <dl className="relative z-10 mt-16 flex flex-wrap justify-center gap-x-[clamp(2rem,7vw,6rem)] gap-y-8 md:mt-24">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="m-0">
                    <span className="block font-sans text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-none text-[var(--career-neon)]">
                      {stat.value}
                    </span>
                    <span className="career-eyebrow mt-3 block text-zinc-500 dark:text-zinc-500">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Why you'll love building ── */}
        <section className="cv-auto relative py-16 md:py-24">
          <div className="career-shell">
            <Reveal as="h2" className="career-heading text-zinc-950 dark:text-white">
              Why you&rsquo;ll love building
              <span className="block">the future with us</span>
            </Reveal>

            <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-6">
              {BENEFITS.map(({ index, title, body, Icon }) => (
                <NotchCard key={title}>
                  <div className="px-6 pb-14 pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className="career-eyebrow text-[var(--career-neon)]">{index}</span>
                      <Icon className="h-4 w-4 shrink-0 text-[var(--career-neon)]" strokeWidth={1.6} />
                    </div>
                    <h3 className="mt-6 font-sans text-base font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                      {title}
                    </h3>
                    <p className="mt-3 font-sans text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {body}
                    </p>
                  </div>
                </NotchCard>
              ))}
            </div>
          </div>
        </section>

        {/* ── One day of our team ── */}
        <section className="cv-auto relative overflow-hidden py-16 md:py-28">
          <div className="career-shell relative">
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <Reveal as="h2" className="career-heading relative z-10 text-zinc-950 dark:text-white">
                <span className="block text-[var(--career-neon)]">One day</span>
                of our team
              </Reveal>
              <p className="career-watermark -mb-2" aria-hidden="true">
                LIFE
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
              {ROLE_FILMS.slice(0, 2).map((role) => (
                <RoleTile key={role.title} role={role} large />
              ))}
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {ROLE_FILMS.slice(2).map((role) => (
                <RoleTile key={role.title} role={role} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Current openings ── */}
        <section className="cv-auto relative overflow-hidden py-16 md:py-28">
          <div className="career-shell relative">
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <Reveal as="h2" className="career-heading relative z-10 text-zinc-950 dark:text-white">
                Current
                <span className="block">openings</span>
              </Reveal>
              <p className="career-watermark -mb-2" aria-hidden="true">
                JOBS
              </p>
            </div>

            <div className="mt-12 md:mt-20">
              {OPENINGS.map((job) => (
                <a
                  key={job.title}
                  className="career-job group"
                  href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Bewerbung: ${job.title}`)}`}
                >
                  <span>
                    <span className="block font-sans text-sm font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                      {job.title}
                    </span>
                    <span className="career-eyebrow mt-1 block text-zinc-500 dark:text-zinc-500">
                      DEPARTMENT: {job.department}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center gap-x-8 gap-y-1">
                    <span className="career-eyebrow text-zinc-500 dark:text-zinc-600">{JOB_LOCATION}</span>
                    <span className="career-eyebrow text-[var(--career-neon)] group-hover:underline">
                      VIEW ROLE // APPLY
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Precision. Pride. Progress. ── */}
        <section className="cv-auto relative py-16 md:py-24">
          <div className="career-shell">
            <Reveal
              as="h2"
              className="career-heading flex flex-wrap gap-x-[0.6em] text-zinc-950 dark:text-white"
            >
              <span>Precision.</span>
              <span>Pride.</span>
              <span className="text-[var(--career-neon)]">Progress.</span>
            </Reveal>

            <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
              {VALUES.map((value) => (
                <div key={value.title}>
                  <h3 className="font-sans text-[13px] font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 font-sans text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {value.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How to apply ── */}
        <section className="cv-auto relative overflow-hidden py-16 md:py-28">
          <div className="career-shell relative">
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <Reveal as="h2" className="career-heading relative z-10 text-zinc-950 dark:text-white">
                How to apply
              </Reveal>
              <p className="career-watermark -mb-2" aria-hidden="true">
                JOIN
              </p>
            </div>

            <ol className="mt-10 grid list-none gap-6 p-0 md:mt-14 md:grid-cols-4">
              {APPLY_STEPS.map((step) => (
                <li key={step.title} className="career-card px-5 py-5">
                  <span className="career-eyebrow block text-[var(--career-neon)]">{step.index}</span>
                  <h3 className="mt-5 font-sans text-sm font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-sans text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Speculative application CTA ── */}
        <section className="cv-auto relative overflow-hidden pb-28 pt-16 md:pb-40 md:pt-28">
          <div className="career-shell relative">
            <p className="career-watermark text-[clamp(4rem,14vw,13rem)]" aria-hidden="true">
              READY
            </p>

            <Reveal className="relative z-10 -mt-2">
              <h2 className="career-heading text-zinc-950 dark:text-white">
                Dein Beruf ist nicht dabei?
              </h2>
              <p className="mt-5 max-w-2xl font-sans text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Wir sind stets auf der Suche nach motivierten Talenten und Carbonfaser-Spezialisten.
                Wenn du deine handwerkliche Leidenschaft oder dein ingenieurtechnisches Wissen
                einbringen willst, freuen wir uns über deine Initiativbewerbung.
              </p>
              <a
                className="mt-8 inline-flex items-center rounded-md bg-[var(--career-neon)] px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wide text-black transition-transform duration-200 hover:scale-[1.03]"
                href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent("Initiativbewerbung")}`}
              >
                Jetzt bewerben
              </a>
            </Reveal>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
