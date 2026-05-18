import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="social" className="py-8 md:py-10 px-6 md:px-12 bg-[#FAF9F6] border-t border-zinc-200 text-zinc-600 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start pb-8">
        
        {/* Колонна 1: Бренд и миссия */}
        <div className="md:col-span-5 space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shadow-sm">
              <img
                src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769356927/5453934422802501391_wfkxhr.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-zinc-800 font-bold text-sm uppercase tracking-[0.15em]">
              Ирина Головатова
            </span>
          </div>
          <p className="text-xs text-zinc-600 font-light leading-relaxed max-w-sm">
            Энергетические погружения, возвращение к первоначальной настройке и исконной биологической свободе вашего тела.
          </p>
          
          {/* Соцсети */}
          <div className="flex gap-6 pt-1">
            <a 
              href="https://www.instagram.com/accessbars.irina/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 transition-colors text-[10px] font-bold uppercase tracking-widest group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <span>Instagram</span>
            </a>
            
            <a 
              href="https://t.me/+7WoSGeS2y6JhNzQy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-950 transition-colors text-[10px] font-bold uppercase tracking-widest group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0088cc] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              </div>
              <span>Telegram</span>
            </a>
          </div>
        </div>

        {/* Колонна 2: Документы */}
        <div className="md:col-span-4 space-y-4 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffa600]">
            Правовая информация
          </h4>
          <div className="flex flex-col gap-2.5 text-xs text-zinc-600 font-normal">
            <Link href="/consent" className="hover:text-[#ffa600] transition-colors">
              Согласие на обработку персональных данных
            </Link>
            <Link href="/privacy" className="hover:text-[#ffa600] transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/offer" className="hover:text-[#ffa600] transition-colors">
              Договор публичной оферты
            </Link>
            <Link href="/instructions" className="hover:text-[#ffa600] transition-colors">
              Инструкция по оплате и регистрации
            </Link>
          </div>
        </div>

        {/* Колонна 3: Реквизиты исполнителя */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffa600]">
            Реквизиты
          </h4>
          <div className="text-xs text-zinc-600 font-normal space-y-1.5 leading-relaxed">
            <p className="text-zinc-800 font-bold uppercase">ИП ГОЛОВАТОВА ИРИНА РАСИМОВНА</p>
            <p className="font-semibold text-zinc-700">БИН (ИИН): 730521450027</p>
            <p className="text-[11px] text-zinc-500 italic leading-snug">
              Услуги носят практический и информационный характер.
            </p>
          </div>
        </div>

      </div>

      {/* Нижняя полоса */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
        <p>© 2026 Ирина Головатова. Все права защищены.</p>
        <p className="hidden md:block">Biological Freedom & Energy Alignment</p>
      </div>
    </footer>
  );
}
