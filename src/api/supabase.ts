import type { ITables } from "@/api/supabase.interface.ts";
import type { Database } from "@/api/supabase.types";
import { createClient } from "@supabase/supabase-js";
import { createMutation, createQuery } from "react-query-kit";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

interface IFilters {
  id?: number | null;
  custom_id?: string | null;
  project_id?: number | null;
  module_id?: number | null;
  empty_module_id?: boolean;
  user_id?: string | null;

  completed?: boolean | null;
}

interface ISortings {
  sortByCreatedAt?: "asc" | "desc" | string | null;
  sortByUpdatedAt?: "asc" | "desc" | string | null;
}

interface IUseSupabaseQuery {
  name: string;
  table: keyof ITables;
  count?: "all" | "first";
}

interface IUseSupabaseInsert {
  name: string;
  table: keyof ITables;
}

interface IUseSupabaseUpdate {
  name: string;
  table: keyof ITables;
}

// Хук useSupabaseQuery
export const createSupabaseQuery = <TResult>({
  name,
  table,
  count = "all",
}: IUseSupabaseQuery) => {
  return createQuery<TResult, Partial<IFilters & ISortings>>({
    queryKey: ["get", name, "from", table],

    fetcher: async ({
      id,
      completed,
      custom_id,
      module_id,
      project_id,
      empty_module_id = false,
      sortByCreatedAt,
      sortByUpdatedAt,
    }) => {
      let query = supabase.from(table).select("*");

      // FILTERS
      // This is look like a suck because i suck in typescript
      // TODO: REFACTORING |  не удивляйся что тебя не берут на работу
      if (id) {
        query = query.eq("id", id);
      }
      if (completed) {
        query = query.eq("completed", completed);
      }
      if (custom_id) {
        query = query.eq("custom_id", custom_id);
      }
      if (module_id) {
        query = query.eq("module_id", module_id);
      }
      if (project_id) {
        query = query.eq("project_id", project_id);
      }

      if (empty_module_id) {
        query = query.is("module_id", null);
      }

      // SORTINGS
      if (sortByCreatedAt) {
        query = query.order("created_at", {
          ascending: sortByCreatedAt === "asc",
        });
      }

      if (sortByUpdatedAt) {
        query = query.order("updated_at", {
          ascending: sortByUpdatedAt === "asc",
        });
      }

      const { data } = await query;

      console.log(table, data);

      if (count == "first") {
        return data?.[0] as TResult;
      }
      return data as TResult;
    },
  });
};

export const createSupabaseInsert = <TVariables>({
  name,
  table,
}: IUseSupabaseInsert) => {
  return createMutation<null, Partial<TVariables>>({
    mutationKey: ["create", name, "to", table],
    mutationFn: async (newData) => {
      // @ts-ignore
      const result = await supabase.from(table).insert(newData);
      // if (result.error) throw result.error;
      return result.data;
    },
    onError: (error) => {
      console.log("insert error ", { error });
    },
  });
};

export const createSupabaseUpdate = <TVariables>({
  name,
  table,
}: IUseSupabaseUpdate) => {
  return createMutation<null, { id: number; data: TVariables }>({
    mutationKey: ["create", name, "to", table],
    mutationFn: async ({ id, data }) => {
      // @ts-ignore
      await supabase.from(table).update(data).eq("id", id);
      return null;
    },
  });
};

export const createSupabaseDelete = ({ name, table }: IUseSupabaseInsert) => {
  return createMutation<null, { id: number }>({
    mutationKey: ["delete", name, "from", table],
    mutationFn: async ({ id }) => {
      await supabase.from(table).delete().eq("id", id);
      return null;
    },
  });
};

// Изаначально, задумка было в том: что бы при различном table была соответствующая типизация в select и filters на основе полей Database["public"]["Tables"]["название таблицы"]["Row"];

// const { data: projects } = useSupabaseQuery({
//   name: "projects",
//   table: "projects",
//   select: ["title", "color"],
//   filters: { custom_id: "proj1" },
// });

// if (project_id !== undefined) {
//   query = query.eq("project_id", )
// }
// if (completed !== undefined) {
//   query = query.eq("completed", completed);
// }

// }

// // Выполнение запроса
// const { data, error } = await query;

// if (error) {
//   throw new Error(error.message);
// }

// return data as TReturnData;
// }
