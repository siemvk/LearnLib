import { Grade, gradeMaker, KaartStaat, kaartWachtrij, LearnlibState, leerMethode, wachrijUpdater } from "./types"
import { checkAnswer, CheckConfig } from "./check"
import { simpleWachtrij } from "./wachrijUpdater/simple";
import { verySimple } from "./gradeMakers/verySimple";
import { simpleMethode } from "./methodes/simple";
import { upgradeTools } from "./upgradeTools";

export default class Learnlib {
  private methode: leerMethode;
  private grader: gradeMaker;
  public wachtrij: kaartWachtrij;
  public current: KaartStaat;
  private cStart: Date;
  private wachtrijUpdater: wachrijUpdater;
  private checkConfig: CheckConfig;
  public initialCount: number;
  private listeners: Set<(state: LearnlibState) => void> = new Set();
  private cachedSnapshot!: LearnlibState;

  constructor(
    wachtrij: kaartWachtrij,
    methode: leerMethode,
    grader: gradeMaker,
    wachtrijUpdater: wachrijUpdater,
    checkConfig: CheckConfig = {}
  ) {
    if (wachtrij.length === 0) {
      throw new Error("Kan niet functioneren zonder wachtrij");
    }
    this.wachtrij = this.shuffleArray(wachtrij);
    this.initialCount = this.wachtrij.length;
    this.methode = methode;
    this.grader = grader;
    this.wachtrijUpdater = wachtrijUpdater;
    this.checkConfig = checkConfig;
    this.current = this.wachtrij[0];
    this.cStart = new Date();
    if (this.current.methodeId == undefined) {
      this.wachtrij = this.wachtrij.map((v) => {
        v.methodeId = this.methode.id.toString();
        return upgradeTools.upgradeList(v);
      });
      this.current = this.wachtrij[0];
    }
    if (this.current.methodeId != this.methode.id.toString()) {
      throw new Error("ERROR: Verkeerde methode");
    }
    this.updateSnapshot();
  }

  private shuffleArray(array: kaartWachtrij): kaartWachtrij {
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
      current: isKlaar ? null : this.current,
      wachtrij: [...this.wachtrij],
      isKlaar,
      initialCount: this.initialCount,
      progress: this.initialCount > 0 ? (this.initialCount - this.wachtrij.length) / this.initialCount : 0,
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
    this.current = this.wachtrij[0];
    this.cStart = new Date();
    this.notify();
  }

  public antwoord(uAnwtoord: string, gradeOverwrite?: Grade, checkConfigOverride?: CheckConfig) {
    const endTime = new Date();
    const isGoed = checkAnswer(
      this.current.antwoord,
      uAnwtoord,
      checkConfigOverride ?? this.checkConfig
    );

    const grade = gradeOverwrite ?? this.grader.grade(isGoed, this.cStart, endTime);

    this.current = this.methode.reviewKaart(this.current, grade, endTime);
    this.wachtrij[0] = this.current;
    this.wachtrij = this.wachtrijUpdater.updateWachtrij(this.wachtrij, this.current, grade);
    this.current = this.wachtrij[0];
    this.cStart = new Date();
    this.notify();
  }
}

export { Grade, urlSafeString } from "./types"
export type { KaartStaat, LearnlibState, leerMethode, wachtrijUpdater, wachrijUpdater, gradeMaker, kaartWachtrij } from "./types"
export { checkAnswer } from "./check"
export type { CheckConfig } from "./check"

export { verySimple } from "./gradeMakers/verySimple"
export { simpleMethode } from "./methodes/simple"
export { simpleWachtrij } from "./wachrijUpdater/simple"

export const methodes: leerMethode[] = [
  new simpleMethode(),
]

export const wachtrijUpdaters: wachrijUpdater[] = [
  new simpleWachtrij(),
]

export const gradeMakers: gradeMaker[] = [
  new verySimple(),
]
export { upgradeTools } from "./upgradeTools"