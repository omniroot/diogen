import type { ReactNode } from "react";
import { Sidebar } from "@/components/business/Sidebar/Sidebar.tsx";

export const GlobalLayout = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Sidebar />
			<main className="main">{children}</main>
		</>
	);
};
