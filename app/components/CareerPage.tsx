"use client";

import Link from "next/link";
import Image from "next/image";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteButton from "./SiteButton";
import YouTubeVideo from "./YouTubeVideo";
import type { PublishedVideos, PublishedVideo } from "@/lib/videos";
import "./CareerPage.css";
import { localizedHref, type Locale } from "@/lib/i18n";

import { CAREER_EN } from "@/lib/data/career-copy";

const APPLY_EMAIL = "info@braeutigam-gmbh.eu";

const PILLARS = [
  {
    title: "team events",
    image: "/images/crew/pillar-events.webp",
    crop: "crew-photo--events",
    body: "Gemeinsame Erlebnisse bringen uns auch außerhalb der Werkstatt zusammen. Bei unseren Team-Events lernen wir die Menschen hinter den Bauteilen noch besser kennen.",
  },
  {
    title: "weiterbildungen",
    image: "/images/crew/pillar-training.webp",
    crop: "crew-photo--cover",
    paragraphs: [
      "Wir glauben an die kontinuierliche Weiterentwicklung unserer Mitarbeiter. Bei uns erhältst du eine umfangreiche Einarbeitung, da die Arbeit mit Kohlefaser Komponenten eine spezielle Expertise erfordert.",
      "Neben spezifischen Schulungen zur Materialkunde, Bauteilherstellung und dem Umgang mit Geräten bieten wir auch Weiterbildungen für Abteilungsleiter und Führungspositionen an. Wir legen Wert darauf, dass unsere Mitarbeiter ihr Potenzial voll ausschöpfen und sich beruflich weiterentwickeln können.",
    ],
  },
  {
    title: "Work-life balance",
    image: "/images/crew/pillar-balance.webp",
    crop: "crew-photo--balance",
    body: "Gute Arbeit braucht Raum zum Auftanken. Uns ist wichtig, dass neben anspruchsvollen Projekten auch Zeit für Familie, Freunde und eigene Interessen bleibt.",
  },
] as const;

const ROLE_FILMS = [
  {
    slot: "career-design",
    title: "Konstruktion",
    body: "Faseraufbau und Bauteilgeometrie für anspruchsvolle Belastungen konstruieren.",
    poster: "/images/crew/film-1.webp",
    crop: "crew-photo--konstruktion",
    large: true,
  },
  {
    slot: "career-prepreg",
    title: "Pre-preg Laminierer",
    body: "Vorimprägnierte Carbonlagen präzise von Hand in die Form einlegen.",
    poster: "/images/crew/film-2.webp",
    crop: "crew-photo--bottom",
    large: true,
  },
  {
    slot: "career-cutting",
    title: "Zuschnitt",
    body: "Schnittmuster anordnen und Carbonlagen materialeffizient zuschneiden.",
    poster: "/images/crew/film-3.webp",
    crop: "crew-photo--bottom",
    large: false,
  },
  {
    slot: "career-planning",
    title: "Produktionsplanung & Projektmanagement",
    body: "Fertigungsabläufe, Termine und Kundenanforderungen aufeinander abstimmen.",
    poster: "/images/crew/film-4.webp",
    crop: "crew-photo--bottom",
    large: false,
  },
  {
    slot: "career-assembly",
    title: "Montage",
    body: "Ausgehärtete Bauteile zusammenfügen und Oberflächen fertigstellen.",
    poster: "/images/crew/film-5.webp",
    crop: "crew-photo--bottom",
    large: false,
  },
] as const;

const APPLY_STEPS = [
  {
    index: "01",
    title: "Bewerbung",
    body: "Sende uns deine Unterlagen über unser Online-Formular oder per E-Mail.",
  },
  {
    index: "02",
    title: "Interview",
    body: "Lerne unser Team in einem persönlichen Gespräch kennen.",
  },
  {
    index: "03",
    title: "Probearbeit",
    body: "Zeige dein Können in einem praxisnahen Probetag vor Ort.",
  },
  {
    index: "04",
    title: "Angebot",
    body: "Erhalte dein Vertragsangebot und werde Teil des Teams.",
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

function openingTitle(job: CareerOpening, locale: Locale) {
  if (locale === "en" && job.titleEn?.trim()) return job.titleEn.trim();
  return job.title;
}

function FilmCard({ film, locale, video }: { film: (typeof ROLE_FILMS)[number]; locale: Locale; video?: PublishedVideo }) {
  const copy = (value: string) => locale === "en" ? CAREER_EN[value] ?? value : value;
  const poster = <Image className={film.crop} src={film.poster} alt={`${copy(film.title)} ${locale === "en" ? "at" : "bei"} Bräutigam`} width={1400} height={790} sizes={film.large ? "(max-width: 700px) 100vw, 50vw" : "(max-width: 700px) 100vw, 33vw"} />;
  return (
    <article className={`crew-film${video ? " crew-film--video" : ""}`}>
      <div className={`crew-film__frame ${film.large ? "crew-film__frame--lg" : ""}${video ? " crew-film__frame--video" : ""}`}>
        {video ? <YouTubeVideo key={video.id + locale} video={video} locale={locale} poster={poster} /> : poster}
      </div>
      <h3 className="crew-film__title">{video?.title || copy(film.title)}</h3>
      <p className="crew-film__body">{copy(film.body)}</p>
    </article>
  );
}

export default function CareerPage({
  openings,
  videos = {},
  locale = "de",
}: {
  openings: CareerOpening[];
  videos?: PublishedVideos;
  locale?: Locale;
}) {
  const copy = (value: string) => locale === "en" ? CAREER_EN[value] ?? value : value;
  return (
    <LazyMotion features={domAnimation}>
      <div className="crew-page">
        <SiteChrome />

        <main id="main-content" lang={locale}>
          <section className="crew-hero" aria-label={locale === "en" ? "Career" : "Karriere"}>
            <div className="crew-hero__media" aria-hidden="true">
              <Image className="crew-photo--hero" src="/images/crew/hero.webp" alt="" width={2400} height={1600} sizes="141vw" preload />
            </div>
            <div className="crew-hero__shade" aria-hidden="true" />

            <p className="crew-hero__join">[ JOIN THE CREW ]</p>
            <p className="crew-hero__pitch">
              <span>We build with precision, passion, and purpose. Join a team</span>
              <span>of world-class engineers pushing the boundaries of composite technology.</span>
            </p>

            <div className="crew-hero__title">
              <h1>{locale === "en" ? "CAREER" : "KARRIERE"}</h1>
              <SiteButton href="#stellen">{copy("Offene stellenanzeigen")}</SiteButton>
            </div>

            <a className="crew-hero__status" href="#crew-intro">
              <span>CREW STATUS: RECRUITING</span>
              <span>SCROLL TO EXPLORE</span>
            </a>
          </section>

          <div className="crew-body">
            <section id="crew-intro" className="crew-block crew-intro">
              <p className="crew-mark crew-mark--crew" aria-hidden="true">
                CREW
              </p>
              <p className="crew-micro">
                <span>BRAEUTIGAM_WEBFILE / CREW</span>
                <span>{copy("ZUGANG GEWÄHRT")}</span>
              </p>
              <h2 className="crew-intro__title section-heading">
                <span>{copy("UNSER TEAM:")}</span>
                <span>{copy("EINZIGARTIG")}</span>
              </h2>
              <p className="crew-copy crew-copy--narrow">{copy("Hinter jedem Bauteil steckt ein Team, das Höchstleistung als Standard setzt. Unser Team arbeitet präzise, innovativ, kompromisslos.")}</p>
              <div className="crew-actions">
                <SiteButton href="#stellen">{copy("Offene stellenanzeigen")}</SiteButton>
                <SiteButton href="#alltag" variant="amber">{copy("Über das team")}</SiteButton>
              </div>
            </section>

            <section id="truppe" className="crew-block">
              <div className="crew-lead">
                <p className="crew-kicker">{copy("ARBEITSWEISE")}</p>
                <h2 className="crew-display section-heading">
                  <span>{copy("DAS WICHTIGSTE:")}</span>
                  <span>{copy("DIE TRUPPE.")}</span>
                </h2>
                <p className="crew-copy crew-copy--narrow">{copy("Unser Alltag ist dynamisch und anspruchsvoll.")}</p>
              </div>
              <div className="crew-pillars">
                {PILLARS.map((pillar) => (
                  <article key={pillar.title} className="crew-pillar">
                    <div className="crew-pillar__frame">
                      <Image className={pillar.crop} src={pillar.image} alt={`${copy(pillar.title)} ${locale === "en" ? "at" : "bei"} Bräutigam`} width={1600} height={1066} sizes={pillar.crop === "crew-photo--balance" ? "(max-width: 700px) 217vw, (max-width: 1920px) 72vw, 1251px" : pillar.crop === "crew-photo--events" ? "(max-width: 700px) 153vw, (max-width: 1920px) 51vw, 884px" : "(max-width: 700px) 100vw, (max-width: 1920px) 33vw, 576px"} />
                    </div>
                    <h3>{copy(pillar.title)}</h3>
                    {"paragraphs" in pillar ? (
                      <div className="crew-copy">
                        {pillar.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{copy(paragraph)}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="crew-copy">{copy(pillar.body)}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section id="alltag" className="crew-block crew-day" aria-label={locale === "en" ? "A day with the team" : "Ein Tag im Team"}>
              <div className="crew-day__head">
                <div className="crew-lead">
                  <p className="crew-kicker">{locale === "en" ? "// A DAY WITH THE TEAM" : "// EIN TAG IM TEAM"}</p>
                  <h2 className="crew-display section-heading">
                    <span>{copy("Unser alltag")}</span>
                    <span>{copy("Ein tag im team")}</span>
                  </h2>
                </div>
                <p className="crew-mark crew-mark--life" aria-hidden="true">
                  LIFE
                </p>
              </div>
              <div className="crew-films crew-films--lg">
                {ROLE_FILMS.slice(0, 2).map((film) => (
                  <FilmCard key={film.title} film={film} locale={locale} video={videos[film.slot]} />
                ))}
              </div>
              <div className="crew-films crew-films--sm">
                {ROLE_FILMS.slice(2).map((film) => (
                  <FilmCard key={film.title} film={film} locale={locale} video={videos[film.slot]} />
                ))}
              </div>
            </section>

            <section id="stellen" className="crew-block">
              <div className="crew-lead">
                <p className="crew-kicker crew-kicker--tiny">{locale === "en" ? "// OPEN POSITIONS" : "// OFFENE STELLEN"}</p>
                <h2 className="crew-display section-heading">
                  <span>{copy("Offene")}</span>
                  <span>{copy("Stellen.")}</span>
                </h2>
              </div>
              <div className="crew-jobs">
                {openings.length === 0 ? (
                  <p className="crew-jobs__empty">
                    {locale === "en"
                      ? "No published openings at the moment."
                      : "Keine veröffentlichten Stellen."}
                  </p>
                ) : (
                  openings.map((job) => (
                    <Link
                      key={job.slug}
                      className="crew-job"
                      href={localizedHref(`/karriere/${job.slug}`, locale)}
                    >
                      <span className="crew-job__title">
                        <span>{openingTitle(job, locale)}</span>
                        <span>{locale === "en" ? "DEPARTMENT:" : "ABTEILUNG:"} {job.department}</span>
                      </span>
                      <span className="crew-job__meta">
                        <span>{job.department}</span>
                        <span aria-hidden="true">·</span>
                        <span>{job.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{locale === "en" ? ({ FULL_TIME: "FULL TIME", PART_TIME: "PART TIME", APPRENTICESHIP: "APPRENTICESHIP" })[job.employmentType] : EMPLOYMENT_DE[job.employmentType]}</span>
                      </span>
                      {/* Figma vector export; no raster optimization needed. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/crew/status-dot.svg" alt="" width={21} height={21} />
                    </Link>
                  ))
                )}
              </div>
            </section>

            <section className="crew-block">
              <div className="crew-lead">
                <p className="crew-kicker crew-kicker--tiny">{locale === "en" ? "// APPLICATION PROCESS" : "// BEWERBUNGSPROZESS"}</p>
                <h2 className="crew-display section-heading">
                  <span>{copy("So kommst du")}</span>
                  <span>{copy("ins team:")}</span>
                </h2>
              </div>
              <div className="crew-split">
                <p>{copy("Unser Bewerbungsprozess ist transparent und effizient. Du musst uns nur deine Unterlagen wie Lebenslauf und kurzes Anschreiben zukommen lassen. In einem persönlichen Gespräch mit unserer Personalabteilung und dem entsprechenden Abteilungsleiter können wir uns kennenlernen und detailliertere Informationen austauschen.")}</p>
                <p>{copy("Anschließend laden wir dich zu einem Probetag ein, bei dem du das Team und die Arbeitsumgebung kennenlernen kannst, während wir deine Fähigkeiten genauer prüfen.")}</p>
              </div>
              <ol className="crew-steps">
                {APPLY_STEPS.map((step) => (
                  <li key={step.index}>
                    <span>{step.index}</span>
                    <h3>{copy(step.title)}</h3>
                    <p>{copy(step.body)}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="crew-block">
              <div className="crew-cta">
                <p>{copy("INITIATIVBEWERBUNG")}</p>
                <h2>{copy("WERDE TEIL DES TEAMS.")}</h2>
                <p>{copy("Auch ohne ausgeschriebene Stelle — überzeuge uns mit deiner Bewerbung.")}</p>
                <SiteButton
                  variant="fill"
                  href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(locale === "en" ? "Speculative application" : "Initiativbewerbung")}`}
                >{copy("Jetzt bewerben")}</SiteButton>
              </div>
            </section>
          </div>
        </main>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
