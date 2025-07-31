"use client";
import { Provider } from "@/components/ui/provider";
import { Sidebar } from "@/components/ui/Sidebar/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
      staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
    },
  },
});

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={client}>
      <Provider>
        <Sidebar />
        <main className="main">{children}</main>
      </Provider>
    </QueryClientProvider>
  );
};
