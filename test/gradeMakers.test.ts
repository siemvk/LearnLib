import { describe, it, expect } from "bun:test";
import { verySimple } from "../gradeMakers/verySimple";
import { Grade } from "../types";

describe("verySimple gradeMaker", () => {
    const gm = new verySimple();

    it("has metadata properties set", () => {
        expect(gm.naam).toBe("Erg simple");
        expect(gm.id.toString()).toBe("basic");
        expect(typeof gm.description).toBe("string");
    });

    it("returns GoedPrima when answer is correct", () => {
        const start = new Date();
        const now = new Date();
        expect(gm.grade(true, start, now)).toBe(Grade.GoedPrima);
    });

    it("returns Fout when answer is incorrect", () => {
        const start = new Date();
        const now = new Date();
        expect(gm.grade(false, start, now)).toBe(Grade.Fout);
    });

    it("respects grade overwrite when provided", () => {
        const start = new Date();
        const now = new Date();
        expect(gm.grade(false, start, now, Grade.GoedMakkelijk)).toBe(Grade.GoedMakkelijk);
        expect(gm.grade(true, start, now, Grade.GoedMoeilijk)).toBe(Grade.GoedMoeilijk);
    });
});
