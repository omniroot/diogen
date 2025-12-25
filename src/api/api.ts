import { QueryClient } from "@tanstack/react-query";
// import { postsHooks } from "@/api/apis/posts.api.tsx";
import { createRefetcher } from "@/api/utils/tanstack-query.utils.tsx";
import { postsHooks } from "@/features/posts/api/posts.api.ts";

export const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnReconnect: true,
			retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
			staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
		},
	},
});

const buildKey = (...parts: any[]) => {
	const clean = (value: any): any => {
		if (value === null || value === undefined) return undefined;
		// ---------- 1. ТУПЛЫ (["name", value]) ----------
		if (Array.isArray(value) && value.length === 2 && typeof value[0] === "string") {
			return { [value[0]]: clean(value[1]) };
		}
		// ---------- 2. ПУСТЫЕ МАССИВЫ ----------
		if (Array.isArray(value)) {
			if (value.length === 0) return undefined;
			return value.map(clean).filter((v) => v !== undefined);
		}
		// ---------- HANDLE DATES BEFORE OBJECTS ----------
		if (value instanceof Date) {
			return value.toISOString(); // Serialize Date to ISO string for key stability
		}
		// ---------- 3. ОБЪЕКТЫ ----------
		if (typeof value === "object") {
			const entries = Object.entries(value)
				.map(([k, v]) => [k, clean(v)])
				.filter(([_, v]) => v !== undefined)
				.sort(([a], [b]) => a.localeCompare(b));
			if (entries.length === 0) return undefined;
			return Object.fromEntries(entries);
		}
		// ---------- 4. ПРИМИТИВЫ ----------
		return value;
	};
	return parts.map(clean).filter((v) => v !== undefined); // убираем undefined после чистки
};

function createKeySection(name: string) {
	const all = [name];

	return {
		all,
		list: (...vars: unknown[]) => buildKey(...all, "list", ...vars),
		one: (...vars: unknown[]) => buildKey(...all, "one", ...vars),
		create: (...vars: unknown[]) => buildKey(...all, "create", ...vars),
		update: (...vars: unknown[]) => buildKey(...all, "update", ...vars),
		delete: (...vars: unknown[]) => buildKey(...all, "delete", ...vars),
	};
}

export const keyFactory = {
	projects: createKeySection("projects"),
	issues: createKeySection("issues"),
	modules: createKeySection("modules"),
	habits: createKeySection("habits"),
	habit_records: createKeySection("habit_records"),
	days_records: createKeySection("days_records"),
};

export const keyFactoryNew = {
	posts: postsHooks.queryKeys,
};

export const refetcher = createRefetcher(client, keyFactoryNew);

//
// REQUIREMENTS FOR API HOOKS
// HOOKS: useGetProjects, useGetProject, useCreateProject, useUpdateProjects, useDeleteProjects
// MUTATIONS: return result with query.select().single()
// ERROR: handle errors with handleError util
//

export const refetchQuery = (
	key: (string | number | string[] | null | undefined | any)[],
) => {
	client.invalidateQueries({ queryKey: key });
};
