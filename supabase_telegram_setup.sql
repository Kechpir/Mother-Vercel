-- ============================================
-- Обновление таблицы participants для Telegram ссылок
-- ============================================

-- Добавляем поля для Telegram инвайт-ссылок
ALTER TABLE public.participants 
ADD COLUMN IF NOT EXISTS telegram_invite_link TEXT,
ADD COLUMN IF NOT EXISTS telegram_invite_used BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS telegram_invite_created_at TIMESTAMPTZ;

-- Создаем индекс для быстрого поиска по использованным ссылкам
CREATE INDEX IF NOT EXISTS idx_participants_telegram_invite_used 
ON public.participants(telegram_invite_used) 
WHERE telegram_invite_used = false;

-- ============================================
-- Готово! Теперь можно хранить Telegram ссылки
-- ============================================
