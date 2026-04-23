import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getBookmarks, toggleBookmark as toggleBookmarkApi, isBookmarked as checkBookmarked } from "@/lib/supabase/bookmarks";

export function useBookmarks() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["bookmarks", user?.id],
    queryFn: () => getBookmarks(user!.id),
    enabled: !!user,
  });
}

export function useIsBookmarked(questionId: number) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["bookmark", user?.id, questionId],
    queryFn: () => checkBookmarked(user!.id, questionId),
    enabled: !!user && !!questionId,
  });
}

export function useToggleBookmark() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: number) => {
      if (!user) throw new Error("User not authenticated");
      return toggleBookmarkApi(user.id, questionId);
    },
    onSuccess: (_, questionId) => {
      // Invalidate bookmarks list and specific bookmark status
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["bookmark", user?.id, questionId] });
    },
  });
}






