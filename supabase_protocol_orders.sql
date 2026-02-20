-- ============================================
-- Таблица «Персональный энергетический протокол»
-- Заявки с страницы протокола (без инвайт-ссылок в Telegram)
-- ============================================

CREATE TABLE IF NOT EXISTS public.protocol_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    email TEXT,
    city TEXT,
    age TEXT,
    telegram TEXT,
    promo_code TEXT,
    payment_status TEXT DEFAULT 'pending',
    payment_inv_id TEXT,
    payment_amount NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_protocol_orders_email ON public.protocol_orders(email);
CREATE INDEX IF NOT EXISTS idx_protocol_orders_payment_status ON public.protocol_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_protocol_orders_payment_inv_id ON public.protocol_orders(payment_inv_id);

ALTER TABLE public.protocol_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert protocol_orders" ON public.protocol_orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select protocol_orders" ON public.protocol_orders
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow update protocol_orders" ON public.protocol_orders
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_protocol_orders_updated_at
    BEFORE UPDATE ON public.protocol_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
