import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getAllTasks() {
  const { data, error } = await supabase.from("tasks").select("*");
  if (error) throw error;
  return data;
}

export async function createTask(task: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  category_id?: string;
}) {
  const { data, error } = await supabase.from("tasks").insert([task]).select();
  if (error) throw error;
  return data?.[0];
}

export async function updateTask(
  id: string,
  updates: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
    category_id?: string;
  }
) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
  return true;
}
