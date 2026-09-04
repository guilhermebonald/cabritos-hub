import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aggregateWeeklyRankings, ActivityRecord } from "./rankings";

describe("Rankings Engine - Weekly Aggregation & Segregation", () => {
  const activities: ActivityRecord[] = [
    {
      athleteId: "1",
      athleteName: "Guilherme",
      distanceMeters: 60000,
      elevationGainMeters: 1200,
      movingTimeSeconds: 7200, // 30 km/h
      startDateLocal: "2026-09-01T08:00:00Z",
      isEligibleForRanking: true,
      activityType: "Outdoor",
    },
    {
      athleteId: "1",
      athleteName: "Guilherme",
      distanceMeters: 40000,
      elevationGainMeters: 800,
      movingTimeSeconds: 4800,
      startDateLocal: "2026-09-02T08:00:00Z",
      isEligibleForRanking: true,
      activityType: "Outdoor",
    },
    {
      athleteId: "2",
      athleteName: "João",
      distanceMeters: 150000,
      elevationGainMeters: 300,
      movingTimeSeconds: 18000, // 30 km/h
      startDateLocal: "2026-09-01T07:00:00Z",
      isEligibleForRanking: true,
      activityType: "Outdoor",
    },
    {
      athleteId: "3",
      athleteName: "Carlos E-Bike",
      distanceMeters: 200000,
      elevationGainMeters: 3000,
      movingTimeSeconds: 18000,
      startDateLocal: "2026-09-01T06:00:00Z",
      isEligibleForRanking: false, // Segregated EBike
      activityType: "EBike",
    },
  ];

  it("excludes segregated e-bikes from competitive leaderboards", () => {
    const { distancePodium } = aggregateWeeklyRankings(activities);
    assert.equal(distancePodium.some((p) => p.athleteName === "Carlos E-Bike"), false);
  });

  it("ranks João as Rei da Distância (150km vs 100km)", () => {
    const { distancePodium } = aggregateWeeklyRankings(activities);
    assert.equal(distancePodium[0].athleteName, "João");
    assert.equal(distancePodium[0].totalDistanceKm, 150);
  });

  it("ranks Guilherme as Rei da Montanha (2000m vs 300m)", () => {
    const { mountainPodium } = aggregateWeeklyRankings(activities);
    assert.equal(mountainPodium[0].athleteName, "Guilherme");
    assert.equal(mountainPodium[0].totalElevationMeters, 2000);
  });

  it("ranks Guilherme as Mais Consistente (2 distinct days vs 1)", () => {
    const { consistencyPodium } = aggregateWeeklyRankings(activities);
    assert.equal(consistencyPodium[0].athleteName, "Guilherme");
    assert.equal(consistencyPodium[0].distinctDays, 2);
  });
});
