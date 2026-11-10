import { describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { findLocalStrongTerm, resolveStrongTerm, strongTermSchema } from "@/lib/strong";

const remote = { id: "H7225", language: "hebrew" as const, originalWord: "רֵאשִׁית", transliteration: "reshith", pronunciation: "ray-sheeth", definition: "Começo, princípio.", kjvOccurrences: "beginning", theologicalNotes: "O contexto determina o sentido." };
describe("Strong lookup", () => {
  it("prioritizes local G26 without an AI request", async () => {
    const lookup = vi.fn();
    const r = await resolveStrongTerm(new QueryClient(), "G26", lookup);
    expect(r.entry.id).toBe("G26"); expect(r.source).toBe("local"); expect(lookup).not.toHaveBeenCalled();
  });
  it("recognizes Portuguese, Greek and Hebrew locally", () => {
    expect(findLocalStrongTerm("Graça")?.id).toBe("G5485");
    expect(findLocalStrongTerm("ἀγάπη")?.id).toBe("G26");
    expect(findLocalStrongTerm("שלום")?.id).toBe("H7965");
  });
  it("fetches absent H7225 once and caches repeated searches and original aliases", async () => {
    const client = new QueryClient(); const lookup = vi.fn().mockResolvedValue(remote);
    expect((await resolveStrongTerm(client, "H7225", lookup)).entry).toEqual(remote);
    await resolveStrongTerm(client, "h7225", lookup);
    await resolveStrongTerm(client, "רֵאשִׁית", lookup);
    expect(lookup).toHaveBeenCalledTimes(1);
  });
  it("does not cache failures, allowing a user-requested retry", async () => {
    const client = new QueryClient(); const lookup = vi.fn().mockRejectedValueOnce(new Error("indisponível")).mockResolvedValueOnce(remote);
    await expect(resolveStrongTerm(client, "H7225", lookup)).rejects.toThrow("indisponível");
    expect((await resolveStrongTerm(client, "H7225", lookup)).entry.id).toBe("H7225");
    expect(lookup).toHaveBeenCalledTimes(2);
  });
  it("rejects fabricated or mismatched code-language pairs", () => {
    expect(strongTermSchema.safeParse({ ...remote, id: "" }).success).toBe(false);
    expect(strongTermSchema.safeParse({ ...remote, language: "greek" }).success).toBe(false);
  });
});