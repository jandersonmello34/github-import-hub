import { describe, expect, it } from "vitest";
import { type IdeaDirections, withOriginalKeywords } from "@/lib/types";

const base: IdeaDirections = {
  passages: [{ reference: "João 3:16", reason: "amor de Deus" }],
  context: "Contexto",
  relatedVerses: [{ reference: "Romanos 5:8", note: "prova de amor" }],
  angles: [{ title: "A", thesis: "t", basis: "b" }],
  suggestedFormat: "tematico",
  formatReason: "r",
  originalKeywords: [
    { word: "Agape", original: "ἀγάπη", strongCode: "G26", meaning: "amor que se doa" },
  ],
};

describe("original-language keywords", () => {
  it("keeps the keywords the AI returned", () => {
    const d = withOriginalKeywords(base);
    expect(d.originalKeywords).toHaveLength(1);
    expect(d.originalKeywords[0]).toMatchObject({ word: "Agape", original: "ἀγάπη", strongCode: "G26" });
  });

  it("yields an empty list when the reply omits the field", () => {
    const { originalKeywords: _omitted, ...withoutField } = base;
    const d = withOriginalKeywords(withoutField as unknown as IdeaDirections);
    expect(d.originalKeywords).toEqual([]);
  });

  it("yields an empty list when the field is not an array", () => {
    const d = withOriginalKeywords({ ...base, originalKeywords: null } as unknown as IdeaDirections);
    expect(d.originalKeywords).toEqual([]);
  });
});
