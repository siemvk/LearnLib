import { describe, it, expect } from "bun:test";
import { checkAnswer } from "../check";

describe("checkAnswer", () => {
	it("returns true for exact match (case-insensitive, trimmed)", () => {
		expect(checkAnswer("Hello", "hello")).toBe(true);
		expect(checkAnswer(" Hello ", "hello")).toBe(true);
	});

	it("handles diacritics when fuckFransen is true", () => {
		expect(checkAnswer("éclair", "eclair", { fuckFransen: true })).toBe(true);
		expect(checkAnswer("à la carte", "a la carte", { fuckFransen: true })).toBe(true);
	});

	it("accepts alternative answers with staAlternatieveAntwoordenToe", () => {
		expect(checkAnswer("a / b", "b", { staAlternatieveAntwoordenToe: true })).toBe(true);
		expect(checkAnswer("a / b", "a", { staAlternatieveAntwoordenToe: true })).toBe(true);
	});

	it("matches optional parts when optioneleAntwoordDelen is true", () => {
		expect(checkAnswer("voetbal (spel)", "voetbal", { optioneleAntwoordDelen: true })).toBe(true);
		expect(checkAnswer("voetbal (spel)", "voetbal spel", { optioneleAntwoordDelen: true })).toBe(true);
	});

	it("handles enkelWoordAlternatieveAntwoorden", () => {
		expect(checkAnswer("kleur rood/blauw", "kleur rood", { enkelWoordAlternatieveAntwoorden: true })).toBe(true);
		expect(checkAnswer("kleur rood/blauw", "kleur blauw", { enkelWoordAlternatieveAntwoorden: true })).toBe(true);
	});

	it("returns false for wrong answer", () => {
		expect(checkAnswer("ja", "nee")).toBe(false);
	});
});
