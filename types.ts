export enum Grade {
    Fout = 0,
    GoedMoeilijk = 1,
    GoedPrima = 2,
    GoedMakkelijk = 3
}

export interface KaartStaat {
    id: string,
    vraag: string,
    antwoord: string
    fase: fase,
    methodeId: string
    lastReviewed: Date,
    nextReview: Date,
    metaData: Record<string, any>,
}
export enum fase {
    Leer = 0,
    Review = 1,
}
export type kaartWachtrij = KaartStaat[]
export interface leerMethode {
    naam: string,
    description: string,
    aboutLink?: string,
    id: urlSafeString, // MOET URL SAFE ZIJN
    reviewKaart(kaart: KaartStaat, g: Grade, now: Date): KaartStaat,
    filterWachtrijItem(item: KaartStaat): boolean
}
export interface wachrijUpdater {
    naam: string,
    description: string,
    aboutLink?: string,
    id: urlSafeString, // MOET URL SAFE ZIJN
    updateWachtrij(rij: kaartWachtrij, kaart: KaartStaat, g: Grade): kaartWachtrij
}
export type wachtrijUpdater = wachrijUpdater;

export interface gradeMaker {
    naam: string,
    description: string,
    aboutLink?: string,
    id: urlSafeString,
    grade(goed: boolean, start: Date, now: Date, overwrite?: Grade): Grade
}
export class urlSafeString {
    private valueREAL: string;
    constructor(value: string) {
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
            throw new Error("Value must be URL safe (alphanumeric, underscores, or hyphens)");
        }
        this.valueREAL = value;
    }
    toString() {
        return this.valueREAL;
    }

    public get value(): string {
        return this.valueREAL
    }
}

export interface LearnlibState {
    current: KaartStaat | null;
    wachtrij: KaartStaat[];
    isKlaar: boolean;
    initialCount: number;
    progress: number;
}