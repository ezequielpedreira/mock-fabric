import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).nullable().optional(),
  page: z.string().max(500).nullable().optional(),
});

const NOTIFY_EMAIL = "ezequielpedreira2016@hotmail.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const notifyFeedback = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!lovableKey || !resendKey) {
      console.error("Missing email keys for feedback notification");
      return { ok: false, error: "email_not_configured" };
    }

    const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
    const comment = data.comment?.trim() || "(sem comentário)";
    const page = data.page || "(desconhecida)";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
        <h2 style="margin: 0 0 16px; color: #111;">Novo feedback recebido</h2>
        <p style="font-size: 24px; margin: 0 0 8px; color: #f59e0b; letter-spacing: 2px;">${stars}</p>
        <p style="margin: 0 0 16px; color: #555;"><strong>Nota:</strong> ${data.rating}/5</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(comment)}</p>
        </div>
        <p style="margin: 0; font-size: 13px; color: #888;"><strong>Página:</strong> ${escapeHtml(page)}</p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #888;"><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
      </div>
    `;

    try {
      const res = await fetch(`${GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": resendKey,
        },
        body: JSON.stringify({
          from: "Feedback <onboarding@resend.dev>",
          to: [NOTIFY_EMAIL],
          subject: `Novo feedback (${data.rating}/5)`,
          html,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Resend gateway error", res.status, text);
        return { ok: false, error: "send_failed" };
      }
      return { ok: true };
    } catch (err) {
      console.error("notifyFeedback error", err);
      return { ok: false, error: "exception" };
    }
  });