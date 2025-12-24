import type {
	QueryClient,
	RefetchOptions as RQRefetchOptions,
} from "@tanstack/react-query";

// --- ТИПЫ ---

// Извлекаем тип аргументов из функции генерации ключа
type GetQueryArgs<T> = T extends (args: infer A) => any ? A : never;

// Опции нашего рефетчера
type RefetcherOptions<TArgs> = RQRefetchOptions & {
	where?: TArgs; // Твои фильтры (Queries<TData>)
	mode?: "exact" | "fuzzy"; // Режим работы
};

// Тип возвращаемого объекта (повторяет структуру keyFactory)
type RefetcherResult<TFactory> = {
	[Scope in keyof TFactory]: {
		[Method in keyof TFactory[Scope]]: TFactory[Scope][Method] extends (args: any) => any
			? (
					options?: RefetcherOptions<GetQueryArgs<TFactory[Scope][Method]>>,
				) => Promise<void>
			: never;
	};
};

// --- ЛОГИКА "НЕЧЕТКОГО" ПОИСКА (Fuzzy Matching) ---

/**
 * Рекурсивно проверяет, содержится ли subset внутри source.
 * Работает как "глубокий поиск подстроки" для объектов.
 */
function isDeepSubset(source: any, subset: any): boolean {
	// 1. Если subset равен source (базовый случай)
	if (source === subset) return true;

	// 2. Если типы не совпадают или null/undefined
	if (
		typeof source !== typeof subset ||
		source === null ||
		subset === null ||
		source === undefined ||
		subset === undefined
	) {
		return false;
	}

	// 3. Если это дата
	if (subset instanceof Date && source instanceof Date) {
		return subset.getTime() === source.getTime();
	}

	// 4. Если subset - массив
	if (Array.isArray(subset)) {
		if (!Array.isArray(source)) return false;
		// В режиме fuzzy для массива мы требуем, чтобы элементы subset
		// нашлись внутри массива source (порядок не важен)
		return subset.every((subItem) =>
			source.some((sourceItem) => isDeepSubset(sourceItem, subItem)),
		);
	}

	// 5. Если subset - объект
	if (typeof subset === "object") {
		// Проверяем, что все ключи subset есть в source и их значения совпадают
		return Object.keys(subset).every((key) => {
			const subValue = subset[key];
			// Важно: если source не имеет этого ключа, это не match
			if (!Object.hasOwn(source, key)) return false;
			return isDeepSubset(source[key], subValue);
		});
	}

	// Примитивы
	return source === subset;
}

/**
 * Ищет вхождение subset В ЛЮБОМ МЕСТЕ структуры source (на любой глубине).
 * Это нужно для того, чтобы найти { title: ... } даже внутри $or или $and.
 */
function containsDeeply(source: any, subset: any): boolean {
	// Сначала проверяем, вдруг source уже является искомым подмножеством
	if (isDeepSubset(source, subset)) return true;

	// Если source массив или объект, спускаемся вниз
	if (typeof source === "object" && source !== null) {
		return Object.values(source).some((val) => containsDeeply(val, subset));
	}

	return false;
}

// --- ОСНОВНАЯ ФУНКЦИЯ ---

export function createRefetcher<TFactory extends Record<string, Record<string, any>>>(
	client: QueryClient,
	keyFactory: TFactory,
): RefetcherResult<TFactory> {
	// Создаем объект, повторяющий структуру TFactory
	const result = {} as any;

	for (const scope in keyFactory) {
		result[scope] = {};

		for (const method in keyFactory[scope]) {
			const keyBuilder = keyFactory[scope][method];

			// Создаем функцию рефетча
			result[scope][method] = async (opts: RefetcherOptions<any> = {}) => {
				const { where, mode = "exact", ...rqOptions } = opts;

				// 1. Режим EXACT: используем стандартный матчинг ключей RQ
				if (mode === "exact") {
					// Если where передан, строим точный ключ, иначе инвалидируем всю группу scope
					const queryKey = where ? keyBuilder(where) : [scope, method]; // Частичный ключ для exact (инвалидирует все списки постов)

					return client.refetchQueries({
						queryKey,
						exact: !!where, // Если передан where, требуем точного совпадения
						...rqOptions,
					});
				}

				// 2. Режим FUZZY: используем predicate
				if (mode === "fuzzy" && where) {
					return client.refetchQueries({
						...rqOptions,
						predicate: (query) => {
							// query.queryKey обычно выглядит как [scope, method, filters]
							// Нас интересует filters (индекс 2), но проверяем безопасно
							const queryFilters = query.queryKey[2];

							if (!queryFilters) return false;

							// Проверяем, что scope и method совпадают (чтобы не рефетчить users, когда ищем posts)
							const [qScope, qMethod] = query.queryKey;
							if (qScope !== scope || qMethod !== method) return false;

							// Главная магия: ищем вхождение where внутри фильтров запроса
							return containsDeeply(queryFilters, where);
						},
					});
				}

				// Fallback (fuzzy без where -> просто рефетч всей группы)
				return client.refetchQueries({ queryKey: [scope, method], ...rqOptions });
			};
		}
	}

	return result;
}
