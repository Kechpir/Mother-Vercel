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

    // Ищем по InvId: сначала в participants (главная), потом в protocol_orders (протокол)
    const { data: participant, error: findError } = await supabase
      .from('participants')
      .select('id, payment_status, email, telegram, full_name')
      .eq('payment_inv_id', InvId)
      .single();

    if (!findError && participant) {
      // Оплата с главной страницы — обновляем, создаём инвайт, шлём на email/Telegram
      if (participant.payment_status === 'paid') {
        return new NextResponse('OK', { status: 200 });
      }
      const { error: updateError } = await supabase
        .from('participants')
        .update({
          payment_status: 'paid',
          payment_amount: parseFloat(OutSum) || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', participant.id);
      if (updateError) {
        console.error('Failed to update payment status:', updateError);
        return new NextResponse('OK', { status: 200 });
      }
      let inviteLink: string | null = null;
      try {
        const inviteResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/telegram/create-invite`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participantId: participant.id }),
          }
        );
        const inviteData = await inviteResponse.json().catch(() => ({}));
        inviteLink = inviteData.inviteLink || null;
        if (!inviteResponse.ok) {
          console.error('Failed to create Telegram invite link');
        } else if (inviteLink) {
          const { sendInviteLinkToParticipant } = await import('@/lib/send-invite-link');
          await sendInviteLinkToParticipant(
            {
              email: participant.email ?? null,
              telegram: participant.telegram ?? null,
              full_name: participant.full_name ?? null,
            },
            inviteLink
          );
        }
      } catch (inviteError) {
        console.error('Error creating invite link:', inviteError);
      }
      return new NextResponse('OK', { status: 200 });
    }

    // Не нашли в participants — проверяем protocol_orders (Персональный энергетический протокол)
    const { data: protocolOrder, error: protocolError } = await supabase
      .from('protocol_orders')
      .select('id, payment_status, full_name, email, phone, city, payment_amount')
      .eq('payment_inv_id', InvId)
      .single();

    if (!protocolError && protocolOrder) {
      if (protocolOrder.payment_status === 'paid') {
        return new NextResponse('OK', { status: 200 });
      }
      await supabase
        .from('protocol_orders')
        .update({
          payment_status: 'paid',
          payment_amount: parseFloat(OutSum) || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', protocolOrder.id);

      // Уведомление в Telegram о покупке протокола
      const notifyChatId = process.env.TELEGRAM_NOTIFY_CHAT_ID || process.env.TELEGRAM_GROUP_ID;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken && notifyChatId) {
        const sum = OutSum ? `${OutSum} ₸` : (protocolOrder.payment_amount ? `${protocolOrder.payment_amount} ₸` : '—');
        const lines = [
          '🟢 Оплата: Персональный энергетический протокол',
          '',
          `ФИО: ${protocolOrder.full_name || '—'}`,
          `Email: ${protocolOrder.email || '—'}`,
          `Телефон: ${protocolOrder.phone || '—'}`,
          `Город: ${protocolOrder.city || '—'}`,
          `Сумма: ${sum}`,
        ];
        try {
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: notifyChatId,
              text: lines.join('\n'),
              disable_web_page_preview: true,
            }),
          });
        } catch (e) {
          console.error('Telegram protocol notify error:', e);
        }
      }

      return new NextResponse('OK', { status: 200 });
    }

    console.error('Participant/protocol not found for InvId:', InvId);

    // Robokassa ожидает ответ "OK" в случае успеха
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Все равно возвращаем OK, чтобы Robokassa не повторяла запрос
    return new NextResponse('OK', { status: 200 });
  }
}
