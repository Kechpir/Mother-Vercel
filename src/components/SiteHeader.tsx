"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Menu, LayoutDashboard, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Amber/gold brand border and hover
const HEADER_BORDER = "rgba(212, 160, 60, 0.2)";

// Главная всегда первая; «Четыре потока энергии» пока скрыта
const SESSIONS_LINKS = [
  { href: "/", label: "Главная страница" },
  { href: "/sessions/energiya-pervonachalnosti", label: "Персональный энергетический протокол" },
];

function ChevronDownThin({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const sessionsDropdownRef = useRef<HTMLDivElement>(null);
  const isProtocolPage = pathname === "/sessions/energiya-pervonachalnosti";
  const bookingHref = isProtocolPage ? "/sessions/energiya-pervonachalnosti#booking-form" : "/#register";
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setAuthUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setAuthUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sessionsDropdownRef.current && !sessionsDropdownRef.current.contains(e.target as Node)) {
        setSessionsOpen(false);
      }
    };
    if (sessionsOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sessionsOpen]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ease-out"
      style={{
        backgroundColor: "#000000",
        borderBottomColor: HEADER_BORDER,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
        <div className="flex items-center h-16 md:h-20 gap-6 md:gap-8">
          {/* Logo: wordmark + amber accent */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden ring-1 ring-[rgba(212,160,60,0.25)] flex-shrink-0">
                <img
                  src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769356927/5453934422802501391_wfkxhr.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-hero text-[#e8e0d0] text-sm md:text-base tracking-wide antialiased">
                Ирина Головатова
                <span className="ml-1.5 inline-block w-1 h-1 rounded-full bg-[#d4a03c]" aria-hidden />
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-between min-w-0">
            {/* Соцсети — цветные иконки, по левой части шапки */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="https://www.instagram.com/accessbars.irina/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-[#E4405F] hover:bg-[#E4405F]/10 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.205.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://t.me/+7WoSGeS2y6JhNzQy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-[#0088cc] hover:bg-[#0088cc]/10 transition-colors duration-200"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>

            {/* Навигация: по центру */}
            <div className="flex items-center gap-5 flex-shrink-0">
            <Link
              href="/#about"
              className="text-[#e8e0d0] hover:text-white transition-colors duration-200 text-sm font-light uppercase tracking-[0.12em]"
            >
              О МНЕ
            </Link>
            <Link
              href="/instructions"
              className="text-[#e8e0d0] hover:text-white transition-colors duration-200 text-sm font-light uppercase tracking-[0.12em]"
            >
              ИНСТРУКЦИИ
            </Link>
            <div className="relative" ref={sessionsDropdownRef}>
              <button
                type="button"
                onClick={() => setSessionsOpen((v) => !v)}
                className="flex items-center gap-1.5 text-[#e8e0d0] hover:text-white transition-colors duration-200 text-sm font-light uppercase tracking-[0.12em]"
              >
                СЕССИИ
                <ChevronDownThin open={sessionsOpen} />
              </button>
              {sessionsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 py-1 min-w-[220px] rounded-xl shadow-xl z-50 border transition-colors"
                  style={{
                    backgroundColor: "rgba(26, 23, 20, 0.98)",
                    borderColor: HEADER_BORDER,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {SESSIONS_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSessionsOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[#e8e0d0] hover:bg-white/5 hover:text-white transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {authUser ? (
              <>
                <Link
                  href="/cabinet"
                  className="flex items-center gap-1.5 text-[#e8e0d0] hover:text-white transition-colors duration-200 text-sm font-light uppercase tracking-[0.12em]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Личный кабинет
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                    router.refresh();
                  }}
                  className="flex items-center gap-1.5 text-[#e8e0d0] hover:text-red-300 transition-colors duration-200 text-sm font-light uppercase tracking-[0.12em]"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </>
            ) : (
              <span className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-[#e8e0d0] hover:text-white transition-colors duration-200 text-sm font-light uppercase tracking-[0.12em]"
                >
                  Войти
                </Link>
                <span className="text-[#e8e0d0]/40" aria-hidden>|</span>
                <Link
                  href="/register"
                  className="text-[#e8e0d0] hover:text-white transition-colors duration-200 text-sm font-light uppercase tracking-[0.12em]"
                >
                  Регистрация
                </Link>
              </span>
            )}
            </div>

            {/* CTA: amber→gold gradient, справа по шапке */}
            <Link
              href={bookingHref}
              className="flex items-center justify-center px-5 py-2.5 rounded-2xl text-white text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#d4a03c]/50 focus:ring-offset-2 focus:ring-offset-[#0f0e0c] flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #d4a03c 0%, #c4942e 50%, #b88620 100%)",
                boxShadow: "0 0 20px rgba(212, 160, 60, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {isProtocolPage ? "Приобрести запись" : "Забронировать место"}
            </Link>
          </nav>

          {/* Мобильная шапка: Личный кабинет / Войти + Меню */}
          <div className="md:hidden flex items-center gap-2 flex-shrink-0 ml-auto">
            {authUser ? (
              <Link
                href="/cabinet"
                className="text-[#e8e0d0] hover:text-white transition-colors text-[10px] sm:text-xs font-semibold uppercase tracking-wider py-2 px-2.5 touch-manipulation"
              >
                Личный кабинет
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-[#e8e0d0] hover:text-white transition-colors text-[10px] sm:text-xs font-semibold uppercase tracking-wider py-2 px-2.5 touch-manipulation"
              >
                Войти
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[#e8e0d0] hover:text-white transition-colors py-2 px-3 rounded-lg border border-[#e8e0d0]/30 touch-manipulation"
              aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={20} strokeWidth={1.5} />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Меню</span>
            </button>
          </div>
        </div>
      </div>



      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40 overflow-y-auto"
          style={{
            backgroundColor: "rgba(15, 14, 12, 0.98)",
            borderTop: `1px solid ${HEADER_BORDER}`,
          }}
        >
          <nav className="flex flex-col py-6 px-4 gap-1">
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 text-[#e8e0d0] hover:text-white text-sm font-light uppercase tracking-[0.12em]"
            >
              О МНЕ
            </Link>
            <Link
              href="/instructions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 text-[#e8e0d0] hover:text-white text-sm font-light uppercase tracking-[0.12em]"
            >
              ИНСТРУКЦИИ
            </Link>
            {SESSIONS_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 text-[#e8e0d0] hover:text-white text-sm font-light uppercase tracking-[0.12em]"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-[#e8e0d0]/20 my-2" />
            <a
              href="https://www.instagram.com/accessbars.irina/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 text-[#E4405F] hover:text-[#E4405F]/80 text-base font-medium"
            >
              Instagram
            </a>
            <a
              href="https://t.me/+7WoSGeS2y6JhNzQy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-4 text-[#0088cc] hover:text-[#0088cc]/80 text-base font-medium"
            >
              Telegram
            </a>
            <div className="border-t border-[#e8e0d0]/20 my-2" />
            {authUser ? (
              <>
                <Link
                  href="/cabinet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-[#e8e0d0] hover:text-white text-sm font-light uppercase tracking-[0.12em] flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Личный кабинет
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await supabase.auth.signOut();
                    router.push("/");
                    router.refresh();
                  }}
                  className="py-3 px-4 text-left text-[#e8e0d0] hover:text-red-300 text-sm font-light uppercase tracking-[0.12em] flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-[#e8e0d0] hover:text-white text-sm font-light uppercase tracking-[0.12em]"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-[#e8e0d0] hover:text-white text-sm font-light uppercase tracking-[0.12em]"
                >
                  Регистрация
                </Link>
              </>
            )}
            <div className="border-t border-[#e8e0d0]/20 my-2" />
            <Link
              href={bookingHref}
              onClick={() => setMobileMenuOpen(false)}
              className="mx-4 mt-2 flex items-center justify-center px-5 py-3.5 rounded-2xl text-white text-sm font-semibold uppercase tracking-[0.08em]"
              style={{
                background: "linear-gradient(135deg, #d4a03c 0%, #c4942e 50%, #b88620 100%)",
                boxShadow: "0 0 20px rgba(212, 160, 60, 0.25)",
              }}
            >
              {isProtocolPage ? "Приобрести запись" : "Забронировать место"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
