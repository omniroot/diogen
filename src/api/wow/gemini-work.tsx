import { Query, type QueryTypes } from "appwrite";
import type { Posts } from "@/api/types/appwrite.js";

// import type { Posts } from "@/api/types/appwrite.js";

Query.equal("field", [123, 456]);
Query.between("field", 2, 5);
Query.contains("field", "Api");

// Добавил lessThan/greaterThan, так как они были в твоем примере
type FilterValueTypes = {
	equal: string[] | number[];
	between: [number, number] | [string, string];
	lessThan: number;
	greaterThan: number;
	contains: string;
};

type SupportedFilter = keyof FilterValueTypes;

// Конфиг (остался прежним)
type FilterConfig<TData> = {
	filters: {
		[K in keyof TData]?: {
			[F in SupportedFilter]?: boolean;
		};
	};
};

// --- 2. МАГИЯ РЕКУРСИВНЫХ ТИПОВ ---

// Тип для обычных полей (title, views...)
type FieldFilters<TData, TConf extends FilterConfig<TData>> = {
	[K in keyof TData]?: {
		// Оставляем только те методы, которые = true в конфиге
		[F in SupportedFilter as TConf["filters"][K] extends Record<F, true>
			? F
			: never]?: FilterValueTypes[F];
	};
};

// Рекурсивный тип: объединяет поля И логические операторы
type RecursiveFilter<TData, TConf extends FilterConfig<TData>> = FieldFilters<
	TData,
	TConf
> & {
	$and?: RecursiveFilter<TData, TConf>[]; // Массив таких же фильтров
	$or?: RecursiveFilter<TData, TConf>[]; // Массив таких же фильтров
};

// --- 3. BUILDER С ЛОГИКОЙ ПРЕОБРАЗОВАНИЯ ---

function builder<TData>() {
	return {
		create: <const TConfig extends FilterConfig<TData>>(config: TConfig) => {
			// Тип входного объекта для метода list
			type InputFilters = RecursiveFilter<TData, TConfig>;

			// Рекурсивная функция для превращения объекта в массив строк Appwrite Query
			function mapFilters(input: InputFilters): string[] {
				const queries: string[] = [];

				for (const key in input) {
					const value = (input as any)[key];
					if (!value) continue;

					// 1. Обработка логических операторов
					if (key === "$and" || key === "$or") {
						console.group(`-- Logic Operator: ${key.toUpperCase()} --`);
						const nestedQueries = value.flatMap((f: InputFilters) => mapFilters(f));
						console.groupEnd();

						if (nestedQueries.length > 0) {
							const result =
								key === "$and" ? Query.and(nestedQueries) : Query.or(nestedQueries);
							console.log(`%cGenerated: ${result}`, "color: #e67e22; font-weight: bold;");
							queries.push(result);
						}
						continue;
					}

					// 2. Обработка полей (title, views...)
					if (typeof value === "object") {
						for (const method in value) {
							const args = value[method];
							let generated: string = "";

							switch (method) {
								case "equal":
									generated = Query.equal(key, args);
									break;
								case "between":
									// Appwrite Query.between(key, start, end)
									generated = Query.between(key, args[0], args[1]);
									break;
								case "lessThan":
									generated = Query.lessThan(key, args);
									break;
								case "greaterThan":
									generated = Query.greaterThan(key, args);
									break;
								case "contains":
									generated = Query.contains(key, args);
									break;
							}

							if (generated) {
								console.log(
									`%cFilter: Query.${method}("${key}", ${JSON.stringify(args)})`,
									"color: #3498db",
								);
								queries.push(generated);
							}
						}
					}
				}

				return queries;
			}

			function list(filters: InputFilters) {
				const queries = mapFilters(filters);
				console.log("Generated Queries:", queries);
				// Тут вызов databases.listDocuments(..., queries)
				return queries;
			}

			return { list };
		},
	};
}

const api = builder<Posts>().create({
	filters: {
		title: {
			between: true, // Разрешаем
			equal: true,
			contains: true,
		},
		views: {
			equal: true, // Разрешаем
		},
	},
});

api.list({
	$or: [
		{
			title: {
				contains: "api",
			},
			description: {
				contains: "api",
			},
		},
	],
});
