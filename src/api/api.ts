import { ITask } from "@/api/supabase.interface.ts";
import { supabase } from "@/api/supabase.ts";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { queryOptions, useQuery } from "@tanstack/react-query";

interface api {
  tasks: {
    all: () => Promise<PostgrestSingleResponse<ITask[]>>;
    one: {};
    update: {};
    delete: {};
  };
}

export const api: api = {
  tasks: {
    all: async () => {
      let query = supabase.from("tasks").select("*");

      const result = await query;
      return result.data;
    },
    one: {},
    update: {},
    delete: {},
  },
};

export const queryFactory = {
  tasks: {
    all: () =>
      queryOptions({
        queryKey: ["habits", "all"],
        queryFn: api.tasks.all,
        select: (data) => data.data,
      }),
  },
};

// real code
const { data: tasks } = useQuery({
  ...queryFactory.tasks.all(),
  select: (data) => data.data?.[data.data?.length],
});

// mutation: {
//   habits: {
//     all: {
//       update: () => mutationOptions({}),
//     },
//     one: {
//       update: (data: IHabitUpdate) =>
//         mutationOptions<IHabit>({
//           mutationFn: (data) => {},
//         }),
//       delete: () => mutationOptions({}),
//     },
//   },
// },
