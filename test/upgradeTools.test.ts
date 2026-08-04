import { describe, it, expect } from "bun:test";
import { upgradeTools } from "../upgradeTools";
import { fase } from "../types";

describe("upgradeTools", () => {
    it("fills missing fields with default values", () => {
        const input = {};
        const upgraded = upgradeTools.upgradeList(input);

        expect(upgraded.id).toBe("");
        expect(upgraded.vraag).toBe("");
        expect(upgraded.antwoord).toBe("");
        expect(upgraded.methodeId).toBe("");
        expect(upgraded.fase).toBe(fase.Leer);
        expect(upgraded.lastReviewed instanceof Date).toBe(true);
        expect(upgraded.nextReview instanceof Date).toBe(true);
        expect(upgraded.metaData).toEqual({});
    });

    it("preserves provided fields and converts date strings to Date instances", () => {
        const now = new Date();
        const input = {
            id: "card-123",
            vraag: "Wat is 2+2?",
            antwoord: "4",
            methodeId: "simple",
            fase: fase.Review,
            lastReviewed: now.toISOString(),
            nextReview: now.toISOString(),
            metaData: { learnedCount: 5 }
        };

        const upgraded = upgradeTools.upgradeList(input as any);

        expect(upgraded.id).toBe("card-123");
        expect(upgraded.vraag).toBe("Wat is 2+2?");
        expect(upgraded.antwoord).toBe("4");
        expect(upgraded.methodeId).toBe("simple");
        expect(upgraded.fase).toBe(fase.Review);
        expect(upgraded.lastReviewed.getTime()).toBe(now.getTime());
        expect(upgraded.nextReview.getTime()).toBe(now.getTime());
        expect(upgraded.metaData).toEqual({ learnedCount: 5 });
    });
});
