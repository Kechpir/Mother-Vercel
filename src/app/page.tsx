"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { ChevronDown, Sparkles, Zap, Check, User, MessageCircle, ChevronLeft, ChevronRight, Plus, X, Mail, Phone, MapPin, Menu } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [openEnergy, setOpenEnergy] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("participants").insert([formData]);
      if (error) throw error;
      alert("Данные сохранены! Переходим к оплате...");
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
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#ffa600] to-[#ff8c00] flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm md:text-base">М</span>
              </div>
              <span className="text-white font-black text-sm md:text-base uppercase tracking-tight">Маа'За'Тамее</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#packages" className="text-zinc-300 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest">Пакеты</a>
              <a href="#register" className="text-zinc-300 hover:text-[#ffa600] transition-colors text-sm font-medium uppercase tracking-widest">Регистрация</a>
              <a href="#" className="bg-[#ffa600] text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-lg">
                Записаться
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
            <source src="/videos/43832-437611758_small.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>
        <div className="relative z-20 max-w-4xl mx-auto text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg uppercase tracking-tight">
            Заочные курсы «Маа'За'Тамее» и <br /> «Здоровый позвоночник»
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-90 font-light tracking-wide">
            С 2 по 27 февраля
          </p>
          <a href="#packages" className="bg-[#ffa600] text-white px-10 py-4 rounded-full text-base font-bold hover:bg-white hover:text-black hover:scale-105 transition-all shadow-xl inline-block uppercase tracking-widest">
            ПРИНЯТЬ УЧАСТИЕ
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
            Курс заочных ЭнергоМедитаций <br /> «Маа'За'Тамее»
          </h2>
          <div className="space-y-1 text-sm md:text-base text-zinc-500 mb-8 font-light italic">
            <p>с 2 по 13 февраля | 10 сеансов по будням</p>
            <p>Сеанс в группе в 8.00 мск. Доступен 24 часа.</p>
          </div>
          
          <div className="relative py-6 mt-6">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#ffa600] opacity-20" />
            <div className="mb-4">
              <div className="inline-block bg-[#ffa600] text-white px-6 py-1.5 font-black text-[9px] tracking-[0.2em] uppercase">
                ЭНЕРГИЯ МАА'ЗА'ТАМЕЕ
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
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
            <div className="flex-[1.2] space-y-4 order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">Энергия Маа'За'Тамее</h2>
              <div className="space-y-3 text-base text-zinc-600 leading-relaxed font-light">
                <p>На протяжении многих инкарнаций, включая нынешнюю, в нас набралось огромное количество информации и энергетических образцов, которые ограничивают продолжительность нашей физической жизни.</p>
                <p>Это такие образцы воспоминаний, которые укорачивают время нашей жизни в рамках нашего физического тела – старение, боль, болезни, умирание.</p>
                <p className="text-black font-bold italic">Маа'За'Тамее способна точно нацелиться на эти энергетические образцы и вытащить их из наших клеток, как мощный энергетический магнит.</p>
              </div>
              <div className="pt-4 border-t border-zinc-50 text-base text-zinc-700 leading-relaxed font-light">
                <p>
                  Данными сеансами мы сможем энергетически воздействовать на клетки человека, <span className="font-bold text-black uppercase">очищать</span> их, 
                  <span className="font-bold text-black uppercase"> перепрограммировать</span> и <span className="font-bold text-black uppercase">наполнять</span> Первозданной Энергией.
                </p>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2 w-full max-w-[400px]">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl relative group">
                <img src="/images/dna.jpg" alt="ДНК" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
              Сеансы воздействуя на клетку и ДНК закладывают информацию о возможности безгранично расширяться в своем Свете. Происходит <span className="text-[#ffa600]">глубочайший спиритуальный процесс – Клеточное Пробуждение</span>.
            </h3>
            <p className="text-base md:text-lg font-medium text-zinc-800 italic">
              Благодаря глубокому осознанию, что мы Творцы — наша жизнь может стать легче, радостней и счастливей.
              <br />
              <span className="mt-3 inline-block uppercase tracking-widest not-italic font-black text-black text-sm">Ведь мы начнём жить так, как хочется нам!</span>
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК 6: АНГЕЛ --- */}
      <section className="py-16 md:py-20 px-4 bg-zinc-50/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1 w-full max-w-[450px]">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl relative group">
              <img src="/images/angel.png" alt="Angel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-zinc-900 uppercase tracking-tight">Энергия Маа'За'Тамее</h2>
            <div className="space-y-4 text-base md:text-lg text-zinc-600 leading-relaxed font-light">
              <p className="italic border-l-4 border-[#ffa600] pl-5 py-1">
                Энергия Маа'За'Тамее может продлить время нашей жизни, которое мы проведём в своем физическом теле.
              </p>
              <p className="text-zinc-800 font-medium">
                Ангел Рафаэль поддержит нас во время сеанса, чтобы каждая клетка смогла принять и вспомнить эту истину и стабилизироваться.
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
              Энергия Маа'За'Тамее запустит процесс Клеточного Пробуждения, что благотворно скажется на нашем глубоком осознании своей Божественности.
            </p>
          </div>
          <div className="flex-1 order-1 md:order-2 w-full max-w-[450px]">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group">
              <img src="/images/dna-activation.png" alt="Activation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* --- БЛОК 8: РЕЗУЛЬТАТЫ --- */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Какие результаты вы получите?</h2>
          <p className="text-sm md:text-base text-zinc-600 font-light leading-relaxed">
            Заметите, что снова можете чувствовать себя в своем теле комфортно, что тело может начать избавляться от симптомов, и со временем чувствовать себя моложе, сильнее и красивее.
          </p>
          <p className="text-sm md:text-base text-zinc-700 font-medium leading-relaxed max-w-3xl mx-auto">
            Ведь первоначальной информацией, заложенной в ваших клетках, была информация о том, что мы не должны болеть, что <span className="font-black">нашим Первоначальным состоянием является состояние здоровья</span>, что мы не должны стареть и физически умирать, что мы являемся Светом и что Свет в наших клетках снабжает нас всем, в чем мы нуждаемся.
          </p>
        </div>
      </section>

      {/* --- БЛОК: ПАРАЛЛАКС С ТЕКСТОМ (Техника Маа'За'Тамее) --- */}
      <section className="relative h-[350px] md:h-[450px] overflow-hidden flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("/images/result.jpg")' }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="backdrop-blur-md bg-black/30 py-10 px-8 rounded-[32px] border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.7)]">
            <p className="text-base md:text-lg font-bold text-white leading-relaxed uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] opacity-95">
              Техника Маа'За'Тамее рассчитана на длительную регулярную работу, так как это серьезный процесс. Трех-пяти сеансов недостаточно. Чтобы перепрограммировать и очистить клетки нужно работать несколько месяцев. Это глубокая работа на уровне ДНК.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {[
              { title: "Курс «Маа'За'Тамее»", price: "3600р.", oldPrice: "4000р.", note: "Скидка до 30 января" },
              { title: "Курс «Здоровый позвоночник»", price: "6200р.", oldPrice: "6650р.", note: "Скидка до 13 февраля", popular: true },
              { title: "«Маа'За'Тамее» + «Здоровый позвоночник»", price: "8900р.", oldPrice: "10650р.", note: "Скидка до 30 января" }
            ].map((pkg, i) => (
              <div key={i} className={`relative bg-white p-6 md:p-8 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border ${pkg.popular ? 'border-[#ffa600] z-10' : 'border-zinc-100'} text-center flex flex-col transition-all hover:shadow-xl`}>
                {pkg.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffa600] text-white px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest">Популярный</div>}
                <h3 className="text-sm md:text-base font-bold mb-3 uppercase min-h-[40px] flex items-center justify-center leading-tight">{pkg.title}</h3>
                <p className="text-[9px] text-orange-500 font-bold uppercase mb-4">{pkg.note}</p>
                <div className="mb-6 flex flex-col items-center">
                  <span className="text-zinc-300 line-through text-xs mb-0.5">{pkg.oldPrice}</span>
                  <span className="text-3xl font-black text-black tracking-tighter">{pkg.price}</span>
                </div>
                <a href="#register" className="mt-auto bg-[#ffa600] text-white py-2.5 rounded-lg text-[11px] font-extrabold uppercase tracking-widest hover:bg-black transition-all shadow-md">
                  Записаться
                </a>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed max-w-3xl mx-auto px-4">
              Нажимая кнопку выше, я подтверждаю, что ознакомлен с <a href="#" className="underline hover:text-[#ffa600]">Договором оферты</a> и принимаю его условия, даю <a href="#" className="underline hover:text-[#ffa600]">Согласие на обработку</a> моих персональных данных на условиях <a href="#" className="underline hover:text-[#ffa600]">Политики конфиденциальности</a>
            </p>
          </div>
        </div>
      </section>

      {/* --- БЛОК 10: ЗДОРОВЫЙ ПОЗВОНОЧНИК (ПОДРОБНО) --- */}
      <section className="py-12 md:py-16 px-4 bg-white border-t border-zinc-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-tight">
            Заочный курс <br /> "Здоровый позвоночник"
          </h2>
          <div className="space-y-1 text-sm md:text-base text-zinc-500 mb-12 font-light italic">
            <p>с 16 по 27 февраля | 10 сеансов по будням</p>
            <p>Сеанс в группе в 8.00 мск. Доступен 24 часа.</p>
          </div>

          <div className="space-y-10">
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight max-w-2xl mx-auto leading-tight">
              Нарушения опорно-двигательной системы проявляются через различные заболевания и болезненные симптомы
            </h3>
            
            <div className="relative max-w-2xl mx-auto">
              <img src="/images/diagram.jpg" alt="Диаграмма" className="w-full h-auto rounded-2xl" />
            </div>

            <div className="pt-10 space-y-8">
              <div className="space-y-2">
                <h4 className="text-lg md:text-xl font-bold uppercase tracking-tight">Данный курс поможет вам в следующих ситуациях:</h4>
                <p className="text-[10px] md:text-xs text-zinc-400 uppercase tracking-widest font-medium">при искривлениях, болях, повышенном давлении</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-4">
                {[
                  { icon: <Zap className="text-[#ffa600]" size={18} />, text: "Боли в пояснице и спине" },
                  { icon: <Sparkles className="text-[#ffa600]" size={18} />, text: "Высокое давление, головные боли и мигрени" },
                  { icon: <Check className="text-[#ffa600]" size={18} />, text: "Искривление таза и разница в длине ног" },
                  { icon: <Zap className="text-[#ffa600]" size={18} />, text: "Боли и спазмы в мышцах, нарушение координации" },
                  { icon: <Check className="text-[#ffa600]" size={18} />, text: "Боли в плечах и коленных суставах, артрозы" },
                  { icon: <Sparkles className="text-[#ffa600]" size={18} />, text: "Искривления в шейном отделе, нарушения слуха" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-3 px-4">
                    <div className="bg-orange-50 p-2 rounded-full">{item.icon}</div>
                    <p className="text-[10px] md:text-[11px] font-bold text-zinc-800 uppercase leading-relaxed tracking-tight">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* НОВЫЙ БЛОК: НАПРАВЛЕНИЯ ЭНЕРГИЙ КУРСА */}
            <div className="pt-16 md:pt-20 border-t border-zinc-100">
              <h3 className="text-xl md:text-2xl font-bold text-center mb-12 uppercase tracking-tight leading-tight max-w-2xl mx-auto">
                Высокочастотные мощные энергии этого курса направлены на:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left max-w-4xl mx-auto">
                {[
                  "Выпрямление светового канала вдоль позвоночника",
                  "Центрирование всей опорно-двигательной системы",
                  "Освобождение от тяжелых элементов кармы сосредоточенной в костях",
                  "Восстановление и Божественное урегулирование всего организма",
                  "Исправление искривления таза и выравнивание длины ног",
                  "Очищение тела от тяжелых металлов",
                  "Выравнивание уровня лопаток",
                  "Очищение энергетического тела и открытие верхних чакр",
                  "Освобождение от боли в спине и выравнивание позвоночника",
                  "Поднятие вибраций"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="mt-1 shrink-0">
                      <Check className="text-[#ffa600] group-hover:scale-125 transition-transform" size={20} />
                    </div>
                    <span className="text-sm md:text-base text-zinc-700 font-light leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* --- БЛОК: ЭНЕРГИИ КУРСА (АККОРДЕОН) --- */}
      <section className="py-12 md:py-16 px-4 bg-white border-t border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-10 uppercase tracking-tight leading-tight max-w-3xl mx-auto">
            В курсе "Здоровый позвоночник" мы будем работать со следующими энергиями:
          </h2>

          <div className="border-t border-[#ffa600]/30">
            {[
              {
                title: "Забота о суставах",
                content: (
                  <p className="text-sm md:text-base text-zinc-600 leading-relaxed font-light py-4">
                    <span className="font-bold text-black">Энергетическая система - Забота о Суставах</span>, облегчает боль при движениях, заполняя область тонких сочленений между нашими костями. Это способствует восстановлению связок, хрящей и других тканей, необходимых для обеспечения комфортного движения каждого сустава.
                  </p>
                )
              },
              {
                title: "Забота о костях",
                content: (
                  <div className="text-sm md:text-base text-zinc-600 leading-relaxed font-light py-4 space-y-4">
                    <p className="font-bold text-black">Мощная Энергетическая система, которая работает на несколько аспектов:</p>
                    <ul className="space-y-3">
                      <li className="flex gap-3 items-start"><span className="text-[#ffa600]">•</span> Структурное Выравнивание энергий вашего физического тела с вашей высшей Божественной Матрицей.</li>
                      <li className="flex gap-3 items-start"><span className="text-[#ffa600]">•</span> Улучшение и оптимизация плотности костной ткани.</li>
                      <li className="flex gap-3 items-start"><span className="text-[#ffa600]">•</span> Жизненная Сила Костного Мозга помогает костному мозгу вырабатывать здоровые клетки крови.</li>
                    </ul>
                    <p className="font-medium text-zinc-800 italic border-l-2 border-[#ffa600] pl-4">Эти Энергии обладают Божественным Разумом.</p>
                  </div>
                )
              },
              {
                title: "Божественное выравнивание позвоночника (1 сеанс)",
                content: (
                  <div className="text-sm md:text-base text-zinc-600 leading-relaxed font-light py-4 space-y-4">
                    <p>
                      <span className="font-bold text-black italic">"Божественное выпрямление"</span> соответствует пульсу Нового времени. Оно представляет собой процесс Божественного изменения структуры ДНК с помощью силы духа.
                    </p>
                    <p>
                      Вы сможете сразу же заметить изменение статики. Спустя несколько дней или недель после сеанса выпрямления позвоночника тело человека восстанавливает божественное урегулирование на клеточном уровне.
                    </p>
                    <p className="font-medium text-zinc-800 italic border-l-2 border-[#ffa600] pl-4">
                      Это урегулирование обуславливает изменение информации в клетках и служит импульсом для самоисцеления.
                    </p>
                  </div>
                )
              }
            ].map((item, i) => (
              <div key={i} className="border-b border-[#ffa600]/30 overflow-hidden">
                <button 
                  onClick={() => setOpenEnergy(openEnergy === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 md:py-8 text-left group"
                >
                  <span className={`text-base md:text-xl font-medium transition-all ${openEnergy === i ? 'text-[#ffa600] font-bold' : 'text-zinc-800 group-hover:text-black'}`}>
                    {item.title}
                  </span>
                  <div className={`transition-transform duration-300 ${openEnergy === i ? 'rotate-180' : ''}`}>
                    {openEnergy === i ? <X size={20} className="text-[#ffa600]" /> : <Plus size={20} className="text-zinc-400" />}
                  </div>
                </button>
                <div 
                  className={`transition-all duration-500 ease-in-out ${openEnergy === i ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-1">{item.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- БЛОК: ТАЙМЕР (Успей прийти на курс) --- */}
      <section className="relative min-h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center text-white py-16">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url("/images/timer.png")' }}
        >
          <div className="absolute inset-0 bg-black/60 md:bg-black/40" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-10">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">
            Успей прийти на курс "МааЗаТамее" по цене со <br className="hidden md:block" /> скидкой <span className="text-zinc-400/50 line-through">4000р.</span> <span className="text-[#ffa600]">3600р.</span>
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm md:text-lg font-bold uppercase tracking-widest opacity-90">
              Курс заочных ЭнергоМедитаций будет проходить по будням с 2 по 13 февраля.
            </p>
            <div className="text-xs md:text-sm font-medium space-y-1 opacity-80 uppercase tracking-widest">
              <p>Закрытие регистрации 30 января в 15.00 мск.</p>
              <p>Повышение цены 1 февраля в 23.00 мск. Осталось:</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 md:gap-10">
            {[
              { label: "День", value: "06" },
              { label: "Час", value: "11" },
              { label: "Минуты", value: "08" },
              { label: "Секунды", value: "37" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-black text-[#ffa600] tracking-tighter drop-shadow-xl">{item.value}</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-60 mt-2">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <a href="#register" className="inline-block bg-[#ffa600] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hover:scale-105 shadow-2xl">
              Принять участие
            </a>
            <p className="mt-8 text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed max-w-3xl mx-auto opacity-80">
              Нажимая кнопку выше, я подтверждаю, что ознакомлен с <a href="#" className="underline hover:text-[#ffa600]">Договором оферты</a> и принимаю его условия, даю <a href="#" className="underline hover:text-[#ffa600]">Согласие на обработку</a> моих персональных данных на условиях <a href="#" className="underline hover:text-[#ffa600]">Политики конфиденциальности</a>
            </p>
          </div>
        </div>
      </section>
      {/* --- НОВЫЙ БЛОК: ЗНАКОМСТВО (Оксана Войнова) --- */}
      <section className="py-16 md:py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">
            <div className="flex-[1.3] space-y-8">
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-tight">
                Давайте знакомиться, меня зовут Оксана Войнова (Sija'Maa)
              </h2>
              
              <div className="space-y-6 text-sm md:text-base text-zinc-600 font-light leading-relaxed">
                <p>
                  Преображаю людей, помогая им обрести молодость, здоровье, внутренний ресурс, баланс и гармонию с собой и миром. Провожу исцеляющие и омолаживающие программы, групповые курсы, личные сессии, индивидуальные потоковые расстановки, диагностику тонкого и физического тела. Помогаю расширить границы и увидеть Свет внутри себя.
                </p>
                
                <ul className="grid grid-cols-1 gap-y-2 text-[11px] md:text-[13px] text-zinc-500 font-medium">
                  {[
                    "Тренер, целитель техники Элизз-Мила", "Тренер школы Крайона", "Маг Нового Времени",
                    "Световой косметолог", "Терапевт Божественного Выравнивания", "Целитель Нового Времени",
                    "Целительская техника Ноам Зарус", "Целительная техника Ниа Та Нэ", "Целительная техника Маа За Тамее",
                    "Мастер ХИАМ'АНАСТРА", "Медиум Нового Времени", "Мастер Тора Ан Тария",
                    "Арт- терапевт, коуч", "Мастер Учитель Рэйки", "Мастер по работе с энергией SHOON'A'NAAR (меч Экскалибур)",
                    "Шийя'А'Шун — пионер детских шагов Тийя'А'Нада", "ШЕН'А'МАА — белая жрица"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-300">—</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex-1 w-full max-w-[450px] sticky top-24">
              <div className="aspect-[3/4] bg-zinc-50 rounded-[40px] border border-zinc-100 flex items-center justify-center relative overflow-hidden shadow-sm">
                <div className="text-zinc-300 font-black uppercase text-xs tracking-widest text-center px-10">
                  Место для фото Оксаны
                </div>
                <User size={120} className="absolute bottom-[-20px] text-zinc-100" />
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
      <section id="register" className="pt-4 pb-20 px-4 bg-gradient-to-b from-zinc-50 via-orange-50/30 to-zinc-50 relative overflow-hidden">
        {/* Фоновые декоративные элементы для глубины */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-100/50 rounded-full blur-[120px] opacity-40" />

        <div className="max-w-xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-6 md:p-8 rounded-[32px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,166,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] border-2 border-[#ffa600]/20 flex flex-col items-center relative overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-[#ffa600] to-transparent rounded-full" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffa600]/10 rounded-full blur-[80px] -mr-24 -mt-24" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ffa600]/10 rounded-full blur-[80px] -ml-24 -mb-24" />
            
            <div className="text-center mb-6 space-y-2 relative z-10">
              <div className="inline-block bg-[#ffa600]/20 text-[#ffa600] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#ffa600]/30">
                Финальный шаг
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight">
                Забронируйте <br /> своё участие
              </h3>
              <p className="text-zinc-300 text-xs font-light max-w-xs mx-auto">
                Заполните данные для регистрации и перехода к безопасной системе оплаты Prodamus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-3">
              {[
                { id: "full_name", placeholder: "ФИО полностью", icon: <User size={18} /> },
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
                    type={field.id === 'email' ? 'email' : (field.id === 'phone' ? 'tel' : 'text')}
                    placeholder={field.placeholder} 
                    className="w-full bg-zinc-800/50 border-2 border-zinc-700/50 p-3.5 pl-12 rounded-2xl text-white outline-none focus:border-[#ffa600] focus:ring-2 focus:ring-orange-500/20 focus:bg-zinc-800 transition-all duration-300 text-sm placeholder:text-zinc-400 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group-hover:border-zinc-600"
                    value={(formData as any)[field.id]} 
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})} 
                  />
                </div>
              ))}

              <div className="pt-4 space-y-5">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-[#ffa600] to-[#ff8c00] text-white py-3.5 rounded-2xl font-black text-sm hover:from-black hover:to-zinc-900 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] hover:scale-[1.02] transition-all duration-300 uppercase tracking-widest active:scale-[0.98] shadow-[0_8px_24px_-5px_rgba(255,166,0,0.4)]"
                >
                  {loading ? "ПОДОЖДИТЕ..." : "ЗАПИСАТЬСЯ И ОПЛАТИТЬ"}
                </button>
                
                <div className="bg-zinc-800/40 backdrop-blur-sm p-4 rounded-2xl border-2 border-zinc-700/30 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <p className="text-[8px] md:text-[9px] text-zinc-300 text-center leading-relaxed font-medium">
                    Нажимая кнопку выше, я подтверждаю, что ознакомлен с <a href="#" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Договором оферты</a> и принимаю его условия, даю <a href="#" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Согласие на обработку</a> моих персональных данных на условиях <a href="#" className="text-zinc-200 underline hover:text-[#ffa600] font-semibold">Политики конфиденциальности</a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* --- ФУТЕР --- */}
      <footer className="py-16 px-4 bg-white border-t border-zinc-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          <div className="text-center md:text-left space-y-8">
            <div className="flex justify-center md:justify-start gap-10">
              <a href="#" className="group flex flex-col items-center md:items-start gap-3 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-black">Instagram</span>
              </a>
              
              <a href="#" className="group flex flex-col items-center md:items-start gap-3 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#0088cc] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-black">Telegram</span>
              </a>
            </div>
            
            <p className="text-[9px] text-zinc-300 uppercase tracking-[0.3em] font-medium">
              © 2026. Все права защищены.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-[9px] md:text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
            <div className="flex items-center gap-3 group">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-[#ffa600] transition-colors" />
              <a href="#" className="hover:text-black transition-colors">Согласие на получение рассылки</a>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-[#ffa600] transition-colors" />
              <a href="#" className="hover:text-black transition-colors">Согласие на обработку персональных данных</a>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-[#ffa600] transition-colors" />
              <a href="#" className="hover:text-black transition-colors">Политика конфиденциальности</a>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 group-hover:bg-[#ffa600] transition-colors" />
              <a href="#" className="hover:text-black transition-colors">Договор оферты</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
