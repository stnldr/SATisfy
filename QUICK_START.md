# Быстрый старт - Подключение Supabase

## 🚀 За 5 минут

### 1. Создайте проект в Supabase
- Перейдите на https://supabase.com
- Создайте новый проект
- Дождитесь завершения (1-2 минуты)

### 2. Получите ключи
- Settings → API
- Скопируйте **Project URL** и **anon public** ключ

### 3. Создайте файл `.env`
Создайте файл `.env` в корне проекта:

```env
VITE_SUPABASE_URL=https://ваш-проект.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=ваш-anon-ключ
```

### 4. Примените миграции
В Supabase Dashboard → SQL Editor выполните по порядку:

1. `supabase/migrations/20240101000000_create_sat_schema.sql`
2. `supabase/migrations/20240101000001_create_stats_update_function.sql`
3. `supabase/migrations/20240101000002_create_subscriptions.sql` (опционально)
4. `supabase/migrations/20240101000003_create_pending_payments.sql` (опционально)
5. `supabase/migrations/create_user_questions.sql`

### 5. Запустите проект
```bash
npm run dev
```

### 6. Проверьте
- Откройте http://localhost:8080
- Попробуйте зарегистрироваться
- Проверьте консоль браузера (F12) на ошибки

## ✅ Готово!

Подробная инструкция: см. `SUPABASE_SETUP.md`





