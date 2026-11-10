import { describe, expect, it } from "vitest";
import { resolveFormat } from "@/lib/sermon-format";

describe("format selection", () => {
  it("follows the AI suggestion while Automatic is selected", () => {
    expect(resolveFormat({ auto: true, manual: "tematico", suggested: "expositivo" })).toBe("expositivo");
  });

  it("keeps the preacher's own pick when he chooses a format", () => {
    expect(resolveFormat({ auto: false, manual: "biografico", suggested: "expositivo" })).toBe("biografico");
  });

  it("is Automatic by default, so the suggested format is the one used", () => {
    const auto = true; // the wizard starts with Automatic selected
    expect(resolveFormat({ auto, manual: "tematico", suggested: "textual" })).toBe("textual");
  });
});
