import { Grade, KaartStaat, LearnlibState, wachtrijUpdater } from "../types";

export class simpleWachtrij implements wachtrijUpdater {
    naam = "simpleWachtrij";
    description = "Verwijder of schuif een random hoeveelheid op";
    aboutLink?: string | undefined = undefined;
    id: string = "simple";

    updateWachtrij(state: LearnlibState, kaart: KaartStaat, g: Grade): LearnlibState {
        let rij = [...state.wachtrij];
        if (g === Grade.Fout) {
            // verwijder eventueel bestaande instantie van deze kaart eerst
            rij = rij.filter(k => k.id !== kaart.id);
            const pos = Math.floor(Math.random() * (rij.length + 1));
            rij.splice(pos, 0, kaart);
        } else {
            rij = rij.filter(k => k.id !== kaart.id);
        }
        return {
            ...state,
            wachtrij: rij,
        };
    }
}