import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Webhook от Robokassa для подтверждения оплаты
 * Этот endpoint должен быть указан в настройках Robokassa как Result URL
 * Robokassa может отправлять данные через GET или POST
 */
export async function GET(request: Request) {
  return handleWebhook(request);
}

export async function POST(request: Request) {
  return handleWebhook(request);
}

async function handleWebhook(request: Request) {
  try {
    // Robokassa отправляет данные через POST или GET
    // Нужно получить все параметры из query string или body
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    // Если данные в body (POST), парсим их
    let bodyParams: Record<string, string> = {};
    try {
      const body = await request.text();
      if (body) {
        const formData = new URLSearchParams(body);
        bodyParams = Object.fromEntries(formData) as Record<string, string>;
      }
    } catch (e) {
      // Игнорируем ошибки парсинга body
    }

    // Объединяем параметры (query string имеет приоритет)
    const allParams: Record<string, string> = { ...bodyParams, ...params };

    const {
      OutSum,
      InvId,
      SignatureValue,
      Email,
    } = allParams;

    const password2 = process.env.ROBOKASSA_PASSWORD_2;
    const isTest = process.env.NEXT_PUBLIC_ROBOKASSA_IS_TEST === '1';

    if (!password2) {
      console.error('Missing ROBOKASSA_PASSWORD_2');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    // Проверяем подпись: OutSum:InvId:Password2
    const signatureStr = `${OutSum}:${InvId}:${password2}`;
    const calculatedSignature = crypto
      .createHash('md5')
      .update(signatureStr, 'utf8')
      .digest('hex')
      .toUpperCase();

    if (calculatedSignature !== SignatureValue?.toUpperCase()) {
      console.error('Invalid signature:', {
        received: SignatureValue,
        calculated: calculatedSignature,
        signatureStr,
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Подпись верна, обновляем статус в базе данных
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseServiceKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Ищем участника по InvId (payment_inv_id)
    const { data: participant, error: findError } = await supabase
      .from('participants')
      .select('id, payment_status')
      .eq('payment_inv_id', InvId)
      .single();

    if (findError || !participant) {
      console.error('Participant not found for InvId:', InvId);
      // Все равно возвращаем OK, чтобы Robokassa не повторяла запрос
      return new NextResponse('OK', { status: 200 });
    }

    // Если уже оплачено, просто возвращаем OK
    if (participant.payment_status === 'paid') {
      return new NextResponse('OK', { status: 200 });
    }

    // Обновляем статус на "paid"
    const { error: updateError } = await supabase
      .from('participants')
      .update({
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', participant.id);

    if (updateError) {
      console.error('Failed to update payment status:', updateError);
      return new NextResponse('OK', { status: 200 }); // Все равно OK, чтобы не было повторных запросов
    }

    // Создаем одноразовую Telegram ссылку для этого участника
    try {
      const inviteResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/telegram/create-invite`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participantId: participant.id }),
        }
      );

      if (!inviteResponse.ok) {
        console.error('Failed to create Telegram invite link');
      }
    } catch (inviteError) {
      console.error('Error creating invite link:', inviteError);
      // Не критично, можно создать ссылку позже
    }

    // Robokassa ожидает ответ "OK" в случае успеха
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Все равно возвращаем OK, чтобы Robokassa не повторяла запрос
    return new NextResponse('OK', { status: 200 });
  }
}
