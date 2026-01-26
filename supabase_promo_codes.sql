-- ============================================
-- Создание таблицы promo_codes для промокодов
-- ============================================

-- Создаем таблицу promo_codes
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL,
    discount_percent NUMERIC(5, 2),
    is_active BOOLEAN DEFAULT true,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON public.promo_codes(is_active);

-- Включаем Row Level Security (RLS)
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Политика: Разрешаем ВСЕМ читать активные промокоды (для валидации)
CREATE POLICY "Allow public select active promo codes" ON public.promo_codes
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Пример создания промокода на скидку 10000 тенге (цена будет 15000 вместо 25000)
-- INSERT INTO public.promo_codes (code, discount_amount, is_active, usage_limit)
-- VALUES ('PROMO2026', 10000, true, NULL);

-- ============================================
-- Готово! Таблица готова к использованию
-- ============================================
