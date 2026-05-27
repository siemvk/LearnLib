import { it, expect } from "bun:test";
import TestLearnLib from "./TestLearnLib";

it("draws a tree for branching answers while testing", () => {
  const learnLib = new TestLearnLib([], { staAlternatieveAntwoordenToe: true });

  const tree = learnLib.drawAnswerTree("test / test2", "test2");

  expect(tree).toContain("alternative answers");
  expect(tree).toContain("exact match");
  expect(tree.split("\n").length).toBeGreaterThan(1);
});
