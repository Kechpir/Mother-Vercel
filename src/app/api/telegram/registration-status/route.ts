import { NextResponse } from 'next/server';

/**
 * GET /api/telegram/registration-status?email=...
 * Возвращает { connected: true } если для email есть запись в telegram_chat_registrations.
 * Используется в личном кабинете для показа попапа «Подключить уведомления».
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return NextResponse.json({ error: 'Invalid or missing email' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('telegram_chat_registrations')
      .select('email')
      .eq('email', normalized)
      .maybeSingle();

    if (error) {
      console.error('telegram_chat_registrations select error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ connected: !!data });
  } catch (e) {
    console.error('registration-status error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
