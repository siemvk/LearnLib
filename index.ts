import { Grade, gradeMaker, KaartStaat, kaartWachtrij, leerMethode, wachrijUpdater } from "./types"
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
  private cStart: Date
  private wachtrijUpdater: wachrijUpdater;
  private checkConfig: CheckConfig;

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
    this.wachtrij = this.shuffleArray(wachtrij)
    this.methode = methode
    this.grader = grader
    this.wachtrijUpdater = wachtrijUpdater
    this.checkConfig = checkConfig
    this.current = this.wachtrij[0]
    this.cStart = new Date()
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
  }

  private shuffleArray(array: kaartWachtrij): kaartWachtrij {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  public reshuffle() {
    // reshuffle de wachtrij
    this.wachtrij = this.shuffleArray(this.wachtrij)
    // update current
    this.current = this.wachtrij[0]
    // reset cStart
    this.cStart = new Date()
  }

  public antwoord(uAnwtoord: string, gradeOverwrite?: Grade, checkConfigOverride?: CheckConfig) {
    const endTime = new Date()
    const isGoed = checkAnswer(
      this.current.antwoord,
      uAnwtoord,
      checkConfigOverride ?? this.checkConfig
    );

    const grade = gradeOverwrite ?? this.grader.grade(isGoed, this.cStart, endTime);

    this.current = this.methode.reviewKaart(this.current, grade, endTime)
    // sync de current met de item in de lijst
    this.wachtrij[0] = this.current

    // update wachtrij
    this.wachtrij = this.wachtrijUpdater.updateWachtrij(this.wachtrij, this.current, grade)

    // update current
    this.current = this.wachtrij[0]

    // reset cStart
    this.cStart = new Date()
  }
}

// we moeten een goofy export dingetje doen om de leermodi enzo te exporten

export { Grade, urlSafeString } from "./types"
export type { KaartStaat, leerMethode, wachtrijUpdater, wachrijUpdater, gradeMaker, kaartWachtrij } from "./types"
export { checkAnswer } from "./check"
export type { CheckConfig } from "./check"

// exporteer alle leermodi en wachtrij updaters
export { verySimple } from "./gradeMakers/verySimple"
export { simpleMethode } from "./methodes/simple"
export { simpleWachtrij } from "./wachrijUpdater/simple"

// export ze ook als een lijst
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