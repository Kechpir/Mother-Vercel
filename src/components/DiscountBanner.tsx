"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const PERIOD_MS = 18 * 60 * 60 * 1000;
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

export function DiscountBanner() {
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
  const blocks = [
    { value: pad(days), label: "Дней" },
    { value: pad(hours), label: "Часов" },
    { value: pad(minutes), label: "Минут" },
    { value: pad(seconds), label: "Секунд" },
  ];

  return (
    <div
      className="w-full overflow-hidden px-3 sm:px-4 py-3 sm:py-2.5 text-sm"
      style={{
        backgroundColor: "rgba(15, 14, 12, 0.98)",
        borderBottom: "1px solid rgba(212, 160, 60, 0.2)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4 md:gap-6">
        <span className="font-bold text-[#d4a03c] text-sm sm:text-base md:text-lg text-center sm:text-left">
          Скидка на персональный энергетический протокол
        </span>
        <span className="text-[#e8e0d0] text-xs sm:text-sm md:text-base text-center sm:text-left">
          <span className="text-[#d4a03c] font-semibold">50 000 тенге</span>
          <span className="mx-1.5 text-[#e8e0d0]/80">вместо</span>
          <span className="line-through text-[#e8e0d0]/90">75 000</span>
        </span>
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 min-w-0 flex-shrink-0">
          {blocks.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center min-w-0">
              <div className="bg-[#d4a03c]/20 border border-[#d4a03c]/40 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 min-w-[1.75rem] sm:min-w-[2.25rem] flex justify-center">
                <span className="text-[#d4a03c] font-bold text-xs sm:text-sm tabular-nums">{value}</span>
              </div>
              <span className="text-[8px] sm:text-[10px] uppercase text-[#e8e0d0]/70 mt-0.5">{label}</span>
            </div>
          ))}
        </div>
        <Link
          href="/sessions/energiya-pervonachalnosti"
          className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-[#d4a03c] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e8b84c] transition-colors shrink-0"
        >
          Перейти на Энергетический протокол
        </Link>
      </div>
    </div>
  );
}
