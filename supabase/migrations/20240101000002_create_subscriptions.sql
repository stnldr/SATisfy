-- Create subscription plans enum
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid');
CREATE TYPE subscription_plan_type AS ENUM ('free', 'basic', 'premium', 'pro');

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10, 2),
  plan_type subscription_plan_type NOT NULL DEFAULT 'free',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  max_questions_per_day INTEGER,
  max_lessons_access INTEGER,
  max_flashcards_access INTEGER,
  unlimited_practice BOOLEAN DEFAULT false,
  advanced_analytics BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_history table (for tracking changes)
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  status subscription_status NOT NULL,
  action TEXT NOT NULL, -- 'created', 'upgraded', 'downgraded', 'canceled', 'renewed'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_id ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Subscription plans: Public read access
CREATE POLICY "Subscription plans are viewable by everyone"
  ON subscription_plans FOR SELECT
  USING (true);

-- User subscriptions: Users can only see their own subscription
CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Subscription history: Users can only see their own history
CREATE POLICY "Users can view their own subscription history"
  ON subscription_history FOR SELECT
  USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, description, price_monthly, price_yearly, plan_type, features, max_questions_per_day, unlimited_practice, advanced_analytics, priority_support) VALUES
('free', 'Бесплатный', 'Базовые возможности для начала подготовки', 0, 0, 'free', 
 '["До 10 вопросов в день", "Ограниченный доступ к урокам", "Базовые флеш-карты", "Базовая статистика"]'::jsonb,
 10, false, false, false),
('basic', 'Базовый', 'Для регулярной практики', 9.99, 99.99, 'basic',
 '["Неограниченные вопросы", "Все уроки", "Все флеш-карты", "Расширенная статистика"]'::jsonb,
 NULL, true, false, false),
('premium', 'Премиум', 'Максимальная эффективность подготовки', 19.99, 199.99, 'premium',
 '["Все возможности Базового", "Продвинутая аналитика", "Приоритетная поддержка", "Эксклюзивные материалы"]'::jsonb,
 NULL, true, true, true),
('pro', 'Профессиональный', 'Для серьезной подготовки', 39.99, 399.99, 'pro',
 '["Все возможности Премиум", "Персональный тренер", "Кастомные планы обучения", "API доступ"]'::jsonb,
 NULL, true, true, true)
ON CONFLICT (id) DO NOTHING;

-- Function to get user's active subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  plan_id TEXT,
  status subscription_status,
  plan_name TEXT,
  plan_features JSONB,
  current_period_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id,
    us.plan_id,
    us.status,
    sp.name,
    sp.features,
    us.current_period_end
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_uuid
    AND us.status IN ('active', 'trialing')
    AND us.current_period_end > NOW()
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to feature
CREATE OR REPLACE FUNCTION has_subscription_access(user_uuid UUID, feature_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan subscription_plan_type;
  plan_record RECORD;
BEGIN
  -- Get user's active subscription
  SELECT sp.plan_type INTO plan_record
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_uuid
    AND us.status IN ('active', 'trialing')
    AND us.current_period_end > NOW()
  LIMIT 1;

  -- If no subscription, default to free
  IF plan_record IS NULL THEN
    user_plan := 'free';
  ELSE
    user_plan := plan_record.plan_type;
  END IF;

  -- Check feature access based on plan
  CASE feature_name
    WHEN 'unlimited_questions' THEN
      RETURN user_plan IN ('basic', 'premium', 'pro');
    WHEN 'advanced_analytics' THEN
      RETURN user_plan IN ('premium', 'pro');
    WHEN 'priority_support' THEN
      RETURN user_plan IN ('premium', 'pro');
    WHEN 'all_lessons' THEN
      RETURN user_plan IN ('basic', 'premium', 'pro');
    WHEN 'all_flashcards' THEN
      RETURN user_plan IN ('basic', 'premium', 'pro');
    ELSE
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;






