import { describe, expect, it } from "vitest";
import { searchGlossary } from "@/lib/glossary";

describe("searchGlossary", () => {
  it("recognizes the required original-language terms", () => {
    for (const t of ["logos", "koinonia", "hesed", "agape"]) expect(searchGlossary(t).length).toBeGreaterThan(0);
  });
  it("matches Greek script", () => {
    expect(searchGlossary("λόγος")[0]?.term).toBe("Logos");
  });
});
