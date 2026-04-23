import { supabase } from "@/integrations/supabase/client";
import type { Question } from "@/data/database";

export async function getAllQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }

  return data.map((q) => ({
    id: q.id,
    section: q.section as Question["section"],
    difficulty: q.difficulty as Question["difficulty"],
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
  }));
}

export async function getQuestionsBySection(section: Question["section"], userId?: string): Promise<Question[]> {
  const [defaultData, userData] = await Promise.all([
    supabase
      .from("questions")
      .select("*")
      .eq("section", section)
      .order("id"),
    userId
      ? supabase
          .from("user_questions")
          .select("*")
          .eq("user_id", userId)
          .eq("section", section)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (defaultData.error) {
    console.error("Error fetching questions by section:", defaultData.error);
    throw defaultData.error;
  }

  const questions = defaultData.data.map((q) => ({
    id: q.id,
    section: q.section as Question["section"],
    difficulty: q.difficulty as Question["difficulty"],
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
  }));

  if (userData.data) {
    userData.data.forEach((q) => {
      questions.push({
        id: -q.id, // Negative ID for user questions
        section: q.section as Question["section"],
        difficulty: q.difficulty as Question["difficulty"],
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
      });
    });
  }

  return questions;
}

export async function getQuestionsByDifficulty(difficulty: Question["difficulty"], userId?: string): Promise<Question[]> {
  const [defaultData, userData] = await Promise.all([
    supabase
      .from("questions")
      .select("*")
      .eq("difficulty", difficulty)
      .order("id"),
    userId
      ? supabase
          .from("user_questions")
          .select("*")
          .eq("user_id", userId)
          .eq("difficulty", difficulty)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (defaultData.error) {
    console.error("Error fetching questions by difficulty:", defaultData.error);
    throw defaultData.error;
  }

  const questions = defaultData.data.map((q) => ({
    id: q.id,
    section: q.section as Question["section"],
    difficulty: q.difficulty as Question["difficulty"],
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
  }));

  if (userData.data) {
    userData.data.forEach((q) => {
      questions.push({
        id: -q.id, // Negative ID for user questions
        section: q.section as Question["section"],
        difficulty: q.difficulty as Question["difficulty"],
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
      });
    });
  }

  return questions;
}

export async function getQuestionById(id: number): Promise<Question | null> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // No rows returned
    console.error("Error fetching question:", error);
    throw error;
  }

  return {
    id: data.id,
    section: data.section as Question["section"],
    difficulty: data.difficulty as Question["difficulty"],
    question: data.question,
    options: data.options,
    answer: data.answer,
    explanation: data.explanation,
  };
}

// User-created questions functions
export async function getUserQuestions(userId: string): Promise<Question[]> {
  const { data, error } = await supabase
    .from("user_questions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user questions:", error);
    throw error;
  }

  // Return negative IDs to avoid conflicts with default questions
  return data.map((q) => ({
    id: -q.id,
    section: q.section as Question["section"],
    difficulty: q.difficulty as Question["difficulty"],
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation,
  }));
}

export async function createUserQuestion(
  userId: string,
  question: Omit<Question, "id">
): Promise<Question> {
  const { data, error } = await supabase
    .from("user_questions")
    .insert({
      user_id: userId,
      section: question.section,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating question:", error);
    throw error;
  }

  return {
    id: data.id,
    section: data.section as Question["section"],
    difficulty: data.difficulty as Question["difficulty"],
    question: data.question,
    options: data.options,
    answer: data.answer,
    explanation: data.explanation,
  };
}

export async function updateUserQuestion(
  userId: string,
  questionId: number,
  question: Partial<Omit<Question, "id">>
): Promise<Question> {
  const { data, error } = await supabase
    .from("user_questions")
    .update({
      section: question.section,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
    })
    .eq("id", questionId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating question:", error);
    throw error;
  }

  return {
    id: data.id,
    section: data.section as Question["section"],
    difficulty: data.difficulty as Question["difficulty"],
    question: data.question,
    options: data.options,
    answer: data.answer,
    explanation: data.explanation,
  };
}

export async function deleteUserQuestion(
  userId: string,
  questionId: number
): Promise<void> {
  const { error } = await supabase
    .from("user_questions")
    .delete()
    .eq("id", questionId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
}

// Get all questions (both default and user-created)
export async function getAllQuestionsWithUser(userId?: string): Promise<Question[]> {
  const [defaultQuestions, userQuestions] = await Promise.all([
    getAllQuestions(),
    userId ? getUserQuestions(userId).catch(() => []) : Promise.resolve([]),
  ]);

  // Combine and ensure unique IDs
  const allQuestions = [...defaultQuestions];
  userQuestions.forEach((q) => {
    // Use negative IDs for user questions to avoid conflicts
    allQuestions.push({ ...q, id: -q.id });
  });

  return allQuestions;
}

// Admin functions for managing questions in the main questions table
export async function createQuestion(question: Omit<Question, "id">): Promise<Question> {
  const { data, error } = await supabase
    .from("questions")
    .insert({
      section: question.section,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating question:", error);
    throw error;
  }

  return {
    id: data.id,
    section: data.section as Question["section"],
    difficulty: data.difficulty as Question["difficulty"],
    question: data.question,
    options: data.options,
    answer: data.answer,
    explanation: data.explanation,
  };
}

export async function updateQuestion(
  questionId: number,
  question: Partial<Omit<Question, "id">>
): Promise<Question> {
  const { data, error } = await supabase
    .from("questions")
    .update({
      section: question.section,
      difficulty: question.difficulty,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation,
    })
    .eq("id", questionId)
    .select()
    .single();

  if (error) {
    console.error("Error updating question:", error);
    throw error;
  }

  return {
    id: data.id,
    section: data.section as Question["section"],
    difficulty: data.difficulty as Question["difficulty"],
    question: data.question,
    options: data.options,
    answer: data.answer,
    explanation: data.explanation,
  };
}

export async function deleteQuestion(questionId: number): Promise<void> {
  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  if (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
}






