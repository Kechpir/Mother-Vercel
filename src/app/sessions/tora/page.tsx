import { Sparkles, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Перенастройка энергетической архитектуры | Ирина Головатова",
  description:
    "Живое погружение в новую систему чакр и энергии Нового Времени. Онлайн, Zoom, групповая работа. Старт 22 июня. 21 сессия.",
};

const BENEFITS = [
  {
    title: "Свободу от чужого",
    text: "Коллективные страхи, чужие программы и энергии окружения, которые ты нёс годами, перестанут цепляться к тебе. Не потому что ты от них убежал — а потому что твоя система больше не будет их принимать.",
  },
  {
    title: "Своё основание",
    text: "Устойчивость, которая не разрушается под давлением внешних событий. Ты наконец стоишь на своём месте — и это ощущается телом.",
  },
  {
    title: "Живую радость",
    text: "Не наигранный позитив и не усилием воли, а естественную радость, которая идёт изнутри. Ту, которую многие уже забыли, как ощущается.",
  },
  {
    title: "Доверие к себе",
    text: "К своим ощущениям, к своей интуиции, к своим решениям. Больше не нужно искать подтверждение снаружи — ты сам себе источник.",
  },
  {
    title: "Открытый голос и действие",
    text: "Способность говорить своё, делать своё, проявляться — без страха быть непонятым или отвергнутым. Блоки с выражения снимаются.",
  },
  {
    title: "Новое восприятие",
    text: "Интуиция начинает работать по-другому. Ты начинаешь воспринимать то, что раньше было закрыто. Послания, образы, ощущения — всё это становится яснее.",
  },
  {
    title: "Связь с источником",
    text: "Не абстрактную, а живую. Ощущение, что ты не один, что тебя ведут, что у тебя есть место в этом мире и в этом времени.",
  },
  {
    title: "Золотую Корону",
    text: "Энергетическую защиту и постоянное питание от высших источников. Она формируется вокруг каждой чакры и работает, даже когда ты этого не осознаёшь.",
  },
  {
    title: "Интеграцию в Новое время",
    text: "Твоя система чакр обновится, адаптируется к новым вибрациям. То, что раньше давалось с усилием — начнёт происходить естественно.",
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

export default function ToraPage() {
  return (
    <main className="flex flex-col bg-white text-black font-sans min-h-screen selection:bg-[#ffa600] selection:text-white">
      <SiteHeader />

      {/* Hero */}
      <section
        className="relative pt-36 md:pt-44 pb-16 md:pb-24 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(165deg, #0f0e0c 0%, #1a1714 45%, #2a2218 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4a03c]/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#ffa600]/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <p className="text-[#d4a03c] text-sm md:text-base tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Перенастройка энергетической архитектуры человека
            <Sparkles className="w-4 h-4" />
          </p>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Живое погружение в новую систему чакр и энергии Нового Времени
          </h1>
          <p className="text-[#e8e0d0]/80 text-sm md:text-base mb-8">
            Онлайн · Zoom · Групповая работа
          </p>
          <div className="inline-flex flex-wrap items-center justify-center">
            <div className="px-6 py-3 rounded-xl border border-[#d4a03c]/30 bg-[#d4a03c]/10">
              <p className="text-[10px] uppercase tracking-widest text-[#e8e0d0]/70 mb-1">Старт</p>
              <p className="text-white font-bold text-lg">22 июня</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 bg-[#fafaf9]">
        <div className="max-w-3xl mx-auto space-y-20 md:space-y-28">

          {/* Что ты получишь */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 text-center mb-4">
              Что ты получишь
            </h2>
            <p className="text-zinc-600 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
              Это не очередной курс, который ты пройдёшь и забудешь. Это живая работа с твоей
              энергетической системой — и изменения происходят прямо во время сессий, а потом
              продолжают разворачиваться в жизни.
            </p>
            <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white border border-zinc-100 p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#d4a03c]/20 transition-all"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <StarBullet />
                    <h3 className="font-bold text-zinc-900 text-sm md:text-base">{item.title}</h3>
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed pl-5">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Программа */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 text-center mb-4">
              Программа погружения
            </h2>
            <p className="text-zinc-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
              Каждая встреча — это живая работа с одной из семи чакр. Глубокая, личная, в группе с
              мощным коллективным полем. Ты не просто слушаешь — ты проживаешь каждую сессию в своём
              теле.
            </p>
            <div className="space-y-6">
              {CHAKRAS.map((chakra) => (
                <article
                  key={chakra.num}
                  className={`rounded-2xl border bg-gradient-to-br ${chakra.accent} p-6 md:p-8`}
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

          {/* Это для тебя */}
          <div className="rounded-3xl bg-zinc-900 text-white p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#d4a03c]">
              Это для тебя, если
            </h2>
            <ul className="space-y-4 max-w-2xl mx-auto">
              {FOR_YOU.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[#e8e0d0] leading-relaxed">
                  <StarBullet />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Детали */}
          <div className="rounded-2xl bg-white border-2 border-[#d4a03c]/25 shadow-lg p-8 md:p-10">
            <h2 className="text-2xl font-bold text-zinc-900 mb-8 text-center">Детали</h2>
            <dl className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto mb-8">
              {[
                { label: "Формат", value: "Онлайн, Zoom, групповая работа" },
                { label: "Количество встреч", value: "21 сессия" },
                { label: "Старт", value: "с 22 июня по 20 июля" },
                { label: "Запись", value: "8 701 250 99 63" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-zinc-50 px-5 py-4 border border-zinc-100">
                  <dt className="text-xs uppercase tracking-widest text-zinc-500 mb-1">{label}</dt>
                  <dd className="font-semibold text-zinc-900">
                    {label === "Запись" ? (
                      <a
                        href="tel:+77012509963"
                        className="text-[#a65c14] hover:text-[#ffa600] transition-colors inline-flex items-center gap-1.5"
                      >
                        <Phone className="w-4 h-4" />
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
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
