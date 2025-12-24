import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { ID, type Models, Query, type TablesDB } from "appwrite";

const buildAppwriteQueries = <TVars>(
	vars: Partial<TVars>,
	filters: Partial<Record<keyof TVars, keyof typeof Query> | undefined>,
) => {
	const queries: string[] = [];
	Object.entries(vars).forEach(([key, value]) => {
		if (value === undefined) return;
		if (value === null) {
			queries.push(Query.isNull(key));
			return;
		}

		const rule: keyof typeof Query = filters?.[key as keyof TVars] || "equal";
		if (!rule) return;

		// @ts-expect-error - TS не любит вызов динамических методов статического класса :8
		queries.push(Query[rule](key, value));
	});

	return queries;
};

export type QueryFactoryFn<TValue = any> = (value: TValue) => string;

type CreateAppwriteHooks<TVars extends Record<string, any>> = {
	tablesDB: TablesDB;
	databaseId: string;
	tableId: string;
	includeTotal?: boolean;

	// Ключи filters должны соответствовать ключам TVars
	filters?: Partial<Record<keyof TVars, keyof typeof Query>>; // | QueryFactoryFn<TVars> - пока не нужно
};

export const createAppwriteHooks = <
	TRow extends Models.Row,
	TVars extends Record<string, any>,
>({
	tablesDB,
	databaseId,
	tableId,
	filters,
	includeTotal = true,
}: CreateAppwriteHooks<TVars>) => {
	function useList(
		vars: Partial<TVars> = {},
		overrides: Partial<UseQueryOptions<TRow[]>> = {},
	) {
		return useQuery<TRow[]>({
			queryKey: ["get", databaseId, tableId, vars],
			queryFn: async () => {
				console.log("@@@ Before tablesDB");

				const { rows } = await tablesDB.listRows<TRow>({
					databaseId,
					tableId,
					queries: buildAppwriteQueries<TVars>(vars, filters),
					total: includeTotal,
				});

				return rows;
			},
			...overrides,
		});
	}

	type CreateRowDataFull<TRow> = TRow extends Models.DefaultRow
		? Partial<Models.Row> & Record<string, any>
		: Partial<Models.Row> & Omit<TRow, keyof Models.Row>;

	/** Тип, который мы разрешаем передавать в mutate — partial от полной формы */
	type CreateRowPayload<TRow> = Partial<CreateRowDataFull<TRow>>;
	function useCreate<TPayload extends CreateRowPayload<TRow> = CreateRowPayload<TRow>>(
		defaults?: CreateRowDataFull<TRow>, // опциональные дефолты, если нужно
		overrides?: Partial<UseMutationOptions<TRow, unknown, TPayload, unknown>>,
	) {
		return useMutation<TRow, unknown, TPayload>({
			mutationKey: ["create", databaseId, tableId],
			mutationFn: async (vars) => {
				const dataForApi: CreateRowDataFull<TRow> = {
					...(defaults ?? ({} as CreateRowDataFull<TRow>)),
					// здесь делаем временное приведение payload к unknown чтобы TS не цеплялся
					...(vars as unknown as CreateRowDataFull<TRow>),
				};

				const result = await tablesDB.createRow<TRow>({
					databaseId,
					tableId,
					rowId: ID.unique(),
					data: dataForApi,
				});

				return result;
			},
			...overrides,
		});
	}
	// type CreateRowDataFull<TRow> = TRow extends Models.DefaultRow
	// 	? Partial<Models.Row> & Record<string, any>
	// 	: Partial<Models.Row> & Omit<TRow, keyof Models.Row>;

	/** Тип, который мы разрешаем передавать в mutate — partial от полной формы */
	// type CreateRowPayload<TRow> = Partial<CreateRowDataFull<TRow>>;
	function useUpdate<TPayload extends CreateRowPayload<TRow> = CreateRowPayload<TRow>>(
		defaults?: CreateRowDataFull<TRow>, // опциональные дефолты, если нужно
		overrides?: Partial<
			UseMutationOptions<TRow, unknown, { id: string; vars: TPayload }>
		>,
	) {
		return useMutation<TRow, unknown, { id: string; vars: TPayload }>({
			mutationKey: ["create", databaseId, tableId],
			mutationFn: async ({ id, vars }) => {
				const dataForApi: CreateRowDataFull<TRow> = {
					...(defaults ?? ({} as CreateRowDataFull<TRow>)),
					// здесь делаем временное приведение payload к unknown чтобы TS не цеплялся
					...(vars as unknown as CreateRowDataFull<TRow>),
				};

				const result = await tablesDB.updateRow<TRow>({
					databaseId,
					tableId,
					rowId: id,
					data: dataForApi,
				});

				return result;
			},
			...overrides,
		});
	}

	return { useList, useCreate, useUpdate };
};
