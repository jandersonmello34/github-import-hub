import { describe, expect, it } from "vitest";
import { BIBLE_DICTIONARY, searchDictionary } from "@/lib/bible-dictionary";
describe("dicionário bíblico", () => {
  it("só usa fontes de domínio público", () => {
    for (const e of BIBLE_DICTIONARY) expect(["Easton", "Hitchcock", "Strong"]).toContain(e.source);
  });
  it("busca sem acento e filtra por letra", () => {
    expect(searchDictionary("belem")[0]?.term).toBe("Belém");
    expect(searchDictionary("", "lugar", "J").map((e) => e.term)).toEqual(["Jericó", "Jerusalém", "Jordão"]);
  });
  it("acha por número Strong e transliteração", () => {
    expect(searchDictionary("G3056")[0]?.term).toBe("Logos");
    expect(searchDictionary("agape").map((e) => e.term)).toContain("Ágape");
  });
  it("verbetes relacionados existem no dicionário", () => {
    const terms = new Set(BIBLE_DICTIONARY.map((e) => e.term));
    for (const e of BIBLE_DICTIONARY) for (const r of e.related ?? []) expect(terms, `${e.term} → ${r}`).toContain(r);
  });
});
