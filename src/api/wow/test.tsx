// // improved-filters.ts
// import { ID, type Models, Query, type TablesDB } from "appwrite";
// import { postsTable, tablesDB } from "@/api/appwrite.tsx";
// import type { Posts } from "@/api/types/appwrite.js";

// /* ----------------------
//    Operator names & types
//    ---------------------- */
// type CommonOps = "equal" | "notEqual" | "isNull";
// type NumericOps = "lessThan" | "lessEqual" | "greaterThan" | "greaterEqual" | "between";
// type StringOps = "search";
// type OperatorName = CommonOps | NumericOps | StringOps;

// /* Concrete operator payload shapes */
// type EqualOp<T> = { equal: T };
// type NotEqualOp<T> = { notEqual: T };
// type IsNullOp = { isNull: true };
// type LessThanOp = { lessThan: number };
// type LessEqualOp = { lessEqual: number };
// type GreaterThanOp = { greaterThan: number };
// type GreaterEqualOp = { greaterEqual: number };
// type BetweenOp = { between: [number, number] };
// type SearchOp = { search: string };

// /* Operator union specialized by field type T */
// type OperatorInputFor<T> =
// 	| EqualOp<T>
// 	| NotEqualOp<T>
// 	| IsNullOp
// 	| (T extends number
// 			? LessThanOp | LessEqualOp | GreaterThanOp | GreaterEqualOp | BetweenOp
// 			: never)
// 	| (T extends string ? SearchOp : never);

// /* -------------------------
//    Filters config at creation
//    ------------------------- */

// /**
//  * Simple config for a field at API creation time.
//  * You can either pass an array of allowed operator names, or a config object
//  * for future extensibility (e.g. custom parser/validator).
//  */
// type FieldFilterSpec =
// 	| OperatorName[]
// 	| {
// 			operators: OperatorName[];
// 			// optional: parser/validator/hints for this field, e.g. to coerce strings to numbers
// 			parse?: (raw: unknown) => unknown;
// 	  };

// type FiltersDefinition<TVars> = Partial<Record<keyof TVars, FieldFilterSpec>>;

// /* -------------------------
//    Input type for list(...)
//    ------------------------- */
// /** For the `list` call, filters object where each key is a field and value is an operator-object */
// type FiltersInput<TVars> = Partial<{ [K in keyof TVars]: OperatorInputFor<TVars[K]> }>;

// /* -------------------------
//    Core API builder / utils
//    ------------------------- */

// function isOperatorAllowed(spec: FieldFilterSpec | undefined, op: OperatorName): boolean {
// 	if (!spec) return true; // if no spec provided — allow everything (or change policy)
// 	if (Array.isArray(spec)) return spec.includes(op);
// 	return spec.operators.includes(op);
// }

// function getOperatorName(opObject: Record<string, any>): OperatorName | undefined {
// 	return (Object.keys(opObject)[0] as OperatorName) || undefined;
// }

// /* Map operator -> Query builder */
// function mapToQuery(field: string, opObject: Record<string, any>): string | string[] {
// 	const op = getOperatorName(opObject);
// 	const val = op ? (opObject as any)[op] : undefined;

// 	switch (op) {
// 		case "equal":
// 			return Query.equal(field, val);
// 		case "notEqual":
// 			return Query.notEqual(field, val);
// 		case "lessThan":
// 			return Query.lessThan(field, val);
// 		// case "lessEqual":
// 		//   return Query.lessEqual(field, val);
// 		case "greaterThan":
// 			return Query.greaterThan(field, val);
// 		// case "greaterEqual":
// 		//   return Query.greaterEqual(field, val);
// 		case "between":
// 			return Query.between(field, val[0], val[1]);
// 		case "search":
// 			return Query.search(field, val);
// 		case "isNull":
// 			return Query.isNull(field);
// 		default:
// 			throw new Error(`Unsupported operator "${op}" for field "${field}"`);
// 	}
// }

// function buildAppwriteQueries<TVars extends Record<string, any>>(
// 	vars: FiltersInput<TVars>,
// 	filtersDef?: FiltersDefinition<TVars>,
// ): string[] {
// 	const queries: string[] = [];

// 	for (const key in vars) {
// 		const opObject = (vars as any)[key] as Record<string, any> | undefined;
// 		if (opObject == null) continue;

// 		const opName = getOperatorName(opObject);
// 		if (!opName) continue;

// 		const fieldSpec = filtersDef?.[key as keyof TVars];
// 		if (!isOperatorAllowed(fieldSpec, opName)) {
// 			throw new Error(`Operator "${opName}" is not allowed on field "${key}"`);
// 		}

// 		const q = mapToQuery(key, opObject);
// 		if (Array.isArray(q)) queries.push(...q);
// 		else queries.push(q);
// 	}

// 	return queries;
// }

// /* -------------------------
//    createCoreApi implementation
//    ------------------------- */

// type CoreApiOptions<TVars> = {
// 	tablesDB: TablesDB;
// 	databaseId: string;
// 	tableId: string;
// 	filters?: FiltersDefinition<TVars>;
// };

// export function createCoreApi<
// 	TRow extends Models.Row,
// 	TVars extends Record<string, any>,
// >({ tablesDB, databaseId, tableId, filters }: CoreApiOptions<TVars>) {
// 	async function list(vars: FiltersInput<TVars> = {}) {
// 		const queries = buildAppwriteQueries(vars, filters);
// 		const { rows } = await tablesDB.listRows<TRow>({
// 			databaseId,
// 			tableId,
// 			queries,
// 		});
// 		return rows;
// 	}

// 	async function getById(id: string) {
// 		return tablesDB.getRow<TRow>({ databaseId, tableId, rowId: id });
// 	}

// 	type FullCreateData = TRow extends Models.DefaultRow
// 		? Partial<Models.Row> & Record<string, any>
// 		: Partial<Models.Row> & Omit<TRow, keyof Models.Row>;

// 	async function create(data: Partial<FullCreateData>) {
// 		return tablesDB.createRow<TRow>({
// 			databaseId,
// 			tableId,
// 			rowId: ID.unique(),
// 			data: data as FullCreateData,
// 		});
// 	}

// 	async function update(id: string, data: Partial<FullCreateData>) {
// 		return tablesDB.updateRow<TRow>({
// 			databaseId,
// 			tableId,
// 			rowId: id,
// 			data: data as FullCreateData,
// 		});
// 	}

// 	async function remove(id: string) {
// 		return tablesDB.deleteRow({ databaseId, tableId, rowId: id });
// 	}

// 	return { list, getById, create, update, delete: remove };
// }

// /* -------------------------
//    Usage examples
//    ------------------------- */

// // Допустим тип Posts:

// // Создаём API и указываем какие операции разрешены для поля:
// export const habitsCoreApi = createCoreApi<Posts, Omit<Posts, keyof Models.Row>>({
// 	tablesDB,
// 	databaseId: String(postsTable?.databaseId),
// 	tableId: String(postsTable?.$id),
// 	filters: {
// 		description: [""],
// 		title: ["search", "equal"], // только search и equal для title
// 		// rating: { operators: ["between", "greaterThan", "lessThan"] }, // numeric ops
// 		// publishedAt: ["isNull", "equal"],
// 		poster: [""],
// 	},
// });

// Query.between();
// // Вызовы:
// await habitsCoreApi.list({
// 	title: { search: "hello" }, // -> Query.search("title", "hello")
// 	poster: {},
// });

// await habitsCoreApi.list({
// 	// rating: { between: [1, 5] }, // -> Query.between("rating", 1, 5)
// 	// publishedAt: { isNull: true }, // -> Query.isNull("publishedAt")
// });

// // Если пытаться использовать запрещённый оператор — будет ошибка на runtime,
// // а TypeScript уже подскажет допустимые payload-формы в зависимости от типа поля.
