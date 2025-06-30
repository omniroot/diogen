import type { ITables } from "@/api/supabase.interface.ts";
import type { Database } from "@/api/supabase.types";
import { createClient } from "@supabase/supabase-js";
import { createQuery } from "react-query-kit";

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

  completed?: boolean | null;
}

interface ISortings {
  sortByCreatedAt?: "asc" | "desc" | null;
  sortByUpdatedAt?: "asc" | "desc" | null;
}

interface IUseSupabaseQuery {
  name: string;
  table: keyof ITables;
  count?: "all" | "first";
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
      sortByCreatedAt,
      sortByUpdatedAt,
    }) => {
      let query = supabase.from(table).select("*");

      console.log({
        id,
        completed,
        custom_id,
        module_id,
        project_id,
        sortByCreatedAt,
        sortByUpdatedAt,
      });

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
