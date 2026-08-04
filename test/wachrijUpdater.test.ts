import { describe, it, expect } from "bun:test";
import { simpleWachtrij } from "../wachrijUpdater/simple";
import { Grade, KaartStaat, fase } from "../types";

describe("simpleWachtrij", () => {
    const updater = new simpleWachtrij();

    it("has metadata properties set", () => {
        expect(updater.naam).toBe("simpleWachtrij");
        expect(updater.id.toString()).toBe("smple");
        expect(typeof updater.description).toBe("string");
    });

    it("removes card from queue when grade is not Grade.Fout", () => {
        const k1: KaartStaat = { id: "1", vraag: "v1", antwoord: "a1", fase: fase.Leer, methodeId: "simple", lastReviewed: new Date(), nextReview: new Date(), metaData: {} };
        const k2: KaartStaat = { id: "2", vraag: "v2", antwoord: "a2", fase: fase.Leer, methodeId: "simple", lastReviewed: new Date(), nextReview: new Date(), metaData: {} };
        const rij = [k1, k2];

        const updated = updater.updateWachtrij(rij, k1, Grade.GoedPrima);
        expect(updated.find(k => k.id === "1")).toBeUndefined();
        expect(updated.length).toBe(1);
    });

    it("re-inserts card at random position when grade is Grade.Fout", () => {
        const k1: KaartStaat = { id: "1", vraag: "v1", antwoord: "a1", fase: fase.Leer, methodeId: "simple", lastReviewed: new Date(), nextReview: new Date(), metaData: {} };
        const k2: KaartStaat = { id: "2", vraag: "v2", antwoord: "a2", fase: fase.Leer, methodeId: "simple", lastReviewed: new Date(), nextReview: new Date(), metaData: {} };
        const rij = [k1, k2];

        const updated = updater.updateWachtrij(rij, k1, Grade.Fout);
        expect(updated.some(k => k.id === "1")).toBe(true);
        expect(updated.length).toBe(2);
    });
});
