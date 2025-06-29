import { createQuery } from "react-query-kit";
import { supabase } from "@/api/supabase";
import type { ITask } from "@/api/supabase.interface";

export const useGetTasks = createQuery<ITask[] | null, { project_id: number }>({
	queryKey: ["get-project-tasks"],
	fetcher: async ({ project_id }) => {
		const { data } = await supabase
			.from("tasks")
			.select("*")
			.eq("project_id", project_id);
		return data;
	},
});

export const useGetTask = createQuery<ITask[] | null, { id: number }>({
	queryKey: ["get-tasks"],
	fetcher: async ({ id }) => {
		const { data } = await supabase.from("tasks").select("*").eq("id", id);
		return data;
	},
});
