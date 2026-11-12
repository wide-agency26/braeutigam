"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";
import { LazyMotion, domAnimation } from "framer-motion";
import PageVideo from "./PageVideo";
import type { PublicVideo } from "@/lib/content/public-types";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import "./CareerPage.css";
// TODO(client): confirm licence — internal/placeholder shoot asset.
import hero from "../../public/images/crew/hero.webp";
// TODO(client): confirm licence for stock culture imagery.
import events from "../../public/images/crew/events.webp";
import training from "../../public/images/crew/training.webp";
import balance from "../../public/images/crew/balance.webp";
import christian from "../../public/images/crew/christian.webp";
import florian from "../../public/images/crew/florian.webp";
import jens from "../../public/images/crew/jens.webp";
import niko from "../../public/images/crew/niko.webp";
import atila from "../../public/images/crew/atila.webp";
import { localizedHref, type Locale } from "@/lib/i18n";

const APPLY_EMAIL = "info@braeutigam-gmbh.eu";

/** TODO(client): confirm team size, in-house rate, and race-team count before enabling. */
const SHOW_CREW_STATS = false;

const STATS = [
  { value: "81", label: "Teammitglieder" },
  { value: "100%", label: "Eigenfertigung" },
  { value: "15+", label: "Rennteams" },
] as const;
const STORIES: ReadonlyArray<{
  image: StaticImageData;
  title: string;
  body: string;
  alt: string;
}> = [
  {
    image: events,
    title: "Teamveranstaltungen",
    body: "Einmal im Jahr raus aus der Halle. Gleiche Truppe, andere Strecke.",
    alt: "Gruppe von Menschen im Freien, Platzhalter für Team Events.",
  },
  {
    image: training,
    title: "Weiterbildungen",
    body: "Neue Anlagen, neue Lagenaufbauten. Wer am Teil steht, lernt den Prozess dazu.",
    alt: "Person an einem Arbeitsplatz, Platzhalter für Weiterbildungen.",
  },
  {
    image: balance,
    title: "Work-Life-Balance",
    body: "Saisonpeaks sind planbar. Schicht und Familie teilen sich denselben Kalender.",
    alt: "Erwachsene Person mit einem Kind, Platzhalter für Work-Life Balance.",
  },
];

const CREW: ReadonlyArray<{
  image: StaticImageData;
  role: string;
  wide?: boolean;
}> = [
  { image: christian, role: "Laminierer", wide: true },
  { image: florian, role: "Fertigung", wide: true },
  { image: jens, role: "Laminierer" },
  { image: niko, role: "Qualität" },
  { image: atila, role: "Qualität" },
];

const STEPS = [
  {
    index: "01",
    title: "Bewerbung",
    body: "Unterlagen direkt an die Stelle oder initiativ an unsere Karriere-Adresse.",
  },
  {
    index: "02",
    title: "Interview",
    body: "Gespräch in der Halle oder am Tisch. Es geht um Teile und den Ablauf.",
  },
  {
    index: "03",
    title: "Probearbeit",
    body: "Ein Tag am Platz. Laminieren, Zeichnung oder Zuschnitt, je nach Rolle.",
  },
  {
    index: "04",
    title: "Angebot",
    body: "Passt es auf beiden Seiten, kommt das Angebot schriftlich.",
  },
] as const;

export type CareerOpening = {
  slug: string;
  title: string;
  titleEn?: string | null;
  department: string;
  location: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "APPRENTICESHIP";
};

const EMPLOYMENT_DE: Record<CareerOpening["employmentType"], string> = {
  FULL_TIME: "VOLLZEIT",
  PART_TIME: "TEILZEIT",
  APPRENTICESHIP: "AUSBILDUNG",
};

function Story({
  image,
  title,
  body,
  alt,
}: (typeof STORIES)[number]) {
  return (
    <figure className="crew-story">
      <div className="crew-shot">
        <Image src={image} alt={alt} fill sizes="(min-width: 800px) 30vw, 100vw" />
      </div>
      <figcaption>
        <h3>{title}</h3>
        <p>{body}</p>
      </figcaption>
    </figure>
  );
}

function Film({ image, role, wide }: (typeof CREW)[number]) {
  return (
    <figure className={`crew-film${wide ? " crew-film--wide" : " crew-film--third"}`}>
      <div className={`crew-shot${wide ? " crew-shot--wide" : ""}`}>
        <Image
          src={image}
          alt={`Platzhalter: ${role}.`}
          fill
          sizes={wide ? "(min-width: 800px) 46vw, 100vw" : "(min-width: 800px) 30vw, 100vw"}
        />
        <span className="crew-play" aria-hidden="true">
          <Play className="h-4 w-4 translate-x-px" fill="currentColor" strokeWidth={0} />
        </span>
      </div>
      <figcaption>
        <h3>{role}</h3>
      </figcaption>
    </figure>
  );
}

export default function CareerPage({
  openings,
  videos = [],
  locale = "de",
}: {
  openings: CareerOpening[];
  videos?: PublicVideo[];
  locale?: Locale;
}) {
  const applyHref =
    openings.length > 0
      ? "#offene-stellen"
      : `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent("Initiativbewerbung")}`;

  return (
    <LazyMotion features={domAnimation}>
      <div className="career crew relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="noise-overlay pointer-events-none" />
        <SiteChrome />

        <main id="main-content" lang={locale}>
          <section className="crew-hero" aria-label="Karriere">
            <Image
              src={hero}
              alt="Mitarbeiter von hinten im Bräutigam-Shirt, Berge im Hintergrund."
              fill
              priority
              sizes="100vw"
              className="crew-hero__photo"
            />
            <div className="crew-hero__fade" aria-hidden="true" />
            <div className="crew-hero__mark">
              <p className="career-watermark">{locale === "en" ? "Careers" : "Karriere"}</p>
              <p className="crew-hiring">Wir suchen Verstärkung</p>
            </div>
          </section>

          <section id="crew-intro" className="crew-block">
            <div className="career-shell">
              <div className="crew-head">
                <h1>
                  <span className="crew-kicker">Unser Team:</span>
                  <span className="crew-display">Einzigartig</span>
                </h1>
                <p className="career-watermark crew-head__mark" aria-hidden="true">
                  Team
                </p>
              </div>
              <p className="crew-lead">
                Laminieren, Zuschnitt, Autoklav und Qualität liegen in Freiberg am Neckar unter einem Dach.
                Die Truppe kennt die Teile, weil sie sie selbst baut.
              </p>
              {SHOW_CREW_STATS ? (
                <dl className="crew-stats">
                  {STATS.map((stat) => (
                    <div key={stat.label}>
                      <dt>{stat.label}</dt>
                      <dd>{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </section>

          <section className="crew-block" aria-labelledby="crew-truppe">
            <div className="career-shell">
              <h2 id="crew-truppe">
                <span className="crew-kicker">Das Wichtigste:</span>
                <span className="crew-display">Die Truppe.</span>
              </h2>
              <p className="crew-lead">
                Events, Weiterbildung, der Kalender daneben. Darum bleibt die Truppe.
              </p>
              <div className="crew-stories">
                {STORIES.map((story) => (
                  <Story key={story.title} {...story} />
                ))}
              </div>
            </div>
          </section>

          <section className="crew-block" aria-labelledby="crew-alltag">
            <div className="career-shell">
              <div className="crew-head">
                <h2 id="crew-alltag">
                  <span className="crew-kicker crew-kicker--neon">Unser Alltag</span>
                  <span className="crew-display">Ein Tag im Team</span>
                </h2>
                <p className="career-watermark crew-head__mark" aria-hidden="true">
                  Alltag
                </p>
              </div>
              <div className="crew-films">
                {CREW.map((person, index) => {
                  const video = videos.find(item => item.placement === `careers-${index + 1}`);
                  return <div key={index} className={person.wide ? "crew-film--wide" : "crew-film--third"}>
                    {video ? <PageVideo video={video} locale={locale} compact /> : <Film {...person} />}
                  </div>;
                })}
              </div>
            </div>
          </section>

          <section id="offene-stellen" className="crew-block" aria-labelledby="crew-jobs">
            <div id="stellen" className="career-shell">
              <h2 id="crew-jobs">
                <span className="crew-display">Offene Stellen</span>
              </h2>
              <div className="crew-jobs">
                {openings.length === 0 ? (
                  <p className="crew-lead">Aktuell keine veröffentlichten Stellen.</p>
                ) : (
                  openings.map((job) => (
                    <Link
                      key={job.slug}
                      className="crew-job"
                      href={localizedHref(`/karriere/${job.slug}`, locale)}
                    >
                      <span>
                        <span className="crew-job__title">{locale === "en" && job.titleEn ? job.titleEn : job.title}</span>
                        <span className="crew-job__dept">{job.department}</span>
                      </span>
                      <span className="crew-job__meta">
                        {job.location} <span aria-hidden="true">·</span> {EMPLOYMENT_DE[job.employmentType]}
                      </span>
                      <ChevronRight className="crew-job__icon" aria-hidden="true" strokeWidth={1.6} />
                    </Link>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="crew-block" aria-labelledby="crew-path">
            <div className="career-shell">
              <h2 id="crew-path">
                <span className="crew-display">So kommst du ins Team:</span>
              </h2>
              <p className="crew-lead">
                Vier Schritte, ohne Umwege. Die Stelle bleibt offen, bis beide Seiten ja sagen.
              </p>
              <ol className="crew-steps">
                {STEPS.map((step) => (
                  <li key={step.index} className="crew-step">
                    <div className="crew-step__top">
                      <span className="crew-step__no">{step.index}</span>
                      <h3>{step.title}</h3>
                    </div>
                    <p>{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="crew-block crew-block--last" aria-labelledby="crew-join">
            <div className="career-shell">
              <div className="crew-join">
                <h2 id="crew-join">
                  <span className="crew-display crew-display--neon">Werde Teil des Teams.</span>
                </h2>
                <a className="crew-cta" href={applyHref}>
                  Jetzt bewerben
                </a>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
