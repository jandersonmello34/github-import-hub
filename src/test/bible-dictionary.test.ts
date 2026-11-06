import { describe, expect, it } from "vitest";
import { BIBLE_DICTIONARY, searchDictionary } from "@/lib/bible-dictionary";
describe("dicionário bíblico", () => {
  it("só usa fontes de domínio público", () => {
    for (const e of BIBLE_DICTIONARY) expect(["Easton", "Hitchcock", "Strong"]).toContain(e.source);
  });
  it("busca sem acento e filtra por letra", () => {
    expect(searchDictionary("belem")[0]?.term).toBe("Belém");
    expect(searchDictionary("", "lugar", "J").map((e) => e.term)).toEqual(["Jerusalém", "Jordão"]);
  });
});
