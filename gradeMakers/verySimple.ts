import { Grade, gradeMaker } from "../types";

export class verySimple implements gradeMaker {
    id: string = "basic";
    description: string = "Altijd fout of prima. Niet goed met FSRS";
    naam: string = "Erg simple";
    grade(goed: boolean, start: Date, now: Date, overwrite?: Grade): Grade {
        if (overwrite !== undefined) {
            return overwrite;
        } else {
            if (goed) {
                return Grade.GoedPrima;
            } else {
                return Grade.Fout;
            }
        }
    }
}