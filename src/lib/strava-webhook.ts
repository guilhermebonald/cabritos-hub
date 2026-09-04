export interface StravaWebhookPayload {
  object_type: "activity" | "athlete";
  object_id: number;
  aspect_type: "create" | "update" | "delete";
  owner_id: number;
  subscription_id: number;
  event_time: number;
  updates: Record<string, string>;
}

export interface WebhookValidationInput {
  verifyToken: string | null;
  challenge: string | null;
  expectedToken: string;
}

export interface WebhookValidationResult {
  isValid: boolean;
  responseBody: { "hub.challenge": string } | null;
}

export interface ParsedWebhookEvent {
  isActivityEvent: boolean;
  action: "create" | "update" | "delete";
  activityId?: number;
  athleteStravaId: number;
  eventTime: number;
  updates: Record<string, string>;
}

/**
 * Validates the initial GET subscription handshake sent by Strava Webhook API.
 * Responds with { "hub.challenge": challenge } when token matches.
 */
export function validateWebhookSubscription(input: WebhookValidationInput): WebhookValidationResult {
  if (input.verifyToken === input.expectedToken && input.challenge) {
    return {
      isValid: true,
      responseBody: { "hub.challenge": input.challenge },
    };
  }

  return {
    isValid: false,
    responseBody: null,
  };
}

/**
 * Parses and categorizes incoming event callbacks from Strava.
 */
export function parseStravaWebhookEvent(payload: StravaWebhookPayload): ParsedWebhookEvent {
  const isActivity = payload.object_type === "activity";

  return {
    isActivityEvent: isActivity,
    action: payload.aspect_type,
    activityId: isActivity ? payload.object_id : undefined,
    athleteStravaId: payload.owner_id,
    eventTime: payload.event_time,
    updates: payload.updates || {},
  };
}
