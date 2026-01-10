import { QueryClient } from "@tanstack/react-query";

export const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnReconnect: true,
			retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
			staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
		},
	},
});

//
// REQUIREMENTS FOR API HOOKS
// HOOKS: useGetProjects, useGetProject, useCreateProject, useUpdateProjects, useDeleteProjects
// MUTATIONS: return result with query.select().single()
// ERROR: handle errors with handleError util
//
