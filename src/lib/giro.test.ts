import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateHumorousAwards,
  compileGiroDaSemana,
  GiroActivityInput,
  AthleteHistoricalDistance,
} from "./giro";

describe("Giro da Semana & Humorous Awards Engine", () => {
  const mockActivities: GiroActivityInput[] = [
    {
      id: "act-1",
      athleteId: "ath-1",
      athleteName: "Guilherme Bonald",
      distanceMeters: 45000,
      elevationGainMeters: 1800, // 40 m/km (Trator candidate!)
      movingTimeSeconds: 5400,
      startDateLocal: "2026-09-02T06:30:00Z",
      averageSpeedKph: 30,
      activityType: "Outdoor",
      isEligibleForRanking: true,
    },
    {
      id: "act-2",
      athleteId: "ath-2",
      athleteName: "Carlos Vampiro",
      distanceMeters: 35000,
      elevationGainMeters: 300,
      movingTimeSeconds: 4200,
      startDateLocal: "2026-09-03T02:15:00Z", // Night ride 02:15 (Vampiro candidate!)
      averageSpeedKph: 30,
      activityType: "Outdoor",
      isEligibleForRanking: true,
    },
    {
      id: "act-3",
      athleteId: "ath-3",
      athleteName: "Joana Foguete",
      distanceMeters: 60000, // > 30km
      elevationGainMeters: 400,
      movingTimeSeconds: 5400,
      startDateLocal: "2026-09-04T07:00:00Z",
      averageSpeedKph: 40, // High speed!
      activityType: "Outdoor",
      isEligibleForRanking: true,
    },
    {
      id: "act-4",
      athleteId: "ath-4",
      athleteName: "Pedro Café",
      distanceMeters: 15000, // < 20km, low pace
      elevationGainMeters: 80,
      movingTimeSeconds: 3600,
      startDateLocal: "2026-09-05T09:00:00Z",
      averageSpeedKph: 15,
      activityType: "Outdoor",
      isEligibleForRanking: true,
    },
    {
      id: "act-5-ebike",
      athleteId: "ath-5",
      athleteName: "E-Biker Rápido",
      distanceMeters: 80000,
      elevationGainMeters: 2500,
      movingTimeSeconds: 4000,
      startDateLocal: "2026-09-04T08:00:00Z",
      averageSpeedKph: 55, // Electric bike! Should NOT win Foguete or Trator
      activityType: "EBike",
      isEligibleForRanking: false,
    },
  ];

  it("evaluates humorous awards correctly using sports rules and heuristics", () => {
    const awards = evaluateHumorousAwards(mockActivities);

    // Vampiro da Madrugada (ath-2)
    assert.equal(awards.vampiro?.athleteId, "ath-2");
    assert.ok(awards.vampiro?.metricDescription.includes("02:15"));

    // Trator da Semana (ath-1: 40m/km ratio, outdoor)
    assert.equal(awards.trator?.athleteId, "ath-1");
    assert.ok(awards.trator?.metricDescription.includes("40 m/km"));

    // Foguete do Asfalto (ath-3: 40 km/h on >30km outdoor)
    assert.equal(awards.foguete?.athleteId, "ath-3");
    assert.ok(awards.foguete?.metricDescription.includes("40 km/h"));

    // Ciclista Café (ath-4: relaxed ride < 20km, avg speed <= 20 km/h)
    assert.equal(awards.cafe?.athleteId, "ath-4");
    assert.ok(awards.cafe?.metricDescription.includes("15 km/h"));
  });

  it("calculates Maior Evolução comparing current week against previous week", () => {
    const prevWeekStats: AthleteHistoricalDistance[] = [
      { athleteId: "ath-1", totalDistanceKm: 40 }, // Current: 45km (+12.5%)
      { athleteId: "ath-3", totalDistanceKm: 30 }, // Current: 60km (+100%) -> Winner!
      { athleteId: "ath-4", totalDistanceKm: 50 }, // Current: 15km (-70%)
    ];

    const compiled = compileGiroDaSemana({
      weekNumber: 36,
      year: 2026,
      activities: mockActivities,
      previousWeekDistance: prevWeekStats,
    });

    assert.equal(compiled.maiorEvolucao?.athleteId, "ath-3");
    assert.equal(compiled.maiorEvolucao?.growthPercentage, 100);
  });

  it("compiles full bulletin with podiums, collective club stats and status draft", () => {
    const compiled = compileGiroDaSemana({
      weekNumber: 36,
      year: 2026,
      activities: mockActivities,
      previousWeekDistance: [],
    });

    assert.equal(compiled.status, "draft");
    assert.equal(compiled.totalDistanceKm, 155); // 45 + 35 + 60 + 15 (eligible outdoor)
    assert.equal(compiled.totalActivities, 4);
    assert.equal(compiled.reiDistancia.first?.athleteId, "ath-3");
    assert.equal(compiled.reiMontanha.first?.athleteId, "ath-1");
    assert.ok(compiled.summaryHeadline.length > 0);
  });
});
