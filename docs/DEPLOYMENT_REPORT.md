# Отчет о деплое проекта на Vercel

**Дата:** 24 января 2026  
**Проект:** Mother-Vercel  
**Репозиторий:** https://github.com/Kechpir/Mother-Vercel  
**Домен:** https://mother-versel.vercel.app/

## Цель работы

Успешно задеплоить Next.js приложение на Vercel с миграцией всех локальных ассетов на Cloudinary и настройкой правильной конфигурации для production.

## Выполненные задачи

### 1. Миграция ассетов на Cloudinary

**Проблема:** Локальные изображения и видео занимали много места в репозитории и могли вызывать проблемы с лимитами Vercel.

**Решение:**
- Заменены все локальные пути на Cloudinary URLs в `src/app/page.tsx`:
  - Видео: `/videos/43832-437611758_small.mp4` → Cloudinary URL
  - Изображения: `/images/dna.jpg`, `/images/angel.png`, `/images/dna-activation.png`, `/images/result.jpg`, `/images/diagram.jpg`, `/images/timer.png` → Cloudinary URLs
- Удалены локальные файлы из репозитория (очистка `public/images/` и `public/videos/`)

**Результат:** Репозиторий стал легче, ассеты загружаются из облака.

### 2. Создание нового репозитория GitHub

**Проблема:** Старый репозиторий был привязан к аккаунту `Chekpir`, требовался переход на аккаунт `Kechpir`.

**Решение:**
- Создан новый репозиторий: `Kechpir/Mother-Vercel`
- Обновлен remote URL: `git remote set-url origin https://github.com/Kechpir/Mother-Vercel.git`
- Исправлен автор коммитов: `git config user.name "Kechpir"`
- Выполнен force push для синхронизации с новым репозиторием

**Результат:** Проект теперь находится в правильном аккаунте GitHub.

### 3. Обновление зависимостей

**Проблема:** Next.js 14.1.0 содержал уязвимость безопасности.

**Решение:**
- Обновлен `package.json`: `"next": "14.1.0"` → `"next": "^14.2.23"`
- Запушены изменения в репозиторий

**Результат:** Проект использует безопасную версию Next.js без предупреждений.

### 4. Настройка переменных окружения в Vercel

**Проблема:** При сборке возникала ошибка `Error: supabaseUrl is required`.

**Решение:**
- Добавлены переменные окружения в Vercel (Settings → Environment Variables):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://dkbmhkglrlavrideaguc.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (токен из `.env`)

**Результат:** Сборка проходит успешно, Supabase клиент инициализируется корректно.

### 5. Исправление конфигурации Vercel

**Проблема:** Сайт возвращал 404 NOT_FOUND после успешной сборки.

**Решение:**
- Изменен **Framework Preset** в Vercel: с "Other" на **"Next.js"**
- Создан файл `next.config.js` с базовой конфигурацией:
  ```js
  const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
  }
  ```
- Настроен **Node.js Version**: 24.x → **20.x** (LTS)
- Отключен **Deployment Protection** для публичного доступа

**Результат:** Сайт успешно загружается и отображается корректно.

### 6. Исправление автора коммитов

**Проблема:** Коммиты отображались от имени `Chekpir` вместо `Kechpir`.

**Решение:**
- Обновлены локальные и глобальные настройки Git:
  - `git config user.name "Kechpir"`
  - `git config --global user.name "Kechpir"`
- Переподписан последний коммит с правильным автором:
  - `git commit --amend --author="Kechpir <74138894+Kechpir@users.noreply.github.com>"`

**Результат:** Все коммиты теперь отображаются от имени `Kechpir`.

## Технические детали

### Структура проекта
- **Framework:** Next.js 14.2.23 (App Router)
- **Node.js:** 20.x (LTS)
- **TypeScript:** Да
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **Asset Hosting:** Cloudinary

### Конфигурационные файлы
- `next.config.js` - базовая конфигурация Next.js
- `.env` - локальные переменные окружения (не в репозитории)
- `package.json` - зависимости проекта

### Домены
- **Production:** https://mother-versel.vercel.app/
- **Git Branch:** `main`
- **Deployment:** Автоматический при push в `main`

## Проблемы и их решения

### Проблема 1: Ошибка аутентификации GitHub
**Симптом:** `fatal: Authentication failed for 'https://github.com/...'`  
**Причина:** Неправильные настройки прокси в переменных окружения  
**Решение:** Очистка переменных `HTTP_PROXY`, `HTTPS_PROXY`, `GIT_HTTP_PROXY`, `GIT_HTTPS_PROXY`

### Проблема 2: Ошибка сборки Supabase
**Симптом:** `Error: supabaseUrl is required`  
**Причина:** Отсутствие переменных окружения в Vercel  
**Решение:** Добавление `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` в настройках Vercel

### Проблема 3: 404 NOT_FOUND после успешной сборки
**Симптом:** Сборка проходит успешно, но сайт возвращает 404  
**Причина:** Неправильный Framework Preset в Vercel (был установлен "Other" вместо "Next.js")  
**Решение:** Изменение Framework Preset на "Next.js" в настройках проекта

## Итоговый статус

✅ **Проект успешно задеплоен на Vercel**  
✅ **Все ассеты мигрированы на Cloudinary**  
✅ **Переменные окружения настроены**  
✅ **Сайт доступен по адресу:** https://mother-versel.vercel.app/  
✅ **Автоматический деплой настроен** (при push в `main`)

## Следующие шаги

1. Настроить кастомный домен (если требуется)
2. Настроить мониторинг и аналитику
3. Оптимизировать производительность (lazy loading, image optimization)
4. Настроить CI/CD для тестирования перед деплоем

## Полезные ссылки

- [Репозиторий GitHub](https://github.com/Kechpir/Mother-Vercel)
- [Vercel Dashboard](https://vercel.com/mothers-projects-48475976)
- [Cloudinary Dashboard](https://cloudinary.com/)
- [Supabase Dashboard](https://supabase.com/dashboard)

---

**Примечание:** Этот отчет создан для контекста и документирования процесса деплоя. Все изменения закоммичены и запушены в репозиторий.
