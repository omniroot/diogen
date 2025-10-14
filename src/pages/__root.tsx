import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Sidebar } from "@/components/business/Sidebar/Sidebar.tsx";
import { CreateModuleModal } from "@/features/modules/_components/CreateModuleModal.tsx";
import { useLocationHandler } from "@/stores/location.store.tsx";

const RootLayout = () => {
	useLocationHandler();

	return (
		<>
			<Sidebar />
			<main className="main">
				<Outlet />
			</main>
			<CreateModuleModal />
			<TanStackRouterDevtools />
		</>
	);
};

export const Route = createRootRoute({ component: RootLayout });
