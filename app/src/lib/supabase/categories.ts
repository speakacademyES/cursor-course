import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getAllCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
}

export async function createCategory(category: {
  name: string;
  color?: string;
}) {
  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updateCategory(
  id: string,
  updates: {
    name?: string;
    color?: string;
  }
) {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteCategory(id: string) {
  // First, update any tasks that use this category to set category_id to null
  const { error: taskUpdateError } = await supabase
    .from("tasks")
    .update({ category_id: null })
    .eq("category_id", id);

  if (taskUpdateError) throw taskUpdateError;

  // Then delete the category
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw error;
  return true;
}
