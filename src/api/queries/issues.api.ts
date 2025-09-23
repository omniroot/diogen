import { client } from "@/api/query.client.ts";
import { supabase } from "@/api/supabase";
import { IIssue } from "@/api/supabase.interface.ts";
import { queryOptions } from "@tanstack/react-query";
import { createQuery } from "react-query-kit";

export const useGetTasksCount = createQuery({
  queryKey: ["get-tasks-count"],
  fetcher: async () => {
    const query = supabase.from("issues").select("id");
    const { data } = await query;
    return data?.length;
  },
});

interface IGetIssuesOptions extends IIssue {
  count: "one" | "many";
}

type IssuesResult<C extends "one" | "many"> = C extends "one"
  ? IIssue
  : IIssue[];

export function getIssuesOptions<
  C extends IGetIssuesOptions["count"] = "many",
>({
  count = "many" as C,
  ...opts
}: Partial<IGetIssuesOptions> & { count?: C } = {}) {
  const key = ["get", count === "one" ? "issue" : "issues", opts];
  return queryOptions<IssuesResult<C>>({
    queryKey: key,
    queryFn: async () => {
      let query = supabase.from("issues").select("*");

      Object.entries(opts).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });
      // if (id) query = query.eq("id", id);
      // if (title) query = query.eq("title", title);
      // if (project_id) query = query.eq("project_id", project_id);

      let response;
      if (count === "one") {
        response = await query.limit(1).single();
      } else {
        response = await query;
      }

      if (response.error) throw response.error;
      return response.data as IssuesResult<C>;
    },
    initialData: () => {
      return client.getQueryData(key);
    },
    placeholderData: () => {
      return client.getQueryData(key);
    },
  });
}

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
