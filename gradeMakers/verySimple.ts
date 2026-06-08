import { checkAnswer } from "../check";
import { Grade, gradeMaker, urlSafeString } from "../types";

export class verySimple implements gradeMaker {
    id: urlSafeString = new urlSafeString("basic")
    description: string = "Altijd fout of prima. Niet goed met FSRS";
    naam: string = "Erg simple";
    grade(goed: boolean, start: Date, now: Date, overwrite?: Grade): Grade {
        if (overwrite) {
            return overwrite
        } else {
            if (goed) {
                return Grade.GoedPrima
            } else {
                return Grade.Fout
            }
        }
    }
}