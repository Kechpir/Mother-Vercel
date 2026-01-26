import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { amount, email, description, participantId, promoCode } = await request.json();

    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
    const isTest = process.env.NEXT_PUBLIC_ROBOKASSA_IS_TEST === '1' ? 1 : 0;
    
    // Для тестового режима используем тестовый пароль, если он задан
    const password1 = isTest && process.env.ROBOKASSA_TEST_PASSWORD_1 
      ? process.env.ROBOKASSA_TEST_PASSWORD_1 
      : process.env.ROBOKASSA_PASSWORD_1;

    if (!merchantLogin || !password1) {
      console.error('Missing Robokassa credentials:', { 
        hasLogin: !!merchantLogin, 
        hasPassword: !!password1,
        isTest,
        hasTestPassword: !!process.env.ROBOKASSA_TEST_PASSWORD_1
      });
      return NextResponse.json({ error: 'Missing Robokassa credentials' }, { status: 500 });
    }

    // Уникальный ID платежа (используем timestamp в секундах)
    const invId = Math.floor(Date.now() / 1000); 

    // Формируем подпись: MerchantLogin:OutSum:InvId:Password1
    // Сумму нужно форматировать до 2 знаков после запятой (например 25000.00)
    const outSum = Number(amount).toFixed(2);
    const signatureStr = `${merchantLogin}:${outSum}:${invId}:${password1}`;
    const signature = crypto.createHash('md5').update(signatureStr, 'utf8').digest('hex').toUpperCase();

    // Описание нужно правильно закодировать для URL
    const paymentDescription = description || 'Оплата участия в энергетических сессиях';

    // Формируем URL с правильной кодировкой
    const baseUrl = 'https://auth.robokassa.kz/Merchant/Index.aspx';
    const params = new URLSearchParams();
    params.append('MerchantLogin', merchantLogin);
    params.append('OutSum', outSum);
    params.append('InvId', invId.toString());
    params.append('Description', paymentDescription);
    params.append('SignatureValue', signature);
    if (email) {
      params.append('Email', email);
    }
    if (isTest) {
      params.append('IsTest', '1');
    }

    // Добавляем Success URL (куда вернуть пользователя после оплаты)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://energy-practice.org';
    params.append('SuccessURL', `${siteUrl}/success?participant_id=${participantId || ''}`);

    const paymentUrl = `${baseUrl}?${params.toString()}`;

    // Сохраняем InvId в базу данных, если передан participantId
    if (participantId) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          await supabase
            .from('participants')
            .update({ 
              payment_inv_id: invId.toString(),
              promo_code: promoCode || null,
            })
            .eq('id', participantId);
          
          // Если промокод использован, увеличиваем счетчик использований
          if (promoCode) {
            const { data: promo } = await supabase
              .from('promo_codes')
              .select('used_count')
              .eq('code', promoCode.toUpperCase())
              .single();
            
            if (promo) {
              await supabase
                .from('promo_codes')
                .update({ used_count: (promo.used_count || 0) + 1 })
                .eq('code', promoCode.toUpperCase());
            }
          }
        }
      } catch (dbError) {
        console.error('Failed to save InvId to database:', dbError);
        // Не критично, продолжаем
      }
    }

    // Логируем для отладки (всегда, чтобы видеть в Vercel)
    console.log('Robokassa payment URL generated:', {
      merchantLogin,
      outSum,
      invId,
      signatureStr: signatureStr.replace(password1, '***HIDDEN***'), // Скрываем пароль в логах
      signature,
      isTest,
      usingTestPassword: isTest && !!process.env.ROBOKASSA_TEST_PASSWORD_1,
      url: paymentUrl
    });

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 });
  }
}
