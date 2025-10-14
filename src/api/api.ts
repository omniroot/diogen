import { QueryClient } from "@tanstack/react-query";

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
      staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
    },
  },
});

export const refetchQuery = (
  key: (string | number | string[] | null | undefined)[]
) => {
  client.invalidateQueries({ queryKey: key });
};
