import { NextResponse } from 'next/server';

/**
 * API для отзыва (деактивации) инвайт-ссылки в Telegram группу
 */
export async function POST(request: Request) {
  try {
    const { inviteLink, participantId } = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const groupId = process.env.TELEGRAM_GROUP_ID;

    if (!botToken || !groupId || !inviteLink) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Отзываем ссылку через Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/revokeChatInviteLink`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: groupId,
        invite_link: inviteLink,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(
        { error: 'Failed to revoke invite link', details: data.description },
        { status: 500 }
      );
    }

    // Обновляем статус в БД
    if (participantId) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          await supabase
            .from('participants')
            .update({ telegram_invite_used: true })
            .eq('id', participantId);
        }
      } catch (dbError) {
        console.error('Failed to update invite link status:', dbError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Revoke invite link error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke invite link' },
      { status: 500 }
    );
  }
}
