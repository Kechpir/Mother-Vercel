"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { User, MapPin, Sparkles, Phone, Mail } from "lucide-react";

const FIELDS = [
  { id: "full_name", placeholder: "ФИО полностью", icon: <User size={18} />, required: true },
  { id: "city", placeholder: "Город", icon: <MapPin size={18} />, required: false },
  { id: "age", placeholder: "Возраст", icon: <Sparkles size={18} />, required: false },
  { id: "phone", placeholder: "Телефон", icon: <Phone size={18} />, required: true },
  { id: "email", placeholder: "Email", icon: <Mail size={18} />, required: true },
] as const;

export default function RegisterMemberPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    age: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Не удалось отправить");
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white">
      <SiteHeader />
      <section className="pt-40 md:pt-44 pb-20 px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#ffa600] transition-colors text-sm uppercase tracking-widest mb-6">
              ← На главную
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
              Регистрация
            </h1>
            <p className="text-zinc-400 text-sm mt-2">
              Заполните форму — мы будем держать вас в курсе
            </p>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-[#ffa600]/30 bg-zinc-800/50 p-8 text-center">
              <p className="text-[#ffa600] font-medium">Спасибо! Вы зарегистрированы.</p>
              <p className="text-zinc-400 text-sm mt-2">Мы свяжемся с вами при необходимости.</p>
              <Link href="/" className="inline-block mt-6 text-zinc-400 hover:text-[#ffa600] text-sm uppercase tracking-widest">
                На главную
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-700/50 bg-zinc-800/30 p-6 md:p-8 shadow-xl">
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              {FIELDS.map(({ id, placeholder, icon, required }) => (
                <div key={id} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ffa600] transition-colors z-10">
                    {icon}
                  </div>
                  <input
                    required={required}
                    type={id === "email" ? "email" : id === "phone" ? "tel" : id === "age" ? "number" : "text"}
                    placeholder={placeholder}
                    className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 py-2.5 px-3 pl-10 rounded-lg text-sm text-white outline-none focus:border-[#ffa600] focus:ring-2 focus:ring-[#ffa600]/20 placeholder:text-zinc-400"
                    value={formData[id]}
                    onChange={(e) => setFormData((p) => ({ ...p, [id]: e.target.value }))}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ffa600] hover:bg-[#ff8c00] text-white py-3 rounded-xl font-bold uppercase tracking-widest transition-colors disabled:opacity-60"
              >
                {loading ? "Отправка…" : "Зарегистрироваться"}
              </button>
            </form>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
