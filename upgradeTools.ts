import { KaartStaat } from "./types";

export const upgradeTools = {
    upgradeList(lijst: Partial<KaartStaat>) {
        // upgrade de lijst zodat hij voldoet aan de nieuwste versie van KaartStaat
        const upgraded: KaartStaat = {
            id: lijst.id ?? "",
            vraag: lijst.vraag ?? "",
            antwoord: lijst.antwoord ?? "",
            methodeId: lijst.methodeId ?? "",
            fase: lijst.fase ?? 0,
            lastReviewed: lijst.lastReviewed ? new Date(lijst.lastReviewed) : new Date(),
            nextReview: lijst.nextReview ? new Date(lijst.nextReview) : new Date(),
            metaData: lijst.metaData ?? {},
        }
        return upgraded
    }
}