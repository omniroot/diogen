import { Sidebar } from "@/components/business/Sidebar/Sidebar.tsx";
import { ReactNode } from "react";

export const GlobalLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Sidebar />
      <main className="main">{children}</main>
    </>
  );
};
