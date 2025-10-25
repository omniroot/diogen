import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { client, queryKeys } from "@/api/api.ts";
import { type IModule, type IModuleInsert, type IModuleUpdate, supabase } from "@/api/supabase.ts";

interface IGetModulesOptions {
	id?: IModule["id"];
	project_id?: IModule["project_id"];
}

export const createModulesOptions = () =>
	mutationOptions<unknown, unknown, IModuleInsert[]>({
		mutationFn: async (modules) => {
			const { data, error } = await supabase.from("modules").insert(modules);

			if (error) throw error;
			return data;
		},
	});

export const getModulesOptions = (opts: IGetModulesOptions) => {
	const key = queryKeys.modules.many(opts.project_id);
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
	const key = queryKeys.modules.one(opts.id);
	return queryOptions({
		...getModulesOptions(opts),
		queryKey: key,
		select: (data) => data[0],
	});
};

export const updateModuleOptions = () =>
	mutationOptions<IModule, unknown, IModuleUpdate>({
		mutationFn: async (module) => {
			const query = supabase.from("modules").update(module).eq("id", Number(module.id)).select();
			const { data, error } = await query.single();
			if (error) throw error;
			return data;
		},
	});

export const deleteModuleOptions = () =>
	mutationOptions<unknown, unknown, { ids: IModule["id"][] }>({
		mutationFn: async ({ ids }) => {
			const { data, error } = await supabase.from("modules").delete().in("id", ids);
			if (error) throw error;
			return data;
		},
	});
