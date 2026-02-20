-- ============================================
-- Добавить telegram_chat_id в registered_members
-- Чтобы "учётка" (запись в registered_members) хранила привязку к Telegram
-- ============================================

ALTER TABLE public.registered_members
  ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

CREATE INDEX IF NOT EXISTS idx_registered_members_telegram_chat_id
  ON public.registered_members(telegram_chat_id)
  WHERE telegram_chat_id IS NOT NULL;
