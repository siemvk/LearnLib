import { describe, it, expect } from "bun:test";
import { simpleWachtrij } from "../wachrijUpdater/simple";
import { Grade, KaartStaat, LearnlibState, fase } from "../types";

describe("simpleWachtrij", () => {
    const updater = new simpleWachtrij();

    const createDummyState = (wachtrij: KaartStaat[]): LearnlibState => ({
        current: wachtrij[0] ?? null,
        wachtrij,
        isKlaar: wachtrij.length === 0,
        initialCount: wachtrij.length,
        progress: 0,
        history: []
    });

    it("has metadata properties set", () => {
        expect(updater.naam).toBe("simpleWachtrij");
        expect(updater.id.toString()).toBe("simple");
        expect(typeof updater.description).toBe("string");
    });

    it("removes card from queue when grade is not Grade.Fout", () => {
        const k1: KaartStaat = { id: "1", vraag: "v1", antwoord: "a1", fase: fase.Leer, methodeId: "simple", lastReviewed: new Date(), nextReview: new Date(), metaData: {} };
        const k2: KaartStaat = { id: "2", vraag: "v2", antwoord: "a2", fase: fase.Leer, methodeId: "simple", lastReviewed: new Date(), nextReview: new Date(), metaData: {} };
        const state = createDummyState([k1, k2]);

        const updated = updater.updateWachtrij(state, k1, Grade.GoedPrima);
        expect(updated.wachtrij.find(k => k.id === "1")).toBeUndefined();
        expect(updated.wachtrij.length).toBe(1);
    });

    it("re-inserts card at random position when grade is Grade.Fout", () => {
        const k1: KaartStaat = { id: "1", vraag: "v1", antwoord: "a1", fase: fase.Leer, methodeId: "simple", lastReviewed: new Date(), nextReview: new Date(), metaData: {} };
        const k2: KaartStaat = { id: "2", vraag: "v2", antwoord: "a2", fase: fase.Leer, methodeId: "simple", lastReviewed: new Date(), nextReview: new Date(), metaData: {} };
        const state = createDummyState([k1, k2]);

        const updated = updater.updateWachtrij(state, k1, Grade.Fout);
        expect(updated.wachtrij.some(k => k.id === "1")).toBe(true);
        expect(updated.wachtrij.length).toBe(2);
    });
});

