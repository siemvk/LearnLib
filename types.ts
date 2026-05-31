import { shuffle } from "./helpers"

export type Lijst = Kaart[]
export type Kaart = {

  vraag: string,
  antwoord: string,
  listSessionItemAnswerHistories?: {
    goed: goedheid,
    userAntwoord: string,
  }[],

  volgende?: Date,
  laatste?: Date,
  inCurrent: boolean
  fase: fase,
  ronde: number,
  stabielheid?: stabielheid,
  moeilijkheid?: moeilijkheid,
  id?: string
  mode: "fsrs"
} | {
  vraag: string,
  antwoord: string,
  listSessionItemAnswerHistories?: {
    goed: boolean,
    userAntwoord: string,
  }[],
  id?: string
  mode: "simple"
}

export enum goedheid {
  Fout = 1,
  GoedMoeilijk = 2,
  GoedPrima = 3,
  GoedMakkelijk = 4
}
export enum fase {
  Nieuw = 0,
  Leerende = 1,
  Review = 2,
  Herleren = 3,
  NietLerend = 4
}

class NumberValidator {
  readonly num: number;

  constructor(num: number, min: number, max: number) {
    if (num < min || num > max) {
      throw new Error("Number out of range");
    }

    this.num = num;
  }
}

export type terughaalbaarheid = number

export type stabielheid = number
export class moeilijkheid extends NumberValidator {
  constructor(num: number) {
    super(num, 0, 10);
  }
}

export type LearnConfig = {
  staAlternatieveAntwoordenToe?: boolean // `antwoord een / antwoord twee` syntax
  multikeuzeWisselAlternatieveAntwoordenAf?: boolean // wisle bij meerkeuze vragen met de vorige syntax de antwoorden af
  gebruikAlternatieveVragenAfwisselendWanneerBeschikbaar?: boolean, // `vraag1/vraag2` syntax, wissel deze af als deze optie aanstaat. JE MOET HIERVOOR DE CURRENTITEM SYNTAX GEBRUIKEN OM HET OP TE HALEN!! (werkt vanaf 1.1.0)
  gebruikSeed?: string, // anders random
  fuckFransen?: boolean, // handig voor grieks of als je geen zin hebt om het te leren
  // dislectieVrindeleik?: boolean, // maakt `é -> ee` en `è -> e` etc // TODO: dit werkt nog niet!!
  optioneleAntwoordDelen?: boolean, // maakt het dat delen van antwoorden optioneel zijn, dus alles wat in `(...)` staat.
  enkelWoordAlternatieveAntwoorden?: boolean, // `woord/anderwoord` syntax
  griekseLettersLatijnsKans?: number, // 0 -> 100 kans dat griekse letters worden omgezet naar latijnse equivalenten, dus `α -> a` etc. Handig als je grieks leert maar geen zin hebt om te leren typen.
}
export let defaultLearnConfig: LearnConfig = {
  staAlternatieveAntwoordenToe: true,
  multikeuzeWisselAlternatieveAntwoordenAf: true,
  gebruikAlternatieveVragenAfwisselendWanneerBeschikbaar: true,
  fuckFransen: false,
  // dislectieVrindeleik: false,
  optioneleAntwoordDelen: true,
  enkelWoordAlternatieveAntwoorden: true,
  griekseLettersLatijnsKans: 0,
}

export class wachtrij<type> {
  private wachrij: type[]
  readonly base: type[]
  private filter: (value: type) => boolean

  constructor(start: type[], filter: (value: type) => boolean = () => true) {
    this.filter = filter
    this.wachrij = []
    start.forEach((value) => {
      if (filter(value)) {
        this.wachrij.push(value)
      }
    })
    this.base = [...this.wachrij]
  }
  public push(newItem: type) {
    if (this.filter(newItem)) {
      this.wachrij.push(newItem)
    }
  }
  public shuffle() {
    this.wachrij = [...shuffle(this.base)]
  }
  public reset = this.shuffle
  public reinsertCurrent(at: number) {
    const now = this.wachrij[0]
    // re insert current item at position `at`
    if (now === undefined || this.wachrij.length === 0) return

    this.wachrij.splice(0, 1)
    const boundedAt = Math.max(0, Math.min(at, this.wachrij.length))
    this.wachrij.splice(boundedAt, 0, now)
  }
  public removeCurrent() {
    this.wachrij.splice(0, 1)
  }
  public set value(v: type[]) {
    this.wachrij = v;
  }
  public get value(): type[] {
    return this.wachrij
  }
  public get now(): type {
    return this.wachrij[0]
  }
  public set now(v: type) {
    this.wachrij[0] = v
  }
  public get next(): type {
    return this.wachrij[1]
  }
  public recomp() {
    this.wachrij.forEach((value) => {
      if (this.filter(value)) {
        this.wachrij.push(value)
      }
    })
  }
}
