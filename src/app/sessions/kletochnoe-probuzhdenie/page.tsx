import Link from "next/link";
import { ChevronDown, Zap, Sparkles, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Четыре потока энергии — Zoom мастер-класс | Ирина Головатова",
  description: "Мастер-класс «Связь вместо сопротивления». Как перестать бороться и начать создавать связь. 21 февраля, 21:00 по Астане. 5000 тенге.",
};

export default function KletochnoeProbuzhdeniePage() {
  return (
    <main className="flex flex-col bg-white text-black font-sans min-h-screen selection:bg-[#ffa600] selection:text-white">
      <SiteHeader />
      <section className="pt-36 md:pt-40 py-10 md:py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 uppercase tracking-tight">
            Четыре потока энергии
          </h1>
          <p className="text-zinc-500 text-sm md:text-base mt-2">
            Zoom мастер-класс · Связь вместо сопротивления
          </p>
        </div>
        <div className="max-w-2xl mx-auto space-y-12 md:space-y-16">
          {/* Хук */}
          <div className="space-y-4">
            <p className="text-zinc-800 font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ffa600]" />
              Вы устали доказывать?
            </p>
            <p className="text-zinc-800 font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ffa600]" />
              Устали чувствовать истощение после общения?
            </p>
            <p className="text-zinc-800 font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ffa600]" />
              Устали быть «слишком мягкими» или «слишком сильными»?
            </p>
            <p className="text-xl text-zinc-900 font-bold mt-6">
              Есть другой способ.
            </p>
          </div>

          {/* Заголовок мастер-класса */}
          <div className="text-center py-6 px-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffa600] mb-2">
              Zoom мастер-класс
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 uppercase tracking-tight mb-2">
              Четыре потока энергии
            </h2>
            <p className="text-zinc-600 italic">
              Связь вместо сопротивления
            </p>
          </div>

          {/* Введение */}
          <div className="space-y-4">
            <p className="text-zinc-700 leading-relaxed">
              Большинство людей живут в борьбе.<br />
              Кто-то защищается.<br />
              Кто-то давит.<br />
              Кто-то истощается.<br />
              Кто-то пытается доказать свою правоту.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              Но почти никто не умеет работать с потоком.
            </p>
          </div>

          {/* Суть */}
          <div className="space-y-4 border-l-4 border-[#ffa600] pl-6 py-2">
            <p className="text-zinc-800 leading-relaxed">
              <Sparkles className="w-5 h-5 text-[#ffa600] inline-block mr-1 -mt-0.5" />
              Этот мастер-класс — про то, как перестать бороться и начать создавать связь.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              Это не теория. Не разговор «про энергию».<br />
              Это практический навык, который меняет:
            </p>
            <ul className="text-zinc-700 space-y-1 list-none">
              <li>деньги,</li>
              <li>переговоры,</li>
              <li>отношения,</li>
              <li>публичность,</li>
              <li>влияние.</li>
            </ul>
          </div>

          {/* Что узнаете */}
          <div>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ffa600]" />
              Что вы узнаете
            </h2>
            <ul className="space-y-2 text-zinc-700">
              {[
                "почему одни люди ставят барьеры",
                "как работать с нейтральными",
                "как перестать истощаться рядом с «паразитами»",
                "как не прогибаться перед «толкачами»",
                "как усиливать поток и при этом не терять себя",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#ffa600] font-bold">⏺</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-600 italic mt-4">
              Вы начнёте чувствовать, где вы сопротивляетесь вместо того, чтобы соединяться.
            </p>
          </div>

          {/* Формат работы */}
          <div>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ffa600]" />
              Формат работы
            </h2>
            <ul className="space-y-2 text-zinc-700">
              {[
                "разбор 4 типов реакций людей",
                "объяснение механики потока",
                "живые практики в Zoom",
                "работа с реальными ситуациями",
                "интеграция навыка",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 shrink-0 text-[#ffa600]" size={18} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="text-zinc-600 mt-4">
              Никаких предварительных знаний не требуется.<br />
              Прийти может абсолютно любой.
            </p>
          </div>

          {/* Формат и детали */}
          <div className="rounded-2xl bg-zinc-50 border border-zinc-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-6">
              Формат и детали
            </h2>
            <dl className="space-y-3 text-zinc-700 text-base md:text-xl">
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold text-zinc-900">Дата:</dt>
                <dd>21 февраля</dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold text-zinc-900">Время:</dt>
                <dd>21:00 (по времени Астаны)</dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold text-zinc-900">Формат:</dt>
                <dd>онлайн / Zoom</dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="font-semibold text-zinc-900">Стоимость участия:</dt>
                <dd>5000 тенге</dd>
              </div>
            </dl>
            <p className="text-zinc-600 text-sm mt-4">
              После оплаты вы получаете ссылку на подключение.
            </p>
            <Link
              href="/#register"
              className="mt-6 inline-flex items-center justify-center gap-2 bg-[#ffa600] text-black px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-zinc-900 hover:text-white transition-colors w-full sm:w-auto"
            >
              Оплатить участие
            </Link>
          </div>

          <p className="text-zinc-600 text-center italic">
            Если чувствуете отклик — просто присоединяйтесь.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-12 pt-8 border-t border-zinc-100 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#register"
            className="inline-flex items-center justify-center gap-2 bg-[#ffa600] text-black px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Оплатить участие
          </Link>
          <Link
            href="/sessions/energiya-pervonachalnosti"
            className="inline-flex items-center justify-center gap-2 border-2 border-zinc-300 text-zinc-700 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm hover:border-[#ffa600] hover:text-[#ffa600] transition-colors"
          >
            Персональный энергетический протокол
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
