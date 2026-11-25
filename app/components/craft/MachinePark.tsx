"use client";

import Image from "next/image";
import { useTheme } from "../ThemeProvider";
import type { Locale } from "@/lib/i18n";

type Machine = { name: string; image: string; equipment: [string, string]; spec: [string, string] };
type Group = { id: string; label: [string, string]; title: [string, string]; items: Machine[] };
const cnc: Machine = { name: "CNC", image: "cnc-mill", equipment: ["POS POSmill H 800 U", "POS POSmill H 800 U"], spec: ["CNC-Fräsmaschine", "CNC milling machine"] };
const autoclave: Machine = { name: "Autoklav", image: "autoclave-large", equipment: ["Maschinenbau Scholz Großautoklav", "Maschinenbau Scholz large autoclave"], spec: ["69.400 l, bis 7,5 bar, 200 °C", "69,400 l, up to 7.5 bar, 200 °C"] };
// Equipment names and specifications from the approved Figma frame 2195:165.
const groups: Group[] = [
  { id: "cnc", label: ["CNC-Fräsen", "CNC mills"], title: ["Drei 5-Achs-Fräsen", "Three 5-axis mills"], items: [cnc, cnc, cnc] },
  { id: "cutters", label: ["Cutter", "Cutters"], title: ["Zwei Cutter", "Two cutters"], items: [
    { name: "Cutter", image: "cutter-zuend", equipment: ["Zünd G3 XL-3200", "Zünd G3 XL-3200"], spec: ["Digitaler Flachbettcutter für Prepreg und Gewebe", "Digital flatbed cutter for prepreg and fabric"] },
    { name: "Cutter", image: "cutter-humantec", equipment: ["Humantec Flachbettcutter", "Humantec flatbed cutter"], spec: ["Flachbettcutter", "Flatbed cutter"] },
  ] },
  { id: "autoclaves", label: ["Autoklaven", "Autoclaves"], title: ["Drei Autoklaven", "Three autoclaves"], items: [autoclave, autoclave,
    { name: "Autoklav", image: "autoclave-small", equipment: ["Maschinenbau Scholz Autoklav", "Maschinenbau Scholz autoclave"], spec: ["3.000 l, bis 20 bar, 400 °C", "3,000 l, up to 20 bar, 400 °C"] },
  ] },
  { id: "temperature", label: ["Temperatur", "Temperature"], title: ["Universalschrank", "Universal oven"], items: [
    { name: "UF750", image: "oven-memmert", equipment: ["Memmert Universalschrank UF750", "Memmert universal oven UF750"], spec: ["kalibriert bei 160,0 °C", "calibrated at 160.0 °C"] },
  ] },
  { id: "plasma", label: ["Plasma", "Plasma"], title: ["Piezobrush", "Piezobrush"], items: [
    { name: "PZ3", image: "plasma-pen", equipment: ["relyon plasma piezobrush PZ3", "relyon plasma piezobrush PZ3"], spec: ["Plasma-Handgerät", "Handheld plasma device"] },
  ] },
];
const inspection: Machine[] = [
  { name: "HandySCAN", image: "handyscan", equipment: ["Creaform HandySCAN BLACK+ Elite", "Creaform HandySCAN BLACK+ Elite"], spec: ["handgeführter 3D-Scanner", "Handheld 3D scanner"] },
  { name: "EPOCH 650", image: "ultrasonic", equipment: ["Olympus EPOCH 650", "Olympus EPOCH 650"], spec: ["Ultraschall-Fehlerprüfgerät", "Ultrasonic flaw detector"] },
  { name: "Videoendoskop", image: "endoscope", equipment: ["ENDO Industrial Videoendoskop", "ENDO industrial video endoscope"], spec: ["3,0 mm Sonde, Display und Joystick", "3.0 mm probe, display and joystick"] },
  { name: "PCE-RT 2000", image: "roughness", equipment: ["PCE-RT 2000", "PCE-RT 2000"], spec: ["Rauheitsmessgerät", "Surface roughness tester"] },
  { name: "ORION", image: "bore-micrometer", equipment: ["ORION Dreipunkt-Innenmessschrauben", "ORION three-point internal micrometers"], spec: ["Ø 6–100 mm, Ablesung 0,005 mm", "Ø 6–100 mm, resolution 0.005 mm"] },
  { name: "WIKA CPG1200", image: "pressure", equipment: ["digitales Präzisionsmanometer", "Digital precision pressure gauge"], spec: ["bis 1.000 bar, Genauigkeit 0,25 oder 0,5 %", "Up to 1,000 bar, accuracy 0.25 or 0.5%"] },
];

export default function MachinePark({ locale }: { locale: Locale }) {
  const { theme } = useTheme();
  const language = locale === "en" ? 1 : 0;
  function cards(items: Machine[], measuring = false) {
    return <div className="machine-park__grid">{items.map((machine, index) => {
      const number = String(index + 1).padStart(2, "0");
      const name = locale === "en" && machine.name === "Autoklav" ? "Autoclave" : locale === "en" && machine.name === "Videoendoskop" ? "Video endoscope" : machine.name;
      return <article className="machine-card" key={number}>
        <div className="machine-card__photo"><Image src={`/images/craft/machines/${theme}_machine-${machine.image}.webp`} alt={machine.equipment[language]} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" /></div>
        <span className="machine-card__index">{number}</span>
        <h4>{name}{["cnc-mill", "cutter-zuend", "cutter-humantec", "autoclave-large", "autoclave-small"].includes(machine.image) ? ` ${number}` : ""}</h4>
        <dl>
          <div><dt>{measuring ? (locale === "en" ? "Instrument" : "Messgerät") : (locale === "en" ? "Equipment" : "Anlage")}</dt><dd>{machine.equipment[language]}</dd></div>
          <div><dt>{locale === "en" ? "Specification" : "Kennwert"}</dt><dd>{machine.spec[language]}</dd></div>
        </dl>
      </article>;
    })}</div>;
  }
  return <>
    <section className="craft-phase" id="machine-park">
      <header className="craft-phase__header"><p className="craft-phase__label">{locale === "en" ? "// Equipment" : "// Anlagen"}</p><h2 className="section-heading"><span>{locale === "en" ? "Equipment" : "Maschinenpark"}</span><strong>{locale === "en" ? "In house." : "Im Haus."}</strong></h2></header>
      <div className="machine-park">{groups.map(group => <section className="machine-park__group" key={group.id} aria-labelledby={`machine-${group.id}`}>
        <p className="craft-phase__label">{`// ${group.label[language]}`}</p><h3 id={`machine-${group.id}`}>{group.title[language]}</h3>{cards(group.items)}
      </section>)}</div>
    </section>
    <section className="craft-phase">
      <header className="craft-phase__header"><p className="craft-phase__label">{locale === "en" ? "// Inspection" : "// Prüftechnik"}</p><h2 className="section-heading"><span>{locale === "en" ? "Inspection" : "Prüftechnik"}</span><strong>{locale === "en" ? "Instruments." : "Messmittel."}</strong></h2></header>
      <h3>{locale === "en" ? "Measuring instruments" : "Messmittel"}</h3>{cards(inspection, true)}
    </section>
  </>;
}
