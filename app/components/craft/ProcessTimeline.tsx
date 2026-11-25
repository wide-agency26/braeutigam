"use client";

import { useEffect, useRef } from "react";
import { craftProcessSteps, type ProcessStep } from "@/lib/data/craft-process";
import type { Locale } from "@/lib/i18n";
import type { LaserLook } from "./laser-canvas";
import "./ProcessTimeline.css";

const english: Omit<ProcessStep, "id">[] = [
  { kicker: "Phase 01", title: "Development", tags: ["Concept", "Material"], result: "The requirement becomes a carbon solution designed for manufacturing.", description: "Design and production define the material, construction and manufacturing process together." },
  { kicker: "Phase 01", title: "CAD", tags: ["3D model", "Digital twin"], result: "The model is the foundation for simulation, cutting patterns and machining paths.", description: "Precise 3D models turn the concept into a manufacturable geometry." },
  { kicker: "Phase 02", title: "CAM / CNC", tags: ["5-axis", "Tooling"], result: "Complex geometries become tools and moulds.", description: "Machining paths are developed in house for our own 5-axis machines." },
  { kicker: "Phase 02", title: "Cutting", tags: ["Prepreg", "Fabric"], result: "The plies are ready for the layup process.", description: "Zünd and Humantec cutters cut the plies with millimetre precision." },
  { kicker: "Phase 03", title: "Prepreg", tags: ["Laminate", "Fibre orientation"], result: "Ply placement and orientation determine the component’s properties.", description: "The plies are positioned and bonded before entering the autoclave." },
  { kicker: "Phase 03", title: "Autoclave", tags: ["Pressure", "Temperature"], result: "The component cures under controlled pressure and defined temperatures.", description: "Three Scholz autoclaves accommodate large components and high pressures." },
  { kicker: "Inspection", title: "QC after autoclaving", tags: ["Ultrasound", "Dimensions"], result: "Only inspected components proceed to assembly.", description: "After curing, we inspect the structure and dimensions before further processing." },
  { kicker: "Assembly", title: "Assembly", tags: ["Joining", "Assembly"], result: "The component becomes an assembly ready for inspection.", description: "After curing, the parts are joined, fitted and assembled." },
  { kicker: "Inspection", title: "QC after final assembly", tags: ["Assembly", "Release"], result: "The completed assembly is inspected again.", description: "Fit, surface and dimensions are documented before the part leaves the line." },
  { kicker: "Surface", title: "High-gloss polishing", status: { text: "on request", tone: "accent" }, tags: ["High gloss", "Exposed carbon"], result: "The surface is polished to a high gloss.", description: "When a glossy exposed surface is required, we polish it. The part then returns to QC." },
  { kicker: "Release", title: "QC after polishing", tags: ["Surface", "Release"], result: "Polished parts are inspected and released.", description: "This step applies when polishing is required. The component is then released for delivery." },
  { kicker: "Shipping", title: "Delivered worldwide", tags: ["Logistics partners", "Worldwide"], result: "With strong partners, we make the impossible possible.", description: "Together with our logistics partners, we deliver components quickly and safely around the world." },
];
const looks: LaserLook[] = ["orbit", "draft", "mill", "cut", "layup", "heat", "qc", "assemble", "qc", "polish", "release", "ship"];
const clamp = (n: number) => Math.min(1, Math.max(0, n));

export default function ProcessTimeline({ locale }: { locale: Locale }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = root.current, list = track.current, surface = canvas.current;
    if (!element || !list || !surface) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let engine: ReturnType<typeof import("./laser-canvas").mountLaser> | undefined;
    let alive = true, visible = false, loading = false, frame = 0, burst = 0, activeIndex = -1, previousY = 0, previousTime = 0;
    const rows = Array.from(list.children) as HTMLElement[];
    const update = () => {
      frame = 0;
      const enabled = visible && !document.hidden && !motion.matches;
      surface.hidden = !enabled;
      if (!enabled) { engine?.destroy(); return; }
      const box = list.getBoundingClientRect();
      const rawY = innerHeight * .5 - box.top;
      const y = Math.max(0, Math.min(list.offsetHeight, rawY));
      list.style.setProperty("--process-progress", String(clamp(y / list.offsetHeight)));
      let index = 0;
      rows.forEach((row, i) => {
        const reached = y >= row.offsetTop;
        row.dataset.reached = String(reached);
        if (reached) index = i;
      });
      if (index !== activeIndex) { activeIndex = index; burst++; }
      const now = performance.now();
      const velocity = previousTime ? Math.abs(y - previousY) / Math.max(16, now - previousTime) * 1000 : 0;
      previousTime = now; previousY = y;
      engine?.paint({
        intro: clamp(1 + rawY / Math.min(innerHeight * .3, 200)), line: clamp(y / list.offsetHeight),
        x: innerWidth <= 700 ? 12 : 36, y, velocity, look: looks[index],
        rowProgress: clamp((y - rows[index].offsetTop) / rows[index].offsetHeight),
        width: Math.max(0, innerWidth - box.left - 48), burst,
        outro: clamp((rawY - list.offsetHeight) / (innerHeight * .5)), ox: box.left, oy: box.top,
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const activate = () => {
      if (visible && !motion.matches && !engine && !loading) {
        loading = true;
        import("./laser-canvas").then(({ mountLaser }) => {
          if (!alive) return;
          engine = mountLaser(surface); schedule();
        }).catch(() => { loading = false; });
      }
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; activate(); });
    observer.observe(element);
    const resize = new ResizeObserver(schedule); resize.observe(list);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", activate);
    motion.addEventListener("change", activate);
    return () => {
      alive = false; cancelAnimationFrame(frame); engine?.destroy(); observer.disconnect(); resize.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", activate); motion.removeEventListener("change", activate);
    };
  }, []);
  return <section className="craft-process" ref={root} id="craft-process" aria-labelledby="craft-process-title">
    <div className="craft-process__inner">
      <p className="craft-process__label">{locale === "en" ? "// Process" : "// Prozess"}</p>
      <h2 id="craft-process-title">{locale === "en" ? "From concept to release." : "Vom Konzept bis zur Freigabe."}</h2>
      <ol className="craft-process__track" ref={track}>
        {craftProcessSteps.map((original, i) => {
          const step = locale === "en" ? english[i] : original;
          return <li key={original.id}>
            <span className="craft-process__index" aria-hidden="true">{original.id}</span>
            <div className="craft-process__body">
              <p className="craft-process__label">{step.kicker}</p>
              <h3>{step.title}</h3>
              {step.status && <p className="craft-process__optional">{step.status.text}</p>}
              <ul className="craft-process__tags" aria-label={locale === "en" ? "Process details" : "Prozessdetails"}>{step.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
              <p className="craft-process__result">{step.result}</p>
              <p className="craft-process__description">{step.description}</p>
            </div>
          </li>;
        })}
      </ol>
    </div>
    <canvas ref={canvas} className="craft-process__laser" aria-hidden="true" hidden />
  </section>;
}
