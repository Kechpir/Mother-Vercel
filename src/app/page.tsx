"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { ChevronDown, Sparkles, Zap, Check, User, MessageCircle, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Menu, Info } from "lucide-react";

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

  useEffect(() => {
    const targetDate = new Date("2026-02-07T22:00:00+05:00"); // 7 февраля 22:00 по Астане (GMT+5)

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
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
    <main className="flex flex-col bg-white text-black font-sans selection:bg-[#ffa600] selection:text-white">
      {/* --- ХЕДЕР --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-b border-[#ffa600]/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#ffa600]/30 shadow-lg">
                <img 
                  src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769356927/5453934422802501391_wfkxhr.jpg" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-black text-sm md:text-base uppercase tracking-tight">Ирина Головатова</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="https://www.instagram.com/accessbars.irina/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md hover:scale-110 transition-transform" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://t.me/+7WoSGeS2y6JhNzQy" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0088cc] text-white shadow-md hover:scale-110 transition-transform" aria-label="Telegram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
              </a>
              <a href="#about" className="text-zinc-300 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest">О мне</a>
              <a href="#register" className="bg-[#ffa600] text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg">
                Забронировать место
              </a>
            </nav>

            <button className="md:hidden text-zinc-300 hover:text-[#ffa600] transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* --- БЛОК 1: HERO --- */}
      <section className="relative h-[70vh] md:h-[85vh] flex items-center justify-center text-center px-4 overflow-hidden mt-16 md:mt-20">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="https://res.cloudinary.com/dij7s1nbf/video/upload/v1769257304/43832-437611758_small_i7pc9s.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/45 z-10" />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-transparent to-black/50" aria-hidden />
        </div>
        <div className="relative z-20 max-w-5xl mx-auto px-4 py-8 md:py-12 rounded-2xl bg-black/25 backdrop-blur-[2px] border border-white/5">
          <h1 className="font-hero text-2xl md:text-4xl lg:text-5xl font-light md:font-normal mb-6 leading-tight uppercase tracking-[0.12em] md:tracking-[0.18em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.6),0_0_1px_rgba(0,0,0,0.8)]">
            Энергетические сессии
            <br className="hidden md:block" />
            <span className="inline-block mt-2 text-white/95">
              Возвращение к первоначальной настройке тела
            </span>
          </h1>
          <p className="text-sm md:text-base mb-10 font-light tracking-[0.2em] uppercase text-zinc-300 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
            с 7 по 27 февраля
          </p>
          <a href="#register" className="group relative inline-flex items-center justify-center px-10 py-4 md:px-14 md:py-5 overflow-hidden font-semibold text-white transition-all duration-300 bg-gradient-to-r from-[#ffa600] to-[#ff8c00] rounded-[2rem] hover:from-white hover:to-zinc-100 hover:text-black hover:scale-[1.02] shadow-[0_8px_30px_rgba(255,166,0,0.4)] hover:shadow-[0_12px_40px_rgba(255,166,0,0.6)] border border-[#ffa600]/20">
            <span className="relative uppercase tracking-[0.15em] text-sm md:text-base font-medium">Принять участие</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30 text-white z-20">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* --- БЛОК 2: КУРС ИНФО --- */}
      <section className="py-10 md:py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight uppercase tracking-tighter">
            Цикл энергетического погружения <br /> «Энергия первоначальности»
          </h2>
          <div className="space-y-1 text-sm md:text-base text-zinc-500 mb-8 font-light italic">
            <p>с 7 по 27 февраля | 10 сеансов по будням</p>
            <p>Групповой формат | 22:00 по Астане | Zoom</p>
          </div>
          
          <div className="relative py-6 mt-6">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ffa600] opacity-20" />
            <div className="mb-4">
              <div className="inline-block bg-[#ffa600] text-white px-6 py-1.5 font-black text-[9px] tracking-[0.2em] uppercase">
                ЭНЕРГИЯ ПЕРВОИСКОННОСТИ
              </div>
            </div>
            <p className="text-base md:text-lg leading-relaxed text-zinc-700 font-light max-w-2xl mx-auto px-4">
              Эта энергия представляет собой Первоначальную, исконную энергию, которая может помочь клеткам нашего тела обрести свое Первозданное, исконное энергетическое состояние.
            </p>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#ffa600] opacity-20" />
          </div>
        </div>
      </section>

      {/* --- БЛОК 3 + 4: ДНК И ОЧИЩЕНИЕ --- */}
      <section className="py-10 md:py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
            <div className="flex-[1.2] space-y-6 order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">Энергия Первоначальности</h2>
              <div className="space-y-4 text-base text-zinc-600 leading-relaxed font-light">
                <p>В теле человека со временем накапливаются энергетические записи и напряжение, которые ограничивают жизненный ресурс и удерживают в режиме выживания.</p>
                <p>Энергия Первоначальности помогает телу вернуться к своей естественной настройке — без борьбы, искажений и внутреннего напряжения.</p>
                <p className="font-bold text-black">Во время сеансов:</p>
                <ul className="space-y-2 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffa600] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffa600] shrink-0" />
                    <span>высвобождаются старые энергетические отпечатки</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffa600] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffa600] shrink-0" />
                    <span>снижается фоновое напряжение</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#ffa600] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ffa600] shrink-0" />
                    <span>восстанавливается ощущение целостности</span>
                  </li>
                </ul>
                <p className="pt-4 border-t border-zinc-100 text-black font-bold italic">
                  Это не про исправление. Это возвращение к себе настоящему, к состоянию, где тело и сознание снова работают в согласии.
                </p>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 w-full max-w-[300px] md:max-w-[320px] shrink-0">
              <div className="aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl relative group border-2 border-[#ffa600]/5">
                <img 
                  src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769357650/ai-generated-9400220_1920_ylobuk.jpg" 
                  alt="ДНК" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-orange-900/5 group-hover:bg-transparent transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК 5: ОРАНЖЕВАЯ РАМКА --- */}
      <section className="py-8 md:py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="border border-[#ffa600] rounded-2xl p-6 md:p-10 text-center space-y-6">
            <h3 className="text-lg md:text-xl font-bold leading-relaxed text-zinc-900 tracking-tight">
              Во время сессий активируется работа на уровне клеток и ДНК, запуская процессы обновления, витальности и естественного омоложения тела.
            </h3>
            <p className="text-base md:text-lg font-medium text-zinc-800 italic">
              Клетки выходят из программ выживания и начинают функционировать в режиме живости и творчества. Происходит освобождение от глубинных сценариев — болеть, стареть, умирать, нуждаться и быть должным.
              <br />
              <span className="mt-3 inline-block uppercase tracking-widest not-italic font-black text-black text-sm">Возвращается энергия жизни, желание создавать и проживать реальность из свободы, а не из ограничений.</span>
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК 6: АНГЕЛ --- */}
      <section className="py-16 md:py-20 px-4 bg-zinc-50/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 w-full max-w-[450px]">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl relative group">
              <img src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769258319/angel_x81scu.png" alt="Angel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-zinc-900 uppercase tracking-tight">Энергия Первоначальности</h2>
            <div className="space-y-4 text-base md:text-lg text-zinc-600 leading-relaxed font-light">
              <p className="italic border-l-4 border-[#ffa600] pl-5 py-1">
                Эта энергия поддерживает долгий период активной и полноценной жизни в теле, помогая выходить из боли, напряжения и внутреннего истощения.
              </p>
              <p className="text-zinc-800 font-medium">
                Во время сеанса происходит мягкая интеграция Энергии Первоначальности, поддерживаемая тонким целительным полем. Каждая клетка получает возможность вспомнить своё изначальное состояние, обрести устойчивость, баланс и внутреннюю опору.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК: КЛЕТОЧНОЕ ПРОБУЖДЕНИЕ --- */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 space-y-4 order-2 md:order-1">
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Клеточное Пробуждение</h2>
            <p className="text-lg text-zinc-600 leading-relaxed font-light">
              Энергия Первоначальности активирует глубинные процессы на уровне клеточной памяти. Возвращается осознание своей изначальной природы и внутренней целостности. Эти изменения отражаются не только внутри тела, но и во всех сферах жизни — мягко направляя её к большему качеству, гармонии и устойчивости.
            </p>
          </div>
          <div className="flex-1 order-1 md:order-2 w-full max-w-[450px]">
            <div className="aspect-square rounded-[32px] overflow-hidden shadow-2xl relative group border-2 border-[#ffa600]/10">
              <img 
                src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769358347/DALL_E-2024-01-08-16.33.27-A-balanced-and-spiritual-depiction-of-Kundalini-activation-featuring-both-a-man-and-a-woman-meditating-in-lotus-positions.-They-are-each-surrounded-b_zxqmze.webp" 
                alt="Клеточное Пробуждение" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК 8: РЕЗУЛЬТАТЫ --- */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Результаты, которые вы сможете ощутить</h2>
          
          <div className="space-y-6">
            <p className="text-sm md:text-lg text-zinc-600 font-light leading-relaxed">
              Со временем возвращается ощущение комфорта и присутствия в собственном теле. <br className="hidden md:block" />
              Тело начинает мягко:
            </p>
            
            <ul className="flex flex-col items-center space-y-2 text-zinc-700 font-medium">
              <li className="flex items-center gap-2">• выходить из напряжения</li>
              <li className="flex items-center gap-2">• освобождаться от застрявших состояний</li>
              <li className="flex items-center gap-2">• восстанавливать чувство лёгкости и силы</li>
            </ul>

            <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed max-w-2xl mx-auto">
              Состояние постепенно меняется в сторону большей устойчивости, жизненной энергии и внутренней собранности.
            </p>

            <div className="pt-4 space-y-4">
              <p className="text-sm md:text-base text-zinc-700 font-medium leading-relaxed max-w-3xl mx-auto">
                На уровне клеточной памяти активируется ощущение целостности — когда телу больше не нужно жить в режиме постоянного выживания.
              </p>
              <p className="text-sm md:text-base text-zinc-700 font-medium leading-relaxed max-w-3xl mx-auto">
                Клетки наполняются живой энергией, поддерживающей ресурс, витальность и более насыщенное проживание жизни.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК: ПАРАЛЛАКС С ТЕКСТОМ (Техника Маа'За'Тамее) --- */}
      <section className="relative h-[350px] md:h-[450px] overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/dij7s1nbf/image/upload/v1769258260/result_xpk5or.jpg")' }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="backdrop-blur-md bg-black/30 py-10 px-8 rounded-[32px] border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)]">
            <p className="text-base md:text-lg font-bold text-white leading-relaxed uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] opacity-95">
              Сессии с Энергией Первоначальности — это процесс, который раскрывается со временем. Работа затрагивает глубинные уровни и предполагает регулярное участие. Изменения в клеточной памяти могут постепенно разворачиваться в течение нескольких месяцев.
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК 9: ПАКЕТЫ --- */}
      <section id="packages" className="py-12 md:py-16 px-4 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Выберите свой пакет участия</h2>
          </div>
          
          <div className="max-w-6xl mx-auto mb-10">
            <div className="relative bg-white p-5 md:p-7 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border-2 border-[#ffa600] text-center flex flex-col items-center transition-all hover:shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ffa600] text-white px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Полный цикл</div>
              
              <h3 className="text-base md:text-xl font-black mb-3 uppercase leading-tight max-w-4xl">
                Энергетические сессии "Возвращение к первоначальной настройке тела" и 
                "Энергетическое выравнивание всех тел и позвоночника"
              </h3>
              
              <p className="text-[10px] md:text-xs text-orange-500 font-black uppercase tracking-widest mb-5">
                с 7 по 27 февраля
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-6">
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex flex-col items-center justify-center">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Стоимость в Тенге</span>
                  <div className="flex flex-col items-center">
                    {finalAmount < 25000 && (
                      <span className="text-xs text-zinc-400 line-through mb-1">25.000 ₸</span>
                    )}
                    <span className="text-3xl md:text-4xl font-black text-black tracking-tighter">
                      {finalAmount.toLocaleString('ru-RU')} <span className="text-lg md:text-xl ml-1">тг</span>
                    </span>
                    {promoCodeValid?.valid && (
                      <span className="text-xs text-green-600 font-bold mt-1">Скидка применена!</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffa600]/10 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:bg-[#ffa600]/20" />
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 relative z-10">Приблизительно в Рублях</span>
                  <div className="flex items-center gap-2 relative z-10">
                    {exchangeRate ? (
                      <span className="text-3xl md:text-4xl font-black text-[#ffa600] tracking-tighter">
                        ~{Math.round(finalAmount * exchangeRate).toLocaleString()} <span className="text-lg md:text-xl ml-1">₽</span>
                      </span>
                    ) : (
                      <div className="h-8 w-24 bg-zinc-800 animate-pulse rounded-lg" />
                    )}
                  </div>
                  <span className="text-[7px] text-zinc-600 uppercase tracking-widest mt-1 relative z-10">Курс обновляется в реальном времени</span>
                </div>
              </div>

              <a href="#register" className="w-full max-w-xs bg-[#ffa600] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.3em] hover:bg-black hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(255,166,0,0.3)]">
                Записаться на курс
              </a>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed max-w-3xl mx-auto px-4">
              Нажимая кнопку выше, я подтверждаю, что ознакомлен с <Link href="/offer" className="underline hover:text-[#ffa600]">Договором оферты</Link> и принимаю его условия, даю <Link href="/consent" className="underline hover:text-[#ffa600]">Согласие на обработку</Link> моих персональных данных на условиях <Link href="/privacy" className="underline hover:text-[#ffa600]">Политики конфиденциальности</Link>
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК 10: ЗДОРОВЫЙ ПОЗВОНОЧНИК (ПОДРОБНО) --- */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-12 px-4 bg-white border-t border-zinc-100 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Левая колонка: Текст */}
            <div className="flex-1 space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="inline-block bg-[#ffa600]/10 text-[#ffa600] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
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
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ffa600]" />
                      <span className="text-sm md:text-base">В теле — через боль, зажимы, усталость</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ffa600]" />
                      <span className="text-sm md:text-base">В состоянии — через тревожность и перегрузку</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ffa600]" />
                      <span className="text-sm md:text-base">В энергии — через потерю опоры и ресурса</span>
                    </li>
                  </ul>
                </div>

                <p className="italic text-[#ffa600] font-medium border-l-4 border-[#ffa600] pl-6 py-2">
                  Энергетическое выравнивание создаёт условия для возвращения к более естественному состоянию — внутренней устойчивости, целостности и присутствия в себе.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Период</p>
                  <p className="text-sm font-bold text-zinc-900">с 16 по 27 февраля</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Формат</p>
                  <p className="text-sm font-bold text-zinc-900">10 сеансов по будням</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Время</p>
                  <p className="text-sm font-bold text-zinc-900">22:00 по Астане</p>
                </div>
              </div>
            </div>

            {/* Правая колонка: Картинка */}
            <div className="flex-1 order-1 lg:order-2 w-full max-w-[500px] lg:max-w-none">
              <div className="relative group">
                {/* Декоративное свечение сзади */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#ffa600]/20 to-purple-500/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                
                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-2 border-white/50">
                  <img 
                    src="https://res.cloudinary.com/dij7s1nbf/image/upload/v1769767151/ChatGPT_Image_30_%D1%8F%D0%BD%D0%B2._2026_%D0%B3._14_58_45_ybv35t.png" 
                    alt="Энергетическое выравнивание всех тел и позвоночника" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                {/* Плашка поверх картинки */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-zinc-100 hidden md:block max-w-[200px] animate-float">
                  <Sparkles className="text-[#ffa600] mb-2" size={24} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 leading-tight">
                    Глубокая трансформация на всех уровнях
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-6 md:pt-8 pb-12 md:pb-16 px-4 md:px-8 bg-white">
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
                <h5 className="text-base md:text-lg font-bold uppercase tracking-widest text-[#ffa600]">
                  Верхний ряд — физическое тело
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
                <h5 className="text-base md:text-lg font-bold uppercase tracking-widest text-[#ffa600]">
                  Нижний ряд — состояние и энергия
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
                <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-[#ffa600]">
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
                      <Check className="mt-0.5 shrink-0 text-[#ffa600]" size={18} />
                      <span className="text-sm md:text-base text-zinc-700 font-semibold leading-snug">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-zinc-200 pt-8 mt-8" />

              <div className="space-y-6 max-w-3xl mx-auto mt-8">
                <h4 className="text-sm md:text-base font-bold uppercase tracking-widest text-[#ffa600]">
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
                      <Check className="mt-0.5 shrink-0 text-[#ffa600]" size={18} />
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

      <section className="py-12 md:py-16 px-4 md:px-8 bg-white border-t border-zinc-100">
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
      <section className="relative min-h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center text-white py-16">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/dij7s1nbf/image/upload/v1769258293/timer_rwjg15.png")' }}
        >
          <div className="absolute inset-0 bg-black/60 md:bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-10">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
            Успей прийти на сессии по цене со <br className="hidden md:block" /> скидкой <span className="text-zinc-400/50 line-through">30.000 тг</span> <span className="text-[#ffa600]">25.000 тг</span>
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm md:text-lg font-bold uppercase tracking-widest opacity-90">
              Цикл энергетических сессий будет проходить по будням с 7 по 27 февраля.
            </p>
            <div className="text-xs md:text-sm font-medium space-y-1 opacity-80 uppercase tracking-widest">
              <p>Закрытие регистрации 7 февраля в 22.00 по Астане.</p>
              <p>Старт курса 7 февраля в 22.00 по Астане. Осталось:</p>
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
                <span className="text-4xl md:text-6xl font-black text-[#ffa600] tracking-tighter drop-shadow-xl">{item.value}</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-60 mt-2">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-10">
            <a href="#register" className="inline-block bg-[#ffa600] text-white px-16 py-6 md:px-24 md:py-8 text-lg md:text-xl rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hover:scale-105 shadow-2xl">
              Принять участие
            </a>
            <p className="mt-8 text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed max-w-3xl mx-auto opacity-80">
              Нажимая кнопку выше, я подтверждаю, что ознакомлен с <Link href="/offer" className="underline hover:text-[#ffa600]">Договором оферты</Link> и принимаю его условия, даю <Link href="/consent" className="underline hover:text-[#ffa600]">Согласие на обработку</Link> моих персональных данных на условиях <Link href="/privacy" className="underline hover:text-[#ffa600]">Политики конфиденциальности</Link>
            </p>
          </div>
        </div>
      </section>
      {/* --- НОВЫЙ БЛОК: ЗНАКОМСТВО (Ирина Головатова) --- */}
      <section id="about" className="py-16 md:py-20 px-4 bg-white overflow-hidden">
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
              <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl relative group border-2 border-[#ffa600]/10">
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
              { label: "Более 50 авторских курсов", icon: <Sparkles size={24} /> },
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
            <div className="w-full h-full min-h-0 flex-1 flex flex-col bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-3 md:p-4 rounded-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,166,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] border-2 border-[#ffa600]/20 relative overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#ffa600] to-transparent rounded-full" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffa600]/10 rounded-full blur-[80px] -mr-24 -mt-24" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ffa600]/10 rounded-full blur-[80px] -ml-24 -mb-24" />
            
            <div className="text-left mb-2 space-y-0.5 relative z-10">
              <div className="inline-block bg-[#ffa600]/20 text-[#ffa600] px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-[#ffa600]/30">
                Финальный шаг
              </div>
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter leading-tight">
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
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ffa600] transition-colors duration-300 z-10">
                    {field.icon}
                  </div>
                  <input 
                    required 
                    type={field.id === 'email' ? 'email' : (field.id === 'phone' ? 'tel' : (field.id === 'age' ? 'number' : 'text'))}
                    placeholder={field.placeholder} 
                    className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 py-2 px-3 pl-10 rounded-lg text-sm text-white outline-none focus:border-[#ffa600] focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300 placeholder:text-zinc-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:border-zinc-600"
                    value={(formData as any)[field.id]} 
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})} 
                  />
                </div>
              ))}

              {/* Поле промокода */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ffa600] transition-colors duration-300 z-10">
                  <Sparkles size={18} />
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Промокод (необязательно)" 
                    className="w-full bg-zinc-800/50 border-2 py-2 px-3 pl-10 pr-24 rounded-lg text-sm text-white outline-none focus:border-[#ffa600] focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300 placeholder:text-zinc-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:border-zinc-600"
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
                      <div className="w-4 h-4 border-2 border-[#ffa600] border-t-transparent rounded-full animate-spin" />
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
                  className="w-full bg-gradient-to-r from-[#ffa600] to-[#ff8c00] text-white py-2.5 rounded-xl font-black text-sm hover:from-black hover:to-zinc-900 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest active:scale-[0.98] shadow-[0_8px_24px_-5px_rgba(255,166,0,0.4)]"
                >
                  {loading ? "ПОДОЖДИТЕ..." : "ЗАПИСАТЬСЯ И ОПЛАТИТЬ"}
                </button>
                
                <div className="bg-zinc-800/40 backdrop-blur-sm p-2 rounded-lg border-2 border-zinc-700/30 shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-start gap-2">
                  <div className="pt-0.5">
                    <input 
                      required
                      type="checkbox" 
                      id="agreed"
                      className="w-4 h-4 rounded border-zinc-700 text-[#ffa600] focus:ring-[#ffa600] cursor-pointer"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                  </div>
                  <label htmlFor="agreed" className="text-[8px] md:text-[9px] text-zinc-300 leading-relaxed font-medium cursor-pointer">
                    Я подтверждаю, что ознакомлен с <Link href="/offer" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Договором оферты</Link> и принимаю его условия, даю <Link href="/consent" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Согласие на обработку</Link> моих персональных данных на условиях <Link href="/privacy" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Политики конфиденциальности</Link>
                  </label>
                </div>
              </div>
            </form>
            </div>
          </div>

          {/* Правая колонка: сноска «Как записаться» — крупный текст, аккуратное оформление */}
          <div className="order-1 lg:order-2 w-full">
            <div className="w-full p-6 md:p-8 rounded-[32px] bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-[#ffa600]/50 shadow-[0_20px_50px_-12px_rgba(255,166,0,0.15),0_0_0_1px_rgba(255,166,0,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffa600]/15 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-200/30 rounded-full blur-2xl -ml-12 -mb-12" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#ffa600]/20 flex items-center justify-center border-2 border-[#ffa600]/50 shadow-sm">
                  <Info className="text-[#ffa600]" size={26} />
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
                  <div className="pt-3 mt-3 border-t-2 border-[#ffa600]/30">
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

      {/* --- ФУТЕР --- */}
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
    </main>
  );
}
