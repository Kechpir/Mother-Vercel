import { NextResponse } from 'next/server';

/**
 * API для получения списка всех зарегистрированных пользователей (profiles)
 * Независимо от оплаты. Защита через ADMIN_PASSWORD.
 */
export async function GET(request: Request) {
  try {
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

    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get('first_name')?.trim();
    const lastName = searchParams.get('last_name')?.trim();

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

    let query = supabase
      .from('profiles')
      .select('id, full_name, phone, city, age, updated_at')
      .order('updated_at', { ascending: false });

    // Фильтр по имени (подстрока в full_name)
    if (firstName) {
      query = query.ilike('full_name', `%${firstName}%`);
    }
    if (lastName) {
      query = query.ilike('full_name', `%${lastName}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      users: users || [],
      totalCount: (users || []).length,
    });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
