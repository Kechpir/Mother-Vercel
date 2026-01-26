"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ConsentPage() {
  return (
    <main className="flex flex-col bg-white text-black font-sans min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-b border-[#ffa600]/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#ffa600]/30 shadow-lg">
                <img 
                  src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769356927/5453934422802501391_wfkxhr.jpg" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-black text-sm md:text-base uppercase tracking-tight">Ирина Головатова</span>
            </Link>
            
            <Link 
              href="/" 
              className="flex items-center gap-2 text-zinc-300 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest"
            >
              <ArrowLeft size={18} />
              <span className="hidden md:inline">На главную</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="pt-24 md:pt-28 pb-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight mb-4">
              Согласие на обработку персональных данных
            </h1>
            <p className="text-sm md:text-base text-zinc-500 font-light italic">
              (Consent to Personal Data Processing)
            </p>
          </div>

          <div className="prose prose-zinc max-w-none space-y-8 text-sm md:text-base leading-relaxed">
            <div className="bg-zinc-50 p-6 md:p-8 rounded-2xl border-l-4 border-[#ffa600]">
              <p className="text-zinc-700 font-light mb-4">
                Я, нижеподписавшийся(ая), даю своё согласие на обработку персональных данных Индивидуальному предпринимателю <strong className="font-semibold text-zinc-900">ГОЛОВАТОВОЙ ИРИНЕ РАСИМОВНЕ</strong> (ИИН 730521450027), расположенной по адресу: Республика Казахстан, г. Астана, ул. Бараева, д. 9, кв. 3, далее — <strong className="font-semibold text-zinc-900">Оператор</strong>, в целях исполнения обязательств по договору оферты на участие в онлайн-энергетических сессиях, размещённой на сайте <a href="https://energy-practice.org" className="text-[#ffa600] hover:underline font-medium">https://energy-practice.org</a>.
              </p>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                1. Персональные данные
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  Под персональными данными понимаются любые сведения, которые я предоставляю самостоятельно или которые обрабатываются в связи с использованием мною услуг Оператора, включая:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>фамилию, имя, отчество;</li>
                  <li>номер телефона;</li>
                  <li>адрес электронной почты;</li>
                  <li>данные, связанные с оплатой услуг через платёжные системы;</li>
                  <li>технические данные (IP-адреса, cookie и др.).</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                2. Действия с персональными данными
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  Я даю своё согласие на следующие действия с моими персональными данными:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>сбор, запись, накопление, систематизацию;</li>
                  <li>хранение, уточнение (обновление, изменение);</li>
                  <li>использование в целях исполнения договора (направление уведомлений, рассылка Zoom-ссылок, связь по техническим вопросам);</li>
                  <li>распространение, передача другим лицам (банковским и платёжным провайдерам, службам доставки уведомлений, Telegram/Zoom), только если это необходимо для исполнения договора;</li>
                  <li>обезличивание и уничтожение персональных данных по достижении целей обработки или по моему требованию.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                3. Срок обработки
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  Согласие даётся на обработку персональных данных как с использованием средств автоматизации, так и без таковых в течение срока, необходимого для исполнения обязательств по договору, а также в срок, предусмотренный законодательством Республики Казахстан.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                4. Права и обязанности
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  Я понимаю и подтверждаю, что:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>отказ от обработки персональных данных может сделать невозможным исполнение договора;</li>
                  <li>я могу отозвать это согласие в любое время, направив письменное заявление Оператору;</li>
                  <li>отзыв согласия не влияет на законность обработки, осуществлённой до его отзыва.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                5. Подтверждение
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p className="font-medium text-zinc-900">
                  Я подтверждаю, что предоставляю персональные данные добровольно и осознанно.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                6. Контактные данные Оператора
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">Индивидуальный предприниматель:</strong> ГОЛОВАТОВА ИРИНА РАСИМОВНА
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">БИН (ИИН):</strong> 730521450027
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">Адрес:</strong> Астана, ул. Бараева, д. 9, кв. 3
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">Банк:</strong> АО "Kaspi Bank"
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">БИК:</strong> CASPKZKA
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">Номер счета:</strong> KZ89722S000006963616
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">Телефон:</strong> <a href="tel:+77012509963" className="text-[#ffa600] hover:underline">+7 701 250 99 63</a>
                </p>
              </div>
            </div>
          </div>

          {/* Back to home button */}
          <div className="mt-12 pt-8 border-t border-zinc-200 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-[#ffa600] text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-lg"
            >
              <ArrowLeft size={18} />
              Вернуться на главную
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t border-zinc-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[9px] text-zinc-300 uppercase tracking-[0.3em] font-medium">
            © 2026. Все права защищены.
          </p>
        </div>
      </footer>
    </main>
  );
}
