import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkClubMembership, classifyActivity } from "./strava-auth";

describe("Strava Auth & Club Gate", () => {
  const CABRITOS_CLUB_ID = 123456;

  it("should approve user when official club id is present in club list", () => {
    const clubs = [
      { id: 999, name: "Outro Clube" },
      { id: 123456, name: "Cabritos Cycling Club" },
    ];
    const isMember = checkClubMembership(clubs, CABRITOS_CLUB_ID);
    assert.equal(isMember, true);
  });

  it("should reject user when official club id is missing", () => {
    const clubs = [{ id: 888, name: "Pelotão dos Amigos" }];
    const isMember = checkClubMembership(clubs, CABRITOS_CLUB_ID);
    assert.equal(isMember, false);
  });

  it("should handle empty or null club lists safely", () => {
    assert.equal(checkClubMembership([], CABRITOS_CLUB_ID), false);
    // @ts-expect-error test null safety
    assert.equal(checkClubMembership(null, CABRITOS_CLUB_ID), false);
  });
});

describe("Activity Classification", () => {
  it("should classify standard outdoor rides as Outdoor", () => {
    assert.equal(classifyActivity({ type: "Ride" }), "Outdoor");
    assert.equal(classifyActivity({ type: "GravelRide" }), "Outdoor");
    assert.equal(classifyActivity({ type: "MountainBikeRide" }), "Outdoor");
  });

  it("should classify trainer or virtual rides as Virtual", () => {
    assert.equal(classifyActivity({ type: "VirtualRide" }), "Virtual");
    assert.equal(classifyActivity({ type: "Ride", trainer: true }), "Virtual");
  });

  it("should classify EBikeRide as EBike", () => {
    assert.equal(classifyActivity({ type: "EBikeRide" }), "EBike");
  });
});

describe("Strava OAuth Helpers", () => {
  it("should build proper Strava authorize URL", () => {
    const { buildStravaAuthorizeUrl } = require("./strava-auth");
    const url = buildStravaAuthorizeUrl({
      clientId: "177152",
      redirectUri: "http://localhost:3000/api/auth/callback/strava",
      scope: "read,activity:read_all",
      state: "xyz123",
    });

    assert.match(url, /^https:\/\/www\.strava\.com\/oauth\/authorize\?/);
    assert.match(url, /client_id=177152/);
    assert.match(url, /redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fstrava/);
    assert.match(url, /response_type=code/);
    assert.match(url, /state=xyz123/);
  });
});

