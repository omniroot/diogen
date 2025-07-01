import { createSupabaseMutation, createSupabaseQuery } from "@/api/supabase";
import type { ITask, ITaskInsert } from "@/api/supabase.interface";

export const useGetTasks = createSupabaseQuery<ITask[]>({
  name: "tasks",
  table: "tasks",
});

export const useGetTask = createSupabaseQuery<ITask>({
  name: "task",
  table: "tasks",
  count: "first",
});

export const useCreateTask = createSupabaseMutation<ITaskInsert>({
  name: "task",
  table: "tasks",
});
