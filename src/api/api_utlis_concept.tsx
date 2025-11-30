// type ApiResult = {
// 	data: any[];
// 	error: any;
// };

// <T extends string>({ name }: { name: T })

// // Логика формирования имени (Runtime)
// 	const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
// 	const funcName = `useGet${capitalizedName}`;

// 	// Реализация функции
// 	const implementation = ({ age }: { age: number }) => {
// 		console.log(`Функция ${funcName} вызвана с возрастом: ${age}`);
// 		return {
// 			data: [],
// 			error: null,
// 		};
// 	};

// 	// 3. Используем двойное приведение типа: as unknown as TargetType
// 	return {
// 		[funcName]: implementation,
// 	} as unknown as {
// 		[K in `useGet${Capitalize<T>}`]: (args: { age: number }) => ApiResult;
// 	};

interface CreateAppwriteApi {
	name: string;
}

const createAppwriteApi = ({}: CreateAppwriteApi) => {};

// --- Использование ---
const {} = createAppwriteApi({ name: "posts", hooks: {
  
} });
// useGetPosts({ age: 25 });
