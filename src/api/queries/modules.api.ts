import { queryOptions } from "@tanstack/react-query";
import { client } from "@/api/query.client.ts";
import type { IModule } from "@/api/supabase.interface.ts";
import { supabase } from "@/api/supabase.ts";

interface IGetModulesOptions {
  id?: IModule["id"];
  project_id?: IModule["project_id"];
}

export const getModulesOptions = (opts: IGetModulesOptions) => {
  const key = ["get", "modules", opts];
  return queryOptions({
    queryKey: key,
    queryFn: async () => {
      let query = supabase.from("modules").select();

      Object.entries(opts).forEach(([key, value]) => {
        if (value) query = query.eq(key, value);
      });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    initialData: () => {
      return client.getQueryData(key);
    },
    placeholderData: () => {
      return client.getQueryData(key);
    },
  });
};

export const getModuleOptions = (opts: IGetModulesOptions) => {
  const key = ["get", "module", opts];
  return queryOptions({
    ...getModulesOptions(opts),
    queryKey: key,
    select: (data) => data[0],
  });
};
