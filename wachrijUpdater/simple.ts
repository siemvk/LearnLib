import { Grade, gradeMaker, KaartStaat, kaartWachtrij, urlSafeString, wachrijUpdater } from "../types";

export class simpleWachtrij implements wachrijUpdater {
    naam = "simpleWachtrij";
    description = "Verwijder of schuif een random hoeveelheid op";
    aboutLink?: string | undefined = undefined;
    id: urlSafeString = new urlSafeString("smple");

    updateWachtrij(rij: kaartWachtrij, kaart: KaartStaat, g: Grade): kaartWachtrij {
        if (g == Grade.Fout) {
            // verwijder eventueel bestaande instantie van deze kaart eerst
            rij = rij.filter(k => k.id !== kaart.id);
            const pos = Math.floor(Math.random() * (rij.length + 1));
            rij.splice(pos, 0, kaart);
            return rij;
        } else {
            return rij.filter(k => k.id !== kaart.id);
        }
    }

}