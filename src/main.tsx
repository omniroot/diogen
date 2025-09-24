import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { client } from "@/api/query.client.ts";
import { router } from "@/router.tsx";
import "unfonts.css";
// import { scan } from "react-scan";
import { OmnikitProvider } from "@/theme/components/provider.tsx";
import "./styles/global.css";

// scan({
//   enabled: true,
// });

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<OmnikitProvider>
			<QueryClientProvider client={client}>
				<RouterProvider router={router} />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</OmnikitProvider>
	</StrictMode>,
);
