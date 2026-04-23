import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQuizProgress, saveQuizProgress as saveProgressDb, getUserStats } from "@/lib/supabase/progress";
import { getBookmarks, toggleBookmark as toggleBookmarkDb, isBookmarked as checkBookmarkedDb } from "@/lib/supabase/bookmarks";
import { getQuizProgress as getLocalProgress, saveQuizProgress as saveLocalProgress, getBookmarks as getLocalBookmarks, toggleBookmark as toggleLocalBookmark, isBookmarked as checkLocalBookmarked } from "./storage";
import type { QuizProgress } from "@/data/database";

// Hybrid hooks that use Supabase when authenticated, localStorage otherwise

export function useQuizProgressHybrid() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["quizProgress", user?.id || "local"],
    queryFn: async () => {
      if (user) {
        return await getQuizProgress(user.id);
      } else {
        return getLocalProgress();
      }
    },
  });
}

export function useSaveQuizProgressHybrid() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, isCorrect, timeSpentSeconds }: {
      questionId: number;
      isCorrect: boolean;
      timeSpentSeconds?: number;
    }) => {
      if (user) {
        await saveProgressDb(user.id, questionId, isCorrect, timeSpentSeconds);
      } else {
        const progress = getLocalProgress();
        progress.attempts += 1;
        if (isCorrect) progress.correct += 1;
        progress.history.push({
          qId: questionId,
          correct: isCorrect,
          timestamp: new Date().toISOString(),
        });
        saveLocalProgress(progress);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizProgress", user?.id || "local"] });
    },
  });
}

export function useBookmarksHybrid() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["bookmarks", user?.id || "local"],
    queryFn: async () => {
      if (user) {
        return await getBookmarks(user.id);
      } else {
        return getLocalBookmarks();
      }
    },
  });
}

export function useToggleBookmarkHybrid() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: number) => {
      if (user) {
        return await toggleBookmarkDb(user.id, questionId);
      } else {
        toggleLocalBookmark(questionId);
        return !checkLocalBookmarked(questionId);
      }
    },
    onSuccess: (_, questionId) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id || "local"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark", user?.id || "local", questionId] });
    },
  });
}

export function useIsBookmarkedHybrid(questionId: number) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["bookmark", user?.id || "local", questionId],
    queryFn: async () => {
      if (user) {
        return await checkBookmarkedDb(user.id, questionId);
      } else {
        return checkLocalBookmarked(questionId);
      }
    },
  });
}






