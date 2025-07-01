import {
  createSupabaseDelete,
  createSupabaseInsert,
  createSupabaseQuery,
  createSupabaseUpdate,
} from "@/api/supabase";
import type { ITask, ITaskInsert, ITaskUpdate } from "@/api/supabase.interface";

export const useGetTasks = createSupabaseQuery<ITask[]>({
  name: "tasks",
  table: "tasks",
});

export const useGetTask = createSupabaseQuery<ITask>({
  name: "task",
  table: "tasks",
  count: "first",
});

export const useCreateTask = createSupabaseInsert<ITaskInsert>({
  name: "task",
  table: "tasks",
});

export const useUpdateTask = createSupabaseUpdate<ITaskUpdate>({
  name: "task",
  table: "tasks",
});

export const useDeleteTask = createSupabaseDelete({
  name: "task",
  table: "tasks",
});
