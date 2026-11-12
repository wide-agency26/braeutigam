const JOURNEY = [
  ["2016", "Founded"],
  ["2019", "More space"],
  ["2020", "Monocoque construction"],
  ["2021", "Development and manufacturing"],
  ["2022", "Growth and recognition"],
  ["2024", "Powered by Brabus"],
  ["2026", "80+ experts"],
] as const;

/** Readable while the animated timeline loads, or when motion is reduced. */
export default function TimelineSummary() {
  return <section className="site-container py-16" aria-label="Company history">
    <h2 className="mb-6 text-3xl uppercase">Our journey &amp; history</h2>
    <ol className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
      {JOURNEY.map(([year, title]) => <li key={year} className="border-t border-zinc-300 py-5 dark:border-zinc-700">
        <p className="font-mono text-sm font-bold text-brand-neon">{year}</p>
        <h3 className="mt-2 font-sans text-xl uppercase">{title}</h3>
      </li>)}
    </ol>
  </section>;
}
