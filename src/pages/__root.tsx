// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useMediaQuery } from "@uidotdev/usehooks";
import { lazy } from "react";
import { Sidebar } from "@/components/business/Sidebar/Sidebar.tsx";
import { Header } from "@/components/Header";
import { NavBar } from "@/components/NavBar.tsx";
import { AuthProvider } from "@/providers/auth.provider.tsx";

const ReactQueryDevtools = import.meta.env.DEV
	? lazy(() =>
			import("@tanstack/react-query-devtools").then((m) => ({
				default: m.ReactQueryDevtools,
			})),
		)
	: () => null;

const RootLayout = () => {
	const isMobile = useMediaQuery("(max-width: 767px)");
	// const isTablet = useMediaQuery("(min-width: 768px)");
	// const isDesktop = useMediaQuery("(min-width: 1280px)");

	// useLocationHandler();
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
				{/* <SearchModal /> */}
				{/* <ModuleModal /> */}
				{/* <IssueModal /> */}
				<NavBar />
				<ReactQueryDevtools
					initialIsOpen={false}
					position="bottom"
					buttonPosition="top-left"
				/>
			</AuthProvider>
			{/* <TanStackRouterDevtools position="top-left" /> */}
		</>
	);
};

export const Route = createRootRoute({ component: RootLayout });
