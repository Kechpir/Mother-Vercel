import { NextResponse } from 'next/server';

/**
 * API для создания одноразовой инвайт-ссылки в Telegram группу
 * Использует Telegram Bot API
 */
export async function POST(request: Request) {
  try {
    const { participantId } = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const groupId = process.env.TELEGRAM_GROUP_ID;

    if (!botToken || !groupId) {
      console.error('Missing Telegram credentials:', {
        hasBotToken: !!botToken,
        hasGroupId: !!groupId
      });
      return NextResponse.json(
        { error: 'Telegram bot not configured' },
        { status: 500 }
      );
    }

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      );
    }

    // Создаем одноразовую инвайт-ссылку через Telegram Bot API
    // member_limit: 1 означает, что ссылка может быть использована только один раз
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/createChatInviteLink`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: groupId,
        member_limit: 1, // Одноразовая ссылка
        name: `Invite for participant ${participantId}`, // Опциональное имя ссылки
        creates_join_request: false, // Прямое вступление, без запроса
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json(
        { error: 'Failed to create invite link', details: data.description },
        { status: 500 }
      );
    }

    const inviteLink = data.result.invite_link;

    // Сохраняем ссылку в базу данных
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Нужен service role key для серверных операций

    if (!supabaseServiceKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from('participants')
      .update({
        telegram_invite_link: inviteLink,
        telegram_invite_created_at: new Date().toISOString(),
        telegram_invite_used: false,
      })
      .eq('id', participantId);

    if (updateError) {
      console.error('Failed to save invite link to database:', updateError);
      // Не возвращаем ошибку, так как ссылка уже создана в Telegram
    }

    return NextResponse.json({
      inviteLink,
      participantId,
    });
  } catch (error) {
    console.error('Create invite link error:', error);
    return NextResponse.json(
      { error: 'Failed to create invite link' },
      { status: 500 }
    );
  }
}
