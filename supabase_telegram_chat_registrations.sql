-- ============================================
-- Таблица привязки email пользователя к Telegram chat_id
-- (для отправки уведомлений после оплаты тем, кто подключил бота)
-- ============================================

-- Если таблица уже создана вручную — выполните только блок ALTER ниже.

CREATE TABLE IF NOT EXISTS public.telegram_chat_registrations (
  email TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Добавить updated_at, если таблица была создана без него
ALTER TABLE public.telegram_chat_registrations
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;

-- Индекс по chat_id на случай поиска по нему
CREATE INDEX IF NOT EXISTS idx_telegram_chat_registrations_chat_id
  ON public.telegram_chat_registrations(chat_id);

-- RLS (опционально): доступ только через service role с бэкенда
ALTER TABLE public.telegram_chat_registrations ENABLE ROW LEVEL SECURITY;

-- Политика: запретить прямой доступ из anon (все запросы идут через API с service role)
CREATE POLICY "Service role only"
  ON public.telegram_chat_registrations
  FOR ALL
  USING (false)
  WITH CHECK (false);
