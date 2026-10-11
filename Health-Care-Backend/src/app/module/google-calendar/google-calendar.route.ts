import { Router } from "express";
import { google } from "googleapis";

const router = Router();

router.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  
  if (!code) {
    return res.status(400).json({ success: false, message: "No code found" });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALENDAR_CALLBACK_URL
    );

    const { tokens } = await oauth2Client.getToken(code);

    console.log("GOOGLE CALENDAR TOKENS:", tokens);

    // For testing - show in browser
    return res.send(`
      <html>
        <body style="font-family: monospace; padding: 20px;">
          <h2>✅ Google Calendar Connected!</h2>
          <p>Copy your refresh_token and add to .env</p>
          <pre style="background:#f4f4f4; padding:15px; border-radius:8px; overflow:auto;">${JSON.stringify(tokens, null, 2)}</pre>
          <h3>Next step:</h3>
          <p>In your .env add:</p>
          <code>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</code>
        </body>
      </html>
    `);
    
  } catch (e: any) {
  console.error(e.response?.data || e.message); // <-- log this
  res.status(500).json({
    error: e.response?.data || e.message,
    redirectUriUsed: process.env.GOOGLE_CALENDAR_CALLBACK_URL,
    clientIdUsed: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...",
  });
  }
});

export const GoogleCalendarRoutes = router;