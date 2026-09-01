const UMLAUTS: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
  æ: "ae",
  ø: "oe",
  å: "aa",
};

export function slugify(input: string) {
  const folded = input
    .trim()
    .toLowerCase()
    .replace(/[äöüßæøå]/g, (ch) => UMLAUTS[ch] ?? ch)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 75);

  return folded || "stelle";
}

export async function uniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
) {
  let slug = slugify(base);
  if (!(await isTaken(slug))) return slug;

  for (let n = 2; n < 100; n += 1) {
    const candidate = `${slug.slice(0, 70)}-${n}`;
    if (!(await isTaken(candidate))) return candidate;
  }

  return `${slug.slice(0, 60)}-${Date.now().toString(36)}`;
}
