import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateActivityXp, getLevelFromXp } from "./gamification";

describe("Gamification Engine - XP Calculation", () => {
  it("calculates linear XP for rides under 80km", () => {
    // 50km = 500 XP distance, 500m alt = 50 XP elevation -> 550 XP
    const result = calculateActivityXp({
      distanceMeters: 50000,
      elevationGainMeters: 500,
      activityType: "Outdoor",
      daysRiddenInWeek: 1,
    });
    assert.equal(result.distanceXp, 500);
    assert.equal(result.elevationXp, 50);
    assert.equal(result.totalXp, 550);
  });

  it("applies 50% diminishing returns between 80km and 150km", () => {
    // 100km: 80km * 10 (800) + 20km * 5 (100) = 900 XP distance
    const result = calculateActivityXp({
      distanceMeters: 100000,
      elevationGainMeters: 0,
      activityType: "Outdoor",
      daysRiddenInWeek: 1,
    });
    assert.equal(result.distanceXp, 900);
    assert.equal(result.totalXp, 900);
  });

  it("applies 25% diminishing returns beyond 150km", () => {
    // 200km: 800 (first 80) + 350 (next 70) + 50 * 2.5 (125) = 1275 XP
    const result = calculateActivityXp({
      distanceMeters: 200000,
      elevationGainMeters: 0,
      activityType: "Outdoor",
      daysRiddenInWeek: 1,
    });
    assert.equal(result.distanceXp, 1275);
    assert.equal(result.totalXp, 1275);
  });

  it("applies consistency multiplier for multiple days in week", () => {
    // 50km + 0 alt = 500 baseXp.
    // 5 days: multiplier = 1 + 0.05 * 4 = 1.20 -> 600 totalXp
    const result = calculateActivityXp({
      distanceMeters: 50000,
      elevationGainMeters: 0,
      activityType: "Outdoor",
      daysRiddenInWeek: 5,
    });
    assert.equal(result.baseXp, 500);
    assert.equal(result.totalXp, 600);
  });
});

describe("Gamification Engine - Level Progression", () => {
  it("computes Novato for initial XP", () => {
    const levelInfo = getLevelFromXp(200);
    assert.equal(levelInfo.level, 1);
    assert.equal(levelInfo.tierName, "Novato");
    assert.equal(levelInfo.progressPercent, 20); // 200 / 1000
  });

  it("progresses to higher levels and appropriate tiers", () => {
    // level threshold: 1000 * L^1.5
    // L=6: 1000 * 6^1.5 = 14697 XP -> Pedaleiro
    const levelInfo = getLevelFromXp(15000);
    assert.ok(levelInfo.level >= 6);
    assert.equal(levelInfo.tierName, "Pedaleiro");
  });
});
