import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

const REGISTRATION_VIDEO =
  "https://res.cloudinary.com/dij7s1nbf/video/upload/v1772111496/lv_0_20260225161956_2_v4ouzc.mp4";
const PAYMENT_VIDEO =
  "https://res.cloudinary.com/dij7s1nbf/video/upload/v1772111455/lv_0_20260226164143_qw1eyo.mp4";

export const metadata: Metadata = {
  title: "Инструкции — Регистрация и оплата сессий",
  description: "Как зарегистрироваться на сайте и как оплатить сессии. Видеоинструкции.",
};

export default function InstructionsPage() {
  return (
    <main className="flex flex-col bg-white text-black font-sans min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-b border-[#ffa600]/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#ffa600]/30 shadow-lg">
                <img
                  src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769356927/5453934422802501391_wfkxhr.jpg"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-black text-sm md:text-base uppercase tracking-tight">
                Ирина Головатова
              </span>
            </Link>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 text-white hover:text-[#ffa600] transition-colors text-base md:text-lg font-semibold uppercase tracking-widest"
            >
              <ArrowLeft size={22} className="md:w-6 md:h-6" />
              <span>Вернуться на главную</span>
            </Link>

            <div className="w-[1px] shrink-0 md:invisible" aria-hidden />
          </div>
        </div>
      </header>

      {/* Content — отступы с учётом safe area на телефоне */}
      <section className="pt-20 pb-24 md:pt-28 md:pb-20 px-4 bg-white min-h-screen">
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight mb-2">
              Инструкции
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-zinc-500 font-light">
              Как зарегистрироваться и оплатить сессии
            </p>
          </div>

          <div className="space-y-12 md:space-y-16">
            {/* Регистрация */}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-3 md:mb-4 flex items-center gap-2 flex-wrap">
                <span className="w-8 h-8 rounded-full bg-[#ffa600]/20 text-[#ffa600] flex items-center justify-center text-sm font-black shrink-0">
                  1
                </span>
                Как зарегистрироваться
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm md:text-base mb-4 md:mb-6 font-light">
                Следуйте шагам в видео, чтобы создать аккаунт на сайте.
              </p>
              <div className="flex justify-center">
                {/* На телефоне — по ширине экрана (до 320px), на ПК — компактно. object-contain чтобы в полноэкране было видно всё вертикальное видео */}
                <div className="w-full max-w-[320px] sm:max-w-[280px] rounded-2xl overflow-hidden border-2 border-zinc-200 shadow-xl bg-black">
                  <video
                    src={REGISTRATION_VIDEO}
                    controls
                    playsInline
                    className="instructions-video w-full aspect-[9/16] object-contain bg-black"
                    style={{ maxHeight: "min(85vh, 640px)" }}
                  >
                    Ваш браузер не поддерживает воспроизведение видео.
                  </video>
                </div>
              </div>
            </div>

            {/* Оплата */}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-900 uppercase tracking-tight mb-3 md:mb-4 flex items-center gap-2 flex-wrap">
                <span className="w-8 h-8 rounded-full bg-[#ffa600]/20 text-[#ffa600] flex items-center justify-center text-sm font-black shrink-0">
                  2
                </span>
                Как оплатить сессии
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm md:text-base mb-4 md:mb-6 font-light">
                В видео показано, как оформить и оплатить запись на сессию.
              </p>
              <div className="flex justify-center">
                <div className="w-full max-w-[320px] sm:max-w-[280px] rounded-2xl overflow-hidden border-2 border-zinc-200 shadow-xl bg-black">
                  <video
                    src={PAYMENT_VIDEO}
                    controls
                    playsInline
                    className="instructions-video w-full aspect-[9/16] object-contain bg-black"
                    style={{ maxHeight: "min(85vh, 640px)" }}
                  >
                    Ваш браузер не поддерживает воспроизведение видео.
                  </video>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-zinc-200 text-center">
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
