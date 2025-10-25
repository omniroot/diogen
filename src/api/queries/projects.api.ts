import { client } from "@/api/api.ts";
import { supabase, type IProject } from "@/api/supabase.ts";
import { queryOptions } from "@tanstack/react-query";

interface IGetProjectsOptions {
	id?: IProject["id"] | null | undefined;
	custom_id?: IProject["custom_id"] | null | undefined;
	title?: IProject["title"] | null | undefined;

	limit?: number | null | undefined;
	orderByPosition?: boolean | null | undefined;
}

export const getProjectsOptions = ({ limit, orderByPosition = true, ...opts }: IGetProjectsOptions = {}) => {
	const key = ["get", "projects", opts];
	return queryOptions({
		queryKey: key,
		queryFn: async () => {
			let query = supabase.from("projects").select();
			Object.entries(opts).forEach(([key, value]) => {
				if (value) query = query.eq(key, value);
			});

			if (limit) query = query.limit(limit);

			if (orderByPosition) query = query.order("position");

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

export const getProjectOptions = ({ limit = 1, ...opts }: IGetProjectsOptions = {}) =>
	queryOptions({
		...getProjectsOptions({ limit, ...opts }),
		queryKey: ["get", "project", opts],
		select: (data) => data[0],
	});
