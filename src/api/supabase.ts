import { createClient } from "@supabase/supabase-js";
import type {
	Database as DiogenDatabase,
	Tables as DiogenTables,
	TablesInsert as DiogenTablesInsert,
	TablesUpdate as DiogenTablesUpdate,
} from "@/api/diogen.types.ts";
import type {
	Database as KaizenDatabase,
	Tables as KaizenTables,
	TablesInsert as KaizenTablesInsert,
	TablesUpdate as KaizenTablesUpdate,
} from "@/api/kaizen.types.ts";

export type IIssue = DiogenTables<"issues">;
export type IIssueInsert = DiogenTablesInsert<"issues">;
export type IIssueUpdate = DiogenTablesUpdate<"issues">;

export type IProject = DiogenTables<"projects">;
export type IProjectInsert = DiogenTablesInsert<"projects">;
export type IProjectUpdate = DiogenTablesUpdate<"projects">;

export type IModule = DiogenTables<"modules">;
export type IModuleInsert = DiogenTablesInsert<"modules">;
export type IModuleUpdate = DiogenTablesUpdate<"modules">;

export type IHabit = KaizenTables<"habits">;
export type IHabitInsert = KaizenTablesInsert<"habits">;
export type IHabitUpdate = KaizenTablesUpdate<"habits">;

const diogenSupabaseUrl = import.meta.env.VITE_DIOGEN_SUPABASE_URL;
const diogenSupabaseAnonKey = import.meta.env.VITE_DIOGEN_SUPABASE_ANON_KEY;
const kaizenSupabaseUrl = import.meta.env.VITE_KAIZEN_SUPABASE_URL;
const kaizenSupabaseAnonKey = import.meta.env.VITE_KAIZEN_SUPABASE_ANON_KEY;

if (!diogenSupabaseUrl || !diogenSupabaseAnonKey) {
	throw new Error("Supabase URL or Anon Key for Diogen is missing");
}

if (!kaizenSupabaseUrl || !kaizenSupabaseAnonKey) {
	throw new Error("Supabase URL or Anon Key for KAizen is missing");
}

export const diogen = createClient<DiogenDatabase>(
	diogenSupabaseUrl,
	diogenSupabaseAnonKey,
);

export const kaizen = createClient<KaizenDatabase>(
	kaizenSupabaseUrl,
	kaizenSupabaseAnonKey,
);
