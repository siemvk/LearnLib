import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import Learnlib from "../index";
import { verySimple } from "../gradeMakers/verySimple";
import { simpleMethode } from "../methodes/simple";
import { simpleWachtrij } from "../wachrijUpdater/simple";
import { Grade } from "../types";

describe("gradeMakers, methodes, wachtrij and Learnlib", () => {
    it("verySimple gradeMaker respects overwrite and default behavior", () => {
        const gm = new verySimple();
        const now = new Date();
        expect(gm.grade(true, now, now)).toBe(Grade.GoedPrima);
        expect(gm.grade(false, now, now)).toBe(Grade.Fout);
        expect(gm.grade(false, now, now, Grade.GoedMakkelijk)).toBe(Grade.GoedMakkelijk);
    });

    it("simpleMethode reviewKaart toggles metaData and sets nextReview", () => {
        const m = new simpleMethode();
        const kaart: any = {
            id: "k1",
            vraag: "v",
            antwoord: "a",
            fase: 0,
            methodeId: "simple",
            lastReviewed: new Date(0),
            nextReview: new Date(0),
            metaData: {}
        };
        const now = new Date();
        const updated = m.reviewKaart(kaart, Grade.GoedPrima, now);
        expect(updated.nextReview.getTime()).toBe(now.getTime());
        expect(updated.metaData["geleerd"]).toBe(true);

        const updatedFail = m.reviewKaart(kaart, Grade.Fout, now);
        expect(updatedFail.nextReview.getTime()).toBe(now.getTime());
    });

    it("simpleMethode filterWachtrijItem returns according to metaData.geleerd", () => {
        const m = new simpleMethode();
        const item: any = { metaData: { geleerd: true } };
        expect(m.filterWachtrijItem(item)).toBe(true);
        item.metaData.geleerd = false;
        expect(m.filterWachtrijItem(item)).toBe(false);
    });

    it("simpleWachtrij updateWachtrij removes or inserts based on grade", () => {
        const updater = new simpleWachtrij();
        const kaart: any = { id: "k1" };
        // non-error grade should remove kaart
        let rij: any[] = [{ id: "k1" }, { id: "k2" }];
        let res = updater.updateWachtrij(rij, kaart, Grade.GoedPrima);
        expect(res.find(k => k.id === "k1")).toBe(undefined);

        // error grade should insert kaart at deterministic position
        const realMathRandom = Math.random;
        Math.random = () => 0.5; // deterministic
        rij = [{ id: "k2" }];
        res = updater.updateWachtrij(rij, kaart, Grade.Fout);
        expect(res.some(k => k.id === "k1")).toBe(true);
        Math.random = realMathRandom;
    });

    it("Learnlib constructor validates methodeId and antwoord updates state and calls updater", () => {
        const kaart: any = {
            id: "1",
            vraag: "q",
            antwoord: "a",
            fase: 0,
            methodeId: "simple",
            lastReviewed: new Date(0),
            nextReview: new Date(0),
            metaData: {}
        };

        const methode = {
            id: { toString: () => "simple" },
            reviewKaart: (k: any, g: Grade, now: Date) => {
                k.metaData.geleerd = true;
                k.lastReviewed = now;
                return k;
            }
        } as any;

        let updaterCalled = false;
        const wachtrijUpdater = {
            updateWachtrij: (rij: any[], k: any, g: Grade) => {
                updaterCalled = true;
                return rij;
            }
        } as any;

        const grader = { grade: (_goed: boolean, _s: Date, _n: Date) => Grade.GoedPrima } as any;

        const lib = new Learnlib([kaart], methode, grader, wachtrijUpdater);
        // calling antwoord should update current and call updater
        lib.antwoord("a");
        expect(updaterCalled).toBe(true);

        // constructor throws when methode mismatch
        const badKaart = { ...kaart, methodeId: "other" };
        expect(() => new Learnlib([badKaart], methode, grader, wachtrijUpdater)).toThrow();
    });
});
