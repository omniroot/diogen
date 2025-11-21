import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { client, keyFactory } from "@/api/api.ts";
import {
	diogen,
	type IModule,
	type IModuleInsert,
	type IModuleUpdate,
} from "@/api/supabase.ts";

interface IGetModulesOptions {
	id?: IModule["id"];
	project_id?: IModule["project_id"];
}

export const createModulesOptions = () =>
	mutationOptions<unknown, unknown, IModuleInsert[]>({
		mutationFn: async (modules) => {
			const { data, error } = await diogen.from("modules").insert(modules);

			if (error) throw error;
			return data;
		},
	});

export const getModulesOptions = (opts: IGetModulesOptions) => {
	const key = keyFactory.modules.list(opts.project_id);
	return queryOptions({
		queryKey: key,
		queryFn: async () => {
			let query = diogen.from("modules").select();

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
	const key = keyFactory.modules.one(opts.id);
	return queryOptions({
		...getModulesOptions(opts),
		queryKey: key,
		select: (data) => data[0],
	});
};

export const updateModuleOptions = () =>
	mutationOptions<IModule, unknown, IModuleUpdate>({
		mutationFn: async (module) => {
			const query = diogen
				.from("modules")
				.update(module)
				.eq("id", Number(module.id))
				.select();
			const { data, error } = await query.single();
			if (error) throw error;
			return data;
		},
	});

export const deleteModuleOptions = () =>
	mutationOptions<unknown, unknown, { ids: IModule["id"][] }>({
		mutationFn: async ({ ids }) => {
			const { data, error } = await diogen.from("modules").delete().in("id", ids);
			if (error) throw error;
			return data;
		},
	});
