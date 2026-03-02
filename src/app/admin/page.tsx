"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Calendar, DollarSign, Users, Filter, Lock, Download, UserCircle } from "lucide-react";

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
  telegram_invite_link?: string | null;
  created_at: string;
  updated_at: string;
}

interface SiteUser {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  age: string | null;
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
  const [allUsers, setAllUsers] = useState<SiteUser[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCount: 0, totalAmount: "0" });
  const [loading, setLoading] = useState(false);
  
  // Режим: участники (главная/протокол) или все зарегистрированные пользователи
  const [source, setSource] = useState<"main" | "protocol" | "users">("main");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending">("paid");
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  // Фильтры для раздела «Все пользователи»
  const [filterFirstName, setFilterFirstName] = useState("");
  const [filterLastName, setFilterLastName] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const auth = localStorage.getItem('admin_auth') || password;
      const params = new URLSearchParams();
      if (filterFirstName.trim()) params.append('first_name', filterFirstName.trim());
      if (filterLastName.trim()) params.append('last_name', filterLastName.trim());
      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${auth}` },
      });
      if (response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_auth');
        return;
      }
      const data = await response.json();
      setAllUsers(data.users || []);
    } catch (e) {
      console.error('Failed to fetch users:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (password) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', password);
      if (source === "users") fetchUsers();
      else fetchParticipants();
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth) {
      setIsAuthenticated(true);
      if (source === "users") fetchUsers();
      else fetchParticipants();
    }
  }, []);

  // При смене вкладки выставляем статус по умолчанию и перезагружаем
  useEffect(() => {
    if (source !== "users") setStatusFilter(source === "protocol" ? "all" : "paid");
  }, [source]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (source === "users") fetchUsers();
    else fetchParticipants();
  }, [source, statusFilter]);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const auth = localStorage.getItem('admin_auth') || password;
      const params = new URLSearchParams();
      params.append('source', source);
      params.append('status', statusFilter);
      if (searchName.trim()) params.append('name', searchName.trim());
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
    if (source === "users") fetchUsers();
    else fetchParticipants();
  };

  const handleReset = () => {
    if (source === "users") {
      setFilterFirstName("");
      setFilterLastName("");
      fetchUsers();
    } else {
      setSearchName("");
      setStartDate("");
      setEndDate("");
      setMinAmount("");
      setMaxAmount("");
      fetchParticipants();
    }
  };

  const cell = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const exportToExcel = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    let data: string[][];
    let fileName: string;

    if (source === "users") {
      const headers = ["ФИО", "Телефон", "Город", "Возраст", "Дата обновления"];
      data = [
        headers,
        ...allUsers.map((u) => [
          cell(u.full_name),
          cell(u.phone),
          cell(u.city),
          cell(u.age),
          u.updated_at ? new Date(u.updated_at).toLocaleString("ru-RU") : "",
        ]),
      ];
      fileName = `users_${dateStr}.xlsx`;
    } else {
      const headers = ["ФИО", "Телефон", "Email", "Город", "Возраст", "Сумма", "Промокод", "Ссылка в Telegram", "Дата оплаты"];
      data = [
        headers,
        ...participants.map((p) => [
          cell(p.full_name),
          cell(p.phone),
          cell(p.email),
          cell(p.city),
          cell(p.age),
          p.payment_amount != null ? p.payment_amount.toFixed(2) : "0",
          cell(p.promo_code),
          cell(p.telegram_invite_link ?? ""),
          new Date(p.created_at).toLocaleString("ru-RU"),
        ]),
      ];
      fileName = `${source === "protocol" ? "protocol_orders" : "participants"}_${dateStr}.xlsx`;
    }

    const ws = XLSX.utils.aoa_to_sheet(data);
    const numCols = data[0]?.length ?? 0;
    const colWidths = Array.from({ length: numCols }, (_, i) => {
      const maxLen = Math.max(0, ...data.map((row) => (row[i] != null ? String(row[i]).length : 0)));
      return { wch: Math.min(maxLen + 2, 50) };
    });
    ws["!cols"] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Данные");
    // Явно формат xlsx — кириллица без кракозябр, не CSV
    XLSX.writeFile(wb, fileName, { bookType: "xlsx" });
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
          <p className="text-zinc-400">
            {source === "users"
              ? "Все зарегистрированные пользователи сайта (независимо от оплаты)"
              : `Управление участниками · ${source === "main" ? "Главная страница" : "Персональный энергетический протокол"}`}
          </p>
        </div>

        {/* Статистика: для участников — 3 карточки, для пользователей — одна */}
        <div className={`grid gap-4 mb-6 ${source === "users" ? "grid-cols-1 max-w-sm" : "grid-cols-1 md:grid-cols-3"}`}>
          {source === "users" ? (
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm mb-1">Всего пользователей</p>
                  <p className="text-3xl font-bold text-white">{allUsers.length}</p>
                </div>
                <UserCircle className="w-12 h-12 text-[#ffa600]" />
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Переключатель: Главная / Протокол / Все пользователи */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={() => setSource("main")}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
              source === "main" ? "bg-[#ffa600] text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            Главная страница
          </button>
          <button
            onClick={() => setSource("protocol")}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all ${
              source === "protocol" ? "bg-[#ffa600] text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            Персональный энергетический протокол
          </button>
          <button
            onClick={() => setSource("users")}
            className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
              source === "users" ? "bg-[#ffa600] text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            <UserCircle className="w-5 h-5" />
            Все пользователи
          </button>
          {source !== "users" && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-sm uppercase tracking-wider">Статус:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "paid" | "pending")}
                onBlur={() => fetchParticipants()}
                className="bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#ffa600]"
              >
                <option value="all">Все</option>
                <option value="paid">Оплачено</option>
                <option value="pending">Ожидание</option>
              </select>
              <button type="button" onClick={handleFilter} className="text-zinc-400 hover:text-white text-sm uppercase">
                Применить
              </button>
            </div>
          )}
        </div>

        {/* Фильтры: разные для участников и для пользователей */}
        <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#ffa600]" />
            <h2 className="text-xl font-bold text-white">Фильтры</h2>
          </div>
          {source === "users" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Имя</label>
                <input
                  type="text"
                  value={filterFirstName}
                  onChange={(e) => setFilterFirstName(e.target.value)}
                  placeholder="Поиск по имени"
                  className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa600]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Фамилия</label>
                <input
                  type="text"
                  value={filterLastName}
                  onChange={(e) => setFilterLastName(e.target.value)}
                  placeholder="Поиск по фамилии"
                  className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa600]"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">ФИО</label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Имя или фамилия"
                  className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#ffa600]"
                />
              </div>
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
          )}
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
              onClick={exportToExcel}
              className="bg-zinc-700 text-white px-6 py-2 rounded-xl font-medium uppercase tracking-widest hover:bg-zinc-600 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Экспорт Excel
            </button>
          </div>
        </div>

        {/* Таблица: участники или пользователи */}
        <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            {source === "users" ? (
              <table className="w-full">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">ФИО</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Телефон</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Город</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Возраст</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Дата обновления</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">Загрузка...</td>
                    </tr>
                  ) : allUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-400">Нет данных</td>
                    </tr>
                  ) : (
                    allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{u.full_name ?? "—"}</td>
                        <td className="px-6 py-4 text-zinc-300">{u.phone ?? "—"}</td>
                        <td className="px-6 py-4 text-zinc-300">{u.city ?? "—"}</td>
                        <td className="px-6 py-4 text-zinc-300">{u.age ?? "—"}</td>
                        <td className="px-6 py-4 text-zinc-400 text-sm">
                          {u.updated_at ? new Date(u.updated_at).toLocaleString("ru-RU") : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">ФИО</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Телефон</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Город</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Сумма</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Промокод</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Ссылка в Telegram</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Дата</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/50">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-zinc-400">Загрузка...</td>
                    </tr>
                  ) : participants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-zinc-400">Нет данных</td>
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
                            ? `${parseFloat(participant.payment_amount.toString()).toLocaleString("ru-RU")} ₸`
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          {participant.promo_code ? (
                            <span className="bg-[#ffa600]/20 text-[#ffa600] px-2 py-1 rounded text-xs font-bold">
                              {participant.promo_code}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-4 text-zinc-300 max-w-[220px]">
                          {participant.telegram_invite_link ? (
                            <a
                              href={participant.telegram_invite_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0088cc] hover:underline break-all text-xs"
                              title={participant.telegram_invite_link}
                            >
                              {participant.telegram_invite_link}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-sm">
                          {new Date(participant.created_at).toLocaleString("ru-RU")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
