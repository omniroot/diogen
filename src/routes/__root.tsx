// src/routes/__root.tsx
/// <reference types="vite/client" />

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/layouts/global.layout.tsx";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<GlobalLayout>
			<Outlet />
		</GlobalLayout>
	);
}
