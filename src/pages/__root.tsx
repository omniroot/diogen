import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { SearchModal } from "@/components/business/SearchModal.tsx";
import { Sidebar } from "@/components/business/Sidebar/Sidebar.tsx";
// import { IssueModal } from "@/features/issues/components/IssueModal.tsx";
import { IssueModal } from "@/features/issues/components/IssueModal.tsx";
import { ModuleModal } from "@/features/modules/components/ModuleModal.tsx";
import { useLocationHandler } from "@/stores/location.store.tsx";

const RootLayout = () => {
	useLocationHandler();
	// useModalsStore();

	return (
		<>
			<Sidebar />
			<main className="main">
				<Outlet />
			</main>
			{/* <CreateIssueModal /> */}
			{/* <CreateModuleModal /> */}
			<SearchModal />
			<ModuleModal />
			<IssueModal />
			<TanStackRouterDevtools />
		</>
	);
};

export const Route = createRootRoute({ component: RootLayout });
