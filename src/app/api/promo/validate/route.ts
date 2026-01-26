import { NextResponse } from 'next/server';

/**
 * API для проверки и валидации промокода
 */
export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Promo code is required' },
        { status: 400 }
      );
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Ищем промокод в базе данных
    const { data: promoCode, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !promoCode) {
      return NextResponse.json(
        { error: 'Invalid or expired promo code', valid: false },
        { status: 404 }
      );
    }

    // Проверяем срок действия
    if (promoCode.expires_at) {
      const expiresAt = new Date(promoCode.expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: 'Promo code has expired', valid: false },
          { status: 400 }
        );
      }
    }

    // Проверяем лимит использований
    if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) {
      return NextResponse.json(
        { error: 'Promo code usage limit reached', valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      discount_amount: promoCode.discount_amount,
      discount_percent: promoCode.discount_percent,
      code: promoCode.code,
    });
  } catch (error) {
    console.error('Promo code validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate promo code', valid: false },
      { status: 500 }
    );
  }
}
