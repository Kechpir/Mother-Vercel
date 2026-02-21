/**
 * Отправка инвайт-ссылки участнику на email (Brevo) и в Telegram (если указан chat_id).
 * Если Telegram не заполнен — ошибки нет, ссылка просто не отправляется в Telegram.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const TELEGRAM_SEND_URL = (token: string) => `https://api.telegram.org/bot${token}/sendMessage`;

/** Экранирование для HTML-атрибутов и текста */
function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeHtmlText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildInviteEmailHtml(fullName: string | undefined, inviteLink: string, senderName: string): string {
  const greeting = fullName ? `Здравствуйте, ${escapeHtmlText(fullName)}!` : "Здравствуйте!";
  const safeLink = escapeHtmlAttr(inviteLink);
  const safeSender = escapeHtmlText(senderName);
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ваша ссылка на группу</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f0; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color:#ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background: linear-gradient(135deg, #1a1714 0%, #0f0e0c 100%); padding: 28px 32px; text-align: center;">
              <p style="margin:0; color: #e8e0d0; font-size: 14px; letter-spacing: 0.15em; text-transform: uppercase;">Энергетические сессии</p>
              <p style="margin: 8px 0 0 0; color: #d4a03c; font-size: 12px; letter-spacing: 0.1em;">Оплата получена</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 24px;">
              <p style="margin:0 0 20px 0; color: #1a1714; font-size: 17px; line-height: 1.5;">${greeting}</p>
              <p style="margin:0 0 24px 0; color: #4a4540; font-size: 15px; line-height: 1.6;">Ваша одноразовая ссылка для вступления в закрытую Telegram-группу. Нажмите кнопку ниже или скопируйте ссылку.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${safeLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #d4a03c 0%, #b88620 100%); color: #ffffff; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 12px; letter-spacing: 0.05em;">Перейти в группу</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px 0; color: #7a7570; font-size: 12px;">Ссылка (если кнопка не сработала):</p>
              <p style="margin:0; word-break: break-all;"><a href="${safeLink}" style="color: #d4a03c; font-size: 13px;">${escapeHtmlText(inviteLink)}</a></p>
              <p style="margin: 20px 0 0 0; color: #7a7570; font-size: 13px;">Ссылку можно использовать один раз.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px 28px; border-top: 1px solid #ebe8e4;">
              <p style="margin:0; color: #7a7570; font-size: 13px;">С уважением,<br><strong style="color: #1a1714;">${safeSender}</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

type Participant = {
  email: string | null;
  telegram: string | null;
  full_name?: string | null;
};

/**
 * Отправить инвайт-ссылку на email (Brevo) и в Telegram (если telegram — числовой chat_id).
 * Не бросает ошибок: при отсутствии настроек или данных просто пропускает отправку.
 */
export async function sendInviteLinkToParticipant(
  participant: Participant,
  inviteLink: string
): Promise<void> {
  const senderName = process.env.BREVO_SENDER_NAME || "Энергетические сессии";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@example.com";

  // ——— Email (Brevo) ———
  if (participant.email?.trim()) {
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey) {
      try {
        const res = await fetch(BREVO_API_URL, {
          method: "POST",
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: participant.email.trim() }],
            subject: "Ваша ссылка на группу (оплата получена)",
            textContent: [
              `Здравствуйте${participant.full_name ? `, ${participant.full_name}` : ""}!`,
              "",
              "Оплата получена. Ваша одноразовая ссылка для вступления в закрытую Telegram-группу:",
              "",
              inviteLink,
              "",
              "Ссылку можно использовать один раз. Если не открывается — скопируйте в браузер.",
              "",
              "С уважением,",
              "Энергетические сессии",
            ].join("\n"),
            htmlContent: buildInviteEmailHtml(
              participant.full_name ?? undefined,
              inviteLink,
              senderName
            ),
          }),
        });
        if (!res.ok) {
          const err = await res.text();
          console.error("Brevo send failed:", res.status, err);
        }
      } catch (e) {
        console.error("Brevo send error:", e);
      }
    }
  }

  // ——— Telegram: по email ищем chat_id в telegram_chat_registrations; fallback — participant.telegram (число) ———
  let chatId: string | null = null;
  const email = participant.email?.trim().toLowerCase();
  if (email) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const { data } = await supabase
          .from("telegram_chat_registrations")
          .select("chat_id")
          .eq("email", email)
          .maybeSingle();
        if (data?.chat_id) chatId = String(data.chat_id);
      }
    } catch (e) {
      console.error("Telegram registration lookup error:", e);
    }
  }
  if (!chatId) {
    const telegram = participant.telegram?.trim();
    if (telegram?.match(/^-?\d+$/)) chatId = telegram;
  }
  if (!chatId) return;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  try {
    const text =
      "Оплата прошла успешно. Ваша ссылка для вступления в закрытую группу (одноразовая):\n\n" +
      inviteLink;

    const res = await fetch(TELEGRAM_SEND_URL(botToken), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!data.ok) {
      console.error("Telegram sendMessage failed:", data);
    }
  } catch (e) {
    console.error("Telegram send error:", e);
  }
}
