import {
  createSupabaseDelete,
  createSupabaseInsert,
  createSupabaseQuery,
  createSupabaseUpdate,
} from "@/api/supabase";
import type {
  IModule,
  IModuleInsert,
  IModuleUpdate,
} from "@/api/supabase.interface";

export const useGetModules = createSupabaseQuery<IModule[]>({
  name: "modules",
  table: "modules",
});

export const useGetModule = createSupabaseQuery<IModule>({
  name: "module",
  table: "modules",
  count: "first",
});

export const useCreateModule = createSupabaseInsert<IModuleInsert>({
  name: "module",
  table: "modules",
});

export const useDeleteModule = createSupabaseDelete({
  name: "module",
  table: "modules",
});

export const useUpdateModule = createSupabaseUpdate<IModuleUpdate>({
  name: "module",
  table: "modules",
});
