import { QueryClient } from "@tanstack/react-query";

export const client = new QueryClient({
	defaultOptions: {
		queries: {
			retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
			staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
		},
	},
});
