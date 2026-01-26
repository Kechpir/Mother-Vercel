import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { amount, email, description } = await request.json();

    const merchantLogin = process.env.ROBOKASSA_MERCHANT_LOGIN;
    const password1 = process.env.ROBOKASSA_PASSWORD_1;
    const isTest = process.env.NEXT_PUBLIC_ROBOKASSA_IS_TEST === '1' ? 1 : 0;

    if (!merchantLogin || !password1) {
      return NextResponse.json({ error: 'Missing Robokassa credentials' }, { status: 500 });
    }

    // Уникальный ID платежа (можно заменить на ID из базы данных)
    const invId = Math.floor(Date.now() / 1000); 

    // Формируем подпись: MerchantLogin:OutSum:InvId:Password1
    // Сумму нужно форматировать до 2 знаков после запятой (например 25000.00)
    const outSum = Number(amount).toFixed(2);
    const signatureStr = `${merchantLogin}:${outSum}:${invId}:${password1}`;
    const signature = crypto.createHash('md5').update(signatureStr).digest('hex');

    // Формируем URL
    const baseUrl = 'https://auth.robokassa.kz/Merchant/Index.aspx';
    const params = new URLSearchParams({
      MerchantLogin: merchantLogin,
      OutSum: outSum,
      InvId: invId.toString(),
      Description: description || 'Оплата участия в энергетических сессиях',
      SignatureValue: signature,
      Email: email,
      IsTest: isTest.toString(),
      // Можно добавить свои параметры через Shp_
      // Shp_item: 'energy_session'
    });

    const paymentUrl = `${baseUrl}?${params.toString()}`;

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 });
  }
}
