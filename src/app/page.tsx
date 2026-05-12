"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { Sparkles, Zap, Check, User, MessageCircle, ChevronDown, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Info } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "",
    age: "",
    promo_code: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [promoCodeValid, setPromoCodeValid] = useState<{valid: boolean, discount?: number} | null>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [finalAmount, setFinalAmount] = useState(25000);
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const prefillDoneRef = useRef(false);

  useEffect(() => {
    if (prefillDoneRef.current) return;
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;
      prefillDoneRef.current = true;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, city, age")
        .eq("id", session.user.id)
        .maybeSingle();
      const email = session.user.email ?? "";
      setFormData((prev) => {
        if (prev.email && prev.full_name) return prev;
        return {
          ...prev,
          full_name: profile?.full_name ?? prev.full_name,
          phone: profile?.phone ?? prev.phone,
          city: profile?.city ?? prev.city,
          age: profile?.age ?? prev.age,
          email: email.trim() || prev.email,
        };
      });
    };
    run();
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-03-09T23:59:59+05:00"); // Конец записи 9 марта по Астане (GMT+5)

    const tick = (): boolean => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return true; // время вышло — останавливаем таймер
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
      return false;
    };

    tick(); // сразу показываем актуальный остаток, не ждём секунду
    const timer = setInterval(() => {
      if (tick()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/KZT');
        const data = await res.json();
        if (data && data.rates && data.rates.RUB) {
          setExchangeRate(data.rates.RUB);
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
      }
    };
    fetchRate();
  }, []);

  const checkPromoCode = async (code: string) => {
    if (!code || code.trim() === '') {
      setPromoCodeValid(null);
      setFinalAmount(25000);
      return;
    }

    setCheckingPromo(true);
    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const data = await response.json();
      
      if (data.valid) {
        setPromoCodeValid({ valid: true, discount: data.discount_amount || 0 });
        // Применяем скидку
        const discount = data.discount_amount || 0;
        setFinalAmount(Math.max(0, 25000 - discount));
      } else {
        setPromoCodeValid({ valid: false });
        setFinalAmount(25000);
      }
    } catch (error) {
      setPromoCodeValid({ valid: false });
      setFinalAmount(25000);
    } finally {
      setCheckingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert("Пожалуйста, подтвердите согласие с условиями");
      return;
    }
    setLoading(true);
    try {
      // Сохраняем участника в базу данных
      const { data: participantData, error } = await supabase
        .from("participants")
        .insert([{
          ...formData,
          promo_code: formData.promo_code ? formData.promo_code.toUpperCase() : null,
        }])
        .select('id')
        .single();
      
      if (error) throw error;
      if (!participantData?.id) throw new Error('Не удалось сохранить данные участника');
      
      // Генерируем ссылку на оплату через наш API
      const paymentResponse = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          email: formData.email,
          description: 'Участие в энергетических сессиях: Ирина Головатова',
          participantId: participantData.id, // Передаем ID участника
          promoCode: formData.promo_code ? formData.promo_code.toUpperCase() : null,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (paymentData.paymentUrl) {
        // Перенаправляем на оплату
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error('Не удалось создать ссылку на оплату');
      }
    } catch (error: any) {
      alert("Ошибка: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col bg-[#0f0e0a] text-[#e8dcc8] font-serif selection:bg-[#c9a85c] selection:text-[#0f0e0a]">
      <SiteHeader />
      {/* --- БЛОК 1: HERO --- */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center text-center px-4 overflow-hidden mt-32 md:mt-36">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://res.cloudinary.com/dij7s1nbf/video/upload/v1769257304/43832-437611758_small_i7pc9s.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/60" aria-hidden />
        </div>
        <div className="relative z-20 max-w-5xl mx-auto px-4 py-8 md:py-12 rounded-none">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light mb-8 leading-tight tracking-[-0.02em] text-[#e8dcc8]">
            Энергетические сессии
            <span className="block text-2xl md:text-4xl mt-4 font-extralight tracking-[0.08em] text-[#d4a574]">
              Возвращение к первоначальной настройке тела
            </span>
          </h1>
          <p className="text-base md:text-lg mb-12 font-light tracking-[0.15em] uppercase text-[#b8a89c]">
            9 — 28 марта
          </p>
          <a href="#register" className="group relative inline-flex items-center justify-center px-10 py-4 md:px-16 md:py-5 font-light text-[#0f0e0a] transition-all duration-500 bg-[#d4a574] hover:bg-[#e8dcc8] border border-[#c9a85c]">
            <span className="relative tracking-[0.1em] text-sm md:text-base font-medium">Принять участие</span>
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse opacity-40 text-[#c9a85c] z-20">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* --- БЛОК 2: КУРС ИНФО --- */}
      <section className="py-16 md:py-24 px-4 bg-[#0f0e0a]">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-8 leading-tight tracking-[-0.01em]">
              Цикл энергетического погружения
            </h2>
            <h3 className="text-2xl md:text-3xl font-serif font-light text-[#c9a85c] tracking-[0.05em]">
              «Энергия первоначальности»
            </h3>
          </div>
          
          <div className="space-y-2 text-sm md:text-base text-[#a89a8a] font-light tracking-[0.08em]">
            <p>10 сеансов по будням | Групповой формат</p>
            <p>22:00 по Астане | Zoom</p>
          </div>
          
          <div className="relative py-12 mt-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a85c] to-transparent opacity-40" />
            <p className="text-base md:text-lg leading-relaxed text-[#d4a574] font-light max-w-2xl mx-auto px-4">
              Эта энергия представляет собой Первоначальную, исконную энергию, которая может помочь клеткам нашего тела обрести свое Первозданное, исконное энергетическое состояние.
            </p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a85c] to-transparent opacity-40" />
          </div>
        </div>
      </section>

      {/* --- БЛОК 3 + 4: ДНК И ОЧИЩЕНИЕ --- */}
      <section className="py-16 md:py-24 px-4 bg-[#0f0e0a]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-[1.2] space-y-8 order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#e8dcc8] tracking-[-0.01em]">Энергия Первоначальности</h2>
              <div className="space-y-5 text-base text-[#c9a89a] leading-relaxed font-light">
                <p>В теле человека со временем накапливаются энергетические записи и напряжение, которые ограничивают жизненный ресурс и удерживают в режиме выживания.</p>
                <p>Энергия Первоначальности помогает телу вернуться к своей естественной настройке — без борьбы, искажений и внутреннего напряжения.</p>
                <p className="font-light text-[#d4a574]">Во время сеансов:</p>
                <ul className="space-y-3 pl-6">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#c9a85c] shrink-0 opacity-60" />
                    <span className="text-[#a89a8a]">высвобождаются старые энергетические отпечатки</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#c9a85c] shrink-0 opacity-60" />
                    <span className="text-[#a89a8a]">снижается фоновое напряжение</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#c9a85c] shrink-0 opacity-60" />
                    <span className="text-[#a89a8a]">восстанавливается ощущение целостности</span>
                  </li>
                </ul>
                <p className="pt-6 border-t border-[#3a3a32] text-[#d4a574] font-light italic">
                  Это не про исправление. Это возвращение к себе настоящему, к состоянию, где тело и сознание снова работают в согласии.
                </p>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 w-full max-w-[300px] md:max-w-[320px] shrink-0">
              <div className="aspect-[3/4] overflow-hidden shadow-xl relative group border border-[#3a3a32]">
                <img 
                  src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769357650/ai-generated-9400220_1920_ylobuk.jpg" 
                  alt="ДНК" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК 5: HIGHLIGHT SECTION --- */}
      <section className="py-12 md:py-20 px-4 bg-[#0f0e0a]">
        <div className="max-w-4xl mx-auto">
          <div className="border border-[#3a3a32] p-8 md:p-14 text-center space-y-6">
            <h3 className="text-lg md:text-xl font-serif font-light leading-relaxed text-[#e8dcc8] tracking-[-0.01em]">
              Во время сессий активируется работа на уровне клеток и ДНК, запуская процессы обновления, витальности и естественного омоложения тела.
            </h3>
            <p className="text-base md:text-lg font-light text-[#c9a89a]">
              Клетки выходят из программ выживания и начинают функционировать в режиме живости и творчества. Происходит освобождение от глубинных сценариев — болеть, стареть, умирать, нуждаться и быть должным.
              <br className="my-2" />
              <span className="mt-4 inline-block uppercase tracking-[0.12em] font-light text-[#d4a574] text-sm">Возвращается энергия жизни, желание создавать и проживать реальность из свободы, а не из ограничений.</span>
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК 6: АНГЕЛ --- */}
      <section className="py-16 md:py-28 px-4 bg-[#1a1915]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 w-full max-w-[450px]">
            <div className="aspect-square overflow-hidden shadow-2xl relative group border border-[#3a3a32]">
              <img src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769258319/angel_x81scu.png" alt="Angel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#e8dcc8] tracking-[-0.01em]">Энергия Первоначальности</h2>
            <div className="space-y-6 text-base md:text-lg text-[#c9a89a] leading-relaxed font-light">
              <p className="border-l-2 border-[#c9a85c] pl-6 py-2 text-[#d4a574]">
                Эта энергия поддерживает долгий период активной и полноценной жизни в теле, помогая выходить из боли, напряжения и внутреннего истощения.
              </p>
              <p className="text-[#a89a8a]">
                Во время сеанса происходит мягкая интеграция Энергии Первоначальности, поддерживаемая тонким целительным полем. Каждая клетка получает возможность вспомнить своё изначальное состояние, обрести устойчивость, баланс и внутреннюю опору.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК: КЛЕТОЧНОЕ ПРОБУЖДЕНИЕ --- */}
      <section className="py-16 md:py-28 px-4 bg-[#0f0e0a]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 space-y-8 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-[#e8dcc8] tracking-[-0.01em]">Клеточное Пробуждение</h2>
            <p className="text-lg text-[#c9a89a] leading-relaxed font-light">
              Энергия Первоначальности активирует глубинные процессы на уровне клеточной памяти. Возвращается осознание своей изначальной природы и внутренней целостности. Эти изменения отражаются не только внутри тела, но и во всех сферах жизни — мягко направляя её к большему качеству, гармонии и устойчивости.
            </p>
          </div>
          <div className="flex-1 order-1 md:order-2 w-full max-w-[450px]">
            <div className="aspect-square overflow-hidden shadow-2xl relative group border border-[#3a3a32]">
              <img 
                src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769358347/DALL_E-2024-01-08-16.33.27-A-balanced-and-spiritual-depiction-of-Kundalini-activation-featuring-both-a-man-and-a-woman-meditating-in-lotus-positions.-They-are-each-surrounded-b_zxqmze.webp" 
                alt="Клеточное Пробуждение" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК 8: РЕЗУЛЬТАТЫ --- */}
      <section className="py-16 md:py-24 px-4 bg-[#1a1915]">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-serif font-light tracking-[-0.01em] text-[#e8dcc8]">Результаты, которые вы сможете ощутить</h2>
          
          <div className="space-y-10">
            <p className="text-sm md:text-lg text-[#a89a8a] font-light leading-relaxed">
              Со временем возвращается ощущение комфорта и присутствия в собственном теле.<br className="hidden md:block" />
              Тело начинает мягко:
            </p>
            
            <ul className="flex flex-col items-center space-y-3 text-[#c9a89a] font-light">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a85c]" />
                <span>выходить из напряжения</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a85c]" />
                <span>освобождаться от застрявших состояний</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a85c]" />
                <span>восстанавливать чувство лёгкости и силы</span>
              </li>
            </ul>

            <p className="text-sm md:text-base text-[#a89a8a] font-light leading-relaxed max-w-2xl mx-auto">
              Состояние постепенно меняется в сторону большей устойчивости, жизненной энергии и внутренней собранности.
            </p>

            <div className="pt-8 space-y-6">
              <p className="text-sm md:text-base text-[#d4a574] font-light leading-relaxed max-w-3xl mx-auto">
                На уровне клеточной памяти активируется ощущение целостности — когда телу больше не нужно жить в режиме постоянного выживания.
              </p>
              <p className="text-sm md:text-base text-[#d4a574] font-light leading-relaxed max-w-3xl mx-auto">
                Клетки наполняются живой энергией, поддерживающей ресурс, витальность и более насыщенное проживание жизни.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК: ПАРАЛЛАКС С ТЕКСТОМ (Техника Маа'За'Тамее) --- */}
      <section className="relative h-[350px] md:h-[450px] overflow-hidden flex items-center justify-center bg-[#0f0e0a]">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/dij7s1nbf/image/upload/v1769258260/result_xpk5or.jpg")' }}
        >
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="backdrop-blur-sm bg-black/40 py-12 px-10 border border-[#4a4a42] shadow-2xl">
            <p className="text-base md:text-lg font-light text-[#d4a574] leading-relaxed tracking-[0.05em]">
              Сессии с Энергией Первоначальности — это процесс, который раскрывается со временем. Работа затрагивает глубинные уровни и предполагает регулярное участие. Изменения в клеточной памяти могут постепенно разворачиваться в течение нескольких месяцев.
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК 9: ПАКЕТЫ --- */}
      <section id="packages" className="py-16 md:py-24 px-4 bg-[#1a1915] relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-light tracking-[-0.01em] text-[#e8dcc8]">Выберите свой пакет участия</h2>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative bg-[#0f0e0a] p-8 md:p-12 border border-[#3a3a32] text-center flex flex-col items-center transition-all hover:border-[#c9a85c]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a85c] text-[#0f0e0a] px-6 py-1 text-[10px] font-light uppercase tracking-[0.15em]">Полный цикл</div>
              
              <h3 className="text-base md:text-lg font-serif font-light mb-6 leading-tight max-w-3xl text-[#e8dcc8] tracking-[-0.01em]">
                Энергетические сессии: Возвращение к первоначальной настройке тела &amp; Энергетическое выравнивание всех тел и позвоночника
              </h3>
              
              <p className="text-sm md:text-base text-[#d4a574] font-light tracking-[0.1em] mb-8 uppercase">
                9 — 28 марта
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-8">
                <div className="bg-[#1a1915] p-5 border border-[#3a3a32] flex flex-col items-center justify-center">
                  <span className="text-[8px] text-[#7a6a5a] font-light uppercase tracking-[0.15em] mb-2">Стоимость в Тенге</span>
                  <div className="flex flex-col items-center">
                    {finalAmount < 25000 && (
                      <span className="text-xs text-[#6a5a4a] line-through mb-1">25.000 ₸</span>
                    )}
                    <span className="text-3xl md:text-4xl font-light text-[#d4a574] tracking-tighter">
                      {finalAmount.toLocaleString('ru-RU')} <span className="text-lg md:text-xl ml-1">тг</span>
                    </span>
                    {promoCodeValid?.valid && (
                      <span className="text-xs text-[#a8a856] font-light mt-1">Скидка применена</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-[#1a1915] p-5 border border-[#3a3a32] flex flex-col items-center justify-center relative overflow-hidden group">
                  <span className="text-[8px] text-[#7a6a5a] font-light uppercase tracking-[0.15em] mb-2">Приблизительно в Рублях</span>
                  <div className="flex items-center gap-2">
                    {exchangeRate ? (
                      <span className="text-3xl md:text-4xl font-light text-[#c9a85c] tracking-tighter">
                        ~{Math.round(finalAmount * exchangeRate).toLocaleString()} <span className="text-lg md:text-xl ml-1">₽</span>
                      </span>
                    ) : (
                      <div className="h-8 w-24 bg-[#3a3a32] animate-pulse" />
                    )}
                  </div>
                  <span className="text-[7px] text-[#6a5a4a] uppercase tracking-[0.1em] mt-1 font-light">Курс обновляется в реальном времени</span>
                </div>
              </div>

              <a href="#register" className="w-full max-w-xs bg-[#c9a85c] text-[#0f0e0a] py-4 text-xs font-light tracking-[0.15em] uppercase hover:bg-[#d4a574] transition-all">
                Записаться на курс
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[8px] md:text-[9px] text-[#7a6a5a] uppercase tracking-[0.1em] leading-relaxed max-w-3xl mx-auto px-4">
              Нажимая кнопку выше, я подтверждаю, что ознакомлен с <Link href="/offer" className="underline hover:text-[#c9a85c]">Договором оферты</Link> и принимаю его условия, даю <Link href="/consent" className="underline hover:text-[#c9a85c]">Согласие на обработку</Link> моих персональных данных на условиях <Link href="/privacy" className="underline hover:text-[#c9a85c]">Политики конфиденциальности</Link>
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК 10: ЗДОРОВЫЙ ПОЗВОНОЧНИК (ПОДРОБНО) --- */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-12 px-4 bg-[#0f0e0a] border-t border-zinc-100 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Левая колонка: Текст */}
            <div className="flex-1 space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="inline-block bg-[#c9a85c]/10 text-[#c9a85c] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  Исцеляющий цикл
                </div>
                <h2 className="font-hero text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-900 tracking-tight leading-[1.25] text-balance">
                  «Энергетическое выравнивание <br className="hidden md:block" /> всех тел и позвоночника»
                </h2>
              </div>

              <div className="space-y-6 text-base md:text-lg text-zinc-600 font-light leading-relaxed">
                <p className="text-zinc-900 font-medium">
                  Это пространство глубокой работы с телом, психоэмоциональным состоянием и энергетической системой человека.
                </p>
                <p>
                  Сессия направлена не только на физическое выравнивание, но и на восстановление внутренней согласованности — когда тело, эмоции, сознание и энергия снова начинают работать как единое целое.
                </p>
                
                <div className="bg-zinc-50 p-6 md:p-8 rounded-[32px] border border-zinc-100 space-y-4">
                  <p className="font-bold text-zinc-900 uppercase text-xs tracking-widest">Когда вы в напряжении:</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a85c]" />
                      <span className="text-sm md:text-base">В теле — через боль, зажимы, усталость</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a85c]" />
                      <span className="text-sm md:text-base">В состоянии — через тревожность и перегрузку</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a85c]" />
                      <span className="text-sm md:text-base">В энергии — через потерю опоры и ресурса</span>
                    </li>
                  </ul>
                </div>

                <p className="italic text-[#c9a85c] font-medium border-l-4 border-[#c9a85c] pl-6 py-2">
                  Энергетическое выравнивание создаёт условия для возвращения к более естественному состоянию — внутренней устойчивости, целостности и присутствия в себе.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Период</p>
                  <p className="text-base md:text-lg font-bold text-zinc-900">с 9 марта по 28 марта</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Формат</p>
                  <p className="text-base md:text-lg font-bold text-zinc-900">10 сеансов по будням</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Время</p>
                  <p className="text-base md:text-lg font-bold text-zinc-900">22:00 по Астане</p>
                </div>
              </div>
            </div>

            {/* Правая колонка: Картинка */}
            <div className="flex-1 order-1 lg:order-2 w-full max-w-[500px] lg:max-w-none">
              <div className="relative group">
                {/* Декоративное свечение сзади */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#c9a85c]/20 to-purple-500/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                
                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-2 border-white/50">
                  <img 
                    src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769767151/ChatGPT_Image_30_%D1%8F%D0%BD%D0%B2._2026_%D0%B3._14_58_45_ybv35t.png" 
                    alt="Энергетическое выравнивание всех тел и позвоночника" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                {/* Плашка поверх картинки */}
                <div className="absolute -bottom-6 -left-6 bg-[#0f0e0a] p-6 rounded-3xl shadow-xl border border-zinc-100 hidden md:block max-w-[200px] animate-float">
                  <Sparkles className="text-[#c9a85c] mb-2" size={24} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
                    Глубокая трансформация на всех уровнях
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-6 md:pt-8 pb-12 md:pb-16 px-4 md:px-8 bg-[#0f0e0a]">
        <div className="max-w-6xl mx-auto">
          <div className="pt-4 space-y-10">
              <div className="text-center max-w-3xl mx-auto">
                <h4 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight leading-tight mb-2">
                  Этот формат может быть полезен, если вы замечаете:
                </h4>
                <p className="text-base md:text-lg text-zinc-500 font-light italic">
                  (когда тело и внутреннее состояние выходят из баланса)
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-8" />

              <div className="space-y-6">
                <h5 className="text-base md:text-lg font-bold uppercase tracking-widest text-[#c9a85c]">
                  Физическое тело
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="text-base md:text-lg font-semibold text-zinc-800">Напряжение и боли в спине</p>
                    <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed">ощущение скованности, усталости, потери гибкости и опоры</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base md:text-lg font-semibold text-zinc-800">Головные боли, давление, мигрени</p>
                    <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed">как телесная реакция на длительное напряжение</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base md:text-lg font-semibold text-zinc-800">Перекос таза, ощущение разной длины ног</p>
                    <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed">нарушение устойчивости и баланса в теле</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-8" />

              <div className="space-y-6">
                <h5 className="text-base md:text-lg font-bold uppercase tracking-widest text-[#c9a85c]">
                  Состояние и энергия
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="text-base md:text-lg font-semibold text-zinc-800">Хроническая тревожность и внутреннее давление</p>
                    <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed">сложность расслабиться и отпустить контроль</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base md:text-lg font-semibold text-zinc-800">Эмоциональная усталость и истощение</p>
                    <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed">ощущение перегруженности, потери ресурса и живости</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base md:text-lg font-semibold text-zinc-800">Потеря опоры и устойчивости внутри</p>
                    <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed">жизнь в режиме выживания, нестабильный эмоциональный фон</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-8" />

              <p className="text-sm md:text-base text-zinc-500 font-light leading-relaxed text-center max-w-3xl mx-auto italic">
                Работа направлена на восстановление согласованности между телом, психоэмоциональным состоянием и энергетической системой человека.
              </p>
            </div>

            {/* НОВЫЙ БЛОК: НАПРАВЛЕНИЯ ЭНЕРГИЙ КУРСА */}
            <div className="pt-16 md:pt-20 border-t border-zinc-100">
              <h3 className="text-xl md:text-2xl font-bold text-center mb-10 tracking-tight leading-tight max-w-2xl mx-auto">
                Энергии этого курса направлены на:
              </h3>

              <div className="border-t border-zinc-200 pt-8" />

              <div className="space-y-6 max-w-3xl mx-auto">
                <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-[#c9a85c]">
                  Восстановление оси и телесной согласованности
                </h4>
                <ul className="space-y-3 text-left">
                  {[
                    "Выравнивание внутренней оси вдоль позвоночника",
                    "Центрирование опорно-двигательной системы",
                    "Восстановление баланса таза и опоры",
                    "Гармонизацию положения лопаток и плечевого пояса",
                    "Снижение глубинного напряжения в спине"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-0.5 shrink-0 text-[#c9a85c]" size={18} />
                      <span className="text-sm md:text-base text-zinc-700 font-semibold leading-snug">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-zinc-200 pt-8 mt-8" />

              <div className="space-y-6 max-w-3xl mx-auto mt-8">
                <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-[#c9a85c]">
                  Работу с энергетическим и психоэмоциональным состоянием
                </h4>
                <ul className="space-y-3 text-left">
                  {[
                    "Освобождение от зафиксированных энергетических перегрузок",
                    "Восстановление естественной циркуляции энергии",
                    "Очищение энергетического поля",
                    "Поддержку ясности, устойчивости и внутреннего баланса",
                    "Повышение чувствительности к себе и своему состоянию"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-0.5 shrink-0 text-[#c9a85c]" size={18} />
                      <span className="text-sm md:text-base text-zinc-700 font-semibold leading-snug">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-zinc-200 pt-8 mt-10" />

              <p className="text-xs md:text-sm text-zinc-500 font-light leading-relaxed text-center max-w-2xl mx-auto italic mt-6">
                Процесс направлен на согласованную работу с телом, состоянием и энергетической системой, без давления и форсирования изменений.
              </p>
            </div>
          </div>
        </div>

      <section className="py-12 md:py-16 px-4 md:px-8 bg-[#0f0e0a] border-t border-zinc-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-zinc-700 font-medium leading-relaxed text-base md:text-lg lg:text-xl">
            <p>
              Энергетическое выравнивание сонастроено с ритмами Нового времени.
              Это процесс глубинной перенастройки, в котором активируются внутренние механизмы обновления и восстановления человека.
            </p>
            <p>
              Изменения могут ощущаться уже на уровне телесной статики —
              со временем тело начинает естественно возвращаться к более устойчивому и сбалансированному состоянию.
            </p>
            <p className="md:col-span-2">
              В течение последующих дней и недель процесс продолжает раскрываться на клеточном уровне:
              происходит обновление внутренней информации,
              что служит импульсом для включения собственных восстановительных и саморегулирующих процессов организма.
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК: ТАЙМЕР (Успей прийти на курс) --- */}
      <section className="relative min-h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center text-[#e8dcc8] pt-16 md:pt-20 pb-20 md:pb-28">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/dij7s1nbf/image/upload/v1769258293/timer_rwjg15.png")' }}
        >
          <div className="absolute inset-0 bg-black/60 md:bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center gap-6 md:gap-8">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight mt-8 md:mt-10">
            Успей прийти на сессии по цене со <br className="hidden md:block" /> скидкой <span className="text-zinc-400/50 line-through">30.000 тг</span> <span className="text-[#c9a85c]">25.000 тг</span>
          </h2>
          
          <div className="space-y-3">
            <p className="text-base md:text-xl font-bold uppercase tracking-widest opacity-90">
              Цикл энергетических сессий будет проходить по будням с 9 марта по 28 марта.
            </p>
            <div className="text-sm md:text-base font-medium space-y-1 opacity-80 uppercase tracking-widest">
              <p>Записаться можно только до 9 марта.</p>
              <p>Старт курса 9 марта. Цикл до 28 марта. Осталось:</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 md:gap-10">
            {[
              { label: "День", value: timeLeft.days },
              { label: "Час", value: timeLeft.hours },
              { label: "Минуты", value: timeLeft.minutes },
              { label: "Секунды", value: timeLeft.seconds }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-black text-[#c9a85c] tracking-tighter drop-shadow-xl">{item.value}</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-60 mt-2">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col items-center gap-4 pb-8 md:pb-10">
            <a href="#register" className="inline-block bg-[#c9a85c] text-[#e8dcc8] px-16 py-6 md:px-24 md:py-8 text-lg md:text-xl rounded-2xl font-black uppercase tracking-widest hover:bg-[#0f0e0a] hover:text-[#e8dcc8] transition-all hover:scale-105 shadow-2xl">
              Принять участие
            </a>
            <p className="max-w-3xl mx-auto text-center text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed opacity-80">
              Нажимая кнопку выше, я подтверждаю, что ознакомлен с <Link href="/offer" className="underline hover:text-[#c9a85c]">Договором оферты</Link> и принимаю его условия, даю <Link href="/consent" className="underline hover:text-[#c9a85c]">Согласие на обработку</Link> моих персональных данных на условиях <Link href="/privacy" className="underline hover:text-[#c9a85c]">Политики конфиденциальности</Link>
            </p>
          </div>
        </div>
      </section>
      {/* --- НОВЫЙ БЛОК: ЗНАКОМСТВО (Ирина Головатова) --- */}
      <section id="about" className="py-16 md:py-20 px-4 bg-[#0f0e0a] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">
            <div className="flex-[1.3] space-y-8">
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-tight">
                Давайте знакомиться, меня зовут Ирина Головатова
              </h2>
              
              <div className="space-y-8 text-sm md:text-base text-zinc-600 font-light leading-relaxed">
                <p>
                  Я — интегративный психолог, фасилитатор Access, телесно-ориентированный и энергетический терапевт, проводник энергий и состояний глубинного восстановления. В своей работе я объединяю психологию, телесные практики, работу с энергиями и интуитивное восприятие, помогая человеку вернуться к целостности, внутреннему ресурсу и живости. Я сопровождаю людей в периодах трансформаций, когда важно не бороться с собой и не «чинить» себя, а мягко восстановить связь с телом, сознанием и своей истинной природой.
                </p>

                <div className="border-t border-zinc-200 pt-6">
                  <h3 className="text-base md:text-lg font-bold text-zinc-900 mb-4">Направления моей работы</h3>
                  <ul className="space-y-2 text-zinc-600">
                    <li>— Интегративная психология и телесно-ориентированная терапия</li>
                    <li>— Энергетические сессии и выравнивание тела</li>
                    <li>— Работа с клеточной памятью и глубинными состояниями</li>
                    <li>— Индивидуальные и групповые программы</li>
                    <li>— Диагностика тонкого и физического тела</li>
                  </ul>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <h3 className="text-base md:text-lg font-bold text-zinc-900 mb-4">Профессиональная база</h3>
                  <ul className="space-y-2 text-zinc-600">
                    <li>— Интегративный психолог</li>
                    <li>— Фасилитатор Access</li>
                    <li>— Телесно-ориентированный и энергетический терапевт</li>
                    <li>— Проводник энергий</li>
                    <li>— Целительные техники Ниа Та Нэ, Ноам Зарус, Маа За Тамее</li>
                    <li>— Мастер Тора Ан Тария</li>
                    <li>— Терапевт и инструктор Божественного выравнивания</li>
                    <li>— Духовное целительство и энергетическая кристаллотерапия</li>
                    <li>— Духовное наставничество</li>
                  </ul>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <h3 className="text-base md:text-lg font-bold text-zinc-900 mb-4">Как я работаю</h3>
                  <p className="mb-4">
                    С добротой, вниманием и глубоким уважением к пути человека я помогаю устранять энергетические блокады, активировать жизненные силы организма и возвращать ощущение внутренней опоры. В своей работе я опираюсь на:
                  </p>
                  <ul className="space-y-2 text-zinc-600 mb-4">
                    <li>• интуитивное видение человека в его целостности</li>
                    <li>• энергию кристаллов</li>
                    <li>• поддержку Духовного Мира</li>
                  </ul>
                  <p>
                    Я помогаю увидеть в себе уникальную и восхитительную сущность, которая всегда была внутри, но могла быть скрыта слоями напряжения, опыта и боли.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-[450px] sticky top-24">
              <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl relative group border-2 border-[#c9a85c]/10">
                <img 
                  src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769361079/5453934422802501709_LE_upscale_prime_bzudzh.jpg" 
                  alt="Ирина Головатова" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center border-t border-zinc-50 pt-16">
            {[
              { label: "Более 30 авторских курсов", icon: <Sparkles size={24} /> },
              { label: "Более 1000 участников", icon: <User size={24} /> },
              { label: "Более 200 посвящений", icon: <Zap size={24} /> },
              { label: "Более 1000 благодарных отзывов о моей работе", icon: <MessageCircle size={24} /> }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-4 px-4">
                <div className="text-zinc-300">{item.icon}</div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-800 leading-relaxed max-w-[160px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- БЛОК 15: ФОРМА РЕГИСТРАЦИИ (В САМОМ НИЗУ) --- */}
      <section id="register" className="pt-4 pb-20 px-6 md:px-8 lg:px-10 bg-gradient-to-b from-zinc-50 via-orange-50/30 to-zinc-50 relative overflow-hidden">
        {/* Фоновые декоративные элементы для глубины */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-100/50 rounded-full blur-[120px] opacity-40" />

        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_28rem] gap-6 lg:gap-8 items-start">
          {/* Левая колонка: форма */}
          <div className="min-h-0 order-2 lg:order-1 flex flex-col">
            <div className="w-full h-full min-h-0 flex-1 flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-3 md:p-4 rounded-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,166,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] border-2 border-[#c9a85c]/20 relative overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#c9a85c] to-transparent rounded-full" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#c9a85c]/10 rounded-full blur-[80px] -mr-24 -mt-24" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#c9a85c]/10 rounded-full blur-[80px] -ml-24 -mb-24" />
            
            <div className="text-left mb-2 space-y-0.5 relative z-10">
              <div className="inline-block bg-[#c9a85c]/20 text-[#c9a85c] px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-[#c9a85c]/30">
                Финальный шаг
              </div>
              <h3 className="text-lg md:text-xl font-black text-[#e8dcc8] uppercase tracking-tighter leading-tight">
                Забронируйте своё участие
              </h3>
              <p className="text-zinc-300 text-[10px] font-light max-w-xs leading-snug">
                Заполните данные и перейдите к оплате Prodamus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-1.5">
              {[
                { id: "full_name", placeholder: "ФИО полностью", icon: <User size={18} /> },
                { id: "age", placeholder: "Ваш возраст", icon: <Sparkles size={18} /> },
                { id: "phone", placeholder: "Ваш Телефон", icon: <Phone size={18} /> },
                { id: "email", placeholder: "Ваш Email", icon: <Mail size={18} /> },
                { id: "city", placeholder: "Ваш Город", icon: <MapPin size={18} /> }
              ].map((field) => (
                <div key={field.id} className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#c9a85c] transition-colors duration-300 z-10">
                    {field.icon}
                  </div>
                  <input 
                    required 
                    type={field.id === 'email' ? 'email' : (field.id === 'phone' ? 'tel' : (field.id === 'age' ? 'number' : 'text'))}
                    placeholder={field.placeholder} 
                    className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 py-2 px-3 pl-10 rounded-lg text-sm text-[#e8dcc8] outline-none focus:border-[#c9a85c] focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300 placeholder:text-zinc-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:border-zinc-600"
                    value={(formData as any)[field.id]} 
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})} 
                  />
                </div>
              ))}

              {/* Поле промокода */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#c9a85c] transition-colors duration-300 z-10">
                  <Sparkles size={18} />
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Промокод (необязательно)" 
                    className="w-full bg-zinc-800/50 border-2 py-2 px-3 pl-10 pr-24 rounded-lg text-sm text-[#e8dcc8] outline-none focus:border-[#c9a85c] focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300 placeholder:text-zinc-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:border-zinc-600"
                    value={formData.promo_code} 
                    onChange={(e) => {
                      setFormData({...formData, promo_code: e.target.value});
                      if (e.target.value.length >= 3) {
                        checkPromoCode(e.target.value);
                      } else {
                        setPromoCodeValid(null);
                        setFinalAmount(25000);
                      }
                    }}
                  />
                  {checkingPromo && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-[#c9a85c] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {promoCodeValid && !checkingPromo && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {promoCodeValid.valid ? (
                        <span className="text-green-500 text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 text-xs font-bold">✗</span>
                      )}
                    </div>
                  )}
                </div>
                {promoCodeValid && !promoCodeValid.valid && formData.promo_code && (
                  <p className="text-red-400 text-xs mt-1 ml-4">Неверный промокод</p>
                )}
              </div>

              <div className="pt-2 space-y-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-[#c9a85c] to-[#b8985c] text-[#e8dcc8] py-2.5 rounded-xl font-black text-sm hover:from-black hover:to-zinc-900 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest active:scale-[0.98] shadow-[0_8px_24px_-5px_rgba(255,166,0,0.4)]"
                >
                  {loading ? "ПОДОЖДИТЕ..." : "ЗАПИСАТЬСЯ И ОПЛАТИТЬ"}
                </button>
                
                <div className="bg-zinc-800/40 backdrop-blur-sm p-2 rounded-lg border-2 border-zinc-700/30 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-start gap-2">
                  <div className="pt-0.5">
                    <input 
                      required
                      type="checkbox" 
                      id="agreed"
                      className="w-4 h-4 rounded border-zinc-700 text-[#c9a85c] focus:ring-[#c9a85c] cursor-pointer"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                  </div>
                  <label htmlFor="agreed" className="text-[8px] md:text-[9px] text-zinc-300 leading-relaxed font-medium cursor-pointer">
                    Я подтверждаю, что ознакомлен с <Link href="/offer" className="text-zinc-200 underline hover:text-[#c9a85c] font-semibold">До��овором оферты</Link> и принимаю его условия, даю <Link href="/consent" className="text-zinc-200 underline hover:text-[#c9a85c] font-semibold">Согласие на обработку</Link> моих персональных данных на условиях <Link href="/privacy" className="text-zinc-200 underline hover:text-[#c9a85c] font-semibold">Политики конфиденциальности</Link>
                  </label>
                </div>
              </div>
            </form>
            </div>
          </div>

          {/* Правая колонка: сноска «Как записаться» — крупный текст, аккуратное оформление */}
          <div className="order-1 lg:order-2 w-full">
            <div className="w-full p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-[#c9a85c]/50 shadow-[0_20px_50px_-12px_rgba(255,166,0,0.15),0_0_0_1px_rgba(255,166,0,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#c9a85c]/15 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl -ml-12 -mb-12" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#c9a85c]/20 flex items-center justify-center border-2 border-[#c9a85c]/50 shadow-sm">
                  <Info className="text-[#c9a85c]" size={26} />
                </div>
                <div className="space-y-4 flex-1 min-w-0">
                  <h4 className="text-lg md:text-xl font-bold text-zinc-900 leading-tight">
                    Как записаться на курс
                  </h4>
                  <ol className="space-y-3 text-base md:text-lg text-zinc-700 font-medium leading-relaxed list-decimal list-inside pl-1">
                    <li className="pl-1">Заполните анкету в форме слева.</li>
                    <li className="pl-1">Нажмите «Записаться» и оплатите участие.</li>
                    <li className="pl-1">После оплаты откроется окно со ссылкой на Telegram-канал — обязательно вступите в канал.</li>
                    <li className="pl-1">В канале каждый день будут публиковаться ссылки-приглашения на Zoom-сессии.</li>
                  </ol>
                  <div className="pt-3 mt-3 border-t-2 border-[#c9a85c]/30">
                    <p className="text-sm md:text-base text-zinc-800 font-semibold leading-relaxed">
                      Без вступления в канал вы не получите доступ к сессиям.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
