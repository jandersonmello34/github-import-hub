import { describe, expect, it } from "vitest";
import { alertLevel, formatClock } from "@/lib/pulpit-timer";

describe("pulpit timer", () => {
  it("no alert above 10 minutes", () => expect(alertLevel(10 * 60 + 1)).toBe("normal"));
  it("warning at 10 minutes left", () => expect(alertLevel(10 * 60)).toBe("warning"));
  it("warning above 5 minutes", () => expect(alertLevel(5 * 60 + 1)).toBe("warning"));
  it("red at 5 minutes left", () => expect(alertLevel(5 * 60)).toBe("critical"));
  it("overtime after zero", () => expect(alertLevel(0)).toBe("over"));
  it("overtime remains critical after zero", () => expect(alertLevel(-1)).toBe("over"));
  it("shows overtime with plus sign", () => expect(formatClock(-75)).toBe("+01:15"));
});
