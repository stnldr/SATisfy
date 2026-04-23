import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllQuestions, getQuestionsBySection, getQuestionsByDifficulty, getQuestionById, getUserQuestions, createUserQuestion, updateUserQuestion, deleteUserQuestion, getAllQuestionsWithUser } from "@/lib/supabase/questions";
import { useAuth } from "@/contexts/AuthContext";
import type { Question } from "@/data/database";

export function useQuestions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["questions", user?.id],
    queryFn: () => getAllQuestionsWithUser(user?.id),
  });
}

export function useQuestionsBySection(section: Question["section"]) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["questions", "section", section, user?.id],
    queryFn: () => getQuestionsBySection(section, user?.id),
  });
}

export function useQuestionsByDifficulty(difficulty: Question["difficulty"]) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["questions", "difficulty", difficulty, user?.id],
    queryFn: () => getQuestionsByDifficulty(difficulty, user?.id),
  });
}

export function useQuestion(id: number) {
  return useQuery({
    queryKey: ["questions", id],
    queryFn: () => getQuestionById(id),
    enabled: !!id,
  });
}

export function useUserQuestions() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["userQuestions", user?.id],
    queryFn: () => user ? getUserQuestions(user.id) : Promise.resolve([]),
    enabled: !!user,
  });
}

export function useCreateUserQuestion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: Omit<Question, "id">) => {
      if (!user) throw new Error("User must be authenticated");
      return createUserQuestion(user.id, question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userQuestions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["questions", user?.id] });
    },
  });
}

export function useUpdateUserQuestion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, question }: { questionId: number; question: Partial<Omit<Question, "id">> }) => {
      if (!user) throw new Error("User must be authenticated");
      return updateUserQuestion(user.id, questionId, question);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userQuestions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["questions", user?.id] });
    },
  });
}

export function useDeleteUserQuestion() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: number) => {
      if (!user) throw new Error("User must be authenticated");
      return deleteUserQuestion(user.id, questionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userQuestions", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["questions", user?.id] });
    },
  });
}






