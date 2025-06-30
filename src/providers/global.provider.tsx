import { client } from "@/api/query.client.ts";
import { ColorModeProvider } from "@/components/ui/color-mode.tsx";
import theme from "@/components/ui/theme.tsx";
import { createRouter } from "@/router.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";

const router = createRouter();

export const Providers = () => {
  return (
    <ChakraProvider value={theme}>
      <ColorModeProvider>
        <QueryClientProvider client={client}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
};
