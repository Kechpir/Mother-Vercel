import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingForm } from "@/components/BookingForm";
import { ProtocolPriceCard } from "@/components/ProtocolPriceCard";

const IMAGES = {
  calmGaze:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771759389/ChatGPT_Image_22_%D1%84%D0%B5%D0%B2%D1%80._2026_%D0%B3._16_21_41_qgc82w.png",
  headphonesRelax:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771504576/headphones_relax_id873x.jpg",
  headphonesSoftLight:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771506791/%D1%87%D0%B5%D0%BB_%D0%B2_%D0%BD%D0%B0%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%B0%D1%85_%D0%BC%D1%8F%D0%B3%D0%BA%D0%B8%D0%B9_%D1%81%D0%B2%D0%B5%D1%82_olkfay.jpg",
  headphonesMicro:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771504576/%D0%BD%D0%B0%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%B8_%D0%BC%D0%B8%D0%BA%D1%80%D0%BE_fj11ta.jpg",
  workingProcess:
    "https://res.cloudinary.com/dij7s1nbf/image/upload/v1771759412/photo_2026-02-21_16-57-01_npvmfr.jpg",
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
      <section className="pt-36 md:pt-40 py-10 md:py-14 px-4 bg-[#fafaf9]">
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

          {/* Плашка с ценой, скидкой и таймером */}
          <ProtocolPriceCard />

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
              <p><strong>Инвестиция:</strong> <Accent>50 000 тенге</Accent> (≈ 8 500 ₽)</p>
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
