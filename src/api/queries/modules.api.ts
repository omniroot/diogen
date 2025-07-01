import { createSupabaseMutation, createSupabaseQuery } from "@/api/supabase";
import type { IModule, IModuleInsert } from "@/api/supabase.interface";

export const useGetModules = createSupabaseQuery<IModule[]>({
  name: "modules",
  table: "modules",
});

export const useGetModule = createSupabaseQuery<IModule>({
  name: "module",
  table: "modules",
  count: "first",
});

export const useCreateModule = createSupabaseMutation<IModuleInsert>({
  name: "module",
  table: "modules",
});
