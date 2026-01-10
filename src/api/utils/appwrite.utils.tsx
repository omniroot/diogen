import {
	type QueryClient,
	type RefetchOptions as RQRefetchOptions,
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { ID, type Models, Query, type QueryTypes, type TablesDB } from "appwrite";
import { generateUniqueId } from "@/utils/generateRandomId.tsx";

// TODO: add generic to hooks for typing data external, like select: (data) => data[0]
// TODO: При использовании select не меняется возращаемый тип в tanstack query, реально ли это сделать :@ ?
// TODO: Добавить обработку ошибок и типы для них
// TODO: Переписать типы самостоятельно,  я их вообще нихуя не понимаю :( ?
// [Learn Advanced TypeScript In 25 Minutes (infer, extends, ternaries)](https://www.youtube.com/watch?v=bnTAOB3P6nM)
// [as const: the most underrated TypeScript feature](https://www.youtube.com/watch?v=6M9aZzm-kEc)
// [6 TypeScript tips to turn you into a WIZARD](https://www.youtube.com/watch?v=lraHlXpuhKs)

interface SystemFilters<TData> {
	$select?: (keyof TData)[];
	$limit?: number;
	$offset?: number;
	$orderAsc?: keyof TData;
	$orderDesc?: keyof TData;
	$transactionId?: string;
}

interface Filters<TValue> {
	equal?: QueryTypes;
	notEqual?: QueryTypes;
	between?: [string | number, string | number];
	contains?: string | any[];
	lessThan?: QueryTypes;
	greaterThan?: QueryTypes;
	isNull?: boolean;
	isNotNull?: boolean;
	test?: TValue;

	// другие операторы...
}
// Query.limit();

// 1. Определяем тип только для полей данных
type FieldFilters<TData> = {
	[K in keyof TData]?: TData[K] | Filters<TData[K]>;
};

// 2. Определяем рекурсивную структуру
// Используем интерфейс вместо type, так как интерфейсы лучше справляются с рекурсией
export type Queries<TData> = FieldFilters<TData> &
	SystemFilters<TData> & {
		$and?: Queries<TData>[];
		$or?: Queries<TData>[];
	};

interface Config {
	tablesDB: TablesDB;
	databaseId: string | undefined;
	tableId: string | undefined;
}

export function parseQueries<T>(filters: Queries<T>): string[] {
	return Object.entries(filters).flatMap(([key, value]) => {
		if (!value) return [];

		switch (key as keyof Queries<T>) {
			case "$select":
				return Query.select(value as any);
			case "$limit":
				return Query.limit(value as any);
			case "$offset":
				return Query.offset(value as any);
			case "$orderAsc":
				return Query.orderAsc(value as any);
			case "$orderDesc":
				return Query.orderDesc(value as any);
			case "$and":
			case "$or": {
				const nested = (value as any).flatMap(parseQueries);
				return nested.length
					? [key === "$and" ? Query.and(nested) : Query.or(nested)]
					: [];
			}
		}
		return Object.entries(value)
			.map(([op, value]) => {
				switch (op as keyof Filters<T>) {
					case "equal":
						return Query.equal(key, value as any);
					case "notEqual":
						return Query.notEqual(key, value as any);
					case "contains":
						return Query.contains(key, value as any);
					case "between":
						return Query.between(key, (value as any)[0], (value as any)[1]);
					case "lessThan":
						return Query.lessThan(key, value as any);
					case "greaterThan":
						return Query.greaterThan(key, value as any);
					case "isNull":
						return Query.isNull(key);
					case "isNotNull":
						return Query.isNotNull(key);

					default:
						return "";
				}
			})
			.filter(Boolean);
	});
}

export type UpdateDataTyped<TData = any> = Partial<Models.Row> &
	Omit<TData, keyof Models.Row>;

// Дополнительные "Domain" экспортируем как простые дубляжи, как ты просил:
export type DomainUpdate<TData = any> = UpdateDataTyped<TData>;
export type DomainRow<TData = any> = TData & Models.Row;

interface Options {
	total: boolean;
}

export function createCoreApi<TData>({ tablesDB, databaseId, tableId }: Config) {
	if (!databaseId) throw new Error("DatabaseId not found");

	if (!tableId) {
		throw new Error("tableID not found");
	}

	async function $list(queries: Queries<TData>, options: Options = { total: false }) {
		const _queries = parseQueries(queries);
		const { rows } = await tablesDB.listRows<TData & Models.Row>({
			databaseId: databaseId!,
			tableId: tableId!,
			queries: _queries,
			total: options.total,
			transactionId: queries.$transactionId,
		});
		return rows;
	}

	async function $one($id: string, queries: Queries<TData>) {
		if (!$id) return;
		const _queries = parseQueries(queries);
		const result = await tablesDB.getRow<TData & Models.Row>({
			databaseId: databaseId!,
			tableId: tableId!,
			rowId: $id,
			queries: _queries,
			transactionId: queries.$transactionId,
		});
		return result;
	}

	async function $create(data: UpdateDataTyped<TData>) {
		const result = await tablesDB.createRow<TData & Models.Row>({
			databaseId: databaseId!,
			tableId: tableId!,
			rowId: data.$id || ID.unique(),
			data: data as any,
			permissions: data.$permissions,
		});
		return result;
	}

	async function $update(data: UpdateDataTyped<Partial<TData>>) {
		if (!data.$id) return;
		const result = await tablesDB.updateRow<TData & Models.Row>({
			databaseId: databaseId!,
			tableId: tableId!,
			rowId: data.$id,
			data: data as any,
		});
		return result;
	}

	async function $delete($id: string) {
		if (!$id) return;
		await tablesDB.deleteRow({
			databaseId: databaseId!,
			tableId: tableId!,
			rowId: $id,
		});
		return undefined;
	}

	return { list: $list, one: $one, create: $create, update: $update, delete: $delete };
}

function normalizeQuery(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(normalizeQuery);
	}

	if (value && typeof value === "object") {
		return Object.keys(value)
			.sort()
			.reduce((acc, key) => {
				const v = (value as any)[key];
				if (v !== undefined) {
					acc[key] = normalizeQuery(v);
				}
				return acc;
			}, {} as any);
	}

	return value;
}

function isDeepSubset(source: any, subset: any): boolean {
	if (source === subset) return true;
	if (
		typeof source !== typeof subset ||
		source === null ||
		subset === null ||
		source === undefined ||
		subset === undefined
	) {
		return false;
	}
	if (subset instanceof Date && source instanceof Date) {
		return subset.getTime() === source.getTime();
	}
	if (Array.isArray(subset)) {
		if (!Array.isArray(source)) return false;
		return subset.every((subItem) =>
			source.some((sourceItem) => isDeepSubset(sourceItem, subItem)),
		);
	}
	if (typeof subset === "object") {
		return Object.keys(subset).every((key) => {
			const subValue = subset[key];
			if (!Object.hasOwn(source, key)) return false;
			return isDeepSubset(source[key], subValue);
		});
	}
	return source === subset;
}

function containsDeeply(source: any, subset: any): boolean {
	if (isDeepSubset(source, subset)) return true;
	if (typeof source === "object" && source !== null) {
		return Object.values(source).some((val) => containsDeeply(val, subset));
	}
	return false;
}

// --- REFETCHER TYPES ---

type CustomRefetchOptions<TArgs> = RQRefetchOptions & {
	where?: TArgs;
	mode?: "exact" | "fuzzy";
};

export type DomainUpdateType<TData> = UpdateDataTyped<TData>;

interface CreateHooksApiConfig<TData> {
	name: string;
	coreApis: ReturnType<typeof createCoreApi<TData>>;
	queryClient: QueryClient;
}

export function createHooksApi<TData>({
	name,
	coreApis,
	queryClient,
}: CreateHooksApiConfig<TData>) {
	const queryKeys = {
		all: name,
		list: (queries?: Queries<TData>) => [queryKeys.all, "list", normalizeQuery(queries)],
		one: (queries?: Queries<TData>) => [queryKeys.all, "one", normalizeQuery(queries)],
		create: () => [queryKeys.all, "create", generateUniqueId()],
		update: () => [queryKeys.all, "update", generateUniqueId()],
		delete: () => [queryKeys.all, "delete", generateUniqueId()],
	};
	function useList(
		queries: Queries<TData>,
		overrides?: Partial<UseQueryOptions<(TData & Models.Row)[], null, TData[]>>,
	) {
		return useQuery<(TData & Models.Row)[], null, TData[]>({
			queryKey: queryKeys.list(queries),
			queryFn: async () => {
				return await coreApis.list(queries);
			},
			...overrides,
		});
	}

	function useOne(
		$id: string,
		queries?: Queries<TData>,
		overrides?: Partial<UseQueryOptions<(TData & Models.Row) | undefined, null, TData>>,
	) {
		return useQuery<(TData & Models.Row) | undefined, null, TData>({
			queryKey: queryKeys.one(queries),
			queryFn: async () => {
				return await coreApis.one($id, queries || {});
			},
			...overrides,
		});
	}

	function useCreate(
		overrides?: Partial<UseMutationOptions<Partial<TData>, null, UpdateDataTyped<TData>>>,
	) {
		return useMutation<Partial<TData>, null, UpdateDataTyped<TData>>({
			mutationKey: queryKeys.create(),
			mutationFn: async (data) => {
				return await coreApis.create(data);
			},
			...overrides,
		});
	}

	function useUpdate(
		overrides?: Partial<
			UseMutationOptions<
				(TData & Models.Row) | undefined,
				null,
				UpdateDataTyped<Partial<TData>>
			>
		>,
	) {
		return useMutation<
			(TData & Models.Row) | undefined,
			null,
			UpdateDataTyped<Partial<TData>>
		>({
			mutationKey: queryKeys.update(),
			mutationFn: async (data) => {
				return await coreApis.update(data);
			},
			...overrides,
		});
	}

	function useDelete(
		overrides?: Partial<UseMutationOptions<undefined, null, { $id: string }>>,
	) {
		return useMutation<undefined, null, { $id: string }>({
			mutationKey: queryKeys.delete(),
			mutationFn: async (data) => {
				return await coreApis.delete(data.$id);
			},
			...overrides,
		});
	}

	const refetch = {
		/**
		 * Рефетч списков (list).
		 * @param options Опции рефетча, включая фильтры (where) и режим (exact/fuzzy)
		 */
		list: async (options: CustomRefetchOptions<Queries<TData>> = {}) => {
			const { where, mode = "exact", ...rqOptions } = options;

			if (mode === "exact") {
				const queryKey = where ? queryKeys.list(where) : [name, "list"];
				return queryClient.refetchQueries({
					queryKey,
					exact: !!where,
					...rqOptions,
				});
			}

			// Fuzzy Mode
			if (mode === "fuzzy") {
				return queryClient.refetchQueries({
					...rqOptions,
					predicate: (query) => {
						const [qScope, qMethod, qFilters] = query.queryKey as [
							string,
							string,
							unknown,
						];

						// 1. Проверяем Scope и Method
						if (qScope !== name || qMethod !== "list") return false;

						// 2. Если where не задан, рефетчим все списки этой сущности
						if (!where) return true;

						// 3. Если в запросе нет фильтров, но мы ищем конкретный where, то не совпало
						if (!qFilters) return false;

						// 4. Глубокий поиск
						return containsDeeply(qFilters, where);
					},
				});
			}
		},

		/**
		 * Рефетч одиночных записей (one).
		 * @param options Опции рефетча, включая фильтры (where) и режим (exact/fuzzy)
		 */
		one: async (options: CustomRefetchOptions<Queries<TData>> = {}) => {
			const { where, mode = "exact", ...rqOptions } = options;

			if (mode === "exact") {
				const queryKey = where ? queryKeys.one(where) : [name, "one"];
				return queryClient.refetchQueries({
					queryKey,
					exact: !!where,
					...rqOptions,
				});
			}

			if (mode === "fuzzy") {
				return queryClient.refetchQueries({
					...rqOptions,
					predicate: (query) => {
						const [qScope, qMethod, qFilters] = query.queryKey as [
							string,
							string,
							unknown,
						];
						if (qScope !== name || qMethod !== "one") return false;
						if (!where) return true;
						if (!qFilters) return false;
						return containsDeeply(qFilters, where);
					},
				});
			}
		},
	};

	return { useList, useOne, useCreate, useUpdate, useDelete, refetch, queryKeys };
}

export type DomainHook<TData> = {
	queries: Queries<TData>;
	overrides: Partial<UseQueryOptions<(TData & Models.Row) | undefined, null, TData>>;
};

export type DomainHookMultiple<TData> = {
	queries: Queries<TData>;
	overrides: Partial<UseQueryOptions<(TData & Models.Row)[], null, TData[]>>;
};

interface UseCreateTransaction {
	tablesDB: TablesDB;
	name: string;
}

export const useCreateTransaction = ({ tablesDB, name }: UseCreateTransaction) => {
	const { data: transaction } = useQuery({
		queryKey: ["transaction", "create", name],
		queryFn: () => {
			return tablesDB.createTransaction();
		},
	});
	return transaction;
};

// type Singular<P extends string> = P extends `${infer S}s` ? S : P;

// DomainHookReturn<TItem, "posts"> -> {
//   posts: TItem[];
//   createPost: (...args)=>any;
//   updatePost: (...args)=>any;
//   deletePost: (...args)=>any;
//   __rawList?: unknown;
// }

// export type DomainHookReturn<
// 	TItem,
// 	Plural extends string,
// 	TData,
// 	CreateFn extends (...args: any[]) => any = (...args: any[]) => any,
// 	UpdateFn extends (...args: any[]) => any = (...args: any[]) => any,
// 	DeleteFn extends (...args: any[]) => any = (...args: any[]) => any,
// > = {
// 	[K in Plural]: TItem[] | undefined;
// } & {
// 	[K in `create${Capitalize<Singular<Plural>>}`]: CreateFn;
// } & {
// 	[K in `update${Capitalize<Singular<Plural>>}`]: UpdateFn;
// } & {
// 	[K in `delete${Capitalize<Singular<Plural>>}`]: DeleteFn;
// } & TData & {
// 		// опционально можно вернуть "сырое" значение useList (meta, isLoading и т.д.)
// 		__raw?: unknown;
// 	};
