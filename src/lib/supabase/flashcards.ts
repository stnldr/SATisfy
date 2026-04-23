import { supabase } from "@/integrations/supabase/client";
import type { Flashcard } from "@/data/database";

export async function getAllFlashcards(): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching flashcards:", error);
    throw error;
  }

  return data.map((f) => ({
    id: f.id,
    term: f.term,
    definition: f.definition,
    category: f.category as Flashcard["category"],
  }));
}

export async function getFlashcardsByCategory(category: Flashcard["category"]): Promise<Flashcard[]> {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("category", category)
    .order("id");

  if (error) {
    console.error("Error fetching flashcards by category:", error);
    throw error;
  }

  return data.map((f) => ({
    id: f.id,
    term: f.term,
    definition: f.definition,
    category: f.category as Flashcard["category"],
  }));
}






