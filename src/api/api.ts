import { QueryClient } from "@tanstack/react-query";
import type { IIssue, IModule, IProject } from "@/api/supabase.ts";

export const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnReconnect: true,
			retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
			staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
		},
	},
});

export const queryKeys = {
	issues: {
		all: ["issues"],
		one: (id: IIssue["id"] | null | undefined) => [...queryKeys.issues.all, "one", id],
		many: (project_id: IProject["id"]) => [...queryKeys.issues.all, "many"],
	},
	modules: {
		all: ["modules"],
		one: (id: IModule["id"] | null | undefined) => [...queryKeys.modules.all, "one", id],
		many: (project_id: IModule["project_id"] | null | undefined) => [...queryKeys.modules.all, "many", project_id],
	},
};

export const refetchQuery = (key: (string | number | string[] | null | undefined)[]) => {
	client.invalidateQueries({ queryKey: key });
};
