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

export type kaartSnapshot = {
    kaartId: string,
    date: Date,
    antwoord: string,
    goed: Grade
}

export enum fase {
    Leer = 0,
    Review = 1,
}

export type kaartWachtrij = KaartStaat[];

export interface leerMethode {
    naam: string,
    description: string,
    aboutLink?: string,
    id: string,
    reviewKaart(kaart: KaartStaat, g: Grade, now: Date, state: LearnlibState): KaartStaat,
    filterWachtrijItem(item: KaartStaat): boolean
}
export interface wachtrijUpdater {
    naam: string,
    description: string,
    aboutLink?: string,
    id: string,
    updateWachtrij(state: LearnlibState, kaart: KaartStaat, g: Grade): LearnlibState
}

export interface gradeMaker {
    naam: string,
    description: string,
    aboutLink?: string,
    id: string,
    grade(goed: boolean, start: Date, now: Date, overwrite?: Grade): Grade
}

export interface LearnlibState {
    current: KaartStaat | null;
    wachtrij: KaartStaat[];
    isKlaar: boolean;
    initialCount: number;
    progress: number;
    history: kaartSnapshot[];
}