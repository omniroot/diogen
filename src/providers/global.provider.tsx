import { ColorModeProvider } from "@/components/ui/color-mode.tsx";
import theme from "@/components/ui/theme.tsx";
import { createRouter } from "@/router.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
      staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
    },
  },
});

const router = createRouter();

export const Providers = () => {
  return (
    <>
      <ChakraProvider value={theme}>
        <ColorModeProvider>
          <QueryClientProvider client={client}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ColorModeProvider>
      </ChakraProvider>
    </>
  );
};
