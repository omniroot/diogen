import { createClient } from "@supabase/supabase-js";
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/api/supabase.types";

export type IIssue = Tables<"issues">;
export type IIssueInsert = TablesInsert<"issues">;
export type IIssueUpdate = TablesUpdate<"issues">;

export type IProject = Tables<"projects">;
export type IProjectInsert = TablesInsert<"projects">;
export type IProjectUpdate = TablesUpdate<"projects">;

export type IModule = Tables<"modules">;
export type IModuleInsert = TablesInsert<"modules">;
export type IModuleUpdate = TablesUpdate<"modules">;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
