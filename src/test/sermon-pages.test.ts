import { describe, expect, it } from "vitest";
import { findReferences, splitTopics } from "@/lib/sermon-pages";

describe("splitTopics", () => {
  it("makes one page per heading", () => {
    const p = splitTopics("Intro\n## Tópico 1\nA\n## Tópico 2\nB");
    expect(p.map((x) => x.heading)).toEqual(["", "Tópico 1", "Tópico 2"]);
  });
});
describe("findReferences", () => {
  it("finds cited verses", () => {
    expect(findReferences("Leia João 3:16 e 1 Coríntios 13:4-7.").map((r) => r.label)).toEqual(["João 3:16", "1 Coríntios 13:4-7"]);
  });
});
