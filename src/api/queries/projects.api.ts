import { createSupabaseQuery } from "@/api/supabase";
import type { IProject } from "@/api/supabase.interface";

export const useGetProjects = createSupabaseQuery<IProject[]>({
  name: "projects",
  table: "projects",
});

export const useGetProject = createSupabaseQuery<IProject>({
  name: "project",
  table: "projects",
  count: "first",
});
