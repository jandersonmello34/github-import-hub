import { describe, expect, it } from "vitest";
import { findReferences, splitTopics } from "@/lib/sermon-pages";

describe("splitTopics", () => {
  it("makes one page per heading", () => {
    const p = splitTopics("Intro\n## Tópico 1\nA\n## Tópico 2\nB");
    expect(p.map((x) => x.heading)).toEqual(["", "Tópico 1", "Tópico 2"]);
  });
  it("fills the main-points overview with topic titles, not conclusion or subpoints", () => {
    const pages = splitTopics("## Introdução\nOlá\n## Pontos principais\n### 1. Primeiro Tópico\nA\n#### Detalhe\nD\n### 2. Segundo Tópico\nB\n### 3. Terceiro Tópico\nC\n## Conclusão\nFim");
    expect(pages[1]?.overview).toEqual(["Primeiro Tópico", "Segundo Tópico", "Terceiro Tópico"]);
    expect(pages[2]?.content).toBe("A");
  });
  it("handles main points at the same heading level", () => {
    const pages = splitTopics("## **Pontos principais:**\n## 1. Primeiro Tópico\nA\n## 2. Segundo Tópico\nB\n## Apelo\nFim");
    expect(pages[0]?.overview).toEqual(["Primeiro Tópico", "Segundo Tópico"]);
  });
});
describe("findReferences", () => {
  it("finds cited verses", () => {
    expect(findReferences("Leia João 3:16 e 1 Coríntios 13:4-7.").map((r) => r.label)).toEqual(["João 3:16", "1 Coríntios 13:4-7"]);
  });
});
