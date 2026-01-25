"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
              Политика конфиденциальности
            </h1>
            <p className="text-sm md:text-base text-zinc-500 font-light italic">
              (Privacy Policy)
            </p>
          </div>

          <div className="prose prose-zinc max-w-none space-y-8 text-sm md:text-base leading-relaxed">
            <p className="text-zinc-700 font-light">
              Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок сбора, обработки, хранения и защиты персональных данных пользователей сайта <a href="https://energy-practice.org" className="text-[#ffa600] hover:underline font-medium">https://energy-practice.org</a> (далее — «Сайт»), а также условия использования таких данных.
            </p>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                1. Общие положения
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">1.1.</strong> Политика реализуется в соответствии с законодательством Республики Казахстан, включая Закон «О персональных данных и их защите».
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">1.2.</strong> Оператором обработки персональных данных является<br />
                  Индивидуальный предприниматель ГОЛОВАТОВА ИРИНА РАСИМОВНА, ИИН 730521450027, г. Астана, ул. Бараева, д.9, кв.3.
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">1.3.</strong> Настоящая Политика применяется ко всем посетителям и пользователям Сайта, а также всем лицам, предоставившим свои персональные данные.
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">1.4.</strong> Использование Сайта означает согласие Пользователя с условиями данной Политики. Если Пользователь не согласен с условиями — он должен прекратить использование Сайта.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                2. Термины и определения
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>В настоящей Политике используются следующие термины:</p>
                <p>
                  <strong className="font-semibold text-zinc-900">Персональные данные</strong> — любая информация, относящаяся к прямо или косвенно определённому (определяемому) физическому лицу, включая имя, телефон, e-mail и др.
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">Обработка персональных данных</strong> — сбор, систематизация, хранение, использование, распространение и уничтожение данных.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                3. Цели сбора и использования данных
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">3.1.</strong> Персональные данные собираются и используются для:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>предоставления услуг, заказанных через Сайт;</li>
                  <li>связи с Пользователем (электронная почта, SMS, мессенджеры);</li>
                  <li>технической поддержки;</li>
                  <li>информирования о обновлениях, акциях и важных событиях;</li>
                  <li>соблюдения юридических обязательств.</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                4. Объём и содержание обрабатываемых данных
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">4.1.</strong> Оператор обрабатывает следующие персональные данные:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>ФИО;</li>
                  <li>адрес электронной почты;</li>
                  <li>номер телефона;</li>
                  <li>данные, предоставляемые при оплате услуг (например, платёжные реквизиты через платёжный сервис);</li>
                  <li>данные пользователя, автоматически получаемые при посещении Сайта (cookie, IP-адрес).</li>
                </ul>
                <p>
                  <strong className="font-semibold text-zinc-900">4.2.</strong> Данные используются только в объёме, необходимом для достижения целей, указанных в п. 3.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                5. Права и обязанности пользователя
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">5.1.</strong> Пользователь вправе:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>получать информацию о своих персональных данных;</li>
                  <li>требовать исправления, удаления или блокировки неточных данных;</li>
                  <li>отозвать своё согласие на обработку в любое время (прекращение обработки не влияет на законность обработки, осуществлённой до отзыва).</li>
                </ul>
                <p>
                  <strong className="font-semibold text-zinc-900">5.2.</strong> Пользователь обязуется предоставлять достоверные данные и своевременно уведомлять о любых изменениях.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                6. Безопасность персональных данных
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">6.1.</strong> Оператор принимает организационные и технические меры для защиты персональных данных от незаконного доступа, изменения, раскрытия или уничтожения.
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">6.2.</strong> Доступ к персональным данным имеют только уполномоченные сотрудники.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                7. Передача данных третьим лицам
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">7.1.</strong> Персональные данные могут передаваться:
                </p>
                <ul className="space-y-2 pl-6 list-disc">
                  <li>государственным органам по законным запросам;</li>
                  <li>платёжным системам и провайдерам услуг, участвующим в исполнении заказа;</li>
                  <li>третьим лицам, только если Пользователь дал отдельное согласие.</li>
                </ul>
                <p>
                  <strong className="font-semibold text-zinc-900">7.2.</strong> Передача данных третьим лицам осуществляется только для выполнения целей, указанных в п. 3.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                8. Хранение и удаление данных
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">8.1.</strong> Персональные данные хранятся до достижения целей обработки или до момента отзыва согласия Пользователя, если иное не предусмотрено законодательством.
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">8.2.</strong> После достижения целей персональные данные уничтожаются или обезличиваются.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                9. Изменения политики
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>
                  <strong className="font-semibold text-zinc-900">9.1.</strong> Оператор имеет право вносить изменения в эту Политику без предварительного уведомления.
                </p>
                <p>
                  <strong className="font-semibold text-zinc-900">9.2.</strong> Новая редакция вступает в силу с момента её размещения на Сайте.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-6">
                10. Контактные данные
              </h2>
              <div className="space-y-4 text-zinc-700 font-light">
                <p>По вопросам обработки персональных данных и реализации прав Пользователя:</p>
                <p className="text-lg font-semibold text-zinc-900">
                  Телефон: <a href="tel:+77012509963" className="text-[#ffa600] hover:underline">+7 701 250 99 63</a>
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
