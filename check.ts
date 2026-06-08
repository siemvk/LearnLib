export interface CheckConfig {
    fuckFransen?: boolean;
    staAlternatieveAntwoordenToe?: boolean;
    optioneleAntwoordDelen?: boolean;
    enkelWoordAlternatieveAntwoorden?: boolean;
}

export function checkAnswer(correctAnswerOG: string, userAnswerOG: string, config: CheckConfig = {}): boolean {
    // normalize inputs
    let correctAnswer = correctAnswerOG.toLowerCase().trim();
    let answer = userAnswerOG.toLowerCase().trim();
    let isCorrect = false;

    if (config.fuckFransen) {
        correctAnswer = correctAnswer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        answer = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    if (answer === correctAnswer) return true;

    if (config.staAlternatieveAntwoordenToe && correctAnswer.includes(" / ")) {
        const mogelijkeAntwoorden = correctAnswer.split(" / ");
        for (const mogelijkAntwoord of mogelijkeAntwoorden) {
            if (checkAnswer(mogelijkAntwoord, answer, config)) {
                isCorrect = true;
                break;
            }
        }
    }

    if (!isCorrect && config.optioneleAntwoordDelen && correctAnswer.includes("(")) {
        const antwoordZonderOptioneel = correctAnswer.replace(/\([^)]*\)/g, "").trim();
        const antwoordMetOptioneel = correctAnswer.replace(/\(([^)]*)\)/g, "$1").trim();
        if (answer === antwoordZonderOptioneel || answer === antwoordMetOptioneel) {
            isCorrect = true;
        }
    }

    if (!isCorrect && config.enkelWoordAlternatieveAntwoorden) {
        const antwoordWoorden = correctAnswer.split(" ");
        for (let i = 0; i < antwoordWoorden.length; i++) {
            const woord = antwoordWoorden[i];
            if (woord.includes("/")) {
                const mogelijkeWoorden = woord.split("/");
                for (const mogelijkWoord of mogelijkeWoorden) {
                    const mogelijkAntwoord = [...antwoordWoorden];
                    mogelijkAntwoord[i] = mogelijkWoord;
                    const mogelijkAntwoordStr = mogelijkAntwoord.join(" ");
                    if (checkAnswer(mogelijkAntwoordStr, answer, config)) {
                        isCorrect = true;
                        break;
                    }
                }
                if (isCorrect) break;
            }
        }
    }

    return isCorrect;
}