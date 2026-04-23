import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllQuestions, createQuestion, updateQuestion, deleteQuestion } from "@/lib/supabase/questions";
import type { Question } from "@/data/database";

export function useAdminQuestions() {
  return useQuery({
    queryKey: ["adminQuestions"],
    queryFn: getAllQuestions,
  });
}

export function useCreateAdminQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: Omit<Question, "id">) => createQuestion(question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useUpdateAdminQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, question }: { questionId: number; question: Partial<Omit<Question, "id">> }) =>
      updateQuestion(questionId, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}

export function useDeleteAdminQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: number) => deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
}





