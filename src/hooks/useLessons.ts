import { useQuery } from "@tanstack/react-query";
import { getAllLessons, getLessonsByCategory, getLessonById } from "@/lib/supabase/lessons";
import type { Lesson } from "@/data/database";

export function useLessons() {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: getAllLessons,
  });
}

export function useLessonsByCategory(category: Lesson["category"]) {
  return useQuery({
    queryKey: ["lessons", "category", category],
    queryFn: () => getLessonsByCategory(category),
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ["lessons", id],
    queryFn: () => getLessonById(id),
    enabled: !!id,
  });
}






