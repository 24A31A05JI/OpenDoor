import { Router, type IRouter } from "express";
import { NotifyApplicationSubmissionBody } from "@workspace/api-zod";
import { ReplitConnectors } from "@replit/connectors-sdk";

const router: IRouter = Router();
const connectors = new ReplitConnectors();

router.post("/applications/notify", async (req, res) => {
  const parsed = NotifyApplicationSubmissionBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Please provide a valid email and application details." });
    return;
  }

  const { email, opportunityTitle, company, applicationUrl } = parsed.data;

  try {
    const response = await connectors.proxy("resend", "/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "OpenDoor <onboarding@resend.dev>",
        to: [email],
        subject: `Your OpenDoor application is in progress: ${opportunityTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #171b2d; line-height: 1.6;">
            <h1 style="margin-bottom: 8px;">Your application is in progress</h1>
            <p>We saved your application to OpenDoor so you can find it again in your account.</p>
            <p><strong>${opportunityTitle}</strong><br />${company}</p>
            <p><a href="${applicationUrl}" style="color: #ed624f; font-weight: 700;">Open the application website</a></p>
            <p style="color: #667085; font-size: 14px;">Status: In progress</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      req.log.error({ status: response.status }, "Resend rejected application confirmation");
      res.status(502).json({ error: "The application was saved, but the confirmation email could not be sent." });
      return;
    }

    res.json({ sent: true });
  } catch (error) {
    req.log.error({ err: error }, "Application confirmation email failed");
    res.status(502).json({ error: "The application was saved, but the confirmation email could not be sent." });
  }
});

export default router;