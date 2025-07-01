import {
  createSupabaseDelete,
  createSupabaseQuery,
  createSupabaseUpdate,
} from "@/api/supabase";
import type { IProject, IProjectUpdate } from "@/api/supabase.interface";

export const useGetProjects = createSupabaseQuery<IProject[]>({
  name: "projects",
  table: "projects",
});

export const useGetProject = createSupabaseQuery<IProject>({
  name: "project",
  table: "projects",
  count: "first",
});

export const useDeleteProject = createSupabaseDelete({
  name: "project",
  table: "projects",
});

export const useUpdateProject = createSupabaseUpdate<IProjectUpdate>({
  name: "project",
  table: "projects",
});
