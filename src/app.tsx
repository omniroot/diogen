// src/App.tsx
import { client } from "@/api/query.client";
import { router } from "@/router";
import { ColorModeProvider } from "@/theme/components/color-mode";
import { OmnikitProvider } from "@/theme/components/provider.tsx";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";

export function App() {
	return (
		<StrictMode>
			<DndContext onDragEnd={(e) => console.log(e)} modifiers={[restrictToVerticalAxis]}>
				<OmnikitProvider>
					<ColorModeProvider>
						<QueryClientProvider client={client}>
							<RouterProvider router={router} />
						</QueryClientProvider>
					</ColorModeProvider>
				</OmnikitProvider>
			</DndContext>
		</StrictMode>
	);
}
