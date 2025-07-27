import {
  createSupabaseDelete,
  createSupabaseQuery,
  createSupabaseUpdate,
  supabase,
} from "@/api/supabase";
import type { ITask, ITaskInsert, ITaskUpdate } from "@/api/supabase.interface";
import { createMutation, createQuery } from "react-query-kit";

export const useGetTasksCount = createQuery({
  queryKey: ["get-tasks-count"],
  fetcher: async () => {
    const query = supabase.from("tasks").select("id");
    const { data } = await query;
    return data?.length;
  },
});

export const useGetTasks = createSupabaseQuery<ITask[]>({
  name: "tasks",
  table: "tasks",
});

export const useGetTask = createSupabaseQuery<ITask>({
  name: "task",
  table: "tasks",
  count: "first",
});

export const useCreateTask = createMutation<null, ITaskInsert>({
  mutationKey: ["create-task"],
  mutationFn: async (newData) => {
    const { data, error } = await supabase.from("tasks").insert(newData);
    if (error) throw error;
    return data;
  },
});

export const useUpdateTask = createSupabaseUpdate<ITaskUpdate>({
  name: "task",
  table: "tasks",
});

export const useDeleteTask = createSupabaseDelete({
  name: "task",
  table: "tasks",
});
