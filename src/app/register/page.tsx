"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

const EXTRA_FIELDS = [
  { id: "full_name", label: "ФИО", placeholder: "ФИО полностью", required: true },
  { id: "city", label: "Город", placeholder: "Город", required: false },
  { id: "age", label: "Возраст", placeholder: "Возраст", required: false },
  { id: "phone", label: "Телефон", placeholder: "Номер телефона", required: true },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    age: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Пароли не совпадают" });
      return;
    }
    if (formData.password.length < 8) {
      setMessage({ type: "error", text: "Пароль должен быть не менее 8 символов" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: { emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/cabinet` : undefined },
      });

      if (error) throw error;

      if (data.user && !data.user.identities?.length) {
        setMessage({ type: "error", text: "Пользователь с таким email уже зарегистрирован. Войдите или восстановите пароль." });
        setLoading(false);
        return;
      }

      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          city: formData.city.trim() || undefined,
          age: formData.age.trim() || undefined,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        }),
      });

      setMessage({
        type: "success",
        text: "Регистрация прошла успешно. Проверьте почту — мы отправили ссылку для подтверждения. После подтверждения войдите в аккаунт.",
      });
      setFormData({ full_name: "", city: "", age: "", phone: "", email: "", password: "", confirmPassword: "" });

      // Если Supabase не требует подтверждения email — сразу редирект в кабинет
      if (data.session) {
        router.push("/cabinet");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка регистрации";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-black text-white flex flex-col items-center justify-center px-4 py-8 md:py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ffa600] transition-colors text-xs uppercase tracking-widest mb-3">
            ← На главную
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-tight">Регистрация</h1>
          <p className="text-zinc-400 text-xs mt-1">Аккаунт для доступа в личный кабинет</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5 rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-4 md:p-5 shadow-xl">
          {message && (
            <div
              className={`rounded-lg px-3 py-2 text-xs ${
                message.type === "success" ? "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30" : "bg-red-500/20 text-red-200 border border-red-500/30"
              }`}
            >
              {message.text}
            </div>
          )}

          {EXTRA_FIELDS.map(({ id, label, placeholder, required }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                {label}
              </label>
              <input
                id={id}
                type={id === "phone" ? "tel" : id === "age" ? "number" : "text"}
                required={required}
                value={formData[id]}
                onChange={(e) => setFormData((p) => ({ ...p, [id]: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-900/80 border border-zinc-600 text-white placeholder-zinc-500 focus:border-[#ffa600] focus:ring-1 focus:ring-[#ffa600]/50 outline-none transition"
                placeholder={placeholder}
              />
            </div>
          ))}

          <div>
            <label htmlFor="email" className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-zinc-900/80 border border-zinc-600 text-white placeholder-zinc-500 focus:border-[#ffa600] focus:ring-1 focus:ring-[#ffa600]/50 outline-none transition"
              placeholder="example@mail.ru"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                className="w-full pl-3 pr-10 py-2 text-sm rounded-lg bg-zinc-900/80 border border-zinc-600 text-white placeholder-zinc-500 focus:border-[#ffa600] focus:ring-1 focus:ring-[#ffa600]/50 outline-none transition"
                placeholder="Не менее 8 символов"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Подтвердите пароль
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                className="w-full pl-3 pr-10 py-2 text-sm rounded-lg bg-zinc-900/80 border border-zinc-600 text-white placeholder-zinc-500 focus:border-[#ffa600] focus:ring-1 focus:ring-[#ffa600]/50 outline-none transition"
                placeholder="Повторите пароль"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5"
                aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#ffa600] text-black font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-1"
          >
            {loading ? "Регистрация…" : "Зарегистрироваться"}
          </button>

          <p className="text-center text-zinc-400 text-xs pt-1">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[#ffa600] hover:underline font-medium">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
