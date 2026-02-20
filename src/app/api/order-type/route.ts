import { NextResponse } from 'next/server';

/**
 * Определяет тип заказа по participant_id или inv_id (payment_inv_id):
 * main = участник с главной (ссылка в Telegram), protocol = заказ протокола (5–7 дней).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participant_id');
    const invId = searchParams.get('inv_id') || searchParams.get('InvId');

    if (!participantId && !invId) {
      return NextResponse.json({ error: 'participant_id or inv_id required' }, { status: 400 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (participantId) {
      const { data: p } = await supabase.from('participants').select('id').eq('id', participantId).maybeSingle();
      if (p) return NextResponse.json({ type: 'main' });
      const { data: o } = await supabase.from('protocol_orders').select('id').eq('id', participantId).maybeSingle();
      if (o) return NextResponse.json({ type: 'protocol' });
      return NextResponse.json({ type: null });
    }

    if (invId) {
      const { data: p } = await supabase.from('participants').select('id').eq('payment_inv_id', invId).maybeSingle();
      if (p) return NextResponse.json({ type: 'main' });
      const { data: o } = await supabase.from('protocol_orders').select('id').eq('payment_inv_id', invId).maybeSingle();
      if (o) return NextResponse.json({ type: 'protocol' });
      return NextResponse.json({ type: null });
    }

    return NextResponse.json({ type: null });
  } catch (e) {
    console.error('order-type error:', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
