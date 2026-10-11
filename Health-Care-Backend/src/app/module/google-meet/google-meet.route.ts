import { Router } from "express";
import { createGoogleMeet } from "./google-meet.service.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { startTime, durationMinutes = 30 } = req.body ?? {};

    if (!startTime || typeof startTime !== "string") {
      return res.status(400).json({
        message: "startTime is required",
      });
    }

    const meeting = await createGoogleMeet(startTime, Number(durationMinutes));

    return res.status(201).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    console.error("Google Meet error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Google Meet",
    });
  }
});

export const GoogleMeetRoutes = router;