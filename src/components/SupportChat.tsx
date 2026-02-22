"use client";

import { MessageCircle } from "lucide-react";

const SUPPORT_USERNAME = "Kechpir";
const SUPPORT_PREFILL = "Опишите вашу проблему";
const SUPPORT_LINK = `https://t.me/${SUPPORT_USERNAME}?text=${encodeURIComponent(SUPPORT_PREFILL)}`;

export function SupportChat() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      <span className="rounded-full bg-zinc-800/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg ring-1 ring-white/10">
        Чат поддержки
      </span>
      <a
        href={SUPPORT_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffa600] text-black shadow-lg ring-2 ring-[#ffa600]/50 transition-all hover:scale-110 hover:bg-[#ff8c00] hover:shadow-xl hover:ring-[#ffa600] focus:outline-none focus:ring-2 focus:ring-[#ffa600] focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Написать в поддержку в Telegram"
        title="Поддержка в Telegram"
      >
        <MessageCircle className="h-7 w-7" strokeWidth={2.5} />
      </a>
    </div>
  );
}
