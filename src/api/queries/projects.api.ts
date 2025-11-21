import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { client, keyFactory } from "@/api/api.ts";
import { diogen, type IProject } from "@/api/supabase.ts";

interface UseGetProjects {
	id?: IProject["id"] | null | undefined;
	custom_id?: IProject["custom_id"] | null | undefined;
	title?: IProject["title"] | null | undefined;

	limit?: number | null | undefined;
	orderByPosition?: boolean | null | undefined;
}

export const useGetProjects = (
	{ limit, orderByPosition = true, ...vars }: UseGetProjects = {},
	override: Partial<UseQueryOptions<IProject[]>> = {},
) => {
	const key = keyFactory.projects.list({ vars, orderByPosition });
	return useQuery<IProject[]>({
		queryKey: key,
		queryFn: async () => {
			let query = diogen.from("projects").select();
			Object.entries(vars).forEach(([key, value]) => {
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
		...override,
	});
};

// const { data } = useGetProjects({ id: 1 });

interface UseGetProject {
	id?: IProject["id"] | null | undefined;
	custom_id?: IProject["custom_id"] | null | undefined;
	title?: IProject["title"] | null | undefined;
}

export const useGetProject = (
	vars: UseGetProject = {},
	override: Partial<UseQueryOptions<IProject>> = {},
) => {
	const key = keyFactory.projects.one(vars);
	return useQuery<IProject>({
		queryKey: key,
		queryFn: async () => {
			let query = diogen.from("projects").select();
			Object.entries(vars).forEach(([key, value]) => {
				if (value) query = query.eq(key, value);
			});

			const { data, error } = await query.single();

			if (error) throw error;
			return data;
		},
		initialData: () => {
			return client.getQueryData(key);
		},
		placeholderData: () => {
			return client.getQueryData(key);
		},
		...override,
	});
};

export interface UseUpdateProjectsInput {
	ids: IProject["id"] | IProject["id"][];
	data: Partial<IProject>;
}

export const useUpdateProjects = (
	override: Partial<UseMutationOptions<unknown, unknown, UseUpdateProjectsInput>> = {},
) => {
	const key = keyFactory.projects.update();

	return useMutation<unknown, unknown, UseUpdateProjectsInput>({
		mutationKey: key,

		mutationFn: async ({ ids, data }) => {
			const idsArray = Array.isArray(ids) ? ids : [ids];

			const { error } = await diogen.from("projects").update(data).in("id", idsArray);

			if (error) throw error;

			return { updated: idsArray };
		},

		...override,
	});
};

interface UseDeleteProjects {
	ids: IProject["id"] | IProject["id"][];
}

export const useDeleteProjects = (
	override: Partial<UseMutationOptions<null, unknown, UseDeleteProjects["ids"]>> = {},
) => {
	const key = keyFactory.projects.delete();
	return useMutation<null, unknown, UseDeleteProjects["ids"]>({
		mutationKey: key,
		mutationFn: async (ids) => {
			const idsArray = Array.isArray(ids) ? ids : [ids];

			const { error } = await diogen.from("projects").delete().in("id", idsArray);

			if (error) throw error;

			return null;
		},
		...override,
	});
};
