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
		update: (...vars: unknown[]) => buildKey(...all, "update", ...vars),
		delete: (...vars: unknown[]) => buildKey(...all, "delete", ...vars),
	};
}

export const keyFactory = {
	projects: createKeySection("projects"),
	issues: createKeySection("issues"),
	modules: createKeySection("modules"),
};

// Maybe in future, but now is useless

// export type OverrideQueryOptions<TResult = unknown, TError = unknown, TData = unknown> = Partial<
// 	UseQueryOptions<TResult, TError, TData>
// >;
// export type OverrideMutationOptions<TResult = unknown, TError = unknown, TData = unknown> = Partial<
// 	UseMutationOptions<TResult, TError, TData>
// >;

// export const queryBuilder = <TResult = unknown, TError = unknown, TData extends TResult = TResult>(
// 	queryOptions: UseQueryOptions<TResult, TError, TData>,
// 	overrideQueryOptions: OverrideQueryOptions<TResult, TError, TData> = {},
// ) => {
// 	return useQuery<TResult, TError, TResult>({
// 		...queryOptions,
// 		...overrideQueryOptions,
// 	});
// };

// export const mutationBuilder = <TResult = unknown, TError = unknown, TData = unknown>(
// 	mutationOptions: UseMutationOptions<TResult, TError, TData>,
// 	overrideMutationOptions: OverrideMutationOptions<TResult, TError, TData> = {},
// ) => {
// 	return useMutation({
// 		...mutationOptions,
// 		...overrideMutationOptions,
// 	});
// };

export const refetchQuery = (
	key: (string | number | string[] | null | undefined | any)[],
) => {
	client.invalidateQueries({ queryKey: key });
};
