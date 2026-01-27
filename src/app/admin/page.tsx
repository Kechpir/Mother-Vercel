"use client";

import { useEffect, useState } from "react";
import { Calendar, DollarSign, Users, Filter, Lock, Download } from "lucide-react";

interface Participant {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  age: string;
  payment_status: string;
  payment_amount: number | null;
  payment_inv_id: string | null;
  promo_code: string | null;
  created_at: string;
  updated_at: string;
}

interface Stats {
  totalCount: number;
  totalAmount: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCount: 0, totalAmount: "0" });
  const [loading, setLoading] = useState(false);
  
  // Фильтры
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const handleLogin = () => {
    if (password) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', password);
      fetchParticipants();
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth) {
      setIsAuthenticated(true);
      fetchParticipants();
    }
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const auth = localStorage.getItem('admin_auth') || password;
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (minAmount) params.append('min_amount', minAmount);
      if (maxAmount) params.append('max_amount', maxAmount);

      const response = await fetch(`/api/admin/participants?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_auth');
        return;
      }

      const data = await response.json();
      setParticipants(data.participants || []);
      setStats(data.stats || { totalCount: 0, totalAmount: "0" });
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchParticipants();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    fetchParticipants();
  };

  const exportToCSV = () => {
    // Функция для правильного экранирования CSV значений
    const escapeCSV = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      // Если значение содержит точку с запятой, кавычки или перенос строки, оборачиваем в кавычки
      if (str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        // Удваиваем кавычки внутри значения
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['ФИО', 'Телефон', 'Email', 'Город', 'Возраст', 'Сумма', 'Промокод', 'Дата оплаты'];
    const rows = participants.map(p => [
      escapeCSV(p.full_name),
      escapeCSV(p.phone),
      escapeCSV(p.email),
      escapeCSV(p.city),
      escapeCSV(p.age),
      escapeCSV(p.payment_amount?.toFixed(2) || '0'),
      escapeCSV(p.promo_code),
      escapeCSV(new Date(p.created_at).toLocaleString('ru-RU')),
    ]);

    // Форматируем CSV: 
    // 1. Добавляем 'sep=;' чтобы Excel сразу понял разделитель
    // 2. Используем ';' как разделитель (стандарт для Excel в РФ)
    const csvContent = [
      headers.map(escapeCSV).join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\r\n');
    
    const csvWithExcelHint = `sep=;\r\n${csvContent}`;
    
    // Используем BOM (\ufeff) для корректного отображения кириллицы в UTF-8
    const blob = new Blob(['\ufeff' + csvWithExcelHint], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `participants_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-800/50 backdrop-blur-sm rounded-3xl border-2 border-[#ffa600]/30 shadow-2xl p-8">
          <div className="text-center mb-6">
            <Lock className="w-16 h-16 text-[#ffa600] mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white mb-2 uppercase">Админ-панель</h1>
            <p className="text-zinc-400 text-sm">Введите пароль для доступа</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Пароль"
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa600]"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-[#ffa600] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Войти
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 uppercase">Админ-панель</h1>
          <p className="text-zinc-400">Управление участниками</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Всего участников</p>
                <p className="text-3xl font-bold text-white">{stats.totalCount}</p>
              </div>
              <Users className="w-12 h-12 text-[#ffa600]" />
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Общая сумма</p>
                <p className="text-3xl font-bold text-white">{parseFloat(stats.totalAmount).toLocaleString('ru-RU')} ₸</p>
              </div>
              <DollarSign className="w-12 h-12 text-[#ffa600]" />
            </div>
          </div>
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Средний чек</p>
                <p className="text-3xl font-bold text-white">
                  {stats.totalCount > 0 
                    ? (parseFloat(stats.totalAmount) / stats.totalCount).toLocaleString('ru-RU', { maximumFractionDigits: 0 })
                    : 0} ₸
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-[#ffa600]" />
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#ffa600]" />
            <h2 className="text-xl font-bold text-white">Фильтры</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Дата от</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#ffa600]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Дата до</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#ffa600]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Сумма от (₸)</label>
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa600]"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Сумма до (₸)</label>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="25000"
                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa600]"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleFilter}
              className="bg-[#ffa600] text-white px-6 py-2 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Применить
            </button>
            <button
              onClick={handleReset}
              className="bg-zinc-700 text-white px-6 py-2 rounded-xl font-medium uppercase tracking-widest hover:bg-zinc-600 transition-all"
            >
              Сбросить
            </button>
            <button
              onClick={exportToCSV}
              className="bg-zinc-700 text-white px-6 py-2 rounded-xl font-medium uppercase tracking-widest hover:bg-zinc-600 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Экспорт CSV
            </button>
          </div>
        </div>

        {/* Таблица */}
        <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">ФИО</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Телефон</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Город</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Сумма</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Промокод</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">
                      Загрузка...
                    </td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">
                      Нет данных
                    </td>
                  </tr>
                ) : (
                  participants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{participant.full_name}</td>
                      <td className="px-6 py-4 text-zinc-300">{participant.phone}</td>
                      <td className="px-6 py-4 text-zinc-300">{participant.email}</td>
                      <td className="px-6 py-4 text-zinc-300">{participant.city}</td>
                      <td className="px-6 py-4 text-white font-bold">
                        {participant.payment_amount 
                          ? `${parseFloat(participant.payment_amount.toString()).toLocaleString('ru-RU')} ₸`
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {participant.promo_code ? (
                          <span className="bg-[#ffa600]/20 text-[#ffa600] px-2 py-1 rounded text-xs font-bold">
                            {participant.promo_code}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-sm">
                        {new Date(participant.created_at).toLocaleString('ru-RU')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
