import {
	mutationOptions,
	queryOptions,
	type UseQueryOptions,
	useQuery,
} from "@tanstack/react-query";
import { client } from "@/api/api.ts";
import {
	diogen,
	type IIssue,
	type IIssueInsert,
	type IIssueUpdate,
} from "@/api/supabase";

export interface IGetIssuesOptions {
	id?: IIssue["id"];
	title?: IIssue["title"];
	project_id?: IIssue["project_id"];
	module_id?: IIssue["module_id"];
	status?: IIssue["status"];

	limit?: number;
	filterByEmptyModule?: boolean;
	orderByDate?: boolean;
}

export const getIssuesOptions = ({
	limit,
	filterByEmptyModule = false,
	orderByDate = false,
	...opts
}: IGetIssuesOptions = {}) => {
	const key = ["get", "issues", opts, filterByEmptyModule, orderByDate];
	return queryOptions({
		queryKey: key,
		queryFn: async () => {
			let query = diogen.from("issues").select("*");

			Object.entries(opts).forEach(([key, value]) => {
				if (value) query = query.eq(key, value);
			});

			if (filterByEmptyModule) query = query.is("module_id", null);

			if (limit) query = query.limit(limit);
			if (orderByDate) query = query.order("created_at", { ascending: false });

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

export const getIssueOptions = ({ limit = 1, ...opts }: IGetIssuesOptions = {}) =>
	queryOptions({
		...getIssuesOptions({ limit, ...opts }),
		queryKey: ["get", "issue", opts],
		select: (data) => data[0],
	});

export const updateIssueOptions = () =>
	mutationOptions<IIssue, unknown, IIssueUpdate>({
		mutationFn: async (issue) => {
			const query = diogen
				.from("issues")
				.update(issue)
				.eq("id", Number(issue.id))
				.select();
			const { data, error } = await query.single();
			if (error) throw error;
			return data;
		},
	});

export const createIssueOptions = () =>
	mutationOptions<IIssue, unknown, IIssueInsert>({
		mutationFn: async (issue) => {
			const query = diogen.from("issues").insert(issue);
			const { data, error } = await query.single();
			if (error) throw error;
			return data;
		},
	});

export const deleteIssuesOptions = () =>
	mutationOptions<null, unknown, IIssue["id"][]>({
		mutationFn: async (ids) => {
			const query = diogen.from("issues").delete().in("id", ids);
			const { error } = await query;
			if (error) throw error;
			return null;
		},
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: ["get", "issues"],
			});
		},
	});

interface UseGetIssues {
	id?: IIssue["id"];
	title?: IIssue["title"];
	project_id?: IIssue["project_id"];
	module_id?: IIssue["module_id"];

	limit?: number;
	filterByEmptyModule?: boolean;
	orderByDate?: boolean;
}
export const useGetIssues = (
	{ filterByEmptyModule, limit, orderByDate, title, ...vars }: UseGetIssues = {},
	opts: Partial<UseQueryOptions<IIssue[]>> = {},
) => {
	return useQuery<IIssue[]>({
		queryKey: [""],
		queryFn: async () => {
			let query = diogen.from("issues").select("*");

			Object.entries(vars).forEach(([key, value]) => {
				if (value) query = query.eq(key, value);
			});

			if (title) query = query.ilike("title", `%${title}%`);

			if (filterByEmptyModule) query = query.is("module_id", null);

			if (limit) query = query.limit(limit);
			if (orderByDate) query = query.order("created_at", { ascending: false });

			const { data, error } = await query;

			if (error) throw error;
			return data;
		},

		...opts,
	});
};

// const a = () => {
// 	const {} = useGetIssues({ id: 1 }, { queryKey: ["123"] });

// 	return 1;
// };
