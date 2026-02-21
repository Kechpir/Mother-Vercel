import Link from "next/link";
import Image from "next/image";
import { Sparkles, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingForm } from "@/components/BookingForm";

const IMAGES = {
  calmGaze:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771504577/%D0%A1%D0%BF%D0%BE%D0%BA%D0%BE%D0%B9%D0%BD%D1%8B%D0%B9_%D0%B2%D0%B7%D0%B3%D0%BB%D1%8F%D0%B4_dvoutb.png",
  headphonesRelax:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771504576/headphones_relax_id873x.jpg",
  headphonesSoftLight:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771506791/%D1%87%D0%B5%D0%BB_%D0%B2_%D0%BD%D0%B0%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%B0%D1%85_%D0%BC%D1%8F%D0%B3%D0%BA%D0%B8%D0%B9_%D1%81%D0%B2%D0%B5%D1%82_olkfay.jpg",
  headphonesMicro:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771504576/%D0%BD%D0%B0%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%B8_%D0%BC%D0%B8%D0%BA%D1%80%D0%BE_fj11ta.jpg",
  workingProcess:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771506795/%D1%80%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81_1_jy88iv.jpg",
  lightInnerBalance:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771507441/%D0%A1%D0%B2%D0%B5%D1%82_%D0%B2%D0%BD%D1%83%D1%82%D1%80%D0%B5%D0%BD%D0%BD%D0%B8%D0%B9_%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81_fercb5.png",
  lightMinimalBg:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771508076/%D0%A1%D0%B2%D0%B5%D1%82%D0%BB%D1%8B%D0%B9_%D0%BC%D0%B8%D0%BD%D0%B8%D0%BC%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%BD%D1%8B%D0%B9_%D1%84%D0%BE%D0%BD._vjv8nk.jpg",
};

function ImagePlaceholder({ description }: { description: string }) {
  return (
    <div
      className="w-full aspect-[4/3] min-h-[220px] bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 text-sm text-center p-6 border border-dashed border-zinc-200"
      aria-hidden
    >
      <span className="max-w-sm">Место под изображение: {description}</span>
    </div>
  );
}

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-[#a65c14]">{children}</span>;
}

function BlockRow({
  imageRight,
  image,
  children,
}: {
  imageRight: boolean;
  image: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-8 md:gap-12 md:flex-row md:items-center ${
        imageRight ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="md:flex-1 md:min-w-0">{children}</div>
      <div className="md:w-[42%] md:flex-shrink-0 md:max-w-sm">{image}</div>
    </div>
  );
}

export default function PersonalEnergyProtocolPage() {
  return (
    <main className="flex flex-col bg-white text-black font-sans min-h-screen selection:bg-[#ffa600] selection:text-white">
      <SiteHeader />
      <section className="pt-20 md:pt-24 py-10 md:py-14 px-4 bg-[#fafaf9]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 uppercase tracking-tight">
            Персональный энергетический протокол
          </h1>
          <p className="text-zinc-500 text-sm md:text-base mt-2">
            Индивидуальная работа под ваш запрос
          </p>
        </div>
        <div className="max-w-5xl mx-auto space-y-20 md:space-y-28 text-base md:text-lg [&_p]:leading-loose [&_li]:leading-relaxed">
          {/* Блок 1 — текст слева, картинка справа */}
          <BlockRow
            imageRight
            image={
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={IMAGES.calmGaze}
                  alt="Спокойный уверенный взгляд"
                  fill
                  className="object-cover object-[50%_38%]"
                  sizes="(max-width: 768px) 100vw, 420px"
                  unoptimized
                />
              </div>
            }
          >
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6 tracking-tight [font-family:var(--font-hero)]">
              Персональный энергетический протокол
            </h2>
            <p className="text-zinc-900 mb-4">
              <Accent>Индивидуальная работа</Accent>, созданная лично для вас под ваш запрос и ваше текущее состояние.
            </p>
            <p className="text-zinc-900 mb-4">
              <Accent>3 этапа</Accent> глубинной настройки.<br />
              <Accent>3 аудиозаписи</Accent>.<br />
              <Accent>3 месяца</Accent> мягкой стабилизации.
            </p>
            <p className="text-zinc-900 mb-6">
              Это не просто поддержка.<br />
              Это ваш <Accent>личный инструмент внутренней опоры</Accent>.
            </p>
            <Link
              href="/#register"
              className="inline-flex items-center justify-center gap-2 bg-[#ffa600] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest text-base hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Получить персональный протокол
            </Link>
          </BlockRow>

          {/* Блок 2 — картинка слева, текст справа */}
          <BlockRow
            imageRight={false}
            image={
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={IMAGES.headphonesRelax}
                  alt="Уютное пространство, человек в наушниках"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                  unoptimized
                />
              </div>
            }
          >
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-5 tracking-tight [font-family:var(--font-hero)]">
              Кому подойдёт формат
            </h2>
            <p className="text-zinc-900 mb-4">
              Этот формат подойдёт вам, если:
            </p>
            <ul className="space-y-3 text-zinc-900 mb-4 list-disc list-inside pl-1">
              <li>вы выбираете <Accent>индивидуальную работу</Accent></li>
              <li>вам важно <Accent>личное пространство</Accent></li>
              <li>вы не хотите участвовать в группе</li>
              <li>вам нужен инструмент, к которому <Accent>можно возвращаться</Accent></li>
            </ul>
            <p className="text-zinc-900 italic [font-family:var(--font-hero)]">
              Это персональная настройка.<br />
              Без давления. В вашем ритме.
            </p>
          </BlockRow>

          {/* Блок 3 — текст слева, картинка справа */}
          <BlockRow
            imageRight
            image={
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={IMAGES.headphonesMicro}
                  alt="Наушники и микрофон"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                  unoptimized
                />
              </div>
            }
          >
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-5 tracking-tight [font-family:var(--font-hero)]">
              Что входит в протокол
            </h2>
            <p className="text-zinc-900 mb-4">
              Протокол включает <Accent>3 персональные аудиозаписи</Accent>:
            </p>
            <ol className="space-y-3 text-zinc-900 mb-4 list-decimal list-inside pl-1">
              <li>Подготовка и очищение</li>
              <li>Основная передача под ваш запрос</li>
              <li>Интеграция и закрепление результата</li>
            </ol>
            <p className="text-zinc-900 mb-2">
              Каждая запись создаётся <Accent>индивидуально</Accent> с использованием вашего имени и запроса.
            </p>
            <p className="text-zinc-900 italic [font-family:var(--font-hero)]">
              Это не шаблонная запись.<br />
              Это персональная работа.
            </p>
          </BlockRow>

          {/* Блок 4 — картинка слева, текст справа */}
          <BlockRow
            imageRight={false}
            image={
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={IMAGES.workingProcess}
                  alt="Рабочий процесс. Концентрация."
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                  unoptimized
                />
              </div>
            }
          >
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-5 tracking-tight [font-family:var(--font-hero)]">
              Как создаётся протокол
            </h2>
            <ol className="space-y-3 text-zinc-900 mb-4 list-decimal list-inside pl-1">
              <li>Вы направляете <Accent>личный запрос</Accent>.</li>
              <li>Проводится настройка и создаётся серия записей.</li>
              <li>Подготовка занимает <Accent>5–7 дней</Accent>.</li>
              <li>Вы получаете 3 MP3-файла в Telegram.</li>
            </ol>
            <p className="text-zinc-900">
              Длительность каждой записи — <Accent>20–30 минут</Accent>.
            </p>
          </BlockRow>

          {/* Блок 5 — текст слева, картинка справа */}
          <BlockRow
            imageRight
            image={
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={IMAGES.headphonesSoftLight}
                  alt="Человек в наушниках. Мягкий свет."
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                  unoptimized
                />
              </div>
            }
          >
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-5 tracking-tight [font-family:var(--font-hero)]">
              Как работать с протоколом
            </h2>
            <p className="text-zinc-900 mb-4">
              Протокол рассчитан на цикл <Accent>до 3 месяцев</Accent>.
            </p>
            <p className="text-zinc-900 mb-4">
              Для глубокой проработки рекомендуется <Accent>ежедневно</Accent> прослушивать все 3 аудиозаписи последовательно.
            </p>
            <p className="text-zinc-900 mb-4">
              Так создаётся накопительный эффект: каждый этап усиливает следующий.
            </p>
            <p className="text-zinc-900">
              Регулярность формирует <Accent>устойчивый результат</Accent>.<br />
              Вы работаете в удобное для себя время.
            </p>
          </BlockRow>

          {/* Блок 6 — картинка слева, текст справа */}
          <BlockRow
            imageRight={false}
            image={
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={IMAGES.lightMinimalBg}
                  alt="Светлый минималистичный фон"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                  unoptimized
                />
              </div>
            }
          >
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-5 tracking-tight [font-family:var(--font-hero)]">
              Почему формат работает
            </h2>
            <p className="text-zinc-900 mb-4">
              Индивидуальный формат позволяет:
            </p>
            <ul className="space-y-3 text-zinc-900 mb-4 list-disc list-inside pl-1">
              <li>работать <Accent>без внешнего давления</Accent></li>
              <li>углубляться в своём темпе</li>
              <li>возвращаться к процессу столько, сколько необходимо</li>
              <li>формировать <Accent>накопительный эффект</Accent></li>
            </ul>
            <p className="text-zinc-900 italic [font-family:var(--font-hero)]">
              Повторное прослушивание усиливает стабилизацию и поддерживает внутреннюю опору.
            </p>
          </BlockRow>

          {/* Блок 7 — текст слева, картинка справа */}
          <BlockRow
            imageRight
            image={
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={IMAGES.lightInnerBalance}
                  alt="Свет, внутренний баланс"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 420px"
                  unoptimized
                />
              </div>
            }
          >
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-5 tracking-tight [font-family:var(--font-hero)]">
              Что даёт протокол
            </h2>
            <p className="text-zinc-900 mb-4">
              Протокол помогает:
            </p>
            <ul className="space-y-3 text-zinc-900 mb-4 list-disc list-inside pl-1">
              <li><Accent>снизить внутреннее напряжение</Accent></li>
              <li>стабилизировать эмоциональное состояние</li>
              <li>мягко ослабить старые реакции</li>
              <li>восстановить ощущение внутренней устойчивости</li>
              <li>вернуть контакт с <Accent>собственной опорой</Accent></li>
            </ul>
            <p className="text-zinc-900 italic [font-family:var(--font-hero)]">
              Работа происходит постепенно. Без резких вмешательств. С уважением к вашему темпу.
            </p>
          </BlockRow>

          {/* Плашка с ценой — премиум-карточка (компактная) */}
          <div className="w-full max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-amber-100/50 border border-amber-200/80 shadow-[0_4px_6px_-1px_rgba(251,191,36,0.08),0_20px_50px_-12px_rgba(245,158,11,0.15),0_0_0_1px_rgba(251,191,36,0.06)] p-4 md:p-6">
            <div className="flex flex-col items-center text-center w-full max-w-2xl mx-auto">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-800/80 mb-1.5">
                персональный протокол
              </span>
              <h3 className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight leading-tight mb-1 [font-family:var(--font-hero)]">
                Персональный энергетический протокол
              </h3>
              <p className="text-zinc-700 text-base md:text-lg font-medium mb-3">
                Серия из 3 аудиозаписей под ваш запрос
              </p>

              <ul className="w-full grid grid-cols-2 gap-x-6 gap-y-1.5 mb-3 text-left">
                {[
                  "Персональный подход",
                  "3 аудиозаписи",
                  "Готово за 5–7 дней",
                  "Поддержка после получения",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2 text-zinc-800 text-base md:text-lg font-medium">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/25 flex items-center justify-center">
                      <Check className="w-3 h-3 text-amber-700" strokeWidth={2.5} />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              <div className="w-full border-t border-amber-200/70 pt-3 mb-3">
                <span className="text-xs font-medium uppercase tracking-widest text-zinc-600 block mb-0.5">
                  Стоимость
                </span>
                <p className="text-zinc-900">
                  <span className="text-3xl md:text-4xl font-bold tracking-tight [font-family:var(--font-hero)]">50 000</span>
                  <span className="text-base md:text-lg font-semibold text-zinc-600 ml-1.5 align-baseline">тенге</span>
                </p>
              </div>

              <a
                href="#booking-form"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold text-base uppercase tracking-widest shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:from-amber-600 hover:to-amber-700 hover:shadow-[0_6px_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200"
              >
                Оформить протокол
              </a>
              <p className="text-zinc-600 text-sm mt-2 font-medium">
                Принимаю не более 5 заявок в месяц
              </p>
            </div>
          </div>

          {/* Блок 8 — форма оплаты слева, текст справа */}
          <div id="booking-form">
          <BlockRow
            imageRight={false}
            image={
              <BookingForm
                amount={50000}
                description="Персональный энергетический протокол"
                productType="protocol"
                usePromo
              />
            }
          >
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-5 tracking-tight [font-family:var(--font-hero)]">
              Формат и инвестиция
            </h2>
            <div className="space-y-3 text-zinc-900 mb-6">
              <p><strong>Формат:</strong> Персональный энергетический протокол (серия из 3 аудиозаписей)</p>
              <p><strong>Срок подготовки:</strong> <Accent>5–7 дней</Accent></p>
              <p><strong>Срок использования:</strong> до 3 месяцев</p>
              <p><strong>Инвестиция:</strong> <Accent>50 000 тенге</Accent></p>
            </div>
            <p className="text-zinc-600 text-sm">
              Заполните анкету слева и нажмите «Оплатить» — вы перейдёте к безопасной оплате.
            </p>
          </BlockRow>
          </div>

          {/* Disclaimer — еле заметно снизу */}
          <p className="pt-8 text-center text-zinc-400 text-xs md:text-sm font-light max-w-xl mx-auto">
            Формат не является медицинской или психотерапевтической услугой
          </p>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
