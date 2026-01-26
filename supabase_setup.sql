-- ============================================
-- Создание таблицы participants для регистрации
-- ============================================

-- Создаем таблицу participants
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    city TEXT,
    age TEXT,
    payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
    payment_inv_id TEXT, -- ID платежа из Robokassa
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_payment_status ON public.participants(payment_status);
CREATE INDEX IF NOT EXISTS idx_participants_payment_inv_id ON public.participants(payment_inv_id);

-- Включаем Row Level Security (RLS)
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Политика: Разрешаем ВСЕМ (анонимным пользователям) добавлять записи (INSERT)
CREATE POLICY "Allow public insert" ON public.participants
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Политика: Разрешаем ВСЕМ читать записи (SELECT) - если нужно будет просматривать список
-- Если не нужно, закомментируй эту политику
CREATE POLICY "Allow public select" ON public.participants
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Политика: Разрешаем обновлять записи (UPDATE) - для обновления статуса оплаты
-- Это нужно для API, который будет обновлять payment_status после оплаты
CREATE POLICY "Allow update payment status" ON public.participants
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_participants_updated_at
    BEFORE UPDATE ON public.participants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Готово! Теперь таблица готова к использованию
-- ============================================
