import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { ID, type Models, Query, type QueryTypes, type TablesDB } from "appwrite";
import { generateUniqueId } from "@/utils/generateRandomId.tsx";

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
}

interface Filters<TValue> {
	equal?: QueryTypes;
	notEqual?: QueryTypes;
	between?: [string | number, string | number];
	contains?: string | any[];
	lessThan?: QueryTypes;
	greaterThan?: QueryTypes;

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
	databaseId: string;
	tableId: string;
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
					default:
						return "";
				}
			})
			.filter(Boolean);

		// // 2. Если значение — примитив (sugar для equal)
		// if (typeof value !== "object" || Array.isArray(value)) {
		// 	return [Query.equal(key, value as any)];
		// }
	});
}

type UpdateDataTyped<TData> = TData & Models.Row extends Models.DefaultRow
	? Partial<Models.Row> & Record<string, any>
	: Partial<Models.Row> & Omit<TData & Models.Row, keyof Models.Row>;

interface Options {
	total?: boolean;
}

export function createCoreApi<TData>({ tablesDB, databaseId, tableId }: Config) {
	async function $list(queries: Queries<TData>, options: Options = { total: false }) {
		const _queries = parseQueries(queries);
		const { rows } = await tablesDB.listRows<TData & Models.Row>({
			databaseId,
			tableId,
			queries: _queries,
			total: options.total,
		});
		return rows;
	}

	async function $one(data: Partial<UpdateDataTyped<TData>>, queries: Queries<TData>) {
		if (!data.$id) return;
		const _queries = parseQueries(queries);
		const result = await tablesDB.getRow<TData & Models.Row>({
			databaseId,
			tableId,
			rowId: data.$id,
			queries: _queries,
		});
		return result;
	}

	async function $create(data: UpdateDataTyped<TData>) {
		const result = await tablesDB.createRow<TData & Models.Row>({
			databaseId,
			tableId,
			rowId: ID.unique(),
			data: data,
		});
		return result;
	}

	async function $update(data: UpdateDataTyped<TData>) {
		if (!data.$id) return;
		const result = await tablesDB.updateRow<TData & Models.Row>({
			databaseId,
			tableId,
			rowId: data.$id,
			data: data,
		});
		return result;
	}

	async function $delete(data: UpdateDataTyped<TData>) {
		if (!data.$id) return;
		await tablesDB.deleteRow({
			databaseId,
			tableId,
			rowId: data.$id,
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

interface CreateHooksApiConfig<TData> {
	name: string;
	coreApis: ReturnType<typeof createCoreApi<TData>>;
}

export function createHooksApi<TData>({ name, coreApis }: CreateHooksApiConfig<TData>) {
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
		overrides?: Partial<UseQueryOptions<TData[], null, TData[]>>,
	) {
		return useQuery<TData[], null, TData[]>({
			queryKey: queryKeys.list(queries),
			queryFn: async () => {
				return await coreApis.list(queries);
			},
			...overrides,
		});
	}

	function useOne(
		data: Partial<UpdateDataTyped<TData>>,
		queries?: Queries<TData>,
		overrides?: Partial<UseQueryOptions<(TData & Models.Row) | undefined, null, TData>>,
	) {
		return useQuery<(TData & Models.Row) | undefined, null, TData>({
			queryKey: queryKeys.one(queries),
			queryFn: async () => {
				return await coreApis.one(data, queries || {});
			},
			...overrides,
		});
	}

	function useCreate(
		overrides?: Partial<UseMutationOptions<TData, null, UpdateDataTyped<TData>>>,
	) {
		return useMutation<Partial<TData>, null, UpdateDataTyped<TData>>({
			mutationKey: queryKeys.create(),
			mutationFn: async (data) => {
				return await coreApis.create(data);
			},
			// ...overrides,
		});
	}

	function useUpdate(
		overrides?: Partial<
			UseMutationOptions<(TData & Models.Row) | undefined, null, UpdateDataTyped<TData>>
		>,
	) {
		return useMutation<(TData & Models.Row) | undefined, null, UpdateDataTyped<TData>>({
			mutationKey: queryKeys.update(),
			mutationFn: async (data) => {
				return await coreApis.update(data);
			},
			// ...overrides,
		});
	}

	function useDelete(
		overrides?: Partial<UseMutationOptions<undefined, null, UpdateDataTyped<TData>>>,
	) {
		return useMutation<undefined, null, UpdateDataTyped<TData>>({
			mutationKey: queryKeys.delete(),
			mutationFn: async (data) => {
				return await coreApis.delete(data);
			},
			...overrides,
		});
	}

	return { useList, useOne, useCreate, useUpdate, useDelete, queryKeys };
}

export type DomainHook<TData> = Queries<TData>;

type Singular<P extends string> = P extends `${infer S}s` ? S : P;

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
