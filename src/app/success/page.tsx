"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";

export default function SuccessPage() {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [participantId, setParticipantId] = useState<string | null>(null);

  useEffect(() => {
    // Получаем параметры из URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('participant_id');
    const invId = params.get('InvId') || params.get('inv_id'); // Robokassa возвращает InvId
    
    // Если нет participant_id, пробуем использовать InvId
    if (!id && !invId) {
      console.warn('No participant_id or InvId in URL. Available params:', Array.from(params.keys()));
      return;
    }
    
    if (id) {
      setParticipantId(id);
      console.log('Using participant_id:', id);
    } else if (invId) {
      console.log('Using InvId from Robokassa:', invId);
    }
    
    // Функция для получения ссылки
    const fetchInviteLink = async () => {
      try {
        // Формируем URL с параметрами
        let apiUrl = '/api/telegram/get-invite?';
        if (id) {
          apiUrl += `participant_id=${id}`;
        } else if (invId) {
          apiUrl += `inv_id=${invId}`;
        }
        
        console.log('Fetching invite link from:', apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText);
          const errorData = await response.json().catch(() => ({}));
          console.error('Error details:', errorData);
          return false;
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        // Проверяем, что inviteLink существует, не null и не пустая строка
        if (data.inviteLink && typeof data.inviteLink === 'string' && data.inviteLink.trim() !== '') {
          console.log('Invite link found:', data.inviteLink);
          setInviteLink(data.inviteLink);
          return true; // Ссылка найдена
        }
        
        console.log('Invite link not ready yet:', data);
        return false; // Ссылка еще не готова
      } catch (error) {
        console.error('Failed to fetch invite link:', error);
        return false;
      }
    };
    
    // Пытаемся получить ссылку сразу
    fetchInviteLink();
    
    // Если ссылки еще нет, начинаем периодически проверять (polling)
    // Проверяем каждые 3 секунды, максимум 20 раз (1 минута)
    let attempts = 0;
    const maxAttempts = 20;
    
    const intervalId = setInterval(async () => {
      attempts++;
      
      // Если превысили лимит попыток, прекращаем
      if (attempts >= maxAttempts) {
        console.log('Max attempts reached, stopping polling');
        clearInterval(intervalId);
        return;
      }
      
      // Проверяем ссылку
      const found = await fetchInviteLink();
      
      // Если ссылка найдена, прекращаем проверку
      if (found) {
        console.log('Invite link found, stopping polling');
        clearInterval(intervalId);
      }
    }, 3000); // Каждые 3 секунды
    
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

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
            Спасибо за регистрацию на энергетические сессии
          </p>
        </div>

        {inviteLink ? (
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
        ) : (
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
        )}

        <div className="text-center">
          <Link
            href="/"
            className="inline-block text-zinc-400 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}
