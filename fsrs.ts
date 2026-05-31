import { goedheid as Grade, terughaalbaarheid, stabielheid, moeilijkheid, type Kaart } from "./types";

const W = [
    0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925,
    1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
];

export type dagen = number

const F: number = 19.0 / 81.0;
const C: number = -0.5;

export function initialMoeilijkheid(g: Grade): moeilijkheid {
    const gNum = g as number;
    const d = W[4] - Math.exp(W[5] * (gNum - 1.0)) + 1.0;
    const clamped = Math.min(Math.max(d, 1.0), 10.0);
    return new moeilijkheid(clamped);
}

export function initialStabielheid(g: Grade): stabielheid {
    return g as number;
}

function deltaD(g: Grade): number {
    const gNum = g as number;
    return -W[6] * (gNum - 3.0);
}

function dp(d: number, g: Grade): number {
    return d + deltaD(g) * ((10.0 - d) / 9.0);
}

export function moeilijkheidBerekenden(d: moeilijkheid, g: Grade): moeilijkheid {
    const easyD0 = initialMoeilijkheid(Grade.GoedMakkelijk).num;
    const next = W[7] * easyD0 + (1.0 - W[7]) * dp(d.num, g);
    const clamped = Math.min(Math.max(next, 1.0), 10.0);
    return new moeilijkheid(clamped);
}

export function terughaalbaarheidBerekenen(t: dagen, s: stabielheid): terughaalbaarheid {
    return Math.pow(1.0 + F * (t / s), C)
}

export function volgendeReview(r_d: terughaalbaarheid, s: stabielheid): dagen {
    // inverse of terughaalbaarheidBerekenen: solve for t
    // (1 + F * (t / s.num))^C = r_d
    // 1 + F * (t / s.num) = r_d^(1/C)
    // t = s.num / F * (r_d^(1/C) - 1)
    return (s / F) * (Math.pow(r_d, 1.0 / C) - 1.0)
}

export function stabielheidOpGoed(d: dagen, s: stabielheid, r: terughaalbaarheid, g: Grade): stabielheid {
    const t_d = 11.0 - d;
    const t_s = Math.pow(s, -W[9]);
    const t_r = Math.exp(W[10] * (1.0 - r)) - 1.0;
    const h = g === Grade.GoedMoeilijk ? W[15] : 1.0;
    const b = g === Grade.GoedMakkelijk ? W[16] : 1.0;
    const c = Math.exp(W[8]);
    const alpha = 1.0 + t_d * t_s * t_r * h * b * c;
    return s * alpha;
}

export function stabielheidOpFout(d: dagen, s: stabielheid, r: terughaalbaarheid): stabielheid {
    const d_f = Math.pow(d, -W[12]);
    const s_f = Math.pow(s + 1.0, W[13]) - 1.0;
    const r_f = Math.exp(W[14] * (1.0 - r));
    const c_f = W[11];
    const s_new = d_f * s_f * r_f * c_f;
    return Math.min(s_new, s);
}

export function stabielheidBerekenden(d: dagen, s: stabielheid, r: terughaalbaarheid, g: Grade): stabielheid {
    if (g === Grade.Fout) {
        return stabielheidOpFout(d, s, r);
    }

    return stabielheidOpGoed(d, s, r, g);
}

export function updateKaartFsrs(
    kaart: Kaart,
    g: Grade,
    now: Date = new Date(),
    targetR: terughaalbaarheid = 0.9,
): Kaart {
    if (kaart.mode !== "fsrs") {
        throw new Error("updateKaartFsrs expects a fsrs kaart");
    }

    const previousS = kaart.stabielheid ?? initialStabielheid(g);
    const previousD = kaart.moeilijkheid ?? initialMoeilijkheid(g);
    const lastDate = kaart.laatste ?? now;
    const elapsedDays = Math.max(
        0,
        Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)),
    );

    const r = terughaalbaarheidBerekenen(elapsedDays, previousS);
    const nextS = stabielheidBerekenden(previousD.num, previousS, r, g);
    const nextD = moeilijkheidBerekenden(previousD, g);
    const interval = Math.max(Math.round(volgendeReview(targetR, nextS)), 1.0);
    const volgende = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

    return {
        ...kaart,
        laatste: now,
        volgende,
        stabielheid: nextS,
        moeilijkheid: nextD,
        ronde: kaart.ronde + 1,
    };
}

