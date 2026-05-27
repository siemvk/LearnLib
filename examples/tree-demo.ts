import TestLearnLib from "../tests/TestLearnLib";

const cases = [
//   {
//     title: "Exact match",
//     lib: new TestLearnLib([], {}),
//     correct: "cat",
//     answer: "cat",
//   },
//   {
//     title: "Alternatives",
//     lib: new TestLearnLib([], { staAlternatieveAntwoordenToe: true }),
//     correct: "cat / dog",
//     answer: "dog",
//   },
//   {
//     title: "Optional parts",
//     lib: new TestLearnLib([], { optioneleAntwoordDelen: true }),
//     correct: "hello (world)",
//     answer: "hello",
//   },
  {
    title: "Maximum chaos",
    lib: new TestLearnLib([], {
      staAlternatieveAntwoordenToe: true,
      optioneleAntwoordDelen: true,
      enkelWoordAlternatieveAntwoorden: true,
    }),
    correct: "walk/run slowly/quickly to/from the (big) city / stay/leave at/in the (tiny) town",
    answer: "run quickly from the city",
  },
];

for (const example of cases) {
  console.log(`\n=== ${example.title} ===`);
  console.log(example.lib.drawAnswerTree(example.correct, example.answer));
}