import LearnLib from "../index";
import { drawTree, type TreeDrawerNode } from "../helpers";

type AnswerTreeResult = {
  tree: TreeDrawerNode;
  isCorrect: boolean;
};

export default class TestLearnLib extends LearnLib {
  public drawAnswerTree(correctAnswerOG: string, userAnswerOG: string): string {
    return drawTree(this.buildAnswerTree(correctAnswerOG, userAnswerOG));
  }

  private buildAnswerTree(correctAnswerOG: string, userAnswerOG: string): TreeDrawerNode {
    return this.buildAnswerTreeResult(correctAnswerOG, userAnswerOG).tree;
  }

  private buildAnswerTreeResult(correctAnswerOG: string, userAnswerOG: string): AnswerTreeResult {
    const tree: TreeDrawerNode = {
      label: `check ${JSON.stringify(correctAnswerOG)} vs ${JSON.stringify(userAnswerOG)}`,
      children: [],
    };

    let correctAnswer = correctAnswerOG.toLowerCase().trim();
    let answer = userAnswerOG.toLowerCase().trim();

    if (this.config.fuckFransen) {
      const strippedCorrectAnswer = correctAnswer
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const strippedAnswer = answer
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      tree.children!.push({
        label: `strip accents -> ${JSON.stringify(strippedCorrectAnswer)} / ${JSON.stringify(strippedAnswer)}`,
        children: [],
      });

      correctAnswer = strippedCorrectAnswer;
      answer = strippedAnswer;
    }

    if (answer === correctAnswer) {
      tree.children!.push({
        label: "exact match",
        children: [{ label: "result: true" }],
      });

      return { tree, isCorrect: true };
    }

    if (this.config.staAlternatieveAntwoordenToe && correctAnswer.includes(" / ")) {
      const mogelijkeAntwoorden = correctAnswer.split(" / ");
      const alternativeNode: TreeDrawerNode = {
        label: "alternative answers",
        children: [],
      };
      tree.children!.push(alternativeNode);

      for (const mogelijkAntwoord of mogelijkeAntwoorden) {
        const attempt = this.buildAnswerTreeResult(mogelijkAntwoord, answer);

        alternativeNode.children!.push({
          label: `try ${JSON.stringify(mogelijkAntwoord)}`,
          children: [attempt.tree],
        });

        if (attempt.isCorrect) {
          tree.children!.push({
            label: "result: true",
            children: [],
          });
          return { tree, isCorrect: true };
        }
      }
    }

    if (this.config.optioneleAntwoordDelen && correctAnswer.includes("(")) {
      const antwoordZonderOptioneel = correctAnswer.replace(/\([^)]*\)/g, "").trim();
      const antwoordMetOptioneel = correctAnswer.replace(/\(([^)]*)\)/g, "$1").trim();
      const matchesOptional = answer === antwoordZonderOptioneel || answer === antwoordMetOptioneel;

      tree.children!.push({
        label: `optional parts -> ${JSON.stringify(antwoordZonderOptioneel)} / ${JSON.stringify(antwoordMetOptioneel)}`,
        children: [
          {
            label: matchesOptional ? "result: true" : "result: false",
            children: [],
          },
        ],
      });

      if (matchesOptional) {
        return { tree, isCorrect: true };
      }
    }

    if (this.config.enkelWoordAlternatieveAntwoorden) {
      const antwoordWoorden = correctAnswer.split(" ");
      const singleWordNode: TreeDrawerNode = {
        label: "single word alternatives",
        children: [],
      };
      tree.children!.push(singleWordNode);

      for (const [index, woord] of antwoordWoorden.entries()) {
        if (!woord.includes("/")) {
          continue;
        }

        const mogelijkeWoorden = woord.split("/");

        for (const mogelijkWoord of mogelijkeWoorden) {
          const mogelijkAntwoord = [...antwoordWoorden];
          mogelijkAntwoord[index] = mogelijkWoord;
          const mogelijkAntwoordStr = mogelijkAntwoord.join(" ");
          const attempt = this.buildAnswerTreeResult(mogelijkAntwoordStr, answer);

          singleWordNode.children!.push({
            label: `try ${JSON.stringify(mogelijkAntwoordStr)}`,
            children: [attempt.tree],
          });

          if (attempt.isCorrect) {
            tree.children!.push({
              label: "result: true",
              children: [],
            });
            return { tree, isCorrect: true };
          }
        }
      }
    }

    tree.children!.push({
      label: "result: false",
      children: [],
    });

    return { tree, isCorrect: false };
  }
}
