import { NextResponse } from 'next/server';

/**
 * API для получения списка участников (только для админа)
 * Защита через ADMIN_PASSWORD в переменных окружения
 */
export async function GET(request: Request) {
  try {
    // Проверка авторизации
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin access not configured' },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Получаем параметры фильтрации
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const minAmount = searchParams.get('min_amount');
    const maxAmount = searchParams.get('max_amount');
    const status = searchParams.get('status') || 'paid'; // По умолчанию только оплаченные

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Строим запрос с фильтрами
    let query = supabase
      .from('participants')
      .select('*')
      .eq('payment_status', status)
      .order('created_at', { ascending: false });

    // Фильтр по дате
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Фильтр по сумме
    if (minAmount) {
      query = query.gte('payment_amount', parseFloat(minAmount));
    }
    if (maxAmount) {
      query = query.lte('payment_amount', parseFloat(maxAmount));
    }

    const { data: participants, error } = await query;

    if (error) {
      console.error('Error fetching participants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch participants' },
        { status: 500 }
      );
    }

    // Подсчитываем статистику
    const totalAmount = participants?.reduce((sum, p) => sum + (parseFloat(p.payment_amount?.toString() || '0') || 0), 0) || 0;
    const totalCount = participants?.length || 0;

    return NextResponse.json({
      participants: participants || [],
      stats: {
        totalCount,
        totalAmount: totalAmount.toFixed(2),
      },
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
