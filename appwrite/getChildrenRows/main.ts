import Bun from "bun";
import { Client, Databases, Query } from "node-appwrite";

export default async ({ req, res, log, error }: any) => {
	// 1. Инициализация клиента
	const client = new Client()
		.setEndpoint(Bun.env.APPWRITE_FUNCTION_API_ENDPOINT)
		.setProject(Bun.env.APPWRITE_FUNCTION_PROJECT_ID)
		// Ключ берем либо из заголовка (если вызываешь из другой серверной функции),
		// либо из переменных окружения самой функции (безопаснее и проще)
		.setKey(req.headers["x-appwrite-key"] ?? Bun.env.APPWRITE_API_KEY);

	const databases = new Databases(client);

	// 2. Разбор входящих данных (Payload)
	// Ожидаем JSON вида: { "collection_id": "...", "parent_id": "...", "database_id": "..." }
	let payload;
	try {
		// Appwrite может прислать body как объект или как строку
		payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
	} catch (err) {
		return res.json({ success: false, message: "Invalid JSON payload" }, 400);
	}

	const { collection_id, parent_id } = payload;

	// Берем ID базы из параметров или из переменной окружения по умолчанию
	const database_id = payload.database_id || Bun.env.DEFAULT_DATABASE_ID;

	// 3. Валидация
	if (!collection_id || !parent_id || !database_id) {
		error("Missing required parameters: collection_id, parent_id, or database_id");
		return res.json(
			{
				success: false,
				message: "Please provide collection_id, parent_id and database_id",
			},
			400,
		);
	}

	try {
		// 4. Запрос к базе данных
		// Ищем документы в указанной коллекции, где поле parent_id совпадает
		const response = await databases.listDocuments(database_id, collection_id, [
			Query.equal("parent_id", parent_id),
			// Можно добавить лимит, если записей очень много
			Query.limit(100),
		]);

		log(`Found ${response.total} documents in collection ${collection_id}`);

		// 5. Возврат результата
		return res.json({
			success: true,
			total: response.total,
			documents: response.documents,
		});
	} catch (err: any) {
		error(`Error fetching documents: ${err.message}`);

		// Обработка ситуации, когда коллекция или база не найдены
		if (err.code === 404) {
			return res.json(
				{ success: false, message: "Collection or Database not found" },
				404,
			);
		}

		return res.json({ success: false, message: err.message }, 500);
	}
};
