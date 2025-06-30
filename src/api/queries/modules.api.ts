import { createSupabaseQuery } from "@/api/supabase";
import type { IModule } from "@/api/supabase.interface";

export const useGetModules = createSupabaseQuery<IModule[]>({
  name: "modules",
  table: "modules",
});

export const useGetModule = createSupabaseQuery<IModule>({
  name: "module",
  table: "modules",
  count: "first",
});
