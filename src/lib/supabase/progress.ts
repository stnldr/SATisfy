import { supabase } from "@/integrations/supabase/client";
import type { QuizProgress } from "@/data/database";

export interface UserStats {
  total_attempts: number;
  total_correct: number;
  reading_attempts: number;
  reading_correct: number;
  math_attempts: number;
  math_correct: number;
  grammar_attempts: number;
  grammar_correct: number;
}

export interface ProgressHistoryItem {
  qId: number;
  correct: boolean;
  timestamp: string;
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No stats found, create initial stats
      const { data: newData, error: insertError } = await supabase
        .from("user_stats")
        .insert({ user_id: userId })
        .select()
        .single();
      
      if (insertError) {
        console.error("Error creating user stats:", insertError);
        throw insertError;
      }
      
      return {
        total_attempts: newData.total_attempts,
        total_correct: newData.total_correct,
        reading_attempts: newData.reading_attempts,
        reading_correct: newData.reading_correct,
        math_attempts: newData.math_attempts,
        math_correct: newData.math_correct,
        grammar_attempts: newData.grammar_attempts,
        grammar_correct: newData.grammar_correct,
      };
    }
    console.error("Error fetching user stats:", error);
    throw error;
  }

  return {
    total_attempts: data.total_attempts,
    total_correct: data.total_correct,
    reading_attempts: data.reading_attempts,
    reading_correct: data.reading_correct,
    math_attempts: data.math_attempts,
    math_correct: data.math_correct,
    grammar_attempts: data.grammar_attempts,
    grammar_correct: data.grammar_correct,
  };
}

export async function saveQuizProgress(
  userId: string,
  questionId: number,
  isCorrect: boolean,
  timeSpentSeconds?: number
): Promise<void> {
  const { error } = await supabase
    .from("user_progress")
    .insert({
      user_id: userId,
      question_id: questionId,
      is_correct: isCorrect,
      time_spent_seconds: timeSpentSeconds,
    });

  if (error) {
    console.error("Error saving quiz progress:", error);
    throw error;
  }
  // Stats are automatically updated by trigger
}

export async function getQuizProgress(userId: string): Promise<QuizProgress> {
  const stats = await getUserStats(userId);
  
  if (!stats) {
    return { attempts: 0, correct: 0, history: [] };
  }

  // Fetch recent history
  const { data, error } = await supabase
    .from("user_progress")
    .select("question_id, is_correct, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100); // Get last 100 attempts

  if (error) {
    console.error("Error fetching progress history:", error);
    // Return stats even if history fails
    return {
      attempts: stats.total_attempts,
      correct: stats.total_correct,
      history: [],
    };
  }

  const history: ProgressHistoryItem[] = data.map((item) => ({
    qId: item.question_id,
    correct: item.is_correct,
    timestamp: item.created_at,
  }));

  return {
    attempts: stats.total_attempts,
    correct: stats.total_correct,
    history,
  };
}






