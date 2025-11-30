// import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
// import { type Models, Query, type TablesDB } from "appwrite";

// // --- Утилиты ---

// const buildAppwriteQueries = <TVars extends Record<string, any>>(
// 	vars: Partial<TVars>,
// 	filters: Record<keyof TVars, keyof typeof Query> | undefined,
// ) => {
// 	const queries: string[] = [];

// 	Object.keys(vars).forEach((key) => {
// 		const value = vars[key as keyof TVars];

// 		if (value === undefined) return;

// 		// NOTE: keyof TVars теперь гарантированно string
// 		const fieldName = key as string;

// 		if (value === null) {
// 			queries.push(Query.isNull(fieldName));
// 			return;
// 		}

// 		const rule = filters?.[key as keyof TVars];
// 		if (!rule) return;

// 		// @ts-expect-error
// 		queries.push(Query[rule](fieldName, value));
// 	});

// 	return queries;
// };

// // --- Типы Хуков ---

// // 1. Ограничиваем TFilterKeys типом string
// type CreateAppwriteHooksArgs<TFilterKeys extends string, TRow extends Models.Row> = {
// 	tablesDB: TablesDB;
// 	databaseId: string;
// 	tableId: string;
// 	includeTotal?: boolean;
// 	filters?: Record<TFilterKeys, keyof typeof Query>;
// };

// // 2. Убираем системные поля для дефолтного типа фильтров
// type FilterableKeys<TRow> = Omit<TRow, keyof Models.Row>;

// export const createAppwriteHooks = <
// 	TRow extends Models.Row,
// 	// 3. Главное изменение: явно ограничиваем TVars, чтобы все его ключи были строками.
// 	TVars extends Record<string, any> = FilterableKeys<TRow>,
// >({
// 	tablesDB,
// 	databaseId,
// 	tableId,
// 	filters,
// 	includeTotal = true,
// }: CreateAppwriteHooksArgs<keyof TVars & string, TRow>) => {
// 	// Используем keyof TVars & string для двойной гарантии

// 	function useList(
// 		vars: Partial<TVars> = {},
// 		overrides: Partial<UseQueryOptions<TRow[]>> = {},
// 	) {
// 		return useQuery<TRow[]>({
// 			queryKey: ["get", "posts", vars],
// 			queryFn: async () => {
// 				// Тут мы уверены, что filters имеет ключи TVars, которые являются строками
// 				const queryStrings = buildAppwriteQueries<TVars>(
// 					vars,
// 					filters as Record<keyof TVars, keyof typeof Query> | undefined,
// 				);

// 				const { rows } = await tablesDB.listRows<TRow>({
// 					databaseId,
// 					tableId,
// 					queries: queryStrings,
// 					total: includeTotal,
// 				});

// 				return rows;
// 			},
// 			...overrides,
// 		});
// 	}

// 	return { useList };
// };
