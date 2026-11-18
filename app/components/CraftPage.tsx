"use client";

import Image from "next/image";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteButton from "./SiteButton";
import { localizedHref, type Locale } from "@/lib/i18n";
import "./CraftPage.css";

// Figma 1655:20. Existing workshop photographs fill the unfinished media slots.
const phases = [
  {
    label: ["// Phase 01 — Planung, Konzeption & Design", "// Phase 01 — Planning, concept & design"],
    title: ["Engineering", "Engineering"], accent: ["Excellence.", "Excellence."],
    body: ["Von der ersten Idee bis zum fertigen Konzept. Anforderungen und Belastungsszenarien werden in eine fertigungsgerechte Carbon-Lösung übersetzt.", "From the first idea to a finished concept. Requirements and load cases become a carbon solution designed for manufacturing."],
    items: [
      { title: ["Entwicklung", "Development"], image: "/images/timeline/figma/2016-hero.webp", body: ["Das Konzept legt Werkstoff, Aufbau und Fertigungsweg fest. Konstruktion und Produktion arbeiten von Anfang an zusammen.", "The concept defines the material, construction and manufacturing process. Design and production work together from the start."] },
      { title: ["CAD", "CAD"], image: "/images/Part_01_darkmode.webp", contain: true, body: ["Präzise 3D-Modelle und digitale Zwillinge. Das Modell ist die Grundlage für Simulation, Zuschnitt und Fräsbahnen.", "Precise 3D models and digital twins provide the foundation for simulation, cutting patterns and machining paths."] },
    ],
  },
  {
    label: ["// Phase 02 — Vorbereitung & Werkzeugbau", "// Phase 02 — Preparation & tooling"],
    title: ["Präzisions-", "Precision"], accent: ["Werkzeugbau.", "Tooling."],
    body: ["CNC-Technologie und präzise Materialvorbereitung bilden das Fundament für hochwertige Carbonbauteile.", "CNC technology and precise material preparation lay the foundation for high-quality carbon components."],
    items: [
      { title: ["CAM / CNC", "CAM / CNC"], image: "/images/timeline/figma/2021-shop.webp", body: ["Komplexe Geometrien werden in präzise Werkzeuge und Formen umgesetzt.", "Complex geometries are translated into precise tooling and moulds."] },
      { title: ["Zuschnitt", "Cutting"], image: "/images/timeline/figma/2016-thumb-3.webp", body: ["Carbonfaser-Lagen werden für den anschließenden Laminierprozess vorbereitet und zugeschnitten.", "Carbon-fibre plies are prepared and cut for the subsequent layup process."] },
    ],
  },
  {
    label: ["// Phase 03 — Produktion & Verarbeitung", "// Phase 03 — Production & processing"],
    title: ["Manufacturing", "Manufacturing"], accent: ["& Curing.", "& Curing."],
    body: ["Von der Lage zum ausgehärteten Bauteil. Laminierung, Verbund und Autoklav folgen einem festgelegten Prozess.", "From an individual ply to a cured component. Layup, bonding and autoclave curing follow a defined process."],
    items: [
      { title: ["Prepreg", "Prepreg"], image: "/images/timeline/figma/2016-thumb-1.webp", body: ["Die Lagen werden positioniert und verbunden. Faserorientierung und Materialaufbau bestimmen die Eigenschaften des Bauteils.", "Plies are positioned and bonded. Fibre orientation and the material structure determine the component’s properties."] },
      { title: ["Autoklave", "Autoclaves"], image: "/images/timeline/figma/2019-autoclave.webp", body: ["Unter kontrolliertem Druck und definierter Temperatur entstehen belastbare Carbonstrukturen.", "Controlled pressure and defined temperatures produce durable carbon structures."] },
    ],
  },
] as const;

export default function CraftPage({ locale = "de" }: { locale?: Locale }) {
  const language = locale === "en" ? 1 : 0;
  const t = (de: string, en: string) => language ? en : de;
  return (
    <LazyMotion features={domAnimation}>
      <div className="craft-page">
        <SiteChrome />
        <main id="main-content" lang={locale}>
          <section className="craft-hero">
            <p className="craft-hero__location copy-tiny">Freiberg am Neckar · Germany<br />{t("Fertigung: Inhouse, End to End", "Manufacturing: In-house, end to end")}</p>
            <p className="craft-hero__equipment copy-tiny">** {t("Maschinenpark", "Machine park")} **<br />CNC 3 · Zünd Cutter 2 · Scholz 3</p>
            <div className="craft-hero__title">
              <h1 className="heading-primary-bold">CRAFT</h1>
              <p>{t("Kleinserien und Unikate für Motorsport, Automotive und Luftfahrt. Von der Planung über die Fertigung bis zur Qualitätsfreigabe — unser End-to-End-Prozess für Hochleistungs-Carbonbauteile.", "Small series and one-off components for motorsport, automotive and aerospace. From planning and manufacturing to quality release — our end-to-end process for high-performance carbon components.")}</p>
            </div>
            <a className="craft-hero__scroll copy-caption" href="#craft-process">↓ {t("Prozess entdecken", "Explore the process")}</a>
          </section>
          <div className="craft-content" id="craft-process">
            {phases.map((phase, index) => (
              <section className="craft-phase" key={phase.title[0]}>
                <header className="craft-phase__header">
                  {index === 0 && <p className="craft-watermark" aria-hidden="true">CRAFT</p>}
                  <p className="craft-phase__label">{phase.label[language]}</p>
                  <h2><span>{phase.title[language]}</span><strong>{phase.accent[language]}</strong></h2>
                  <p>{phase.body[language]}</p>
                </header>
                <div className="craft-grid">
                  {phase.items.map((item) => (
                    <article key={item.title[0]}>
                      <div className={`craft-photo${"contain" in item ? " craft-photo--contain" : ""}`}>
                        <Image src={item.image} alt={item.title[language]} fill sizes="(max-width: 700px) 100vw, 50vw" />
                      </div>
                      <h3>{item.title[language]}</h3>
                      <p>{item.body[language]}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
            <section className="craft-phase">
              <header className="craft-phase__header"><p className="craft-phase__label">{t("// Anlagen", "// Equipment")}</p><h2><span>{t("Maschinenpark", "Equipment")}</span><strong>{t("Im Haus.", "In house.")}</strong></h2></header>
              <div className="craft-inventory">
                <article><h3>{t("Drei 5-Achs-Fräsen", "Three 5-axis mills")}</h3><p>POS · POSmill H 500 U</p></article>
                <article><h3>{t("Zwei Cutter", "Two cutters")}</h3><p>Zünd</p></article>
                <article><h3>{t("Drei Autoklaven", "Three autoclaves")}</h3><p>Scholz</p></article>
              </div>
            </section>
            <section className="craft-phase">
              <header className="craft-phase__header"><p className="craft-phase__label">{"// Assembly"}</p><h2><span>{t("Endmontage", "Final assembly")}</span><strong>{t("Im Prozess.", "In the process.")}</strong></h2><p>{t("Der letzte Fertigungsschritt vor der Qualitätsfreigabe.", "The final manufacturing step before quality release.")}</p></header>
              <div className="craft-grid"><article><div className="craft-photo"><Image src="/images/timeline/figma/2016-thumb-2.webp" alt={t("Bearbeitung einer Carbonoberfläche", "Finishing a carbon surface")} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><h3>Assembly</h3><p>{t("Nach der Aushärtung werden die Bauteile gefügt, angepasst und zur prüffertigen Baugruppe montiert.", "After curing, components are joined, fitted and assembled for inspection.")}</p></article></div>
            </section>
            <section className="craft-phase">
              <header className="craft-phase__header"><p className="craft-phase__label">{t("// Phase 04 — Abschluss & Freigabe", "// Phase 04 — Completion & release")}</p><h2><span>{t("Qualitäts-", "Quality")}</span><strong>{t("Sicherung.", "Assurance.")}</strong></h2><p>{t("Prüfung und finale Freigabe vor der Auslieferung.", "Inspection and final release before delivery.")}</p></header>
              <div className="craft-grid craft-quality"><div className="craft-photo"><Image src="/images/mission/precision-figma.webp" alt={t("Maßprüfung eines Carbonbauteils", "Dimensional inspection of a carbon component")} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div><h3>{t("Qualitätssicherung", "Quality assurance")}</h3><p>{t("Zerstörungsfreie Prüfverfahren, Ultraschallmessung und dimensionale Kontrolle sichern die Qualität. Die Ergebnisse werden dokumentiert, bevor das Bauteil zur Auslieferung freigegeben wird.", "Non-destructive testing, ultrasonic inspection and dimensional checks ensure quality. Results are documented before the component is released for delivery.")}</p></div></div>
            </section>
            <section className="craft-phase">
              <header className="craft-phase__header"><p className="craft-phase__label">{t("// Bauteil-Spektrum", "// Component range")}</p><h2><span>{t("Das Spektrum", "The range")}</span><strong>{t("Der Bauteile.", "Of components.")}</strong></h2><p>{t("Von der Idee bis zum fertigen Bauteil — und darüber hinaus in der Instandsetzung.", "From the idea to the finished component — and beyond, through repair and restoration.")}</p></header>
              <div className="craft-inventory">
                <article><h3>Motorsport</h3><p>{t("Powertrain, Fahrwerk, Chassis und Aerodynamik.", "Powertrain, suspension, chassis and aerodynamics.")}</p></article>
                <article><h3>Automotive</h3><p>{t("Interieur in matt und glänzend. Lackiertes Exterieur.", "Matt and gloss interior components. Painted exterior surfaces.")}</p></article>
                <article><h3>{t("Instandsetzung", "Restoration")}</h3><p>{t("Reparatur von Monocoques, CFK-Sichtoberflächen und Strukturbauteilen.", "Repair of monocoques, exposed carbon surfaces and structural components.")}</p></article>
              </div>
            </section>
          </div>
          <section className="craft-cta"><h2>{t("Bereit für Präzision?", "Ready for precision?")}</h2><p>{t("Kontaktieren Sie uns für Ihr nächstes Composite-Projekt.", "Get in touch about your next composite project.")}</p><SiteButton href={localizedHref("/kontakt", locale)}>{t("Projekt anfragen", "Discuss your project")}</SiteButton></section>
        </main>
        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
