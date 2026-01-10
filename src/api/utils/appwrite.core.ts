import type { AppwriteConfig } from "./appwrite.types.ts"; // Твои интерфейсы

// --- HELPER TYPES ---

// Находит элемент в массиве по ID
type FindById<Arr extends readonly { $id: string }[], Id> = Extract<
	Arr[number],
	{ $id: Id }
>;

// Создает объект { [YourName]: ConfigObject }
type MapResources<
	Arr extends readonly { $id: string }[],
	Map extends Record<string, string>,
> = {
	[K in keyof Map]: FindById<Arr, Map[K]>;
};

// Аргументы функции
interface CreateCoreArgs<
	T extends AppwriteConfig,
	TM extends Record<string, string>, // Tables Map (Обязательно)
	DM extends Record<string, string>, // Databases Map (Опционально)
	FM extends Record<string, string>, // Functions Map (Опционально)
	BM extends Record<string, string>, // Buckets Map (Опционально)
> {
	config: T;
	mappings: {
		tables: TM;
		databases?: DM;
		functions?: FM;
		buckets?: BM;
	};
}

// --- MAIN FUNCTION ---

export const createAppwriteCore = <
	T extends AppwriteConfig,
	TM extends Record<string, string>,
	DM extends Record<string, string> = {},
	FM extends Record<string, string> = {},
	BM extends Record<string, string> = {},
>({
	config,
	mappings,
}: CreateCoreArgs<T, TM, DM, FM, BM>) => {
	// Хелпер для маппинга массива в объект
	const mapConfig = <Arr extends { $id: string }[], Map extends Record<string, string>>(
		sourceArray: Arr,
		mapping?: Map,
	) => {
		const result = {} as any;
		if (!mapping) return result;

		for (const [friendlyName, id] of Object.entries(mapping)) {
			const found = sourceArray.find((item) => item.$id === id);
			if (found) {
				result[friendlyName] = found;
			}
		}
		return result;
	};

	return {
		// Маппим ресурсы согласно переданным именам
		tables: mapConfig(config.tables, mappings.tables) as MapResources<T["tables"], TM>,
		databases: mapConfig(config.tablesDB, mappings.databases) as MapResources<
			T["tablesDB"],
			DM
		>,
		functions: mapConfig(config.functions, mappings.functions) as MapResources<
			T["functions"],
			FM
		>,
		buckets: mapConfig(config.buckets, mappings.buckets) as MapResources<
			T["buckets"],
			BM
		>,

		// Возвращаем сам конфиг целиком, если вдруг понадобится сырой доступ
		_rawConfig: config,
	};
};
