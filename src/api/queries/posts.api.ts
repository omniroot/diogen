import type { UseQueryOptions } from "@tanstack/react-query";
import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { client } from "@/api/api";
import { diogen } from "@/api/supabase";
import type { IPosts } from "@/api/supabase.ts";
import { applyFilters, type FilterConfig } from "./supabase-utils";

// ... (типы BaseRecord и KeySection остаются прежними) ...

interface BaseRecord {
	id: string | number;
	[key: string]: any;
}

interface FactoryOptions {
	defaultOrder?: string; // Сортировка по умолчанию (например 'created_at')
	filters?: FilterConfig; // Тот самый конфиг фильтров
}

export function createCrudHooks<
	TRow extends BaseRecord,
	TInsert = Partial<TRow>,
	TUpdate = Partial<TRow>,
	TVars = Record<string, any>, // Тип входных переменных для поиска
>(
	tableName: string,
	keys: KeySection,
	{ defaultOrder = "id", filters = {} }: FactoryOptions = {}, // <-- Опции
) {
	// --- 1. GET LIST ---
	const useList = (
		vars: TVars & { limit?: number } = {} as any,
		options: Partial<UseQueryOptions<TRow[]>> = {},
	) => {
		const queryKey = keys.list(vars);

		return useQuery<TRow[]>({
			queryKey,
			queryFn: async () => {
				let query = diogen.from(tableName).select();

				// Отделяем limit от остальных переменных
				const { limit, ...filterVars } = vars;

				// Передаем переменные И конфиг фильтров в утилиту
				query = applyFilters(query, filterVars, filters);

				if (limit) query = query.limit(limit);

				// Сортировка
				query = query.order(defaultOrder, { ascending: true }); // Можно усложнить логику при желании

				const { data, error } = await query;
				if (error) throw error;
				return data as TRow[];
			},
			...options,
		});
	};

	// ... (Остальные методы create, update, delete без изменений) ...
	// (Код update/delete такой же, как в прошлом ответе)
	// ...

	// Добавляем useCreate, useUpdate, useDelete из предыдущего примера
	// ...

	return { useList /*, ... остальные */ };
}

// const { useQuery: useGetPosts } = createCrudHooks({});

// const filters: IPosts = {};
// const overrides: UseQueryOptions<IPosts[]> = {};

// useGetPosts(filters, overrides);
