import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateWebhookSubscription,
  parseStravaWebhookEvent,
  StravaWebhookPayload,
} from "./strava-webhook";

describe("Strava Webhook Ingestion Engine", () => {
  const SECRET_TOKEN = "cabritos-hub-secret-verify-token";

  describe("Subscription Handshake (GET)", () => {
    it("approves valid handshake matching expected verification token", () => {
      const result = validateWebhookSubscription({
        verifyToken: SECRET_TOKEN,
        challenge: "challenge-token-123456",
        expectedToken: SECRET_TOKEN,
      });

      assert.equal(result.isValid, true);
      assert.deepEqual(result.responseBody, { "hub.challenge": "challenge-token-123456" });
    });

    it("rejects invalid handshake with wrong verification token", () => {
      const result = validateWebhookSubscription({
        verifyToken: "wrong-hacker-token",
        challenge: "challenge-token-123456",
        expectedToken: SECRET_TOKEN,
      });

      assert.equal(result.isValid, false);
      assert.equal(result.responseBody, null);
    });
  });

  describe("Event Dispatcher & Parser (POST)", () => {
    it("parses valid activity creation event correctly", () => {
      const payload: StravaWebhookPayload = {
        object_type: "activity",
        object_id: 987654321,
        aspect_type: "create",
        owner_id: 12345,
        subscription_id: 9999,
        event_time: 1725450000,
        updates: {},
      };

      const parsed = parseStravaWebhookEvent(payload);

      assert.equal(parsed.isActivityEvent, true);
      assert.equal(parsed.action, "create");
      assert.equal(parsed.activityId, 987654321);
      assert.equal(parsed.athleteStravaId, 12345);
    });

    it("identifies non-activity athlete events to bypass processing", () => {
      const payload: StravaWebhookPayload = {
        object_type: "athlete",
        object_id: 12345,
        aspect_type: "update",
        owner_id: 12345,
        subscription_id: 9999,
        event_time: 1725450000,
        updates: { authorized: "false" },
      };

      const parsed = parseStravaWebhookEvent(payload);

      assert.equal(parsed.isActivityEvent, false);
      assert.equal(parsed.action, "update");
    });
  });
});
