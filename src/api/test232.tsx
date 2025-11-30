
можешь переписать наш код генерации хуков на appwrite. Наверное его можно упростить на этапе фильтрации так как appwrite в этом плане более униврсален и позволяет использовать фнкции для генерации queries вроже этого Query.equal("id", 123). Как будто можно передавать это из вне,однако нету типизации. может создать какую то обертку. И не забудь всё типизировать. Подкинь идей, распиши всё. Спасибо :) 


import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

// Доступные операторы Supabase
export type FilterOperator =
	| "eq"
	| "neq"
	| "gt"
	| "gte"
	| "lt"
	| "lte"
	| "like"
	| "ilike"
	| "in"
	| "is"
	| "contains"; // можно добавлять по мере необходимости

// Правило для одного поля
export interface FilterRule {
	field?: string; // Имя колонки в БД (если отличается от имени переменной)
	op?: FilterOperator; // Оператор сравнения
}

// Карта конфигурации: { variableName: Rule | Operator }
export type FilterConfig = Record<string, FilterRule | FilterOperator>;

/**
 * Применяет фильтры к запросу на основе конфигурации.
 */
export const applyFilters = (
	query: any,
	vars: Record<string, any>,
	config: FilterConfig = {},
) => {
	let q = query;

	Object.entries(vars).forEach(([key, value]) => {
		// 1. Пропускаем undefined (значит фильтр не активен)
		if (value === undefined) return;

		// 2. Получаем настройки для текущего поля
		const rule = config[key];

		// Дефолтные значения: имя колонки = имени переменной, оператор = eq
		let field = key;
		let op: FilterOperator = "eq";

		if (typeof rule === "string") {
			op = rule; // Если передали строку: { title: 'ilike' }
		} else if (typeof rule === "object") {
			if (rule.field) field = rule.field; // Если передали объект: { search: { field: 'title', op: 'ilike' } }
			if (rule.op) op = rule.op;
		}

		// 3. SPECIAL CASE: NULL всегда обрабатываем через .is()
		if (value === null) {
			q = q.is(field, null);
			return;
		}

		// 4. Применяем операторы
		switch (op) {
			case "eq":
				// Если прилетел массив, eq превращаем в in автоматически
				if (Array.isArray(value)) {
					q = q.in(field, value);
				} else {
					q = q.eq(field, value);
				}
				break;
			case "neq":
				q = q.neq(field, value);
				break;
			case "gt":
				q = q.gt(field, value);
				break;
			case "gte":
				q = q.gte(field, value);
				break;
			case "lt":
				q = q.lt(field, value);
				break;
			case "lte":
				q = q.lte(field, value);
				break;
			case "in":
				q = q.in(field, Array.isArray(value) ? value : [value]);
				break;
			case "is":
				// Для явного вызова .is(true/false)
				q = q.is(field, value);
				break;
			case "like":
				q = q.like(field, value); // Паттерн (например '%text%') ожидается в value
				break;
			case "ilike":
				// Автоматически оборачиваем в %..% для удобства поиска
				q = q.ilike(field, `%${value}%`);
				break;
			case "contains":
				q = q.contains(field, value);
				break;
			default:
				// Фоллбэк
				q = q.eq(field, value);
		}
	});

	return q;
};

import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { client } from "@/api/api"; // Твой QueryClient
import { diogen } from "@/api/supabase"; // Твой Supabase клиент
import { applyFilters, type FilterConfig } from "@/utils/supabase-utils"; // Импорт из шага 1

// --- Типы ---
interface BaseRecord {
	id: string | number;
	[key: string]: any;
}

interface KeySection {
	all: readonly unknown[];
	list: (...args: any[]) => readonly unknown[];
	one: (...args: any[]) => readonly unknown[];
	create: (...args: any[]) => readonly unknown[];
	update: (...args: any[]) => readonly unknown[];
	delete: (...args: any[]) => readonly unknown[];
}

interface FactoryOptions {
	defaultOrder?: string; // Поле сортировки (дефолт 'id')
	filters?: FilterConfig; // Конфигурация фильтров
}

// --- Фабрика ---
export function createCrudHooks<
	TRow extends BaseRecord, // Тип записи (из БД)
	TInsert = Partial<TRow>, // Тип для создания
	TUpdate = Partial<TRow>, // Тип для обновления
	TVars = Record<string, any>, // Тип переменных поиска
>(
	tableName: string,
	keys: KeySection,
	{ defaultOrder = "id", filters = {} }: FactoryOptions = {},
) {
	// 1. GET LIST
	const useList = (
		vars: TVars & { limit?: number } = {} as any,
		options: Partial<UseQueryOptions<TRow[]>> = {},
	) => {
		// Ключ кэша генерируем на основе всех переменных
		const queryKey = keys.list(vars);

		return useQuery<TRow[]>({
			queryKey,
			queryFn: async () => {
				let query = diogen.from(tableName).select();

				// Отделяем служебные поля от фильтров
				const { limit, ...filterVars } = vars;

				// Применяем нашу мощную фильтрацию
				query = applyFilters(query, filterVars, filters);

				if (limit) query = query.limit(limit);

				// Сортировка
				query = query.order(defaultOrder, {
					ascending: options?.meta?.ascending ?? true,
				}); // Можно расширять логику

				const { data, error } = await query;
				if (error) throw error;
				return data as TRow[];
			},
			...options,
		});
	};

	// 2. GET ONE (Строго по ID)
	const useOne = (id: string | number, options: Partial<UseQueryOptions<TRow>> = {}) => {
		return useQuery<TRow>({
			queryKey: keys.one(id),
			queryFn: async () => {
				const { data, error } = await diogen
					.from(tableName)
					.select()
					.eq("id", id)
					.single(); // Используем single() для гарантии одной записи

				if (error) throw error;
				return data as TRow;
			},
			enabled: !!id,
			...options,
		});
	};

	// 3. CREATE
	const useCreate = (
		options: Partial<UseMutationOptions<TRow, unknown, TInsert>> = {},
	) => {
		return useMutation({
			mutationKey: keys.create(),
			mutationFn: async (newItem) => {
				const { data, error } = await diogen
					.from(tableName)
					.insert(newItem)
					.select()
					.single();

				if (error) throw error;
				return data as TRow;
			},
			onSuccess: () => {
				client.invalidateQueries({ queryKey: keys.all });
			},
			...options,
		});
	};

	// 4. UPDATE
	interface UpdateVars {
		id: string | number;
		data: TUpdate;
	}

	const useUpdate = (
		options: Partial<UseMutationOptions<TRow, unknown, UpdateVars>> = {},
	) => {
		return useMutation({
			mutationKey: keys.update(),
			mutationFn: async ({ id, data }) => {
				const { data: result, error } = await diogen
					.from(tableName)
					.update(data)
					.eq("id", id)
					.select()
					.single();

				if (error) throw error;
				return result as TRow;
			},
			onSuccess: (_, variables) => {
				client.invalidateQueries({ queryKey: keys.all });
				client.invalidateQueries({ queryKey: keys.one(variables.id) });
			},
			...options,
		});
	};

	// 5. DELETE
	const useDelete = (
		options: Partial<UseMutationOptions<void, unknown, string | number>> = {},
	) => {
		return useMutation({
			mutationKey: keys.delete(),
			mutationFn: async (id) => {
				const { error } = await diogen.from(tableName).delete().eq("id", id);
				if (error) throw error;
			},
			onSuccess: () => {
				client.invalidateQueries({ queryKey: keys.all });
			},
			...options,
		});
	};

	return { useList, useOne, useCreate, useUpdate, useDelete };
}

import { keyFactory } from "@/api/api";
import { createCrudHooks } from "@/api/factory";
import type { IIssue, IIssueInsert, IIssueUpdate } from "@/api/supabase";

// 1. Описываем интерфейс переменных для хука
interface IssueFilters {
	search?: string; // Поиск по названию
	moduleId?: number | null; // Фильтр по модулю (или поиск null)
	projectId?: number; // Фильтр по проекту
	status?: string; // Статус
	createdAfter?: string; // Дата "С"
}

// 2. Генерируем хуки с конфигурацией
export const issuesApi = createCrudHooks<
	IIssue,
	IIssueInsert,
	IIssueUpdate,
	IssueFilters
>("issues", keyFactory.issues, {
	defaultOrder: "created_at", // Сортировка по умолчанию
	filters: {
		// search -> поиск ILIKE по колонке 'title'
		search: { field: "title", op: "ilike" },

		// moduleId -> колонка 'module_id' (если передашь null, сработает .is(null))
		moduleId: { field: "module_id", op: "eq" },

		// createdAfter -> колонка 'created_at', оператор >=
		createdAfter: { field: "created_at", op: "gte" },

		// Остальные поля (projectId, status) работают по дефолту как 'eq'
	},
});

const { data } = issuesApi.useList({
	search: "fix", // WHERE title ILIKE '%fix%'
	moduleId: null, // WHERE module_id IS NULL
	createdAfter: "2023-01-01",
});
