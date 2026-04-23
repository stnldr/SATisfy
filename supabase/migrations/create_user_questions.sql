-- Create user_questions table for custom questions
CREATE TABLE IF NOT EXISTS user_questions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('Reading', 'Math', 'Grammar')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL CHECK (array_length(options, 1) = 4),
  answer INTEGER NOT NULL CHECK (answer >= 0 AND answer < 4),
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_questions_user_id ON user_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_questions_section ON user_questions(section);
CREATE INDEX IF NOT EXISTS idx_user_questions_difficulty ON user_questions(difficulty);

-- Enable RLS (Row Level Security)
ALTER TABLE user_questions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own questions
CREATE POLICY "Users can view their own questions"
  ON user_questions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own questions
CREATE POLICY "Users can insert their own questions"
  ON user_questions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own questions
CREATE POLICY "Users can update their own questions"
  ON user_questions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own questions
CREATE POLICY "Users can delete their own questions"
  ON user_questions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_questions_updated_at
  BEFORE UPDATE ON user_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();





