import { NextResponse } from 'next/server';

/**
 * Webhook для получения обновлений от Telegram Bot
 * Отслеживает вступление пользователей в группу и автоматически отзывает ссылку
 */
const TELEGRAM_SEND_URL = (token: string) => `https://api.telegram.org/bot${token}/sendMessage`;

export async function POST(request: Request) {
  try {
    const update = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const groupId = process.env.TELEGRAM_GROUP_ID;

    if (!botToken) {
      return NextResponse.json({ ok: true });
    }

    // —— Обработка /start в личке: привязка email → chat_id для уведомлений ——
    const message = update.message;
    const text = message?.text?.trim();
    if (message && text?.startsWith('/start')) {
      const payload = text.slice(6).trim(); // всё после "/start" (6 символов)
      let email: string | null = null;
      if (payload) {
        try {
          // Поддержка base64url из ссылки t.me/Bot?start=...
          let b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
          const pad = b64.length % 4;
          if (pad) b64 += '='.repeat(4 - pad);
          email = Buffer.from(b64, 'base64').toString('utf8').trim().toLowerCase();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) email = null;
        } catch {
          email = null;
        }
      }
      const chatId = message.chat?.id != null ? String(message.chat.id) : null;
      if (email && chatId) {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (supabaseUrl && supabaseServiceKey) {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(supabaseUrl, supabaseServiceKey);
            const now = new Date().toISOString();
            const { error } = await supabase
              .from('telegram_chat_registrations')
              .upsert(
                { email, chat_id: chatId, updated_at: now },
                { onConflict: 'email' }
              );
            if (!error) {
              // Дублируем в registered_members по email (если такая запись есть — владелец учётки)
              await supabase
                .from('registered_members')
                .update({ telegram_chat_id: chatId })
                .eq('email', email);
              await fetch(TELEGRAM_SEND_URL(botToken), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: 'Уведомления подключены. После оплаты вы получите ссылку на группу здесь.',
                  disable_web_page_preview: true,
                }),
              });
            } else {
              console.error('telegram_chat_registrations upsert:', error);
            }
          }
        } catch (e) {
          console.error('Register chat /start error:', e);
        }
      }
      return NextResponse.json({ ok: true });
    }

    if (!groupId) {
      return NextResponse.json({ ok: true });
    }

    // Проверяем событие вступления в группу
    let userId: number | undefined;
    let chatId: string | undefined;

    // Обрабатываем разные типы обновлений
    if (update.message?.new_chat_members) {
      // Событие через message.new_chat_members
      userId = update.message.new_chat_members[0]?.id;
      chatId = String(update.message.chat.id);
    } else if (update.chat_member) {
      // Событие через chat_member (более надежный способ)
      const newStatus = update.chat_member.new_chat_member?.status;
      const oldStatus = update.chat_member.old_chat_member?.status;
      
      // Пользователь вступил в группу (стал member)
      if (newStatus === 'member' && oldStatus !== 'member') {
        userId = update.chat_member.new_chat_member.user?.id;
        chatId = String(update.chat_member.chat.id);
      }
    }

    // Если это наша группа и пользователь вступил
    if (chatId === groupId && userId) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

      if (supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        // Ищем участника с неиспользованной ссылкой
        const { data: participants } = await supabase
          .from('participants')
          .select('id, telegram_invite_link, telegram_invite_used')
          .eq('telegram_invite_used', false)
          .not('telegram_invite_link', 'is', null);

        // Отзываем все неиспользованные ссылки
        for (const participant of participants || []) {
          if (participant.telegram_invite_link) {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://energy-practice.org'}/api/telegram/revoke-invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  inviteLink: participant.telegram_invite_link,
                  participantId: participant.id,
                }),
              });
            } catch (error) {
              console.error('Failed to revoke invite link:', error);
            }
          }
        }
      }
    }

    // Всегда возвращаем OK для Telegram
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}
