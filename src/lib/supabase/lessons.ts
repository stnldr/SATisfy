import { supabase } from "@/integrations/supabase/client";
import type { Lesson } from "@/data/database";

export async function getAllLessons(): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }

  return data.map((l) => ({
    id: l.id,
    title: l.title,
    body: l.body,
    category: l.category as Lesson["category"],
  }));
}

export async function getLessonsByCategory(category: Lesson["category"]): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("category", category)
    .order("id");

  if (error) {
    console.error("Error fetching lessons by category:", error);
    throw error;
  }

  return data.map((l) => ({
    id: l.id,
    title: l.title,
    body: l.body,
    category: l.category as Lesson["category"],
  }));
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Error fetching lesson:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    body: data.body,
    category: data.category as Lesson["category"],
  };
}






