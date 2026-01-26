import { NextResponse } from 'next/server';

/**
 * API для получения инвайт-ссылки участника
 * Может принимать participant_id или InvId (payment_inv_id)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participant_id');
    const invId = searchParams.get('inv_id'); // InvId от Robokassa

    if (!participantId && !invId) {
      console.error('Get invite: participant_id or inv_id is required');
      return NextResponse.json(
        { error: 'Participant ID or InvId is required' },
        { status: 400 }
      );
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let participant;
    let error;

    // Если передан InvId, ищем участника по payment_inv_id
    if (invId) {
      console.log('Get invite: searching by InvId:', invId);
      const result = await supabase
        .from('participants')
        .select('id, telegram_invite_link, telegram_invite_used, payment_status')
        .eq('payment_inv_id', invId)
        .single();
      participant = result.data;
      error = result.error;
    } else {
      // Ищем по participant_id
      console.log('Get invite: fetching for participant:', participantId);
      const result = await supabase
        .from('participants')
        .select('telegram_invite_link, telegram_invite_used, payment_status')
        .eq('id', participantId)
        .single();
      participant = result.data;
      error = result.error;
    }

    if (error || !participant) {
      console.error('Get invite: participant not found:', { error, participantId, invId });
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    console.log('Get invite: participant found:', {
      hasInviteLink: !!participant.telegram_invite_link,
      inviteLink: participant.telegram_invite_link,
      used: participant.telegram_invite_used,
      paymentStatus: participant.payment_status,
    });

    // Если ссылка уже использована, не возвращаем её
    if (participant.telegram_invite_used) {
      console.log('Get invite: link already used');
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
