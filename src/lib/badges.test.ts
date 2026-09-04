import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateBadgesForActivity, SYSTEM_BADGES } from "./badges";

describe("Badges Engine - Automatic Evaluation", () => {
  it("unlocks century_100k when ride is >= 100km", () => {
    const unlocked = evaluateBadgesForActivity({
      distanceMeters: 105000,
      elevationGainMeters: 800,
      averageSpeedKph: 28,
      startDateLocal: "2026-09-02T07:00:00Z",
      totalSeasonElevationMeters: 2000,
      alreadyUnlockedBadgeCodes: new Set(),
    });

    assert.equal(unlocked.length, 1);
    assert.equal(unlocked[0].code, "century_100k");
  });

  it("does not re-unlock already acquired badges", () => {
    const unlocked = evaluateBadgesForActivity({
      distanceMeters: 120000,
      elevationGainMeters: 800,
      averageSpeedKph: 28,
      startDateLocal: "2026-09-02T07:00:00Z",
      totalSeasonElevationMeters: 2000,
      alreadyUnlockedBadgeCodes: new Set(["century_100k"]),
    });

    assert.equal(unlocked.length, 0);
  });

  it("unlocks secret vampire badge for night rides", () => {
    const unlocked = evaluateBadgesForActivity({
      distanceMeters: 40000,
      elevationGainMeters: 200,
      averageSpeedKph: 26,
      startDateLocal: "2026-09-02T02:30:00Z", // 02:30 AM
      totalSeasonElevationMeters: 2000,
      alreadyUnlockedBadgeCodes: new Set(),
    });

    assert.equal(unlocked.some((b) => b.code === "vampire_secret"), true);
  });

  it("unlocks rocket_speed_40kph when distance > 30km and avg speed >= 35km/h", () => {
    const unlocked = evaluateBadgesForActivity({
      distanceMeters: 35000,
      elevationGainMeters: 100,
      averageSpeedKph: 36.5,
      startDateLocal: "2026-09-02T09:00:00Z",
      totalSeasonElevationMeters: 2000,
      alreadyUnlockedBadgeCodes: new Set(),
    });

    assert.equal(unlocked.some((b) => b.code === "rocket_speed_40kph"), true);
  });
});
