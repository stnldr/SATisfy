-- Create pending_payments table for tracking payment sessions
CREATE TABLE IF NOT EXISTS pending_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KZT',
  billing_period TEXT NOT NULL DEFAULT 'monthly',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pending_payments_user_id ON pending_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_invoice_id ON pending_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_pending_payments_status ON pending_payments(status);

-- Enable RLS
ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own pending payments"
  ON pending_payments FOR SELECT
  USING (auth.uid() = user_id);

-- Clean up old pending payments (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_pending_payments()
RETURNS void AS $$
BEGIN
  DELETE FROM pending_payments
  WHERE status = 'pending'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;












