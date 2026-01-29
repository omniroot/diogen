import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "unfonts.css";
import { OmnikitProvider } from "@/theme/components/provider.tsx";
import "./styles/global.css";
import { client } from "@/api/api.ts";
import "dayjs/locale/ru";
import { SpeedInsights } from "@vercel/speed-insights/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "@/api/appwrite.ts";
import { getRouter } from "@/router.tsx";

dayjs.extend(relativeTime);
dayjs.locale("ru");

const router = getRouter();

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
