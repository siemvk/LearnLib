import { Grade, KaartStaat, LearnlibState, leerMethode } from "../types";

const W = [
    0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925,
    1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
];

export type dagen = number;

const F: number = 19.0 / 81.0;
const C: number = -0.5;

export function initialMoeilijkheid(g: Grade): number {
    const gNum = g as number; // 0..3
    const d = W[4] - Math.exp(W[5] * gNum) + 1.0;
    return Math.min(Math.max(d, 1.0), 10.0);
}

export function initialStabielheid(g: Grade): number {
    return W[g as number]; // W[0..3]
}

function deltaD(g: Grade): number {
    const gNum = g as number; // 0..3 (komt overeen met G in 1..4, dus G - 3 = g - 2)
    return -W[6] * (gNum - 2.0);
}

function dp(d: number, g: Grade): number {
    return d + deltaD(g) * ((10.0 - d) / 9.0);
}

export function moeilijkheidBerekenen(d: number, g: Grade): number {
    const defaultD0 = initialMoeilijkheid(Grade.GoedPrima); // D_0(Good / Rating 3)
    const next = W[7] * defaultD0 + (1.0 - W[7]) * dp(d, g);
    return Math.min(Math.max(next, 1.0), 10.0);
}

export function terughaalbaarheidBerekenen(t: dagen, s: number): number {
    return Math.pow(1.0 + F * (t / s), C);
}

export function volgendeReview(r_d: number, s: number): dagen {
    return (s / F) * (Math.pow(r_d, 1.0 / C) - 1.0);
}

export function stabielheidOpGoed(d: number, s: number, r: number, g: Grade): number {
    const t_d = 11.0 - d;
    const t_s = Math.pow(s, -W[9]);
    const t_r = Math.exp(W[10] * (1.0 - r)) - 1.0;
    const h = g === Grade.GoedMoeilijk ? W[15] : 1.0;
    const b = g === Grade.GoedMakkelijk ? W[16] : 1.0;
    const c = Math.exp(W[8]);
    const alpha = 1.0 + t_d * t_s * t_r * h * b * c;
    return s * alpha;
}

export function stabielheidOpFout(d: number, s: number, r: number): number {
    const d_f = Math.pow(d, -W[12]);
    const s_f = Math.pow(s + 1.0, W[13]) - 1.0;
    const r_f = Math.exp(W[14] * (1.0 - r));
    const c_f = W[11];
    const s_new = d_f * s_f * r_f * c_f;
    return Math.max(0.1, Math.min(s_new, s));
}

export function stabielheidBerekenen(d: number, s: number, r: number, g: Grade): number {
    if (g === Grade.Fout) {
        return stabielheidOpFout(d, s, r);
    }
    return stabielheidOpGoed(d, s, r, g);
}

export class fsrs implements leerMethode {
    id = "fsrs";
    naam: string = "FSRS, langetermijn";
    description: string = "Voor wanneer je alle tijd hebt en iets echt goed wil onthouden";

    filterWachtrijItem(item: KaartStaat): boolean {
        return true;
    }

    reviewKaart(kaart: KaartStaat, g: Grade, now: Date = new Date(), state?: LearnlibState): KaartStaat {
        const targetR: number = 0.9;
        const isEersteKeer = kaart.metaData.stabielheid === undefined || kaart.metaData.moeilijkheid === undefined;

        let nextS: number;
        let nextD: number;

        if (isEersteKeer) {
            nextS = initialStabielheid(g);
            nextD = initialMoeilijkheid(g);
        } else {
            const previousS: number = kaart.metaData.stabielheid;
            const previousD: number = kaart.metaData.moeilijkheid;
            const lastDate = kaart.lastReviewed ?? now;
            const elapsedDays = Math.max(
                0,
                Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)),
            );

            const r = terughaalbaarheidBerekenen(elapsedDays, previousS);
            nextS = stabielheidBerekenen(previousD, previousS, r, g);
            nextD = moeilijkheidBerekenen(previousD, g);
        }

        const interval = Math.max(Math.round(volgendeReview(targetR, nextS)), 1.0);
        const volgende = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

        return {
            ...kaart,
            lastReviewed: now,
            nextReview: volgende,
            metaData: {
                ...kaart.metaData,
                stabielheid: nextS,
                moeilijkheid: nextD,
            }
        };
    }
}