import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "unfonts.css";
import { OmnikitProvider } from "@/theme/components/provider.tsx";
import "./styles/global.css";
import { client } from "@/api/api.ts";
import { routeTree } from "~/.tanstack/routeTree.gen.ts";
import "dayjs/locale/ru";
import { SpeedInsights } from "@vercel/speed-insights/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "@/api/appwrite.ts";

dayjs.extend(relativeTime);
dayjs.locale("ru");

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
// import { scan } from "react-scan";

// scan({
//   enabled: true,
// });

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<OmnikitProvider>
			<QueryClientProvider client={client}>
				<RouterProvider router={router} scrollRestoration />
			</QueryClientProvider>
		</OmnikitProvider>
		<SpeedInsights />
	</StrictMode>,
);
