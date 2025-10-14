import type { IModule } from "@/api/supabase.ts";

export const queryKeys = {
  modules: {
    all: ["modules"],
    one: (id: IModule["id"] | null | undefined) => [
      ...queryKeys.modules.all,
      "one",
      id,
    ],
    many: (project_id: IModule["project_id"] | null | undefined) => [
      ...queryKeys.modules.all,
      "many",
      project_id,
    ],
  },
};
