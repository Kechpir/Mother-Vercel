"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let mounted = true;
    const check = (session: unknown) => {
      if (!mounted) return;
      setReady(true);
      setHasSession(!!session);
      if (!session) {
        setMessage({ type: "error", text: "Ссылка недействительна или устарела. Запросите сброс пароля снова." });
      } else {
        setMessage(null);
      }
    };
    supabase.auth.getSession().then(({ data: { session } }) => check(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      check(session);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Пароли не совпадают" });
      return;
    }
    if (password.length < 8) {
      setMessage({ type: "error", text: "Пароль должен быть не менее 8 символов" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage({ type: "success", text: "Пароль изменён. Перенаправляем на вход…" });
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Не удалось обновить пароль";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white flex items-center justify-center">
        <div className="text-zinc-400 uppercase tracking-widest text-sm">Загрузка…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ffa600] transition-colors text-sm uppercase tracking-widest mb-6">
            ← Вход
          </Link>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ffa600]/20 border border-[#ffa600]/30 mb-4">
            <Lock className="w-7 h-7 text-[#ffa600]" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Новый пароль</h1>
          <p className="text-zinc-400 text-sm mt-2">Задайте новый пароль (не менее 8 символов)</p>
        </div>

        {message?.type === "error" && !hasSession ? (
          <div className="rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 md:p-8">
            <div className="rounded-xl px-4 py-3 text-sm bg-red-500/20 text-red-200 border border-red-500/30 mb-4">
              {message.text}
            </div>
            <Link href="/forgot-password" className="block text-center text-[#ffa600] hover:underline text-sm font-medium">
              Запросить ссылку снова
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 md:p-8 shadow-xl">
            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${
                  message.type === "success" ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30" : "bg-red-500/20 text-red-200 border border-red-500/30"
                }`}
              >
                {message.type === "success" && <CheckCircle className="w-5 h-5 shrink-0" />}
                {message.text}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Новый пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-zinc-900/80 border border-zinc-600 text-white placeholder-zinc-500 focus:border-[#ffa600] focus:ring-1 focus:ring-[#ffa600]/50 outline-none transition"
                  placeholder="Не менее 8 символов"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-zinc-900/80 border border-zinc-600 text-white placeholder-zinc-500 focus:border-[#ffa600] focus:ring-1 focus:ring-[#ffa600]/50 outline-none transition"
                  placeholder="Повторите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#ffa600] text-black font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Сохранение…" : "Сохранить пароль"}
            </button>

            <p className="text-center text-zinc-400 text-sm">
              <Link href="/login" className="text-[#ffa600] hover:underline font-medium">
                Вернуться ко входу
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
