/**
 * Отправка инвайт-ссылки участнику на email (Brevo) и в Telegram (если указан chat_id).
 * Если Telegram не заполнен — ошибки нет, ссылка просто не отправляется в Telegram.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const TELEGRAM_SEND_URL = (token: string) => `https://api.telegram.org/bot${token}/sendMessage`;

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
            subject: "Ваша ссылка на Telegram-группу — энергетические сессии",
            htmlContent: `
              <p>Здравствуйте${participant.full_name ? `, ${participant.full_name}` : ""}!</p>
              <p>Оплата прошла успешно. Ваша одноразовая ссылка для вступления в закрытую Telegram-группу:</p>
              <p><a href="${inviteLink}" style="word-break: break-all;">${inviteLink}</a></p>
              <p>Ссылку можно использовать только один раз. Если ссылка не открывается, скопируйте её в браузер.</p>
              <p>С уважением,<br/>Команда энергетических сессий</p>
            `,
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
