import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TORA_REGISTER_FORM_URL, WHATSAPP_URL } from "@/lib/tora-register";

export const metadata = {
  title: "Перенастройка энергетической архитектуры | Ирина Головатова",
  description:
    "Живое погружение в новую систему чакр и энергии Нового Времени. Онлайн, Zoom, групповая работа. Старт 22 июня. 21 сессия.",
};

const REGISTER_FORM_URL = TORA_REGISTER_FORM_URL;

const BENEFITS = [
  {
    title: "Свободу от чужого",
    text: "Коллективные страхи, чужие программы и энергии окружения, которые ты нёс годами, перестанут цепляться к тебе. Не потому что ты от них убежал — а потому что твоя система больше не будет их принимать.",
    accent: "from-red-500/20 to-orange-500/10 border-red-400/30",
  },
  {
    title: "Своё основание",
    text: "Устойчивость, которая не разрушается под давлением внешних событий. Ты наконец стоишь на своём месте — и это ощущается телом.",
    accent: "from-orange-500/20 to-amber-500/10 border-orange-400/30",
  },
  {
    title: "Живую радость",
    text: "Не наигранный позитив и не усилием воли, а естественную радость, которая идёт изнутри. Ту, которую многие уже забыли, как ощущается.",
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-400/30",
  },
  {
    title: "Доверие к себе",
    text: "К своим ощущениям, к своей интуиции, к своим решениям. Больше не нужно искать подтверждение снаружи — ты сам себе источник.",
    accent: "from-yellow-500/15 to-lime-500/10 border-yellow-500/25",
  },
  {
    title: "Открытый голос и действие",
    text: "Способность говорить своё, делать своё, проявляться — без страха быть непонятым или отвергнутым. Блоки с выражения снимаются.",
    accent: "from-sky-500/20 to-blue-500/10 border-sky-400/30",
  },
  {
    title: "Новое восприятие",
    text: "Интуиция начинает работать по-другому. Ты начинаешь воспринимать то, что раньше было закрыто. Послания, образы, ощущения — всё это становится яснее.",
    accent: "from-indigo-500/20 to-violet-500/10 border-indigo-400/30",
  },
  {
    title: "Связь с источником",
    text: "Не абстрактную, а живую. Ощущение, что ты не один, что тебя ведут, что у тебя есть место в этом мире и в этом времени.",
    accent: "from-violet-500/20 to-purple-500/10 border-violet-400/30",
  },
  {
    title: "Золотую Корону",
    text: "Энергетическую защиту и постоянное питание от высших источников. Она формируется вокруг каждой чакры и работает, даже когда ты этого не осознаёшь.",
    accent: "from-[#d4a03c]/25 to-amber-400/15 border-[#d4a03c]/40",
  },
  {
    title: "Интеграцию в Новое время",
    text: "Твоя система чакр обновится, адаптируется к новым вибрациям. То, что раньше давалось с усилием — начнёт происходить естественно.",
    accent: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30",
  },
];

const CHAKRAS = [
  {
    num: 1,
    title: "Корень и основа",
    intro:
      "Самое главное место, откуда всё начинается. Здесь живут коллективные программы, чужие страхи, унаследованные ограничения. Мы начинаем именно здесь — с освобождения и перезакладки фундамента.",
    outcomes: [
      "ты почувствуешь заземлённость и устойчивость — возможно, впервые за долгое время",
      "коллективные энергии окружения перестанут так легко на тебя влиять",
      "начнёт формироваться первый слой твоей Золотой Короны",
    ],
    accent: "from-red-500/20 to-orange-500/10 border-red-400/30",
  },
  {
    num: 2,
    title: "Радость и жизненная сила",
    intro:
      "Сакральный центр — источник радости, удовольствия от жизни, ощущения себя живым. Именно здесь хранится способность наслаждаться, отграничиваться от лишнего и чувствовать гармонию с тем, что есть.",
    outcomes: [
      "живая радость начнёт возвращаться — та, что не нужно придумывать",
      "станет легче отграничиваться от того, что не твоё",
      "появится больше энергии и ощущение согласия с жизнью",
    ],
    accent: "from-orange-500/20 to-amber-500/10 border-orange-400/30",
  },
  {
    num: 3,
    title: "Доверие и чувства",
    intro:
      "Центр чувств и уверенности. Именно здесь живёт способность доверять — себе, людям, жизни. И именно здесь накапливается страх и печаль, которые мешают действовать.",
    outcomes: [
      "доверие к себе и своим ощущениям вырастет",
      "уйдёт часть страхов, которые стояли на пути",
      "появится ощущение чистоты и согласия с самим собой",
    ],
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-400/30",
  },
  {
    num: 4,
    title: "Любовь и пробуждение",
    intro:
      "Сердечный центр. Безусловная любовь, прощение, пробуждение. Это встреча, после которой многое расставляется на свои места. Страх любить — уходит. Способность принимать и отдавать — открывается.",
    outcomes: [
      "что-то внутри смягчается — и это хорошо",
      "старые обиды и тяжести начинают отпускаться",
      "приходит ощущение единства с собой и с миром",
    ],
    accent: "from-emerald-500/20 to-green-500/10 border-emerald-400/30",
  },
  {
    num: 5,
    title: "Голос и проявление",
    intro:
      "Горловой центр — место, где твоё внутреннее становится внешним. Слова, действия, творчество, аутентичность. Блоки здесь — это молчание там, где нужно говорить, и действие там, где нужно остановиться.",
    outcomes: [
      "блоки с выражения начнут сниматься",
      "говорить своё станет легче — без страха осуждения",
      "появится больше смелости проявляться",
    ],
    accent: "from-sky-500/20 to-blue-500/10 border-sky-400/30",
  },
  {
    num: 6,
    title: "Видение и интуиция",
    intro:
      "Третий глаз — ворота в глубокое восприятие. Интуиция, ясновидение, способность чувствовать то, что за пределами обычного. Здесь разум отступает — и начинает говорить нечто более глубокое.",
    outcomes: [
      "интуиция обострится — ты начнёшь больше ей доверять",
      "восприятие станет тоньше и яснее",
      "появятся образы, ощущения, послания, которых раньше не было",
    ],
    accent: "from-indigo-500/20 to-violet-500/10 border-indigo-400/30",
  },
  {
    num: 7,
    title: "Корона и соединение с источником",
    intro:
      "Финальная и самая мощная встреча. Чакра-Корона — прямая связь с высшим. Здесь всё, что было проработано за погружение, собирается в единое целое. Золотая Корона завершает своё формирование. Ты выходишь другим человеком.",
    outcomes: [
      "ощущение связи с чем-то большим — живое, не умозрительное",
      "энергетическая система обновлена и защищена",
      "ты готов жить в энергиях Нового времени — не бороться с ними, а двигаться вместе с ними",
    ],
    accent: "from-violet-500/20 to-purple-500/10 border-violet-400/30",
  },
];

const FOR_YOU = [
  "ты давно в теме энергетики и духовных практик, но чувствуешь, что достиг потолка",
  "ты практик, работающий с людьми, и хочешь принести им что-то действительно новое",
  "ты чувствуешь, что готов к следующему уровню — и не можешь объяснить это логически",
  "старые инструменты перестали давать результат — и ты ищешь что-то живое",
  "внутри давно что-то зовёт — и ты наконец готов откликнуться",
];

function StarBullet() {
  return <span className="text-[#d4a03c] font-bold shrink-0 mt-0.5">✦</span>;
}

function RegisterButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={REGISTER_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#ffa600] text-black px-10 py-4 md:px-14 md:py-5 rounded-xl font-black uppercase tracking-widest text-base md:text-lg hover:bg-[#e8b84c] transition-colors w-full sm:w-auto max-w-md sm:max-w-none shadow-lg shadow-[#ffa600]/20 ${className}`}
    >
      Зарегистрироваться
    </a>
  );
}

export default function ToraPage() {
  return (
    <main className="flex flex-col bg-white text-black font-sans min-h-screen selection:bg-[#ffa600] selection:text-white">
      <SiteHeader />

      {/* Hero */}
      <section
        className="relative pt-28 md:pt-24 lg:pt-28 pb-12 md:pb-14 lg:pb-16 px-3 sm:px-4 md:px-8 lg:px-10 overflow-hidden"
        style={{
          background: "linear-gradient(165deg, #0f0e0c 0%, #1a1714 45%, #2a2218 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4a03c]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#ffa600]/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto w-full text-center">
          <p className="text-[#d4a03c] text-[11px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase mb-4 md:mb-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-1">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
            <span>Перенастройка энергетической архитектуры человека</span>
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
          </p>
          <h1 className="text-[1.65rem] leading-[1.3] sm:text-3xl md:text-3xl lg:text-4xl xl:text-[2.5rem] font-bold text-white mb-6 md:mb-8 w-full max-w-none md:max-w-4xl md:mx-auto px-1">
            <span className="md:hidden">Живое погружение в новую систему чакр и энергии Нового Времени</span>
            <span className="hidden md:block leading-tight">Живое погружение в новую систему</span>
            <span className="hidden md:block leading-tight mt-2 md:mt-3">чакр и энергии Нового Времени</span>
          </h1>

          <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-6 md:gap-8 pt-2 md:pt-4 border-t border-[#d4a03c]/15 px-1">
            <p className="text-[#e8e0d0]/80 text-sm md:text-base text-center">
              Онлайн · Zoom · Групповая работа
            </p>
            <span className="hidden sm:block w-px h-8 bg-[#d4a03c]/25 shrink-0" aria-hidden />
            <div className="px-7 py-3.5 md:px-8 md:py-4 rounded-2xl border border-[#d4a03c]/30 bg-[#d4a03c]/10 text-center shrink-0">
              <p className="text-[10px] uppercase tracking-widest text-[#e8e0d0]/70 mb-1">Старт</p>
              <p className="text-white font-bold text-xl md:text-2xl whitespace-nowrap">22 июня</p>
            </div>
          </div>
          <div className="mt-6 md:mt-8 flex justify-center px-1">
            <RegisterButton />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-3 sm:px-4 md:px-6 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto w-full space-y-20 sm:space-y-24 md:space-y-32">

          {/* Что ты получишь */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 text-center mb-5 px-1">
              Что ты получишь
            </h2>
            <p className="text-zinc-600 text-base md:text-lg text-left sm:text-center w-full max-w-none sm:max-w-3xl sm:mx-auto mb-10 sm:mb-14 md:mb-16 leading-relaxed px-1">
              Это не очередной курс, который ты пройдёшь и забудешь. Это живая работа с твоей
              энергетической системой — и изменения происходят прямо во время сессий, а потом
              продолжают разворачиваться в жизни.
            </p>
            <div className="grid gap-5 sm:gap-8 md:gap-10 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border bg-gradient-to-br ${item.accent} p-5 sm:p-7 md:p-10 shadow-sm hover:shadow-md transition-shadow w-full`}
                >
                  <div className="flex items-start gap-3 mb-3 sm:mb-4 md:mb-5">
                    <StarBullet />
                    <h3 className="font-bold text-zinc-900 text-base md:text-lg lg:text-xl leading-snug">{item.title}</h3>
                  </div>
                  <p className="text-zinc-700 text-[15px] sm:text-base md:text-lg leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Программа */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-zinc-900 text-center mb-4 px-1">
              Программа погружения
            </h2>
            <p className="text-zinc-600 text-left sm:text-center w-full max-w-none sm:max-w-2xl sm:mx-auto mb-10 sm:mb-12 leading-relaxed px-1">
              Каждая встреча — это живая работа со всеми 7ми чакрами. Глубокая, личная, в группе с
              мощным коллективным полем. Ты посвящаешся, активируешся — ты проживаешь каждую сессию в
              своём теле.
            </p>
            <div className="space-y-5 sm:space-y-8 md:space-y-10 lg:space-y-12">
              {CHAKRAS.map((chakra) => (
                <article
                  key={chakra.num}
                  className={`rounded-2xl border bg-gradient-to-br ${chakra.accent} p-5 sm:p-7 md:p-10 w-full`}
                >
                  <div className="flex flex-wrap items-baseline gap-3 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#a65c14]">
                      Чакра {chakra.num}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-zinc-900">{chakra.title}</h3>
                  </div>
                  <p className="text-zinc-700 leading-relaxed mb-5">{chakra.intro}</p>
                  <p className="text-sm font-semibold text-zinc-800 mb-3">После этой встречи:</p>
                  <ul className="space-y-2">
                    {chakra.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2 text-zinc-700 text-sm md:text-base">
                        <StarBullet />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          {/* Это для тебя + регистрация + детали — компактнее между собой */}
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            <div className="rounded-3xl bg-zinc-900 text-white p-5 sm:p-8 md:p-12 w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 text-[#d4a03c]">
                Это для тебя, если
              </h2>
              <ul className="space-y-4 w-full max-w-none sm:max-w-2xl sm:mx-auto">
                {FOR_YOU.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#e8e0d0] leading-relaxed">
                    <StarBullet />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <RegisterButton />
            </div>

            <div className="rounded-2xl bg-white border-2 border-[#d4a03c]/25 shadow-lg p-5 sm:p-8 md:p-10 w-full">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6 sm:mb-8 text-center">Детали</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-none sm:max-w-2xl sm:mx-auto mb-8">
                {[
                  { label: "Формат", value: "Онлайн, Zoom, групповая работа" },
                  { label: "Количество встреч", value: "21 сессия" },
                  { label: "Старт", value: "с 22 июня по 20 июля" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-zinc-50 px-5 py-4 border border-zinc-100 text-center">
                    <dt className="text-xs uppercase tracking-widest text-zinc-500 mb-1">{label}</dt>
                    <dd className="font-semibold text-zinc-900">{value}</dd>
                  </div>
                ))}
                <div className="rounded-xl bg-zinc-50 px-5 py-4 border border-zinc-100 flex flex-col justify-center items-center text-center">
                  <dt className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Написать в WhatsApp</dt>
                  <dd className="w-full">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Написать
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <p className="text-center text-xl md:text-2xl text-zinc-700 font-light leading-relaxed">
            Если внутри что-то откликнулось —<br />
            <span className="text-[#a65c14] font-semibold">это и есть твой ответ ✨</span>
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
