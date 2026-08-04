import { describe, it, expect } from "bun:test";
import { checkAnswer } from "../check";

describe("checkAnswer", () => {
    describe("Default behavior (exact match)", () => {
        it("matches exact string ignoring case and surrounding whitespace", () => {
            expect(checkAnswer("Parijs", "parijs")).toBe(true);
            expect(checkAnswer("  Parijs  ", "parijs")).toBe(true);
            expect(checkAnswer("Parijs", "  PARIJS  ")).toBe(true);
        });

        it("returns false for incorrect answer", () => {
            expect(checkAnswer("Parijs", "Londen")).toBe(false);
            expect(checkAnswer("Parijs", "Parijs!")) .toBe(false);
        });
    });

    describe("fuckFransen option (diacritics removal)", () => {
        it("strips accents when fuckFransen is true", () => {
            expect(checkAnswer("électricités", "electricites", { fuckFransen: true })).toBe(true);
            expect(checkAnswer("déjà vu", "deja vu", { fuckFransen: true })).toBe(true);
            expect(checkAnswer("garçon", "garcon", { fuckFransen: true })).toBe(true);
        });

        it("fails without fuckFransen option if accents mismatch", () => {
            expect(checkAnswer("électricités", "electricites")).toBe(false);
        });
    });

    describe("staAlternatieveAntwoordenToe option", () => {
        it("matches any slash-separated option", () => {
            const config = { staAlternatieveAntwoordenToe: true };
            expect(checkAnswer("hond / kat / konijn", "hond", config)).toBe(true);
            expect(checkAnswer("hond / kat / konijn", "kat", config)).toBe(true);
            expect(checkAnswer("hond / kat / konijn", "konijn", config)).toBe(true);
            expect(checkAnswer("hond / kat / konijn", "cavia", config)).toBe(false);
        });
    });

    describe("optioneleAntwoordDelen option", () => {
        it("matches answer with or without optional parts in parentheses", () => {
            const config = { optioneleAntwoordDelen: true };
            expect(checkAnswer("voetbal (spel)", "voetbal", config)).toBe(true);
            expect(checkAnswer("voetbal (spel)", "voetbal spel", config)).toBe(true);
            expect(checkAnswer("voetbal (spel)", "tennis", config)).toBe(false);
        });
    });

    describe("enkelWoordAlternatieveAntwoorden option", () => {
        it("matches single-word slash alternatives in sentences", () => {
            const config = { enkelWoordAlternatieveAntwoorden: true };
            expect(checkAnswer("hij/zij loopt", "hij loopt", config)).toBe(true);
            expect(checkAnswer("hij/zij loopt", "zij loopt", config)).toBe(true);
            expect(checkAnswer("hij/zij loopt", "het loopt", config)).toBe(false);
        });
    });

    describe("Combined options", () => {
        it("handles diacritics and alternatives combined", () => {
            const config = {
                fuckFransen: true,
                staAlternatieveAntwoordenToe: true,
                optioneleAntwoordDelen: true
            };
            expect(checkAnswer("électricités / (le) café", "electricites", config)).toBe(true);
            expect(checkAnswer("électricités / (le) café", "le cafe", config)).toBe(true);
            expect(checkAnswer("électricités / (le) café", "cafe", config)).toBe(true);
        });
    });
});
