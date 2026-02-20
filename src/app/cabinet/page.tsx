"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { User, LogOut, Mail, Calendar, Phone, MapPin, Sparkles, Save, MessageCircle, X } from "lucide-react";
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

export default function CabinetPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [telegramConnected, setTelegramConnected] = useState<boolean | null>(null);
  const [telegramPopupDismissed, setTelegramPopupDismissed] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    const checkTelegram = async () => {
      try {
        const res = await fetch(
          `/api/telegram/registration-status?email=${encodeURIComponent(user.email!)}`
        );
        const data = await res.json().catch(() => ({}));
        setTelegramConnected(!!data.connected);
      } catch {
        setTelegramConnected(null);
      }
    };
    checkTelegram();
  }, [user?.email]);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

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
      <div className="max-w-2xl mx-auto">
        {showTelegramPopup && (
          <div className="mb-6 rounded-2xl border border-[#ffa600]/40 bg-[#ffa600]/10 p-4 relative">
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setTelegramPopupDismissed(true)}
              className="absolute right-3 top-3 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex gap-3 pr-8">
              <MessageCircle className="w-6 h-6 text-[#ffa600] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white mb-1">Подключить уведомления в Telegram</p>
                <p className="text-sm text-zinc-400 mb-3">
                  После оплаты вы получите ссылку на группу прямо в боте — не нужно искать письмо.
                </p>
                <a
                  href={telegramBotLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#ffa600] text-black font-bold text-sm uppercase tracking-wider hover:bg-white transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Подключить в Telegram
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link href="/" className="text-zinc-400 hover:text-[#ffa600] transition-colors text-sm uppercase tracking-widest">
            ← На главную
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-sm uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 md:p-8 shadow-xl mb-6">
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

          <p className="text-zinc-500 text-sm mt-6 pt-4 border-t border-zinc-700/50">
            Связь ваших оплат и участий с этим аккаунтом будет добавлена в следующем шаге — здесь отобразится история покупок и доступ в Telegram.
          </p>
        </div>
      </div>
    </main>
  );
}
