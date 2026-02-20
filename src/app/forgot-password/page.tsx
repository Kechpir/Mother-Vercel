"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { Mail, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim()) return;
    setLoading(true);
    try {
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Проверьте почту — мы отправили ссылку для сброса пароля. Перейдите по ней и задайте новый пароль.",
      });
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Не удалось отправить письмо";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ffa600] transition-colors text-sm uppercase tracking-widest mb-6">
            ← Вход
          </Link>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ffa600]/20 border border-[#ffa600]/30 mb-4">
            <Mail className="w-7 h-7 text-[#ffa600]" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Забыли пароль?</h1>
          <p className="text-zinc-400 text-sm mt-2">Введите email — отправим ссылку для сброса пароля</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 md:p-8 shadow-xl">
          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                message.type === "success" ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30" : "bg-red-500/20 text-red-200 border border-red-500/30"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-600 text-white placeholder-zinc-500 focus:border-[#ffa600] focus:ring-1 focus:ring-[#ffa600]/50 outline-none transition"
                placeholder="example@mail.ru"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#ffa600] text-black font-black uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? "Отправка…" : "Отправить ссылку"}
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-zinc-400 text-sm">
            Вспомнили пароль?{" "}
            <Link href="/login" className="text-[#ffa600] hover:underline font-medium">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
