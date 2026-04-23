import { supabase } from "@/integrations/supabase/client";

export async function getBookmarks(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from("user_bookmarks")
    .select("question_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching bookmarks:", error);
    throw error;
  }

  return data.map((item) => item.question_id);
}

export async function toggleBookmark(userId: string, questionId: number): Promise<boolean> {
  // Check if bookmark exists
  const { data: existing } = await supabase
    .from("user_bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .single();

  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from("user_bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("question_id", questionId);

    if (error) {
      console.error("Error removing bookmark:", error);
      throw error;
    }
    return false;
  } else {
    // Add bookmark
    const { error } = await supabase
      .from("user_bookmarks")
      .insert({
        user_id: userId,
        question_id: questionId,
      });

    if (error) {
      console.error("Error adding bookmark:", error);
      throw error;
    }
    return true;
  }
}

export async function isBookmarked(userId: string, questionId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return false; // No rows found
    console.error("Error checking bookmark:", error);
    throw error;
  }

  return !!data;
}






