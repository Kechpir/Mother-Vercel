"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const PERIOD_MS = 18 * 60 * 60 * 1000; // 18 часов
const EPOCH_MS = new Date("2025-01-01T00:00:00Z").getTime();

function getRemainingMs(): number {
  const now = Date.now();
  const elapsed = now - EPOCH_MS;
  const cycles = Math.ceil(elapsed / PERIOD_MS);
  const endOfCycle = EPOCH_MS + cycles * PERIOD_MS;
  return Math.max(0, endOfCycle - now);
}

function formatCountdown(ms: number): { days: number; hours: number; minutes: number; seconds: number } {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

const PRICE_TENGE = 50_000;
const PRICE_TENGE_OLD = 75_000;
const PRICE_RUB = 8_500; // со скидкой (по курсу от 50k ₸)
const PRICE_RUB_OLD = Math.round((PRICE_RUB / PRICE_TENGE) * PRICE_TENGE_OLD); // без скидки (по курсу от 75k ₸)

export function ProtocolPriceCard() {
  const [mounted, setMounted] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const tick = () => setRemaining(getRemainingMs());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [mounted]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const { days, hours, minutes, seconds } = mounted ? formatCountdown(remaining) : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const countdownBlocks = [
    { value: pad(days), label: "Дней" },
    { value: pad(hours), label: "Часов" },
    { value: pad(minutes), label: "Минут" },
    { value: pad(seconds), label: "Секунд" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto relative px-3 sm:px-0 min-w-0" style={{ fontFamily: "var(--font-hero), inherit" }}>
      {/* Плашка над карточкой */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
        <span className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-amber-500 text-black text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 border-white shadow-sm">
          3 дня скидка
        </span>
      </div>

      <div className="rounded-xl sm:rounded-2xl border-2 border-amber-400/80 bg-white shadow-lg p-4 sm:p-5 md:p-8 pt-5 sm:pt-6 md:pt-8">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-zinc-900 tracking-tight leading-tight text-center mb-0.5 px-1">
          Персональный энергетический протокол
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 text-center mb-3 sm:mb-4">
          Серия из 3 аудиозаписей под ваш запрос
        </p>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-left mb-4 sm:mb-6 max-w-md mx-auto">
          {[
            "Персональный подход",
            "3 аудиозаписи",
            "Готово за 5–7 дней",
            "Поддержка после получения",
          ].map((text) => (
            <li key={text} className="flex items-center gap-2 text-zinc-700 text-xs sm:text-sm">
              <span className="flex-shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-600" strokeWidth={2.5} />
              </span>
              {text}
            </li>
          ))}
        </ul>

        {/* Две ценовые карточки рядом — как в референсе */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-5">
          {/* Тенге — светлая карточка */}
          <div className="rounded-lg sm:rounded-xl border-2 border-amber-200 bg-amber-100 p-3 sm:p-4 md:p-5 min-w-0">
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-800/80 mb-1 sm:mb-2">
              Стоимость в тенге
            </p>
            <p className="text-zinc-900 text-base sm:text-xl md:text-2xl font-black tracking-tight text-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg break-words">
              {PRICE_TENGE.toLocaleString("ru-RU")} <span className="font-bold">₸</span> / <span className="text-red-600 line-through">{PRICE_TENGE_OLD.toLocaleString("ru-RU")}</span> <span className="font-bold">₸</span>
            </p>
          </div>
          {/* Рубли — тёмная карточка, цифры светлые */}
          <div className="rounded-lg sm:rounded-xl bg-zinc-800 border border-zinc-700 p-3 sm:p-4 md:p-5 min-w-0">
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 mb-1 sm:mb-2">
              Приблизительно в рублях
            </p>
            <p className="text-amber-300 text-base sm:text-xl md:text-2xl font-black tracking-tight text-center py-1.5 sm:py-2 break-words">
              ~{PRICE_RUB.toLocaleString("ru-RU")} <span className="font-bold">₽</span> / <span className="text-red-400 line-through">{PRICE_RUB_OLD.toLocaleString("ru-RU")}</span> <span className="font-bold">₽</span>
            </p>
            <p className="text-zinc-500 text-[9px] sm:text-[10px] mt-1 sm:mt-1.5">
              Курс ориентировочный
            </p>
          </div>
        </div>

        {/* Таймер — компактно на мобиле */}
        <div className="rounded-lg sm:rounded-xl border-2 border-amber-200 bg-amber-100 p-2 sm:p-3 mb-4 sm:mb-5 min-w-0 overflow-hidden">
          <p className="text-amber-900/90 text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2 text-center px-1">
            ⚡ Ограниченное предложение! Скидка действует ещё
          </p>
          <div className="flex items-stretch divide-x divide-amber-300">
            {countdownBlocks.map(({ value, label }) => (
              <div key={label} className="flex-1 flex flex-col items-center justify-center py-0.5 sm:py-1 px-0.5 sm:px-1 min-w-0">
                <span className="text-black font-bold text-sm sm:text-lg md:text-xl tabular-nums">{value}</span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-amber-800/70 mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <a
          href="#booking-form"
          className="w-full inline-flex items-center justify-center py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-amber-500 text-black font-bold text-sm sm:text-base uppercase tracking-widest shadow-md transition-all duration-200 hover:bg-amber-600 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
        >
          Оформить протокол
        </a>
        <p className="text-zinc-400 text-[10px] sm:text-xs italic mt-1.5 sm:mt-2 text-center">
          Принимаю не более 5 заявок в месяц
        </p>
      </div>
    </div>
  );
}
