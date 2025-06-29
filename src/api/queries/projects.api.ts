import { createQuery } from "react-query-kit";
import { supabase } from "@/api/supabase";
import type { IProject } from "@/api/supabase.interface";

export const useGetProjects = createQuery({
	queryKey: ["get-projects"],
	fetcher: async () => {
		const { data } = await supabase.from("projects").select("*");
		return data;
	},
});

export const useGetProject = createQuery<
	IProject | undefined,
	{ custom_id: string }
>({
	queryKey: ["get-project"],
	fetcher: async ({ custom_id }) => {
		const { data } = await supabase
			.from("projects")
			.select("*")
			.eq("custom_id", custom_id);
		return data?.[0];
	},
});
