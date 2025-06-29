import type { Database } from "./supabase.types";

export type ITask = Database["public"]["Tables"]["tasks"]["Row"];
export type ITaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type ITaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export type IProject = Database["public"]["Tables"]["projects"]["Row"];
export type IProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type IProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type IModule = Database["public"]["Tables"]["modules"]["Row"];
export type IModuleInsert = Database["public"]["Tables"]["modules"]["Insert"];
export type IModuleUpdate = Database["public"]["Tables"]["modules"]["Update"];
