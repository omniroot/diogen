import { createQuery } from "react-query-kit";
import { supabase } from "@/api/supabase";
import type { IModule, ITask } from "@/api/supabase.interface";

export const useGetModules = createQuery<
	IModule[] | null,
	{ project_id: number }
>({
	queryKey: ["get-modules"],
	fetcher: async ({ project_id }) => {
		const { data } = await supabase
			.from("modules")
			.select("*")
			.eq("project_id", project_id);
		return data;
	},
});

export const useGetModule = createQuery<
	IModule | null,
	{ project_id: number; module_id: number }
>({
	queryKey: ["get-modules"],
	fetcher: async ({ project_id, module_id }) => {
		const { data } = await supabase
			.from("modules")
			.select("*")
			.eq("id", module_id)
			.eq("project_id", project_id);
		return data?.[0] || null;
	},
});

export const useGetTasksByModuleId = createQuery<
	ITask[] | null,
	{ id: number }
>({
	queryKey: ["get-tasks"],
	fetcher: async ({ id }) => {
		const { data } = await supabase.from("tasks").select("*").eq("id", id);
		return data;
	},
});
