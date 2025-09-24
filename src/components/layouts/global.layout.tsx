import { Sidebar } from "@/components/business/Sidebar/Sidebar";
import { useLocationHandler } from "@/stores/location.store.tsx";
import { Outlet } from "@tanstack/react-router";

export const GlobalLayout = () => {
	useLocationHandler();
	// const path = useLocation().href;

	return (
		<>
			{/* <Breadcrumbs /> */}
			<Sidebar />

			<main className="main">
				<Outlet />
			</main>
			{/* <Taskbar /> */}
		</>
	);
};
