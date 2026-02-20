"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User, Sparkles, Phone, Mail, MapPin } from "lucide-react";

const FORM_FIELDS = [
  { id: "full_name", placeholder: "ФИО полностью", icon: <User size={18} /> },
  { id: "age", placeholder: "Ваш возраст", icon: <Sparkles size={18} /> },
  { id: "phone", placeholder: "Ваш Телефон", icon: <Phone size={18} /> },
  { id: "email", placeholder: "Ваш Email", icon: <Mail size={18} /> },
  { id: "city", placeholder: "Ваш Город", icon: <MapPin size={18} /> },
] as const;

type FormData = {
  full_name: string;
  age: string;
  phone: string;
  email: string;
  city: string;
  promo_code: string;
};

type BookingFormProps = {
  amount: number;
  description: string;
  usePromo?: boolean;
  /** 'protocol' = заявка в таблицу protocol_orders, без инвайт-ссылок после оплаты */
  productType?: 'main' | 'protocol';
};

export function BookingForm({ amount, description, usePromo = false, productType = 'main' }: BookingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    age: "",
    phone: "",
    email: "",
    city: "",
    promo_code: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState(amount);
  const [promoCodeValid, setPromoCodeValid] = useState<{ valid: boolean; discount?: number } | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);

  const checkPromoCode = async (code: string) => {
    if (!code || code.trim().length < 3) {
      setPromoCodeValid(null);
      setFinalAmount(amount);
      return;
    }
    setCheckingPromo(true);
    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });
      const data = await response.json();
      if (data.valid) {
        const discount = data.discount_amount || 0;
        setPromoCodeValid({ valid: true, discount });
        setFinalAmount(Math.max(0, amount - discount));
      } else {
        setPromoCodeValid({ valid: false });
        setFinalAmount(amount);
      }
    } catch {
      setPromoCodeValid({ valid: false });
      setFinalAmount(amount);
    } finally {
      setCheckingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Пожалуйста, подтвердите согласие с условиями");
      return;
    }
    setLoading(true);
    try {
      const isProtocol = productType === 'protocol';
      const table = isProtocol ? 'protocol_orders' : 'participants';
      const { data: row, error } = await supabase
        .from(table)
        .insert([
          {
            ...formData,
            promo_code: formData.promo_code ? formData.promo_code.toUpperCase() : null,
          },
        ])
        .select("id")
        .single();

      if (error) throw error;
      if (!row?.id) throw new Error("Не удалось сохранить данные");

      const paymentResponse = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          email: formData.email,
          description,
          participantId: isProtocol ? undefined : row.id,
          protocolOrderId: isProtocol ? row.id : undefined,
          promoCode: formData.promo_code ? formData.promo_code.toUpperCase() : null,
        }),
      });

      const paymentData = await paymentResponse.json();
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error("Не удалось создать ссылку на оплату");
      }
    } catch (err: unknown) {
      alert("Ошибка: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-3 md:p-4 rounded-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,166,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] border-2 border-[#ffa600]/20 relative overflow-hidden">
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#ffa600] to-transparent rounded-full" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffa600]/10 rounded-full blur-[80px] -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ffa600]/10 rounded-full blur-[80px] -ml-24 -mb-24" />

      <div className="text-left mb-2 space-y-0.5 relative z-10">
        <p className="text-zinc-300 text-[10px] font-light max-w-xs leading-snug">
          Заполните данные и перейдите к оплате.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-1.5 relative z-10">
        {FORM_FIELDS.map((field) => (
          <div key={field.id} className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ffa600] transition-colors duration-300 z-10">
              {field.icon}
            </div>
            <input
              required
              type={
                field.id === "email"
                  ? "email"
                  : field.id === "phone"
                    ? "tel"
                    : field.id === "age"
                      ? "number"
                      : "text"
              }
              placeholder={field.placeholder}
              className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 py-2 px-3 pl-10 rounded-lg text-sm text-white outline-none focus:border-[#ffa600] focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300 placeholder:text-zinc-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:border-zinc-600"
              value={formData[field.id]}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            />
          </div>
        ))}

        {usePromo && (
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ffa600] transition-colors duration-300 z-10">
              <Sparkles size={18} />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Промокод (необязательно)"
                className="w-full bg-zinc-800/50 border-2 py-2 px-3 pl-10 pr-24 rounded-lg text-sm text-white outline-none focus:border-[#ffa600] focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300 placeholder:text-zinc-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:border-zinc-600"
                value={formData.promo_code}
                onChange={(e) => {
                  setFormData({ ...formData, promo_code: e.target.value });
                  if (e.target.value.length >= 3) {
                    checkPromoCode(e.target.value);
                  } else {
                    setPromoCodeValid(null);
                    setFinalAmount(amount);
                  }
                }}
              />
              {checkingPromo && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#ffa600] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {promoCodeValid && !checkingPromo && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {promoCodeValid.valid ? (
                    <span className="text-green-500 text-xs font-bold">✓</span>
                  ) : (
                    <span className="text-red-500 text-xs font-bold">✗</span>
                  )}
                </div>
              )}
            </div>
            {promoCodeValid && !promoCodeValid.valid && formData.promo_code && (
              <p className="text-red-400 text-xs mt-1 ml-4">Неверный промокод</p>
            )}
          </div>
        )}

        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ffa600] to-[#ff8c00] text-white py-2.5 rounded-xl font-black text-sm hover:from-black hover:to-zinc-900 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest active:scale-[0.98] shadow-[0_8px_24px_-5px_rgba(255,166,0,0.4)]"
          >
            {loading ? "ПОДОЖДИТЕ..." : "ОПЛАТИТЬ"}
          </button>

          <div className="bg-zinc-800/40 backdrop-blur-sm p-2 rounded-lg border-2 border-zinc-700/30 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-start gap-2">
            <div className="pt-0.5">
              <input
                required
                type="checkbox"
                id="agreed-booking"
                className="w-4 h-4 rounded border-zinc-700 text-[#ffa600] focus:ring-[#ffa600] cursor-pointer"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            </div>
            <label htmlFor="agreed-booking" className="text-[8px] md:text-[9px] text-zinc-300 leading-relaxed font-medium cursor-pointer">
              Я подтверждаю, что ознакомлен с{" "}
              <Link href="/offer" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Договором оферты</Link> и принимаю его условия, даю{" "}
              <Link href="/consent" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Согласие на обработку</Link> моих персональных данных на условиях{" "}
              <Link href="/privacy" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Политики конфиденциальности</Link>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
