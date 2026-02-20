import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="social" className="py-16 px-4 bg-white border-t border-zinc-100">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
        <div className="text-center md:text-left space-y-8">
          <div className="flex justify-center md:justify-start gap-10">
            <a href="https://www.instagram.com/accessbars.irina/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center md:items-start gap-3 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-black">Instagram</span>
            </a>

            <a href="https://t.me/+7WoSGeS2y6JhNzQy" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center md:items-start gap-3 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0088cc] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-black">Telegram</span>
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] text-zinc-300 uppercase tracking-[0.3em] font-medium">
              © 2026. Все права защищены.
            </p>
            <p className="text-[9px] text-zinc-400 tracking-[0.05em] font-medium max-w-xs">
              ИП Головатова Ирина Расимовна, БИН (ИИН) 730521450027
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
          <div className="flex items-center gap-3 group">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-[#ffa600] transition-colors" />
            <Link href="/consent" className="hover:text-black transition-colors">Согласие на обработку персональных данных</Link>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-[#ffa600] transition-colors" />
            <Link href="/privacy" className="hover:text-black transition-colors">Политика конфиденциальности</Link>
          </div>
          <div className="flex items-center gap-3 group">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-[#ffa600] transition-colors" />
            <Link href="/offer" className="hover:text-black transition-colors">Договор оферты</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
