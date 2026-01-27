import { NextResponse } from 'next/server';

/**
 * Webhook для получения обновлений от Telegram Bot
 * Отслеживает вступление пользователей в группу и автоматически отзывает ссылку
 */
export async function POST(request: Request) {
  try {
    const update = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const groupId = process.env.TELEGRAM_GROUP_ID;

    if (!botToken || !groupId) {
      return NextResponse.json({ ok: true }); // Игнорируем если не настроено
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
