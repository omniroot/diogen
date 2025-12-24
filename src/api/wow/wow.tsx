import { ID, type Models, Query, type QueryTypes, type TablesDB } from "appwrite";
import { postsTable, tablesDB } from "@/api/appwrite.tsx";
import type { Posts } from "@/api/types/appwrite.js";

type SupportedFilter =
	| { type: "equal"; field: string; value: any }
	| { type: "notEqual"; field: string; value: any }
	| {
			type: "lessThan" | "lessEqual" | "greaterThan" | "greaterEqual";
			field: string;
			value: number;
	  }
	| { type: "between"; field: string; min: number; max: number }
	| { type: "search"; field: string; value: string }
	| { type: "and" | "or"; filters: SupportedFilter[] };

function mapToQuery(filter: SupportedFilter): string | string[] {
	switch (filter.type) {
		case "equal":
			return Query.equal(filter.field, filter.value);
		case "notEqual":
			return Query.notEqual(filter.field, filter.value);
		case "lessThan":
			return Query.lessThan(filter.field, filter.value);
		// case "lessEqual":
		//   return Query.lessEqual(filter.field, filter.value);
		case "greaterThan":
			return Query.greaterThan(filter.field, filter.value);
		// case "greaterEqual":
		//   return Query.greaterEqual(filter.field, filter.value);
		case "between":
			return Query.between(filter.field, filter.min, filter.max);
		case "search":
			return Query.search(filter.field, filter.value);
		case "and":
			return Query.and(filter.filters.flatMap(mapToQuery));
		case "or":
			return Query.or(filter.filters.flatMap(mapToQuery));
		default:
			throw new Error(`Unsupported filter type: ${(filter as any).type}`);
	}
}

type FilterRule =
	| "equal"
	| "notEqual"
	| "contains"
	| "less"
	| "lessEqual"
	| "greater"
	| "greaterEqual"
	| "search";

const a: QueryTypes = [""];
type FiltersConfig<TVars> = Partial<Record<keyof TVars, SupportedFilter>>;

type CoreApiOptions<TVars> = {
	tablesDB: TablesDB;
	databaseId: string;
	tableId: string;
	filters?: FiltersConfig<TVars>;
};

function buildAppwriteQueries<TVars extends Record<string, any>>(
	vars: Partial<TVars>,
	filters?: FiltersConfig<TVars>,
): string[] {
	const queries: string[] = [];

	Object.entries(vars).forEach(([key, value]) => {
		if (value === undefined) return;

		if (value === null) {
			queries.push(Query.isNull(key));
			return;
		}

		const rule = filters?.[key as keyof TVars];
		if (!rule) return;

		// @ts-expect-error Appwrite Query
		queries.push(Query[rule](key, value));
	});

	return queries;
}

export function createCoreApi<
	TRow extends Models.Row,
	TVars extends Record<string, any>,
>({ tablesDB, databaseId, tableId, filters }: CoreApiOptions<TVars>) {
	async function list(vars: Partial<TVars> = {}) {
		const { rows } = await tablesDB.listRows<TRow>({
			databaseId,
			tableId,
			queries: buildAppwriteQueries(vars, filters),
		});

		return rows;
	}

	async function getById(id: string) {
		return tablesDB.getRow<TRow>({
			databaseId,
			tableId,
			rowId: id,
		});
	}

	type FullCreateData = TRow extends Models.DefaultRow
		? Partial<Models.Row> & Record<string, any>
		: Partial<Models.Row> & Omit<TRow, keyof Models.Row>;

	async function create(data: Partial<FullCreateData>) {
		return tablesDB.createRow<TRow>({
			databaseId,
			tableId,
			rowId: ID.unique(),
			data: data as FullCreateData,
		});
	}

	async function update(id: string, data: Partial<FullCreateData>) {
		return tablesDB.updateRow<TRow>({
			databaseId,
			tableId,
			rowId: id,
			data: data as FullCreateData,
		});
	}

	async function remove(id: string) {
		return tablesDB.deleteRow({
			databaseId,
			tableId,
			rowId: id,
		});
	}

	return {
		list,
		getById,
		create,
		update,
		delete: remove,
	};
}

export const habitsCoreApi = createCoreApi<Posts, Omit<Posts, keyof Models.Row>>({
	tablesDB,
	databaseId: String(postsTable?.databaseId),
	tableId: String(postsTable?.$id),
	filters: {
		title: { type: "between", max: 5 },
		// poster: "betwenn"
	},
});

// export const { useList: useGetPosts } = createAppwriteHooks<
// 	Posts,
// 	Omit<Posts, keyof Models.Row>
// >({
// 	tablesDB,
// 	databaseId: String(postsTable?.databaseId), //"6923a56a000f945ace60",
// 	tableId: String(postsTable?.$id), //"6923a6c90018e0309d7f",
// 	filters: {
// 		title: "contains",
// 		likes: "equal",
// 	},
// });
