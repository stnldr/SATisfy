import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, getQuizProgress, saveQuizProgress as saveProgress } from "@/lib/supabase/progress";

export function useUserStats() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => getUserStats(user!.id),
    enabled: !!user,
  });
}

export function useQuizProgress() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["quizProgress", user?.id],
    queryFn: () => getQuizProgress(user!.id),
    enabled: !!user,
  });
}

export function useSaveQuizProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, isCorrect, timeSpentSeconds }: {
      questionId: number;
      isCorrect: boolean;
      timeSpentSeconds?: number;
    }) => {
      if (!user) throw new Error("User not authenticated");
      return saveProgress(user.id, questionId, isCorrect, timeSpentSeconds);
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ["userStats", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["quizProgress", user?.id] });
    },
  });
}






