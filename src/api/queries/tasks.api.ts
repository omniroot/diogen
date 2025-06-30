import { client } from "@/api/query.client.ts";
import { createSupabaseQuery, supabase } from "@/api/supabase";
import type { ITask, ITaskInsert } from "@/api/supabase.interface";
import { createMutation } from "react-query-kit";

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
  mutationFn: async (newTask) => {
    const { data } = await supabase.from("tasks").insert(newTask);
    return data;
  },
  onSuccess: () => {
    client.refetchQueries({ queryKey: useGetTasks.getKey() });
  },
});
