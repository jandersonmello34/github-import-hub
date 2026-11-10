import { z } from "zod";
import { GLOSSARY } from "@/lib/glossary";
import { DICTIONARY } from "@/lib/bible-dictionary";
import type { QueryClient } from "@tanstack/react-query";

export const strongTermSchema = z.object({
  id: z.string().regex(/^[GH][1-9]\d*$/),
  language: z.enum(["greek", "hebrew"]),
  originalWord: z.string().min(1), transliteration: z.string().min(1),
  pronunciation: z.string(), definition: z.string().min(1),
  kjvOccurrences: z.string(), theologicalNotes: z.string(),
}).strict().refine((e) => e.id.startsWith(e.language === "greek" ? "G" : "H"), "Idioma incompatível com o código Strong");
export type StrongTerm = z.infer<typeof strongTermSchema>;
export type StrongResult = { entry: StrongTerm; source: "local" | "ai" };

export const normalizeStrongQuery = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase().replace(/^([gh])\s*0*(\d+)$/, "$1$2");

const localEntries = [
  ...GLOSSARY.map((e) => ({ ...e, notes: "" })),
  ...DICTIONARY.map((e) => ({ ...e, notes: e.typology ?? "" })),
].filter((e) => e.strong && e.original && e.transliteration);

export function findLocalStrongTerm(query: string): StrongTerm | undefined {
  const n = normalizeStrongQuery(query);
  if (!n) return;
  const e = localEntries.find((e) => [e.term, e.original, e.transliteration, e.strong].some((v) => v && normalizeStrongQuery(v) === n));
  if (!e?.strong || !e.original || !e.transliteration) return;
  return { id: e.strong, language: e.strong.startsWith("G") ? "greek" : "hebrew", originalWord: e.original,
    transliteration: e.transliteration, pronunciation: "", definition: e.definition,
    kjvOccurrences: "", theologicalNotes: e.notes };
}

export async function resolveStrongTerm(client: QueryClient, query: string, lookup: (term: string) => Promise<StrongTerm>): Promise<StrongResult> {
  const local = findLocalStrongTerm(query);
  if (local) return { entry: local, source: "local" };
  const key = normalizeStrongQuery(query);
  if (!key) throw new Error("Digite uma palavra ou código Strong.");
  const entry = await client.fetchQuery({ queryKey: ["strong-term", key], staleTime: Infinity, gcTime: Infinity,
    retry: false, queryFn: async () => strongTermSchema.parse(await lookup(query.trim())) });
  for (const alias of [entry.id, entry.originalWord, entry.transliteration]) {
    client.setQueryData(["strong-term", normalizeStrongQuery(alias)], entry);
  }
  return { entry, source: "ai" };
}