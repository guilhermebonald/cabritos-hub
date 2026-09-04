import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  decodePolyline,
  computeMapBounds,
  aggregateClubRoutes,
  ActivityRouteInput,
} from "./routes-map";

describe("Club Routes & Polyline Aggregation Engine", () => {
  // Canonical Google encoded polyline snippet:
  // Points: [38.5, -120.2], [40.7, -120.95], [43.252, -121.21012]
  const samplePolyline = "_p~iF~ps|U_ulLnnqC_mqNvxq`@";

  it("decodes Google Polyline format into [latitude, longitude] coordinates", () => {
    const coords = decodePolyline(samplePolyline);
    assert.equal(coords.length, 3);
    assert.deepEqual(coords[0], [38.5, -120.2]);
    assert.deepEqual(coords[1], [40.7, -120.95]);
    assert.deepEqual(coords[2], [43.252, -126.453]);
  });

  it("handles empty or invalid polylines gracefully without throwing", () => {
    assert.deepEqual(decodePolyline(""), []);
    assert.deepEqual(decodePolyline(undefined as unknown as string), []);
  });

  it("computes map bounding box and center coordinate accurately", () => {
    const points: [number, number][] = [
      [-22.9, -43.2],
      [-23.5, -46.6],
      [-20.3, -40.3],
    ];

    const bounds = computeMapBounds(points);
    assert.deepEqual(bounds.minLat, -23.5);
    assert.deepEqual(bounds.maxLat, -20.3);
    assert.deepEqual(bounds.minLng, -46.6);
    assert.deepEqual(bounds.maxLng, -40.3);
    assert.equal(bounds.centerLat, -21.9);
    assert.equal(bounds.centerLng, -43.45);
  });

  it("aggregates club activities into collective map routes and geographic metrics", () => {
    const activities: ActivityRouteInput[] = [
      {
        id: "act-1",
        athleteName: "Guilherme",
        name: "Subida da Serra",
        distanceMeters: 45000,
        elevationGainMeters: 1200,
        summaryPolyline: samplePolyline,
        activityType: "Outdoor",
      },
      {
        id: "act-2",
        athleteName: "João",
        name: "Giro na Represa",
        distanceMeters: 55000,
        elevationGainMeters: 600,
        summaryPolyline: samplePolyline,
        activityType: "Outdoor",
      },
      {
        id: "act-3-indoor",
        athleteName: "Pedro",
        name: "Treino Zwift",
        distanceMeters: 30000,
        elevationGainMeters: 200,
        summaryPolyline: undefined, // Virtual ride without GPS polyline
        activityType: "Virtual",
      },
    ];

    const result = aggregateClubRoutes(activities);

    assert.equal(result.totalGpsRoutes, 2);
    assert.equal(result.totalDistanceKm, 100);
    assert.equal(result.totalElevationMeters, 1800);
    assert.ok(result.allPoints.length >= 4);
    assert.ok(result.bounds !== null);
  });
});
