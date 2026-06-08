import { Grade, gradeMaker, KaartStaat, kaartWachtrij, leerMethode, wachrijUpdater } from "./types"
import { checkAnswer } from "./check"

export default class Learnlib {
  private methode: leerMethode;
  private grader: gradeMaker;
  private wachtrij: kaartWachtrij;
  private current: KaartStaat;
  private cStart: Date
  private wachtrijUpdater: wachrijUpdater;

  constructor(wachtrij: kaartWachtrij, methode: leerMethode, grader: gradeMaker, wachtrijUpdater: wachrijUpdater) {
    this.wachtrij = this.shuffleArray(wachtrij)
    this.methode = methode
    this.grader = grader
    this.current = this.wachtrij[0]
    this.cStart = new Date()
    this.wachtrijUpdater = wachtrijUpdater
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

  public antwoord(uAnwtoord: string, gradeOverwrite?: Grade) {
    const endTime = new Date()
    const isGoed = checkAnswer(
      this.current.antwoord,
      uAnwtoord
    );

    const grade = gradeOverwrite ?? this.grader.grade(isGoed, this.cStart, endTime);

    this.current = this.methode.reviewKaart(this.current, grade, endTime)
    // sync de current met de item in de lijst
    this.wachtrij[0] = this.current

    // update wachtrij
    this.wachtrijUpdater.updateWachtrij(this.wachtrij, this.current, grade)
  }
}