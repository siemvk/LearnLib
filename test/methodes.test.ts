import { describe, it, expect } from "bun:test";
import { simpleMethode } from "../methodes/simple";
import { Grade, KaartStaat, fase } from "../types";

describe("simpleMethode", () => {
    const methode = new simpleMethode();

    it("has metadata properties set", () => {
        expect(methode.naam).toBe("Simple");
        expect(methode.id.toString()).toBe("simple");
        expect(typeof methode.description).toBe("string");
    });

    it("reviewKaart sets nextReview to now on Grade.Fout without setting geleerd", () => {
        const kaart: KaartStaat = {
            id: "1",
            vraag: "Vraag",
            antwoord: "Antwoord",
            fase: fase.Leer,
            methodeId: "simple",
            lastReviewed: new Date(0),
            nextReview: new Date(0),
            metaData: {}
        };
        const now = new Date();
        const updated = methode.reviewKaart({ ...kaart }, Grade.Fout, now);

        expect(updated.nextReview.getTime()).toBe(now.getTime());
        expect(updated.metaData["geleerd"]).toBeUndefined();
    });

    it("reviewKaart sets geleerd=true in metadata for passing grades", () => {
        const kaart: KaartStaat = {
            id: "1",
            vraag: "Vraag",
            antwoord: "Antwoord",
            fase: fase.Leer,
            methodeId: "simple",
            lastReviewed: new Date(0),
            nextReview: new Date(0),
            metaData: {}
        };
        const now = new Date();
        const updated = methode.reviewKaart({ ...kaart }, Grade.GoedPrima, now);

        expect(updated.nextReview.getTime()).toBe(now.getTime());
        expect(updated.metaData["geleerd"]).toBe(true);
    });

    it("filterWachtrijItem filters items based on geleerd metadata", () => {
        const kaartLearned: KaartStaat = {
            id: "1",
            vraag: "Vraag",
            antwoord: "Antwoord",
            fase: fase.Leer,
            methodeId: "simple",
            lastReviewed: new Date(),
            nextReview: new Date(),
            metaData: { geleerd: true }
        };
        const kaartNotLearned: KaartStaat = {
            id: "2",
            vraag: "Vraag 2",
            antwoord: "Antwoord 2",
            fase: fase.Leer,
            methodeId: "simple",
            lastReviewed: new Date(),
            nextReview: new Date(),
            metaData: {}
        };

        expect(methode.filterWachtrijItem(kaartLearned)).toBe(true);
        expect(methode.filterWachtrijItem(kaartNotLearned)).toBe(false);
    });
});
