import { describe, it, expect } from "bun:test";
import Learnlib, { methodes, gradeMakers, wachtrijUpdaters } from "../index";
import { simpleMethode } from "../methodes/simple";
import { verySimple } from "../gradeMakers/verySimple";
import { simpleWachtrij } from "../wachrijUpdater/simple";
import { KaartStaat, Grade, fase } from "../types";

describe("Learnlib main class", () => {
    function createDummyKaart(id: string, vraag: string = "Vraag", antwoord: string = "Antwoord", methodeId: string = "simple"): KaartStaat {
        return {
            id,
            vraag,
            antwoord,
            fase: fase.Leer,
            methodeId,
            lastReviewed: new Date(),
            nextReview: new Date(),
            metaData: {}
        };
    }

    it("initializes correctly and upgrades cards missing methodeId", () => {
        const partialKaart: any = {
            id: "card-1",
            vraag: "Wat is de hoofdstad van Frankrijk?",
            antwoord: "Parijs"
        };

        const methode = new simpleMethode();
        const grader = new verySimple();
        const updater = new simpleWachtrij();

        const lib = new Learnlib([partialKaart], methode, grader, updater);

        expect(lib.wachtrij.length).toBe(1);
        expect(lib.current.id).toBe("card-1");
        expect(lib.current.methodeId).toBe("simple");
    });

    it("throws an error if card methodeId does not match learning methode", () => {
        const kaart = createDummyKaart("1", "Vraag", "Antwoord", "wrong-methode");
        const methode = new simpleMethode();
        const grader = new verySimple();
        const updater = new simpleWachtrij();

        expect(() => new Learnlib([kaart], methode, grader, updater)).toThrow("ERROR: Verkeerde methode");
    });

    it("processes correct answers via antwoord()", () => {
        const k1 = createDummyKaart("1", "Wat is 1+1?", "2");
        const k2 = createDummyKaart("2", "Wat is 2+2?", "4");

        const methode = new simpleMethode();
        const grader = new verySimple();
        const updater = new simpleWachtrij();

        const lib = new Learnlib([k1, k2], methode, grader, updater);
        const initialCurrentId = lib.current.id;

        lib.antwoord(lib.current.antwoord); // guaranteed correct answer for whichever card is current

        // After answering correctly, the answered card should be removed from queue by simpleWachtrij
        expect(lib.wachtrij.length).toBe(1);
        expect(lib.current.id).not.toBe(initialCurrentId);
    });

    it("processes wrong answers via antwoord()", () => {
        const k1 = createDummyKaart("1", "Wat is 1+1?", "2");

        const methode = new simpleMethode();
        const grader = new verySimple();
        const updater = new simpleWachtrij();

        const lib = new Learnlib([k1], methode, grader, updater);

        lib.antwoord("wrong answer");

        // SimpleWachtrij re-inserts wrong card back into queue
        expect(lib.wachtrij.length).toBe(1);
        expect(lib.current.id).toBe("1");
    });

    it("supports grade overwrite in antwoord()", () => {
        const k1 = createDummyKaart("1", "Wat is 1+1?", "2");
        const methode = new simpleMethode();
        const grader = new verySimple();
        const updater = new simpleWachtrij();

        const lib = new Learnlib([k1], methode, grader, updater);

        // Force grade to Fout even if answer is right
        lib.antwoord("2", Grade.Fout);
        expect(lib.wachtrij.length).toBe(1);
    });

    it("reshuffle() reorganizes the queue and sets current", () => {
        const kaarten = [
            createDummyKaart("1"),
            createDummyKaart("2"),
            createDummyKaart("3")
        ];

        const lib = new Learnlib(kaarten, new simpleMethode(), new verySimple(), new simpleWachtrij());

        lib.reshuffle();
        expect(lib.wachtrij.length).toBe(3);
        expect(lib.current).toBe(lib.wachtrij[0]);
    });

    it("exports default arrays of methodes, gradeMakers and wachtrijUpdaters", () => {
        expect(Array.isArray(methodes)).toBe(true);
        expect(methodes.length).toBeGreaterThan(0);

        expect(Array.isArray(gradeMakers)).toBe(true);
        expect(gradeMakers.length).toBeGreaterThan(0);

        expect(Array.isArray(wachtrijUpdaters)).toBe(true);
        expect(wachtrijUpdaters.length).toBeGreaterThan(0);
    });
});
