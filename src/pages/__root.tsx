import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Header } from "@/components/business/Header.tsx";
import { SearchModal } from "@/components/business/SearchModal.tsx";
import { Sidebar } from "@/components/business/Sidebar/Sidebar.tsx";
// import { IssueModal } from "@/features/issues/components/IssueModal.tsx";
import { IssueModal } from "@/features/issues/components/IssueModal.tsx";
import { ModuleModal } from "@/features/modules/components/ModuleModal.tsx";
import { AuthProvider } from "@/providers/auth.provider.tsx";
import { useLocationHandler } from "@/stores/location.store.tsx";

const RootLayout = () => {
	const isMobile = useMediaQuery("(max-width: 767px)");
	// const isTablet = useMediaQuery("(min-width: 768px)");
	// const isDesktop = useMediaQuery("(min-width: 1280px)");

	useLocationHandler();
	// useModalsStore();

	return (
		<>
			<AuthProvider>
				{isMobile && <Header />}
				<Sidebar />
				<main className="main">
					<Outlet />
				</main>
				{/* <CreateIssueModal /> */}
				{/* <CreateModuleModal /> */}
				<SearchModal />
				<ModuleModal />
				<IssueModal />
				<ReactQueryDevtools
					initialIsOpen={false}
					position="bottom"
					buttonPosition="top-right"
				/>
			</AuthProvider>
			{/* <TanStackRouterDevtools position="top-left" /> */}
		</>
	);
};

export const Route = createRootRoute({ component: RootLayout });
