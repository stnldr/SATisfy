-- Function to update user_stats when progress is inserted
CREATE OR REPLACE FUNCTION update_user_stats_on_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, total_attempts, total_correct)
  VALUES (NEW.user_id, 1, CASE WHEN NEW.is_correct THEN 1 ELSE 0 END)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_attempts = user_stats.total_attempts + 1,
    total_correct = user_stats.total_correct + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
    reading_attempts = user_stats.reading_attempts + CASE WHEN (SELECT section FROM questions WHERE id = NEW.question_id) = 'Reading' THEN 1 ELSE 0 END,
    reading_correct = user_stats.reading_correct + CASE WHEN NEW.is_correct AND (SELECT section FROM questions WHERE id = NEW.question_id) = 'Reading' THEN 1 ELSE 0 END,
    math_attempts = user_stats.math_attempts + CASE WHEN (SELECT section FROM questions WHERE id = NEW.question_id) = 'Math' THEN 1 ELSE 0 END,
    math_correct = user_stats.math_correct + CASE WHEN NEW.is_correct AND (SELECT section FROM questions WHERE id = NEW.question_id) = 'Math' THEN 1 ELSE 0 END,
    grammar_attempts = user_stats.grammar_attempts + CASE WHEN (SELECT section FROM questions WHERE id = NEW.question_id) = 'Grammar' THEN 1 ELSE 0 END,
    grammar_correct = user_stats.grammar_correct + CASE WHEN NEW.is_correct AND (SELECT section FROM questions WHERE id = NEW.question_id) = 'Grammar' THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_on_progress();


