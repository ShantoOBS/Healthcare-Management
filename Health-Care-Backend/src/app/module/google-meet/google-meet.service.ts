
import { google } from "googleapis";
import crypto from "node:crypto";
import { oauth2Client } from "../../config/google-oauth.js";

export async function createGoogleMeet(
  startTime: string,
  durationMinutes = 30
) {
  const start = new Date(startTime);

  if (
    Number.isNaN(start.getTime()) ||
    start <= new Date() ||
    !Number.isInteger(durationMinutes) ||
    durationMinutes < 1 ||
    durationMinutes > 120
  ) {
    throw new Error("Invalid appointment time or duration");
  }

  const end = new Date(
    start.getTime() + durationMinutes * 60_000
  );

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: "Doctor-Patient Consultation",
      start: {
        dateTime: start.toISOString(),
      },
      end: {
        dateTime: end.toISOString(),
      },
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  return {
    eventId: response.data.id,
    meetUrl: response.data.hangoutLink ?? null,
    conferenceStatus:
      response.data.conferenceData?.createRequest
        ?.status?.statusCode ?? "pending",
  };
}
