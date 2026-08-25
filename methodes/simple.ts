import { Grade, KaartStaat, LearnlibState, leerMethode } from "../types";

export class simpleMethode implements leerMethode {
    naam: string = "Simple";
    id: string = "simple";
    description: string = "Simple leren. Gewoon zoals elk ander platfrom";
    reviewKaart(kaart: KaartStaat, g: Grade, now: Date = new Date(), state?: LearnlibState): KaartStaat {
        // als fout
        if (g === Grade.Fout) {
            kaart.nextReview = now
            return kaart
        }
        kaart.nextReview = now
        kaart.metaData["geleerd"] = true
        return kaart
    }
    filterWachtrijItem(item: KaartStaat): boolean {
        if (item.metaData["geleerd"] == true) {
            return true
        } else {
            return false
        }
    }
}