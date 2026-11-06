import { BOOK_NAMES } from "@/lib/bible";

export type SermonPage = { heading: string; content: string };

/** Splits the sermon body into one page per topic (Markdown heading `#`..`###`). */
export function splitTopics(body: string): SermonPage[] {
  const pages: SermonPage[] = [];
  let cur: SermonPage = { heading: "", content: "" };
  for (const line of body.split("\n")) {
    const m = /^\s{0,3}#{1,3}\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      if (cur.heading || cur.content.trim()) pages.push(cur);
      cur = { heading: (m[1] ?? "").replace(/\*\*/g, ""), content: "" };
    } else cur.content += `${line}\n`;
  }
  if (cur.heading || cur.content.trim()) pages.push(cur);
  return pages.map((p) => ({ ...p, content: p.content.trim() }));
}

export type VerseRef = { label: string; book: number; chapter: number; from: number; to: number };

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const ALIAS_LIST: [string, number][] = [
  ...BOOK_NAMES.map((n, i) => [norm(n), i] as [string, number]),
  ["salmo", 18], ["sl", 18], ["cantares", 21], ["cantico dos canticos", 21], ["oseias", 27], ["miqueias", 32], ["mt", 39], ["mc", 40], ["lc", 41], ["jo", 42], ["rm", 44], ["gn", 0], ["is", 22], ["hb", 57], ["ap", 65],
];
const ALIASES = [...ALIAS_LIST].sort((a, b) => b[0].length - a[0].length);

/** Finds references like "João 3:16", "1 Coríntios 13:4-7", "Salmo 23.1" in text. */
export function findReferences(text: string): VerseRef[] {
  const src = norm(text);
  const names = ALIASES.map(([a]) => a.replace(/ /g, "\\s*")).join("|");
  const re = new RegExp(`(?<![a-z])(${names})\\.?\\s+(\\d{1,3})[:.](\\d{1,3})(?:\\s*[-–]\\s*(\\d{1,3}))?`, "g");
  const out: VerseRef[] = [];
  const seen = new Set<string>();
  for (const m of src.matchAll(re)) {
    const key = (m[1] ?? "").replace(/\s+/g, " ");
    const book = ALIASES.find(([a]) => a === key)?.[1];
    if (book === undefined) continue;
    const chapter = Number(m[2]);
    const from = Number(m[3]);
    const to = m[4] ? Math.max(from, Number(m[4])) : from;
    const label = `${BOOK_NAMES[book]} ${chapter}:${from}${to !== from ? `-${to}` : ""}`;
    if (seen.has(label)) continue;
    seen.add(label);
    out.push({ label, book, chapter, from, to });
  }
  return out;
}
