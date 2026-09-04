import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateChallengeProgress, DEFAULT_WEEKLY_CHALLENGES } from "./challenges";

describe("Challenges Engine - Progress & Completion", () => {
  const easyDist = DEFAULT_WEEKLY_CHALLENGES[0]; // 60 km

  it("calculates partial progress accurately", () => {
    const result = evaluateChallengeProgress(easyDist, 30);
    assert.equal(result.progressPercent, 50);
    assert.equal(result.isCompleted, false);
  });

  it("marks completed when target is met or exceeded", () => {
    const result = evaluateChallengeProgress(easyDist, 65);
    assert.equal(result.progressPercent, 100);
    assert.equal(result.isCompleted, true);
  });
});
