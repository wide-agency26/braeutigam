"use client";

import React from "react";
import Link from "next/link";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import "./CareerPage.css";

const APPLY_EMAIL = "info@braeutigam-gmbh.eu";

const PILLARS = [
  {
    title: "team events",
    image: "/images/crew/pillar-events.png",
    crop: "crew-photo--events",
    body: "Cutting-edge composite engineering using advanced simulation, precision tooling, and optimized layup processes.",
  },
  {
    title: "weiterbildungen",
    image: "/images/crew/pillar-training.png",
    crop: "crew-photo--cover",
    paragraphs: [
      "Wir glauben an die kontinuierliche Weiterentwicklung unserer Mitarbeiter. Bei uns erhältst du eine umfangreiche Einarbeitung, da die Arbeit mit Kohlefaser Komponenten eine spezielle Expertise erfordert.",
      "Neben spezifischen Schulungen zur Materialkunde, Bauteilherstellung und dem Umgang mit Geräten bieten wir auch Weiterbildungen für Abteilungsleiter und Führungspositionen an. Wir legen Wert darauf, dass unsere Mitarbeiter ihr Potenzial voll ausschöpfen und sich beruflich weiterentwickeln können.",
    ],
  },
  {
    title: "Work-life balance",
    image: "/images/crew/pillar-balance.png",
    crop: "crew-photo--balance",
    body: "A proven track record in motorsport and aerospace with over eight years of high-performance component delivery.",
  },
] as const;

/* Same five role films as before. Posters are the Figma frames; playback stays on the play control. */
const ROLE_FILMS = [
  {
    title: "Konstruktion",
    body: "Designing the mathematical fiber layouts in Catia to withstand extreme aerodynamic load.",
    poster: "/images/crew/film-1.png",
    crop: "crew-photo--konstruktion",
    play: "/images/crew/play-lg.svg",
    playWidth: 128,
    playHeight: 128,
    large: true,
  },
  {
    title: "Pre-preg Laminierer",
    body: "Placing resin-infused fiber orientations layer-by-layer with surgical human precision.",
    poster: "/images/crew/film-2.png",
    crop: "crew-photo--bottom",
    play: "/images/crew/play-lg.svg",
    playWidth: 128,
    playHeight: 128,
    large: true,
  },
  {
    title: "Zuschnitt",
    body: "Nesting and optimizing fiber templates for perfect cutting layouts.",
    poster: "/images/crew/film-3.png",
    crop: "crew-photo--bottom",
    play: "/images/crew/play-sm.svg",
    playWidth: 64,
    playHeight: 64,
    large: false,
  },
  {
    title: "Produktionsplanung & Projektmanagement",
    body: "Coordinating autoclave schedules and managing client racing constraints.",
    poster: "/images/crew/film-4.png",
    crop: "crew-photo--bottom",
    play: "/images/crew/play-sm-2.svg",
    playWidth: 112,
    playHeight: 112,
    large: false,
  },
  {
    title: "Montage",
    body: "Assembling cured composite structures and polishing clearcoats.",
    poster: "/images/crew/film-5.png",
    crop: "crew-photo--bottom",
    play: "/images/crew/play-sm.svg",
    playWidth: 64,
    playHeight: 64,
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
  department: string;
  location: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "APPRENTICESHIP";
};

const EMPLOYMENT_DE: Record<CareerOpening["employmentType"], string> = {
  FULL_TIME: "VOLLZEIT",
  PART_TIME: "TEILZEIT",
  APPRENTICESHIP: "AUSBILDUNG",
};

function FilmCard({ film }: { film: (typeof ROLE_FILMS)[number] }) {
  return (
    <article className="crew-film">
      <div className={`crew-film__frame ${film.large ? "crew-film__frame--lg" : ""}`}>
        <img className={film.crop} src={film.poster} alt="" />
        <button type="button" className="crew-play" aria-label={`Film abspielen: ${film.title}`}>
          <img src={film.play} alt="" width={film.playWidth} height={film.playHeight} />
        </button>
      </div>
      <h3 className="crew-film__title">{film.title}</h3>
      <p className="crew-film__body">{film.body}</p>
    </article>
  );
}

export default function CareerPage({ openings }: { openings: CareerOpening[] }) {
  return (
    <LazyMotion features={domAnimation}>
      <div className="crew-page">
        <SiteChrome />

        <section className="crew-hero" aria-label="Crew">
          <div className="crew-hero__media" aria-hidden="true">
            <img className="crew-photo--hero" src="/images/crew/hero.png" alt="" />
          </div>
          <div className="crew-hero__shade" aria-hidden="true" />

          <p className="crew-hero__join">[ JOIN THE CREW ]</p>
          <p className="crew-hero__pitch">
            <span>We build with precision, passion, and purpose. Join a team</span>
            <span>of world-class engineers pushing the boundaries of composite technology.</span>
          </p>

          <div className="crew-hero__title">
            <h1>CREW</h1>
            <a className="site-btn" href="#stellen">
              Offene stellenanzeigen
            </a>
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
              <span>ZUGANG GEWÄHRT</span>
            </p>
            <h2 className="crew-intro__title">
              <span>UNSER TEAM:</span>
              <span>EINZIGARTIG</span>
            </h2>
            <p className="crew-copy crew-copy--narrow">
              Hinter jedem Bauteil steckt ein Team, das Höchstleistung als Standard setzt. Unser Team
              arbeitet präzise, innovativ, kompromisslos.
            </p>
            <div className="crew-actions">
              <a className="site-btn" href="#stellen">
                Offene stellenanzeigen
              </a>
              <a className="site-btn site-btn--amber" href="#truppe">
                Über das team
              </a>
            </div>
          </section>

          <section id="truppe" className="crew-block">
            <div className="crew-lead">
              <p className="crew-kicker">ARBEITSWEISE</p>
              <h2 className="crew-display">
                <span>DAS WICHTIGSTE:</span>
                <span>DIE TRUPPE.</span>
              </h2>
              <p className="crew-copy crew-copy--narrow">Unser Alltag ist dynamisch und anspruchsvoll.</p>
            </div>
            <div className="crew-pillars">
              {PILLARS.map((pillar) => (
                <article key={pillar.title} className="crew-pillar">
                  <div className="crew-pillar__frame">
                    <img className={pillar.crop} src={pillar.image} alt="" />
                  </div>
                  <h3>{pillar.title}</h3>
                  {"paragraphs" in pillar ? (
                    <div className="crew-copy">
                      {pillar.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="crew-copy">{pillar.body}</p>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="crew-block crew-day" aria-label="Ein Tag im Team">
            <div className="crew-day__head">
              <div className="crew-lead">
                <p className="crew-kicker">{"// EIN TAG IM TEAM"}</p>
                <h2 className="crew-display">
                  <span>Unser alltag</span>
                  <span>Ein tag im team</span>
                </h2>
              </div>
              <p className="crew-mark crew-mark--life" aria-hidden="true">
                LIFE
              </p>
            </div>
            <div className="crew-films crew-films--lg">
              {ROLE_FILMS.slice(0, 2).map((film) => (
                <FilmCard key={film.title} film={film} />
              ))}
            </div>
            <div className="crew-films crew-films--sm">
              {ROLE_FILMS.slice(2).map((film) => (
                <FilmCard key={film.title} film={film} />
              ))}
            </div>
          </section>

          <section id="stellen" className="crew-block">
            <div className="crew-lead">
              <p className="crew-kicker crew-kicker--tiny">{"// OFFENE STELLEN"}</p>
              <h2 className="crew-display">
                <span>Offene</span>
                <span>Stellen.</span>
              </h2>
            </div>
            <div className="crew-jobs">
              {openings.length === 0 ? (
                <p className="crew-jobs__empty">Keine veröffentlichten Stellen.</p>
              ) : (
                openings.map((job) => (
                  <Link key={job.slug} className="crew-job" href={`/karriere/${job.slug}`}>
                    <span className="crew-job__title">
                      <span>{job.title}</span>
                      <span>ABTEILUNG: {job.department}</span>
                    </span>
                    <span className="crew-job__meta">
                      <span>{job.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.location}</span>
                      <span aria-hidden="true">·</span>
                      <span>{EMPLOYMENT_DE[job.employmentType]}</span>
                    </span>
                    <img src="/images/crew/status-dot.svg" alt="" width={21} height={21} />
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="crew-block">
            <div className="crew-lead">
              <p className="crew-kicker crew-kicker--tiny">{"// BEWERBUNGSPROZESS"}</p>
              <h2 className="crew-display">
                <span>So kommst du</span>
                <span>ins team:</span>
              </h2>
            </div>
            <div className="crew-split">
              <p>
                Unser Bewerbungsprozess ist transparent und effizient. Du musst uns nur deine Unterlagen
                wie Lebenslauf und kurzes Anschreiben zukommen lassen. In einem persönlichen Gespräch mit
                unserer Personalabteilung und dem entsprechenden Abteilungsleiter können wir uns
                kennenlernen und detailliertere Informationen austauschen.
              </p>
              <p>
                Anschließend laden wir dich zu einem Probetag ein, bei dem du das Team und die
                Arbeitsumgebung kennenlernen kannst, während wir deine Fähigkeiten genauer prüfen.
              </p>
            </div>
            <ol className="crew-steps">
              {APPLY_STEPS.map((step) => (
                <li key={step.index}>
                  <span>{step.index}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="crew-block">
            <div className="crew-cta">
              <p>INITIATIVBEWERBUNG</p>
              <h2>WERDE TEIL DES TEAMS.</h2>
              <p>Auch ohne ausgeschriebene Stelle — überzeuge uns mit deiner Bewerbung.</p>
              <a
                className="site-btn site-btn--fill"
                href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent("Initiativbewerbung")}`}
              >
                Jetzt bewerben
              </a>
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
