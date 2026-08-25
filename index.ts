import { Grade, gradeMaker, kaartSnapshot, KaartStaat, kaartWachtrij, LearnlibState, leerMethode, wachtrijUpdater } from "./types"
import { checkAnswer, CheckConfig } from "./check"
import { simpleWachtrij } from "./wachrijUpdater/simple";
import { verySimple } from "./gradeMakers/verySimple";
import { simpleMethode } from "./methodes/simple";
import { upgradeTools } from "./upgradeTools";

export default class Learnlib {
  private methode: leerMethode;
  private grader: gradeMaker;
  public wachtrij: KaartStaat[];
  public current: KaartStaat | null = null;
  private cStart: Date;
  private wachtrijUpdater: wachtrijUpdater;
  private checkConfig: CheckConfig;
  public initialCount: number;
  private listeners: Set<(state: LearnlibState) => void> = new Set();
  private cachedSnapshot!: LearnlibState;
  public history: kaartSnapshot[]

  constructor(
    initialState: LearnlibState | KaartStaat[],
    methode: leerMethode,
    grader: gradeMaker,
    wachtrijUpdater: wachtrijUpdater,
    checkConfig: CheckConfig = {}
  ) {
    this.methode = methode;
    this.grader = grader;
    this.wachtrijUpdater = wachtrijUpdater;
    this.checkConfig = checkConfig;
    this.cStart = new Date();

    if (Array.isArray(initialState)) {
      this.history = [];
      this.wachtrij = this.shuffleArray(initialState);
      this.current = this.wachtrij[0] ?? null;
      this.initialCount = this.wachtrij.length;
    } else {
      this.history = initialState.history ?? [];
      this.initialCount = initialState.initialCount ?? (initialState.wachtrij?.length ?? 0);
      if (initialState.current !== undefined && initialState.current !== null) {
        this.wachtrij = initialState.wachtrij ?? [];
        this.current = initialState.current;
      } else {
        this.wachtrij = this.shuffleArray(initialState.wachtrij ?? []);
        this.current = this.wachtrij[0] ?? null;
      }
    }

    if (this.current) {
      if (this.current.methodeId == undefined) {
        this.wachtrij = this.wachtrij.map((v) => {
          v.methodeId = this.methode.id.toString();
          return upgradeTools.upgradeList(v);
        });
        this.current = this.wachtrij[0] ?? null;
      }
      if (this.current && this.current.methodeId != this.methode.id.toString()) {
        throw new Error("ERROR: Verkeerde methode, deze error is de schuld van de maker van de applicatie");
      }
    }
    this.updateSnapshot();
  }

  private shuffleArray(array: KaartStaat[]): KaartStaat[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public subscribe = (listener: (state: LearnlibState) => void): () => void => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private updateSnapshot(): LearnlibState {
    const isKlaar = this.wachtrij.length === 0;
    this.cachedSnapshot = {
      current: isKlaar ? null : (this.current ?? null),
      wachtrij: [...this.wachtrij],
      isKlaar,
      initialCount: this.initialCount,
      progress: this.initialCount > 0 ? (this.initialCount - this.wachtrij.length) / this.initialCount : 0,
      history: [...this.history]
    };
    return this.cachedSnapshot;
  }

  public getSnapshot = (): LearnlibState => {
    return this.cachedSnapshot;
  };

  private notify() {
    this.updateSnapshot();
    for (const listener of this.listeners) {
      listener(this.cachedSnapshot);
    }
  }

  public reshuffle() {
    this.wachtrij = this.shuffleArray(this.wachtrij);
    this.current = this.wachtrij[0] ?? null;
    this.cStart = new Date();
    this.notify();
  }

  public antwoord(uAntwoord: string, gradeOverwrite?: Grade, checkConfigOverride?: CheckConfig) {
    if (!this.current) {
      return;
    }
    const endTime = new Date();
    const isGoed = checkAnswer(
      this.current.antwoord,
      uAntwoord,
      checkConfigOverride ?? this.checkConfig
    );

    const grade = gradeOverwrite ?? this.grader.grade(isGoed, this.cStart, endTime);
    this.history.push({
      date: endTime,
      kaartId: this.current.id,
      antwoord: uAntwoord,
      goed: grade
    });

    this.updateSnapshot();
    this.current = this.methode.reviewKaart(this.current, grade, endTime, { ...this.cachedSnapshot });
    this.wachtrij[0] = this.current;
    this.updateSnapshot();
    const newState = this.wachtrijUpdater.updateWachtrij({ ...this.cachedSnapshot }, this.current, grade);
    this.wachtrij = newState.wachtrij;
    this.current = this.wachtrij[0] ?? null;
    this.cStart = new Date();
    this.notify();
  }
}

export { Grade } from "./types"
export type { KaartStaat, LearnlibState, kaartSnapshot, kaartWachtrij, leerMethode, wachtrijUpdater, wachtrijUpdater as wachrijUpdater, gradeMaker } from "./types"
export { checkAnswer } from "./check"
export type { CheckConfig } from "./check"

export { verySimple } from "./gradeMakers/verySimple"
export { simpleMethode } from "./methodes/simple"
export { simpleWachtrij } from "./wachrijUpdater/simple"

export const methodes: leerMethode[] = [
  new simpleMethode(),
]

export const wachtrijUpdaters: wachtrijUpdater[] = [
  new simpleWachtrij(),
]

export const gradeMakers: gradeMaker[] = [
  new verySimple(),
]
export { upgradeTools } from "./upgradeTools"