"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";

type OrderType = "main" | "protocol" | null;

export default function SuccessPage() {
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [participantId, setParticipantId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("participant_id");
    const invId = params.get("InvId") || params.get("inv_id");

    if (id) setParticipantId(id);

    if (!id && !invId) {
      setOrderType("main");
      return;
    }

    const checkOrderType = async () => {
      const q = id ? `participant_id=${id}` : `inv_id=${invId}`;
      const res = await fetch(`/api/order-type?${q}`);
      const data = await res.json().catch(() => ({}));
      setOrderType(data.type === "protocol" ? "protocol" : "main");
    };
    checkOrderType();
  }, []);

  useEffect(() => {
    if (orderType !== "main") return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("participant_id");
    const invId = params.get("InvId") || params.get("inv_id");
    if (!id && !invId) return;

    const fetchInviteLink = async (): Promise<boolean> => {
      try {
        const apiUrl = id ? `/api/telegram/get-invite?participant_id=${id}` : `/api/telegram/get-invite?inv_id=${invId}`;
        const response = await fetch(apiUrl);
        if (response.status === 404 && invId) {
          const typeRes = await fetch(`/api/order-type?inv_id=${invId}`);
          const typeData = await typeRes.json().catch(() => ({}));
          if (typeData.type === "protocol") {
            setOrderType("protocol");
            return true;
          }
        }
        if (!response.ok) return false;
        const data = await response.json();
        if (data.inviteLink && typeof data.inviteLink === "string" && data.inviteLink.trim() !== "") {
          setInviteLink(data.inviteLink);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    };

    fetchInviteLink();
    let attempts = 0;
    const intervalId = setInterval(async () => {
      attempts++;
      if (attempts >= 20) clearInterval(intervalId);
      else if (await fetchInviteLink()) clearInterval(intervalId);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [orderType]);

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
          <p className="text-zinc-300 text-lg font-light">
            {orderType === "protocol"
              ? "Спасибо за заказ персонального энергетического протокола"
              : "Спасибо за регистрацию на энергетические сессии"}
          </p>
        </div>

        {orderType === "protocol" ? (
          <div className="bg-zinc-900/50 rounded-2xl p-6 md:p-8 border border-zinc-700/50 mb-6">
            <p className="text-zinc-300 text-center mb-4">
              Аудиозаписи готовятся в течение 5–7 дней. Мы свяжемся с вами по указанным контактам и вышлем материалы.
            </p>
            <div className="text-center">
              <Link
                href="/sessions/energiya-pervonachalnosti"
                className="inline-block text-zinc-400 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest"
              >
                Вернуться к описанию протокола
              </Link>
            </div>
          </div>
        ) : orderType === "main" && inviteLink ? (
          <div className="bg-zinc-900/50 rounded-2xl p-6 md:p-8 border border-zinc-700/50 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">
              Ваша ссылка на Telegram группу
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              Эта ссылка может быть использована только один раз. Нажмите на неё, чтобы присоединиться к закрытой группе.
            </p>
            
            <div className="flex flex-col md:flex-row gap-3">
              <a
                href={inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#ffa600] text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg"
              >
                <ExternalLink size={20} />
                Перейти в группу
              </a>
              
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 bg-zinc-700 text-white px-6 py-4 rounded-xl font-medium uppercase tracking-widest hover:bg-zinc-600 transition-all"
              >
                {copied ? (
                  <>
                    <CheckCircle size={20} />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    Копировать
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/30">
              <p className="text-xs text-zinc-400 font-mono break-all">
                {inviteLink}
              </p>
            </div>
          </div>
        ) : orderType === "main" ? (
          <div className="bg-zinc-900/50 rounded-2xl p-6 md:p-8 border border-zinc-700/50 mb-6">
            <p className="text-zinc-300 text-center">
              Ваша ссылка на Telegram группу генерируется...
            </p>
            <p className="text-zinc-500 text-sm text-center mt-2">
              Если ссылка не появилась в течение минуты, свяжитесь с нами
            </p>
            {participantId && (
              <p className="text-zinc-600 text-xs text-center mt-2 font-mono">
                ID: {participantId}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-zinc-900/50 rounded-2xl p-6 md:p-8 border border-zinc-700/50 mb-6">
            <p className="text-zinc-400 text-center">Загрузка...</p>
          </div>
        )}

        {orderType !== null && orderType !== "protocol" && (
          <div className="text-center">
            <Link
              href="/"
              className="inline-block text-zinc-400 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest"
            >
              Вернуться на главную
            </Link>
          </div>
        )}
        {orderType === "protocol" && (
          <div className="text-center mt-4">
            <Link
              href="/"
              className="inline-block text-zinc-400 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest"
            >
              На главную
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
