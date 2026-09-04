import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeAthleteProfile,
  AthleteProfileInput,
  AthleteActivityRecord,
} from "./athlete-profile";

describe("Athlete Profile & Showcase Engine", () => {
  const sampleActivities: AthleteActivityRecord[] = [
    {
      id: "act-1",
      name: "Giro da Serra 100k",
      distanceMeters: 105000,
      elevationGainMeters: 2200,
      movingTimeSeconds: 12600,
      startDateLocal: "2026-08-20T06:00:00Z",
      averageSpeedKph: 30,
      activityType: "Outdoor",
      xpAwarded: 1270,
    },
    {
      id: "act-2",
      name: "Passeio Noturno",
      distanceMeters: 35000,
      elevationGainMeters: 350,
      movingTimeSeconds: 4200,
      startDateLocal: "2026-09-02T02:30:00Z",
      averageSpeedKph: 30,
      activityType: "Outdoor",
      xpAwarded: 385,
    },
    {
      id: "act-3-virtual",
      name: "Treino Intervalado Rolo",
      distanceMeters: 25000,
      elevationGainMeters: 150,
      movingTimeSeconds: 3000,
      startDateLocal: "2026-09-03T18:00:00Z",
      averageSpeedKph: 30,
      activityType: "Virtual",
      xpAwarded: 265,
    },
  ];

  const profileInput: AthleteProfileInput = {
    athleteId: "ath-1",
    firstname: "Guilherme",
    lastname: "Bonald",
    totalXp: 18450,
    clubName: "Cabritos Cycling Club",
    unlockedBadgeCodes: new Set(["century_100k", "vampire_secret"]),
    activities: sampleActivities,
  };

  it("calculates lifetime level progression and tier name", () => {
    const profile = computeAthleteProfile(profileInput);

    assert.equal(profile.fullName, "Guilherme Bonald");
    assert.equal(profile.totalXp, 18450);
    assert.ok(profile.levelInfo.level > 1);
    assert.ok(profile.levelInfo.tierName.length > 0);
  });

  it("aggregates season sports metrics accurately", () => {
    const profile = computeAthleteProfile(profileInput);

    assert.equal(profile.seasonStats.totalRides, 3);
    assert.equal(profile.seasonStats.totalDistanceKm, 165); // 105 + 35 + 25
    assert.equal(profile.seasonStats.totalElevationMeters, 2700); // 2200 + 350 + 150
    assert.equal(profile.seasonStats.longestRideKm, 105);
  });

  it("partitions badges into unlocked and locked/secret sets", () => {
    const profile = computeAthleteProfile(profileInput);

    assert.equal(profile.badges.unlocked.length, 2);
    assert.ok(profile.badges.unlocked.some((b) => b.code === "century_100k"));
    assert.ok(profile.badges.unlocked.some((b) => b.code === "vampire_secret"));

    assert.ok(profile.badges.locked.length >= 2);
    // Locked secret badges should have redacted titles/descriptions
    const secretLocked = profile.badges.locked.find((b) => b.isSecret);
    if (secretLocked) {
      assert.equal(secretLocked.title, "Conquista Secreta");
      assert.ok(secretLocked.description.includes("???"));
    }
  });
});
