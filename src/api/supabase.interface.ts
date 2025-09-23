import type { Tables, TablesInsert, TablesUpdate } from "./supabase.types";

export type IIssue = Tables<"issues">;
export type IIssueInsert = TablesInsert<"issues">;
export type IIssueUpdate = TablesUpdate<"issues">;

export type IProject = Tables<"projects">;
export type IProjectInsert = TablesInsert<"projects">;
export type IProjectUpdate = TablesUpdate<"projects">;

export type IModule = Tables<"modules">;
export type IModuleInsert = TablesInsert<"modules">;
export type IModuleUpdate = TablesUpdate<"modules">;
