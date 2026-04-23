import { useQuery } from "@tanstack/react-query";
import { getAllFlashcards, getFlashcardsByCategory } from "@/lib/supabase/flashcards";
import type { Flashcard } from "@/data/database";

export function useFlashcards() {
  return useQuery({
    queryKey: ["flashcards"],
    queryFn: getAllFlashcards,
  });
}

export function useFlashcardsByCategory(category: Flashcard["category"]) {
  return useQuery({
    queryKey: ["flashcards", "category", category],
    queryFn: () => getFlashcardsByCategory(category),
  });
}






