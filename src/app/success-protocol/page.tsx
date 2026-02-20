"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessProtocolPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full bg-zinc-800/50 backdrop-blur-sm rounded-3xl border-2 border-[#ffa600]/30 shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#ffa600]/20 mb-6">
            <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-[#ffa600]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">
            Оплата успешна!
          </h1>
          <p className="text-zinc-300 text-lg font-light mb-4">
            Спасибо за заказ персонального энергетического протокола.
          </p>
          <p className="text-zinc-400 text-base">
            Аудиозаписи готовятся в течение 5–7 дней. Мы свяжемся с вами по указанным контактам и вышлем материалы.
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/sessions/energiya-pervonachalnosti"
            className="inline-block text-zinc-400 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest"
          >
            Вернуться к описанию протокола
          </Link>
        </div>
      </div>
    </main>
  );
}
