import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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

export type IDiogenTables = DiogenDatabase["public"]["Tables"];
export type IKaizenTables = KaizenDatabase["public"]["Tables"];

export type { DiogenDatabase, KaizenDatabase };

export type DiogenClient = SupabaseClient<DiogenDatabase>;
export type KaizenClient = SupabaseClient<KaizenDatabase>;

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

export type IDaysRecords = KaizenTables<"days_records">;
export type IDaysRecordsInsert = KaizenTablesInsert<"days_records">;
export type IDaysRecordsUpdate = KaizenTablesUpdate<"days_records">;

export type IHabitsRecords = KaizenTables<"habits_records">;
export type IHabitsRecordsInsert = KaizenTablesInsert<"habits_records">;
export type IHabitsRecordsUpdate = KaizenTablesUpdate<"habits_records">;

export type IPosts = KaizenTables<"posts">;
export type IPostsInsert = KaizenTablesInsert<"posts">;
export type IPostsUpdate = KaizenTablesUpdate<"posts">;

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

export const diogen: DiogenClient = createClient<DiogenDatabase>(
	diogenSupabaseUrl,
	diogenSupabaseAnonKey,
);

export const kaizen: KaizenClient = createClient<KaizenDatabase>(
	kaizenSupabaseUrl,
	kaizenSupabaseAnonKey,
);
