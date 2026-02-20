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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ease-out"
      style={{
        backgroundColor: "#000000",
        borderBottomColor: HEADER_BORDER,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo: wordmark + amber accent */}
          <div className="flex items-center gap-3">
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

          <nav className="hidden md:flex items-center gap-5">
            {/* Social: monochrome outline, amber hover */}
            <a
              href="https://www.instagram.com/accessbars.irina/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#e8e0d0]/80 hover:text-[#d4a03c] transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://t.me/+7WoSGeS2y6JhNzQy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-[#e8e0d0]/80 hover:text-[#d4a03c] transition-colors duration-200"
              aria-label="Telegram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </a>

            {/* Nav links: refined uppercase, light weight, hover white */}
            <Link
              href="/#about"
              className="text-[#e8e0d0] hover:text-white transition-colors duration-200 text-xs font-light uppercase tracking-[0.12em]"
            >
              О МНЕ
            </Link>
            <div className="relative" ref={sessionsDropdownRef}>
              <button
                type="button"
                onClick={() => setSessionsOpen((v) => !v)}
                className="flex items-center gap-1.5 text-[#e8e0d0] hover:text-white transition-colors duration-200 text-xs font-light uppercase tracking-[0.12em]"
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
                  className="flex items-center gap-1.5 text-[#e8e0d0] hover:text-white transition-colors duration-200 text-xs font-light uppercase tracking-[0.12em]"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Личный кабинет
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                    router.refresh();
                  }}
                  className="flex items-center gap-1.5 text-[#e8e0d0] hover:text-red-300 transition-colors duration-200 text-xs font-light uppercase tracking-[0.12em]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Выйти
                </button>
              </>
            ) : (
              <span className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-[#e8e0d0] hover:text-white transition-colors duration-200 text-xs font-light uppercase tracking-[0.12em]"
                >
                  Войти
                </Link>
                <span className="text-[#e8e0d0]/40" aria-hidden>|</span>
                <Link
                  href="/register"
                  className="text-[#e8e0d0] hover:text-white transition-colors duration-200 text-xs font-light uppercase tracking-[0.12em]"
                >
                  Регистрация
                </Link>
              </span>
            )}

            {/* CTA: amber→gold gradient, refined shape, hover glow */}
            <Link
              href={bookingHref}
              className="flex items-center justify-center px-5 py-2.5 rounded-2xl text-white text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#d4a03c]/50 focus:ring-offset-2 focus:ring-offset-[#0f0e0c]"
              style={{
                background: "linear-gradient(135deg, #d4a03c 0%, #c4942e 50%, #b88620 100%)",
                boxShadow: "0 0 20px rgba(212, 160, 60, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {isProtocolPage ? "Приобрести запись" : "Забронировать место"}
            </Link>
          </nav>

          <button className="md:hidden text-[#e8e0d0] hover:text-white transition-colors p-2 -m-2" aria-label="Меню">
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
