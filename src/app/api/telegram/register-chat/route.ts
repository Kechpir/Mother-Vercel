import { NextResponse } from 'next/server';

/**
 * POST /api/telegram/register-chat
 * Сохраняет привязку email → chat_id в telegram_chat_registrations (upsert по email).
 * Вызывается из вебхука бота при /start с payload = base64(email).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : null;
    const chatId = body.chat_id != null ? String(body.chat_id) : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (!chatId) {
      return NextResponse.json({ error: 'Missing chat_id' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date().toISOString();
    const { error } = await supabase
      .from('telegram_chat_registrations')
      .upsert(
        { email, chat_id: chatId, updated_at: now },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('telegram_chat_registrations upsert error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('register-chat error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
