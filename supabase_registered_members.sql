-- Таблица зарегистрированных участников (без оплаты): ФИО, город, возраст, телефон, почта
CREATE TABLE IF NOT EXISTS public.registered_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    city TEXT,
    age TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_registered_members_email ON public.registered_members(email);
CREATE INDEX IF NOT EXISTS idx_registered_members_created_at ON public.registered_members(created_at);

ALTER TABLE public.registered_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert registered_members" ON public.registered_members
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public select registered_members" ON public.registered_members
    FOR SELECT TO anon, authenticated USING (true);
