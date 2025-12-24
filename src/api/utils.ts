// TRow extends BaseRecord, // Тип записи из БД
// TInsert = Partial<TRow>, // Тип для Insert
// TUpdate = Partial<TRow>, // Тип для Update
// TVars = Record<string, any>, // Переменные поиска
// TKeys extends CrudKeys = CrudKeys, // Гибкий тип ключей

import { useQuery } from "@tanstack/react-query";

interface CreateCrudHooks {
	table: any;
	client: any;
	dbName: "diogen" | "kaizen"; // <-- 2. Клиент обязателен
	defaultOrder?: string;
	// filters?: FilterConfig;
}

export function createCrudHooks<TRow>({ table, client }: CreateCrudHooks) {
	function useList() {
		return useQuery<TRow[]>({
			queryKey: ["get", "posts"],
			queryFn: async () => {
				const query = client.from(table).select();

				const { data, error } = await query;
				if (error) throw error;
				console.log("UseList", data);

				return data as TRow[];
				// return data as TRow[];
			},
		});
	}

	return { useList };
}

// export const { useList: useGetPosts } = createCrudHooks<
// 	IPosts,
// 	IPostsInsert,
// 	IPostsUpdate,
// 	any,
// >({client: kaizen, table: "posts", dbName: "kaizen"});
