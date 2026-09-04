import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { processSeasonBackfill, StravaRawActivity } from "./backfill";
import { computePendingClubMembers, StravaClubMember, HubRegisteredAthlete } from "./club-members";

describe("Season Backfill Engine", () => {
  const sampleActivities: StravaRawActivity[] = [
    {
      id: 101,
      name: "Pedal Velho 2025",
      type: "Ride",
      start_date_local: "2025-12-20T08:00:00Z", // Before 2026-01-01
      distance: 50000,
      moving_time: 6000,
      total_elevation_gain: 400,
      average_speed: 8.33,
      max_speed: 15,
    },
    {
      id: 102,
      name: "Primeiro Pedal 2026",
      type: "Ride",
      start_date_local: "2026-01-05T07:00:00Z",
      distance: 60000,
      moving_time: 7200,
      total_elevation_gain: 500,
      average_speed: 8.33, // 30 km/h
      max_speed: 16,
    },
    {
      id: 103,
      name: "Centurião 2026",
      type: "Ride",
      start_date_local: "2026-02-15T06:00:00Z",
      distance: 105000, // triggers century badge
      moving_time: 12600,
      total_elevation_gain: 1200,
      average_speed: 8.33,
      max_speed: 18,
    },
  ];

  it("filters out pre-season activities and processes only current season", () => {
    const result = processSeasonBackfill({
      athleteCurrentXp: 0,
      existingActivityIds: new Set(),
      existingBadgeCodes: new Set(),
      rawActivities: sampleActivities,
    });

    assert.equal(result.processedCount, 2);
    assert.equal(result.skippedCount, 1);
    assert.ok(result.totalXpGained > 0);
  });

  it("deduplicates activities already present in system", () => {
    const result = processSeasonBackfill({
      athleteCurrentXp: 500,
      existingActivityIds: new Set([102]), // 102 already saved
      existingBadgeCodes: new Set(),
      rawActivities: sampleActivities,
    });

    assert.equal(result.processedCount, 1); // Only 103 processed
    assert.equal(result.skippedCount, 2); // 101 (old) and 102 (duplicate)
  });

  it("awards badges and adds badge bonus XP during historical processing", () => {
    const result = processSeasonBackfill({
      athleteCurrentXp: 0,
      existingActivityIds: new Set(),
      existingBadgeCodes: new Set(),
      rawActivities: sampleActivities,
    });

    assert.ok(result.unlockedBadges.some((b) => b.code === "century_100k"));
  });
});

describe("Club Members & Pending Invites Engine", () => {
  const stravaMembers: StravaClubMember[] = [
    { id: 1, firstname: "Guilherme", lastname: "Bonald" },
    { id: 2, firstname: "João", lastname: "Silva" },
    { id: 3, firstname: "Pedro", lastname: "Santos" },
    { id: 4, firstname: "Mariana", lastname: "Costa" },
  ];

  const registeredAthletes: HubRegisteredAthlete[] = [
    { stravaId: 1, name: "Guilherme Bonald" },
    { stravaId: 2, name: "João Silva" },
  ];

  it("identifies pending members not yet onboarded to Cabritos Hub", () => {
    const result = computePendingClubMembers(stravaMembers, registeredAthletes);
    assert.equal(result.totalClubMembers, 4);
    assert.equal(result.registeredCount, 2);
    assert.equal(result.pendingCount, 2);
    assert.deepEqual(
      result.pendingMembers.map((m) => m.firstname),
      ["Pedro", "Mariana"]
    );
  });
});
