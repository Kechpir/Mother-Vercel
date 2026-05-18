"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { User, Mail, Calendar, Phone, MapPin, Sparkles, Save, MessageCircle, X, ShoppingBag, ExternalLink } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "AccsessBot";

function toBase64UrlSafe(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

type Profile = {
  full_name: string;
  phone: string;
  city: string;
  age: string;
};

const emptyProfile: Profile = { full_name: "", phone: "", city: "", age: "" };

type PurchaseSession = { id: string; created_at: string; telegram_invite_link: string | null };
type PurchaseProtocol = { id: string; created_at: string };

export default function CabinetPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<{ access_token: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [telegramConnected, setTelegramConnected] = useState<boolean | null>(null);
  const [telegramPopupDismissed, setTelegramPopupDismissed] = useState(false);
  const [purchases, setPurchases] = useState<{ sessions: PurchaseSession[]; protocols: PurchaseProtocol[] } | null>(null);
  const [purchasesLoading, setPurchasesLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: s } } = await supabase.auth.getSession();
      setSession(s ? { access_token: s.access_token } : null);
      setUser(s?.user ?? null);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ? { access_token: s.access_token } : null);
      setUser(s?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkTelegramStatus = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `/api/telegram/registration-status?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json().catch(() => ({}));
      setTelegramConnected(!!data.connected);
    } catch {
      setTelegramConnected(null);
    }
  };

  useEffect(() => {
    checkTelegramStatus();
  }, [user?.email]);

  // Повторная проверка при возврате на вкладку (после привязки Telegram в другом окне)
  useEffect(() => {
    const onVisible = () => {
      if (user?.email) checkTelegramStatus();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [user?.email]);

  useEffect(() => {
    if (!user?.id || !session?.access_token) return;
    const fetchPurchases = async () => {
      setPurchasesLoading(true);
      try {
        const res = await fetch("/api/cabinet/purchases", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPurchases({ sessions: data.sessions ?? [], protocols: data.protocols ?? [] });
        } else {
          setPurchases({ sessions: [], protocols: [] });
        }
      } catch {
        setPurchases({ sessions: [], protocols: [] });
      }
      setPurchasesLoading(false);
    };
    fetchPurchases();
  }, [user?.id, session?.access_token]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      setProfileLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, city, age")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setProfile({
          full_name: data.full_name ?? "",
          phone: data.phone ?? "",
          city: data.city ?? "",
          age: data.age ?? "",
        });
      } else {
        setProfile(emptyProfile);
      }
      setProfileLoading(false);
    };
    fetchProfile();
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setMessage(null);
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: profile.full_name.trim() || null,
          phone: profile.phone.trim() || null,
          city: profile.city.trim() || null,
          age: profile.age.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      if (error) throw error;
      setMessage({ type: "success", text: "Данные сохранены" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Не удалось сохранить";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white flex items-center justify-center">
        <div className="text-zinc-400 uppercase tracking-widest text-sm">Загрузка…</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : null;

  const profileFields = [
    { id: "full_name" as const, placeholder: "ФИО полностью", icon: <User size={18} /> },
    { id: "age" as const, placeholder: "Ваш возраст", icon: <Sparkles size={18} /> },
    { id: "phone" as const, placeholder: "Ваш телефон", icon: <Phone size={18} /> },
    { id: "city" as const, placeholder: "Ваш город", icon: <MapPin size={18} /> },
  ];

  const telegramStartPayload = user.email ? toBase64UrlSafe(user.email) : "";
  const telegramBotLink =
    telegramStartPayload &&
    `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${telegramStartPayload}`;
  const showTelegramPopup =
    telegramConnected === false && !telegramPopupDismissed && !!telegramBotLink;

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white px-4 py-20">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
        {/* Левая колонка: ссылка, карточка с данными */}
        <div className="flex-1 min-w-0">
          <div className="mb-8 flex justify-center">
            <Link href="/" className="text-zinc-400 hover:text-[#ffa600] transition-colors text-base md:text-lg font-bold uppercase tracking-[0.2em]">
              На главную
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#ffa600]/20 border border-[#ffa600]/30 flex items-center justify-center">
                <User className="w-8 h-8 text-[#ffa600]" />
              </div>
              <div>
                <h1 className="text-xl font-bold uppercase tracking-tight">Личный кабинет</h1>
                <p className="text-zinc-400 text-sm mt-0.5">Ваши данные и участие</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-700/50">
                <Mail className="w-5 h-5 text-[#ffa600] shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500">Email</div>
                  <div className="text-white font-medium">{user.email}</div>
                </div>
              </div>

              {createdAt && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-700/50">
                  <Calendar className="w-5 h-5 text-[#ffa600] shrink-0" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-zinc-500">Аккаунт создан</div>
                    <div className="text-white font-medium">{createdAt}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-700/50 pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-4">Мои данные</h2>
              <p className="text-zinc-500 text-sm mb-4">Заполните или измените данные — те же, что в форме при оплате.</p>

              {profileLoading ? (
                <div className="text-zinc-500 text-sm">Загрузка…</div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  {message && (
                    <div
                      className={`rounded-xl px-4 py-3 text-sm ${
                        message.type === "success" ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30" : "bg-red-500/20 text-red-200 border border-red-500/30"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  {profileFields.map((field) => (
                    <div key={field.id} className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ffa600] transition-colors z-10">
                        {field.icon}
                      </div>
                      <input
                        type={field.id === "phone" ? "tel" : field.id === "age" ? "number" : "text"}
                        placeholder={field.placeholder}
                        value={profile[field.id]}
                        onChange={(e) => setProfile((p) => ({ ...p, [field.id]: e.target.value }))}
                        className="w-full bg-zinc-900/80 border border-zinc-600 py-2.5 px-3 pl-10 rounded-xl text-sm text-white placeholder-zinc-500 focus:border-[#ffa600] focus:ring-1 focus:ring-[#ffa600]/50 outline-none transition"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-xl bg-[#ffa600] text-black font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Сохранение…" : "Сохранить данные"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Правая колонка: история покупок и Telegram уведомление */}
        <div className="lg:w-[340px] lg:flex-shrink-0 lg:mt-14 lg:sticky lg:top-24 flex flex-col gap-6">
          <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#ffa600]" />
              История покупок
            </h2>
            {purchasesLoading ? (
              <p className="text-zinc-500 text-sm">Загрузка…</p>
            ) : purchases && (purchases.protocols.length > 0 || purchases.sessions.length > 0) ? (
              <ul className="space-y-4">
                {purchases.protocols.map((order) => (
                  <li
                    key={order.id}
                    className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-700/50"
                  >
                    <p className="font-medium text-white mb-1">
                      Персональный энергетический протокол
                    </p>
                    <p className="text-zinc-400 text-sm">
                      Спасибо за покупку. Ожидайте 5–7 дней — с вами свяжутся после создания записи.
                    </p>
                    {order.created_at && (
                      <p className="text-zinc-500 text-xs mt-2">
                        {new Date(order.created_at).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </li>
                ))}
                {purchases.sessions.map((order) => (
                  <li
                    key={order.id}
                    className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-700/50"
                  >
                    <p className="font-medium text-white mb-1">
                      Энергетические сессии. Возвращение к первоначальной настройке тела
                    </p>
                    {order.telegram_invite_link ? (
                      <div className="mt-3">
                        <p className="text-zinc-400 text-sm mb-2">
                          Ссылка на Telegram-группу:
                        </p>
                        <a
                          href={order.telegram_invite_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#ffa600] text-black font-bold text-sm uppercase tracking-wider hover:bg-white transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Перейти в группу
                        </a>
                        <p className="text-zinc-500 text-xs mt-2 font-mono break-all">
                          {order.telegram_invite_link}
                        </p>
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-sm">
                        Ссылка на группу отправлена на почту и отображалась после оплаты. Если нужна ещё раз — напишите нам.
                      </p>
                    )}
                    {order.created_at && (
                      <p className="text-zinc-500 text-xs mt-2">
                        {new Date(order.created_at).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500 text-sm">
                Здесь появятся ваши оплаченные заказы (энергетические сессии и персональный протокол).
              </p>
            )}
          </div>

          {showTelegramPopup && (
            <div className="rounded-2xl border border-[#ffa600]/40 bg-[#ffa600]/10 p-5 relative shadow-xl">
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setTelegramPopupDismissed(true)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#ffa600] shrink-0" />
                  <p className="font-semibold text-white text-sm">Уведомления в Telegram</p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  После оплаты вы получите ссылку на группу прямо в боте — не нужно искать письмо на почте.
                </p>
                <a
                  href={telegramBotLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#ffa600] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  Подключить Telegram
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
