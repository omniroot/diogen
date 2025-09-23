import { client } from "@/api/query.client.ts";
import { router } from "@/router.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "unfonts.css";
// import { scan } from "react-scan";
import { OmnikitProvider } from "@/theme/components/provider.tsx";
import "./styles/global.css";

// scan({
//   enabled: true,
// });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OmnikitProvider>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </OmnikitProvider>
  </StrictMode>
);
