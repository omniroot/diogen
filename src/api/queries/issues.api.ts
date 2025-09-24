import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";
import { client } from "@/api/query.client.ts";
import { supabase } from "@/api/supabase";
import type { IIssue, IIssueUpdate } from "@/api/supabase.interface.ts";

export const useGetTasksCount = createQuery({
  queryKey: ["get-tasks-count"],
  fetcher: async () => {
    const query = supabase.from("issues").select("id");
    const { data } = await query;
    return data?.length;
  },
});

interface IGetIssuesOptions {
  id?: IIssue["id"];
  title?: IIssue["title"];
  project_id?: IIssue["project_id"];

  limit?: number;
  orderByDate?: boolean;
}

export const getIssuesOptions = ({
  limit,
  orderByDate = false,
  ...opts
}: IGetIssuesOptions = {}) => {
  const key = ["get", "issues", opts];
  return queryOptions({
    queryKey: key,
    queryFn: async () => {
      let query = supabase.from("issues").select("*");

      Object.entries(opts).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });

      if (limit) query = query.limit(limit);
      if (orderByDate) query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    initialData: () => {
      return client.getQueryData(key);
    },
    placeholderData: () => {
      return client.getQueryData(key);
    },
  });
};

export const getIssueOptions = ({
  limit = 1,
  ...opts
}: IGetIssuesOptions = {}) =>
  queryOptions({
    ...getIssuesOptions({ limit, ...opts }),
    queryKey: ["get", "issue", opts],
    select: (data) => data[0],
  });

export const updateIssueOptions = () =>
  mutationOptions<IIssue, unknown, IIssueUpdate>({
    mutationFn: async (issue) => {
      const query = supabase
        .from("issues")
        .update(issue)
        .eq("id", Number(issue.id))
        .select();
      const { data, error } = await query.single();
      if (error) throw error;
      return data;
    },
    // onMutate: async (newIssue, context) => {
    //   await context.client.cancelQueries({ queryKey: ["get", "issues"] });

    //   // Snapshot the previous value
    //   const previousTodos = context.client.getQueryData(["get", "issues"]);

    //   // Optimistically update to the new value
    //   if (previousTodos) {
    //     // если это список
    //     if (Array.isArray(previousTodos)) {
    //       client.setQueryData(
    //         ["get", "issues"],
    //         (old: IIssue[] | undefined) => {
    //           if (!old) return old;
    //           return old.map((i) =>
    //             i.id === newIssue.id ? { ...i, ...newIssue } : i
    //           );
    //         }
    //       );
    //     } else {
    //       // single
    //       client.setQueryData(["get", "issues"], (old: IIssue | undefined) => {
    //         if (!old) return old;
    //         return { ...old, ...newIssue };
    //       });
    //     }
    //   }

    //   // Return a result with the snapshotted value
    //   return { previousTodos };
    // },
    // onError: (err, updatedIssue, context: any) => {
    //   // откат к snapshot
    //   if (context?.previous) {
    //     client.setQueryData(["get", "issues"], context.previous);
    //   }
    // },
    // onSettled: () => {
    //   // обновляем/инвалидируем, чтобы синхронизироваться с сервером
    //   client.invalidateQueries({ queryKey: ["get", "issues"] });
    // },
  });
// export const useGetTasks = createSupabaseQuery<IIssue[]>({
//   name: "tasks",
//   table: "tasks",
// });

// export const useGetTask = createSupabaseQuery<IIssue>({
//   name: "task",
//   table: "tasks",
//   count: "first",
// });

// export const useCreateTask = createMutation<null, IIssueInsert>({
//   mutationKey: ["create-task"],
//   mutationFn: async (newData) => {
//     const { data, error } = await supabase.from("tasks").insert(newData);
//     if (error) throw error;
//     return data;
//   },
// });

// export const useUpdateTask = createSupabaseUpdate<IIssueUpdate>({
//   name: "task",
//   table: "tasks",
// });

// export const useDeleteTask = createSupabaseDelete({
//   name: "task",
//   table: "tasks",
// });
