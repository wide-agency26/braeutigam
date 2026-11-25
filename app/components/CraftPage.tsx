"use client";

import Image from "next/image";
import { LazyMotion, domAnimation } from "framer-motion";
import SiteChrome from "./SiteChrome";
import SiteFooter from "./SiteFooter";
import SiteButton from "./SiteButton";
import LazyOnVisible from "./LazyOnVisible";
import ProcessTimeline from "./craft/ProcessTimeline";
import MachinePark from "./craft/MachinePark";
import { useTheme } from "./ThemeProvider";
import { localizedHref, type Locale } from "@/lib/i18n";
import "./CraftPage.css";
const loadBeams = () => import("./craft/Beams");

// Final Craft frame 2195:165, exported 25 Nov 2026.
const phases = [
  {
    label: ["// Phase 01 — Planung, Konzeption & Design", "// Phase 01 — Planning, concept & design"],
    title: ["Engineering", "Engineering"], accent: ["Excellence.", "Excellence."],
    body: ["Von der ersten Idee bis zum fertigen Konzept. Anforderungen und Belastungsszenarien werden in eine fertigungsgerechte Carbon-Lösung übersetzt.", "From the first idea to a finished concept. Requirements and load cases become a carbon solution designed for manufacturing."],
    items: [
      { title: ["Entwicklung", "Development"], image: "/images/craft/development.webp", body: ["Das Konzept legt Werkstoff, Aufbau und Fertigungsweg fest. Konstruktion und Produktion arbeiten von Anfang an zusammen.", "The concept defines the material, construction and manufacturing process. Design and production work together from the start."] },
      { title: ["CAD", "CAD"], image: "/images/craft/cad.webp", body: ["Präzise 3D-Modelle und digitale Zwillinge. Das Modell ist die Grundlage für Simulation, Zuschnitt und Fräsbahnen.", "Precise 3D models and digital twins provide the foundation for simulation, cutting patterns and machining paths."] },
    ],
  },
  {
    label: ["// Phase 02 — Vorbereitung & Werkzeugbau", "// Phase 02 — Preparation & tooling"],
    title: ["Präzisions-", "Precision"], accent: ["Werkzeugbau.", "Tooling."],
    body: ["CNC-Technologie und präzise Materialvorbereitung bilden das Fundament für hochwertige Carbonbauteile.", "CNC technology and precise material preparation lay the foundation for high-quality carbon components."],
    items: [
      { title: ["CAM / CNC", "CAM / CNC"], image: "/images/craft/cnc.webp", body: ["Komplexe Geometrien werden in präzise Werkzeuge und Formen umgesetzt.", "Complex geometries are translated into precise tooling and moulds."] },
      { title: ["Zuschnitt", "Cutting"], image: "/images/craft/cutting.webp", body: ["Carbonfaser-Lagen werden für den anschließenden Laminierprozess vorbereitet und zugeschnitten.", "Carbon-fibre plies are prepared and cut for the subsequent layup process."] },
    ],
  },
  {
    label: ["// Phase 03 — Produktion & Verarbeitung", "// Phase 03 — Production & processing"],
    title: ["Manufacturing", "Manufacturing"], accent: ["& Curing.", "& Curing."],
    body: ["Von der Lage zum ausgehärteten Bauteil. Laminierung, Verbund und Autoklav folgen einem festgelegten Prozess.", "From an individual ply to a cured component. Layup, bonding and autoclave curing follow a defined process."],
    items: [
      { title: ["Prepreg", "Prepreg"], image: "/images/craft/prepreg.webp", body: ["Die Lagen werden positioniert und verbunden. Faserorientierung und Materialaufbau bestimmen die Eigenschaften des Bauteils.", "Plies are positioned and bonded. Fibre orientation and the material structure determine the component’s properties."] },
      { title: ["Autoklave", "Autoclaves"], image: "/images/craft/autoclave.webp", body: ["Unter kontrolliertem Druck und definierter Temperatur entstehen belastbare Carbonstrukturen.", "Controlled pressure and defined temperatures produce durable carbon structures."] },
    ],
  },
] as const;

export default function CraftPage({ locale = "de" }: { locale?: Locale }) {
  const { isDark } = useTheme();
  const language = locale === "en" ? 1 : 0;
  const t = (de: string, en: string) => language ? en : de;
  return (
    <LazyMotion features={domAnimation}>
      <div className="craft-page">
        <SiteChrome />
        <main id="main-content" lang={locale}>
          <section className="craft-hero">
            <div className="craft-hero__background" aria-hidden="true">
              <Image src="/images/craft/beams-poster.webp" alt="" fill sizes="100vw" preload className="craft-hero__poster" />
              <LazyOnVisible loader={loadBeams} delayMs={600} rootMargin="0px" className="craft-hero__beams" componentProps={{ beamWidth: 82, color: "#f3f3f3", mouseInteraction: false, glow: .45, fillLight: .25, brightness: 1.2, depth: 1.4, sharpness: .55, speed: .7, grain: .4, fade: .15, intro: false, dpr: 1, quality: .6, lightMode: !isDark }} />
            </div>
            <p className="craft-hero__location copy-tiny">Location: Germany [48.9298° N, 9.2070° E]<br />Plant: Freiberg am Neckar<br />Process: Inhouse, End to End</p>
            <p className="craft-hero__equipment copy-tiny">** {t("Maschinenpark", "Machine park")} **<br />CNC 3 · Cutter 2 · Scholz 3</p>
            <div className="craft-hero__title">
              <h1 className="heading-primary-bold">{t("LEISTUNGEN", "CRAFT")}</h1>
              <p>{t("Kleinserien und Unikate für Motorsport, Automotive und Luftfahrt. Von der Planung über die Fertigung bis zur Qualitätsfreigabe — unser End-to-End-Prozess für Hochleistungs-Carbonbauteile.", "Small series and one-off components for motorsport, automotive and aerospace. From planning and manufacturing to quality release — our end-to-end process for high-performance carbon components.")}</p>
              <div className="craft-hero__actions"><SiteButton href="#craft-process">{t("Prozess", "Process")}</SiteButton><SiteButton href="#machine-park">{t("Maschinenpark", "Equipment")}</SiteButton></div>
            </div>
            <a className="craft-hero__scroll copy-caption" href="#craft-process"><span>CF-PROCESS // END_TO_END_V2.0</span>↓ {t("Prozess entdecken", "Explore the process")}</a>
          </section>
          <div className="craft-system-bar" aria-hidden="true"><span>BRAEUTIGAM_WEBFILE / {t("KOHLEFASER", "CARBON FIBRE")}<br /><b>{t("ZUGANG GEWÄHRT", "ACCESS GRANTED")}</b></span><span><b>{t("FERTIGUNG: AKTIV", "MANUFACTURING: ACTIVE")}</b> · PIPELINE: CF-2026-Q3</span><span><b>&gt;&gt;_{t("PIPELINE INITIALISIERT", "PIPELINE INITIALISED")}</b><br />©2026 BRÄUTIGAM GMBH</span></div>
          <ProcessTimeline locale={locale} />
          <div className="craft-content">
            {phases.map((phase, index) => (
              <section className="craft-phase" key={phase.title[0]}>
                <header className="craft-phase__header">
                  {index === 0 && <p className="craft-watermark" aria-hidden="true">CRAFT</p>}
                  <p className="craft-phase__label">{phase.label[language]}</p>
                  <h2 className="section-heading"><span>{phase.title[language]}</span><strong>{phase.accent[language]}</strong></h2>
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
              <header className="craft-phase__header"><p className="craft-phase__label">{"// Assembly"}</p><h2 className="section-heading"><span>{t("Endmontage", "Final assembly")}</span><strong>{t("Im Prozess.", "In the process.")}</strong></h2><p>{t("Der letzte Fertigungsschritt vor der Qualitätsfreigabe.", "The final manufacturing step before quality release.")}</p></header>
              <div className="craft-grid"><article><div className="craft-photo"><Image src="/images/craft/assembly.webp" alt={t("Bearbeitung einer Carbonoberfläche", "Finishing a carbon surface")} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><h3>Assembly</h3><p>{t("Nach der Aushärtung werden die Bauteile gefügt, angepasst und zur prüffertigen Baugruppe montiert.", "After curing, components are joined, fitted and assembled for inspection.")}</p></article></div>
            </section>
            <section className="craft-phase">
              <header className="craft-phase__header"><p className="craft-phase__label">{t("// Phase 04 — Abschluss & Freigabe", "// Phase 04 — Completion & release")}</p><h2 className="section-heading"><span>{t("Qualitäts-", "Quality")}</span><strong>{t("Sicherung.", "Assurance.")}</strong></h2><p>{t("Prüfung und finale Freigabe vor der Auslieferung.", "Inspection and final release before delivery.")}</p></header>
              <div className="craft-grid craft-quality"><div className="craft-photo"><Image src="/images/craft/quality.webp" alt={t("Maßprüfung eines Carbonbauteils", "Dimensional inspection of a carbon component")} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div><h3>{t("Qualitätssicherung", "Quality assurance")}</h3><p>{t("Zerstörungsfreie Prüfverfahren, Ultraschallmessung und dimensionale Kontrolle sichern die Qualität. Die Ergebnisse werden dokumentiert, bevor das Bauteil zur Auslieferung freigegeben wird.", "Non-destructive testing, ultrasonic inspection and dimensional checks ensure quality. Results are documented before the component is released for delivery.")}</p><div className="craft-certificate"><Image src="/images/craft/tuv.webp" alt="TÜV SÜD ISO 9001" width={88} height={88} /><SiteButton href="/documents/tuv-iso-9001.pdf" target="_blank" rel="noopener noreferrer">{t("TÜV Zertifikat ansehen", "View TÜV certificate")}</SiteButton></div><dl className="craft-quality__spec"><div><dt>{t("Prüfverfahren", "Inspection method")}</dt><dd>NDT_ULTRASONIC_v3.1</dd></div><div><dt>{t("Protokoll", "Protocol")}</dt><dd>ZERO_DEFECT_RELEASE</dd></div><div><dt>{t("Toleranz", "Tolerance")}</dt><dd>±0.05 mm</dd></div><div><dt>{t("Zertifizierung", "Certification")}</dt><dd>DIN EN ISO 9001:2015</dd></div></dl></div></div>
            </section>
            <MachinePark locale={locale} />
            <section className="craft-phase">
              <header className="craft-phase__header"><p className="craft-phase__label">{t("// Bauteil-Spektrum", "// Component range")}</p><h2 className="section-heading"><span>{t("Das Spektrum", "The range")}</span><strong>{t("Der Bauteile.", "Of components.")}</strong></h2><p>{t("Von der Idee bis zum fertigen Bauteil — und darüber hinaus in der Instandsetzung.", "From the idea to the finished component — and beyond, through repair and restoration.")}</p></header>
              <div className="craft-inventory">
                <article><div className="craft-photo"><Image src="/images/craft/motorsport.webp" alt="Motorsport" fill sizes="(max-width:700px) 100vw, 33vw" /></div><h3>Motorsport</h3><p>{t("Powertrain, Fahrwerk, Chassis und Aerodynamik.", "Powertrain, suspension, chassis and aerodynamics.")}</p><p>{t("Öltank, Airbox, Querlenker, Flügel und Crashstrukturen.", "Oil tanks, airboxes, wishbones, wings and crash structures.")}</p></article>
                <article><div className="craft-photo"><Image src="/images/craft/automotive.webp" alt="Automotive" fill sizes="(max-width:700px) 100vw, 33vw" /></div><h3>Automotive</h3><p>{t("Sichtcarbon im Interieur, matt oder glänzend. Außenbauteile lackiert, auch transparent oder zweifarbig.", "Matt or gloss exposed carbon in the interior. Painted exterior components, including clear-coated or two-tone finishes.")}</p></article>
                <article><div className="craft-photo"><Image src="/images/craft/restoration.webp" alt={t("Instandsetzung", "Restoration")} fill sizes="(max-width:700px) 100vw, 33vw" /></div><h3>{t("Instandsetzung", "Restoration")}</h3><p>{t("Reparatur von Monocoques, CFK-Sichtoberflächen und Strukturbauteilen.", "Repair of monocoques, exposed carbon surfaces and structural components.")}</p><p>{t("Unfallreparatur von Monocoques, Außenhaut und crashrelevanter Struktur.", "Accident repairs to monocoques, outer panels and crash-relevant structures.")}</p><p>{t("Weltweites Patent für Reparatur von Sichtcarbon", "Worldwide patent for exposed-carbon repair")}</p></article>
              </div>
            </section>
          </div>
          <section className="craft-cta"><h2>{t("Bereit für Präzision?", "Ready for precision?")}</h2><p>{t("Kontaktieren Sie uns für Ihr nächstes Hochleistungs-Composite-Projekt.", "Get in touch about your next high-performance composite project.")}</p><SiteButton href={localizedHref("/kontakt", locale)}>{t("Projekt anfragen", "Discuss your project")}</SiteButton></section>
        </main>
        <SiteFooter />
      </div>
    </LazyMotion>
  );
}
