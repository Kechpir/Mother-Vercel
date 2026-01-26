import { NextResponse } from 'next/server';

/**
 * API для получения инвайт-ссылки участника
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participant_id');

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      );
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: participant, error } = await supabase
      .from('participants')
      .select('telegram_invite_link, telegram_invite_used, payment_status')
      .eq('id', participantId)
      .single();

    if (error || !participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    // Если ссылка уже использована, не возвращаем её
    if (participant.telegram_invite_used) {
      return NextResponse.json({
        error: 'Invite link already used',
        inviteLink: null,
      });
    }

    return NextResponse.json({
      inviteLink: participant.telegram_invite_link,
      used: participant.telegram_invite_used,
      paymentStatus: participant.payment_status,
    });
  } catch (error) {
    console.error('Get invite link error:', error);
    return NextResponse.json(
      { error: 'Failed to get invite link' },
      { status: 500 }
    );
  }
}
