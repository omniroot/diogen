// import {
//   createSupabaseDelete,
//   createSupabaseInsert,
//   createSupabaseQuery,
//   createSupabaseUpdate,
// } from "@/api/supabase";
// import type {
//   IModule,
//   IModuleInsert,
//   IModuleUpdate,
// } from "@/api/supabase.interface";

import { supabase } from "@/api/supabase.ts";
import { queryOptions } from "@tanstack/react-query";

// export const useGetModules = createSupabaseQuery<IModule[]>({
//   name: "modules",
//   table: "modules",
// });

// export const useGetModule = createSupabaseQuery<IModule>({
//   name: "module",
//   table: "modules",
//   count: "first",
// });

// export const useCreateModule = createSupabaseInsert<IModuleInsert>({
//   name: "module",
//   table: "modules",
// });

// export const useDeleteModule = createSupabaseDelete({
//   name: "module",
//   table: "modules",
// });

// export const useUpdateModule = createSupabaseUpdate<IModuleUpdate>({
//   name: "module",
//   table: "modules",
// });

export const getModulesOptions = () =>
	queryOptions({
		queryKey: ["get", "modules"],
		queryFn: async () => {
			const { data, error } = await supabase.from("modules").select();
			if (error) throw error;
			return data;
		},
	});
