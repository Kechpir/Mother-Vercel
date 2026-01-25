import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OfferPage() {
  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4 md:py-20">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-zinc-100">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ffa600] transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-bold uppercase tracking-widest">Вернуться на главную</span>
        </Link>

        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 mb-2 uppercase tracking-tight">
          ПУБЛИЧНЫЙ ДОГОВОР-ОФЕРТА
        </h1>
        <p className="text-zinc-500 mb-8 font-medium">об оказании онлайн-услуг</p>

        <div className="prose prose-zinc max-w-none text-zinc-700 space-y-6 text-sm leading-relaxed">
          <p>
            Настоящий документ является официальным предложением (публичной офертой) Индивидуального предпринимателя <strong>ГОЛОВАТОВОЙ ИРИНЫ РАСИМОВНЫ</strong> заключить договор на изложенных ниже условиях.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">1. ОБЩИЕ ПОЛОЖЕНИЯ</h2>
            <p>1.1. В соответствии со статьями 395, 396, 447 Гражданского кодекса Республики Казахстан настоящий документ является публичной офертой.</p>
            <p>1.2. Акцептом настоящей оферты является полная оплата услуг через сайт <a href="https://energy-practice.org" className="text-[#ffa600] underline">https://energy-practice.org</a>. С момента оплаты договор считается заключённым и обязательным для сторон.</p>
            <p>1.3. Оферта адресована любому дееспособному физическому лицу, достигшему 18 лет.</p>
            <p>1.4. Исполнитель вправе вносить изменения в условия оферты без предварительного уведомления. Актуальная версия всегда размещается на Сайте.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">2. ТЕРМИНЫ И ОПРЕДЕЛЕНИЯ</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Исполнитель</strong> — Индивидуальный предприниматель ГОЛОВАТОВА ИРИНА РАСИМОВНА.</li>
              <li><strong>Заказчик</strong> — физическое лицо, оплатившее услуги Исполнителя.</li>
              <li><strong>Услуги</strong> — онлайн-услуги энергетического/практического характера, оказываемые в групповом формате через платформу Zoom.</li>
              <li><strong>Сайт</strong> — <a href="https://energy-practice.org" className="text-[#ffa600] underline">https://energy-practice.org</a></li>
              <li><strong>Telegram-группа</strong> — закрытая группа, доступ к которой предоставляется Заказчику после оплаты.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">3. ПРЕДМЕТ ДОГОВОРА</h2>
            <p>3.1. Исполнитель обязуется оказать Заказчику онлайн-услуги путём предоставления доступа к участию в групповых сессиях через Zoom, а Заказчик обязуется оплатить данные услуги.</p>
            <p>3.2. Услуги оказываются дистанционно, с использованием сети Интернет.</p>
            <p>3.3. Услуги носят нематериальный, практический и информационный характер и не являются медицинскими, психотерапевтическими или лечебными.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">4. ПОРЯДОК ОКАЗАНИЯ УСЛУГ</h2>
            <p>4.1. После оплаты Заказчику предоставляется доступ в закрытую Telegram-группу.</p>
            <p>4.2. В течение двух недель в Telegram-группе публикуются ссылки на Zoom-сессии, проводимые в заранее установленное время.</p>
            <p>4.3. Услуги оказываются в групповом формате, количество участников может достигать 50 и более человек.</p>
            <p>4.4. Неучастие Заказчика в сессии по личным причинам не является основанием для возврата денежных средств.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">5. СТОИМОСТЬ И ПОРЯДОК ОПЛАТЫ</h2>
            <p>5.1. Стоимость услуг указывается на Сайте и является актуальной на момент оплаты.</p>
            <p>5.2. Оплата производится в безналичной форме через платёжные сервисы, доступные на Сайте.</p>
            <p>5.3. Обязательства Исполнителя считаются возникшими с момента поступления денежных средств.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">6. ПРАВА И ОБЯЗАННОСТИ СТОРОН</h2>
            <p><strong>Исполнитель обязуется:</strong></p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>предоставить Заказчику доступ к Telegram-группе;</li>
              <li>публиковать ссылки на Zoom-сессии в соответствии с объявленным расписанием.</li>
            </ul>
            <p><strong>Заказчик обязуется:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>предоставить достоверные контактные данные;</li>
              <li>соблюдать правила поведения в Telegram-группе и на сессиях;</li>
              <li>не передавать доступ третьим лицам.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">7. ОТВЕТСТВЕННОСТЬ СТОРОН</h2>
            <p>7.1. Исполнитель не несёт ответственности за:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>технические сбои Zoom, Telegram или интернет-соединения Заказчика;</li>
              <li>субъективную оценку Заказчиком полученного результата.</li>
            </ul>
            <p>7.2. Исполнитель не гарантирует достижение конкретного результата, так как эффект от участия зависит от индивидуальных особенностей Заказчика.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">8. ВОЗВРАТ ДЕНЕЖНЫХ СРЕДСТВ</h2>
            <p>8.1. Возврат денежных средств возможен до начала первой сессии, при обращении Заказчика по контактным данным, указанным на Сайте.</p>
            <p>8.2. После начала оказания услуг возврат не производится, поскольку услуга считается оказанной.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">9. ПЕРСОНАЛЬНЫЕ ДАННЫЕ</h2>
            <p>9.1. Оплачивая услуги, Заказчик даёт согласие на обработку своих персональных данных в соответствии с законодательством Республики Казахстан.</p>
            <p>9.2. Персональные данные используются исключительно для исполнения настоящего договора.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-zinc-900 uppercase">10. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</h2>
            <p>10.1. Настоящий договор вступает в силу с момента акцепта.</p>
            <p>10.2. Все споры разрешаются в соответствии с законодательством Республики Казахстан.</p>
          </section>

          <section className="bg-zinc-50 p-6 rounded-2xl space-y-2 border border-zinc-100">
            <h2 className="text-lg font-black text-zinc-900 uppercase mb-4">11. РЕКВИЗИТЫ ИСПОЛНИТЕЛЯ</h2>
            <p><strong>Индивидуальный предприниматель:</strong></p>
            <p className="text-base font-bold text-zinc-900 uppercase">ГОЛОВАТОВА ИРИНА РАСИМОВНА</p>
            <div className="pt-2 space-y-1 text-zinc-600 font-medium">
              <p>ИИН: 730521450027</p>
              <p>Адрес: Республика Казахстан, г. Астана, ул. Бараева, д. 9, кв. 3</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
